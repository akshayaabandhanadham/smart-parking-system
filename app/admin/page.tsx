"use client";

import useSWR from "swr";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";

const fetcher = async (url: string) => {
  const res = await fetch(url);
  const json = await res.json();
  if (!res.ok) throw new Error(json.error || "Fetch failed");
  return json.data || [];
};

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    Authorization: token ? `Bearer ${token}` : "",
  };
};

export default function AdminDashboard() {
  const router = useRouter();

  const [isAuthChecked, setIsAuthChecked] = useState(false);
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [message, setMessage] = useState("");

  const [form, setForm] = useState({
    slotNumber: "",
    level: "",
    price: "",
  });

  const showMessage = (msg: string) => {
    setMessage(msg);
    setTimeout(() => setMessage(""), 3000);
  };

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.replace("/login?role=admin");
      return;
    }

    try {
      const payload = JSON.parse(atob(token.split(".")[1]));

      if (payload.role !== "admin") {
        router.replace("/login?role=admin");
        return;
      }

      setIsAuthChecked(true);
    } catch {
      router.replace("/login?role=admin");
    }
  }, []);

  const { data: slots, mutate, error } = useSWR(
    isAuthChecked ? "/api/slots" : null,
    fetcher
  );

  const { data: analytics } = useSWR(
    isAuthChecked ? "/api/analytics" : null,
    fetcher
  );

  if (!isAuthChecked) {
    return <p className="p-6">Checking authentication...</p>;
  }

  if (error) {
    return <p className="p-6 text-red-500">Failed to load data</p>;
  }

  const safeSlots = slots || [];
  const totalRevenue = analytics?.totalRevenue || 0;

  const addSlot = async () => {
    if (!form.slotNumber.trim()) return showMessage("Slot required");
    if (!form.level.trim()) return showMessage("Level required");
    if (!form.price) return showMessage("Price required");

    try {
      const res = await fetch("/api/slots", {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({
          slotNumber: form.slotNumber.trim(),
          level: form.level.trim(),
          price: Number(form.price),
        }),
      });

      const json = await res.json();

      if (!res.ok) {
        showMessage(json.error);
        return;
      }

      showMessage("Slot added");
      setForm({ slotNumber: "", level: "", price: "" });
      mutate();
    } catch {
      showMessage("Network error");
    }
  };

  const cancel = async (slotId: string) => {
    try {
      setLoadingId(slotId);

      const res = await fetch("/api/bookings", {
        method: "DELETE",
        headers: getAuthHeaders(),
        body: JSON.stringify({ slotId }),
      });

      const json = await res.json();

      if (!res.ok) {
        showMessage(json.error);
        return;
      }

      const r = json.data;
      showMessage(`₹${r.amount} • ${r.minutes}m`);
      mutate();
    } finally {
      setLoadingId(null);
    }
  };

  const deleteSlot = async (slotId: string) => {
    try {
      const res = await fetch("/api/slots", {
        method: "DELETE",
        headers: getAuthHeaders(),
        body: JSON.stringify({ slotId }),
      });

      const json = await res.json();

      if (!res.ok) {
        showMessage(json.error);
        return;
      }

      showMessage("Deleted");
      mutate();
    } catch {
      showMessage("Network error");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar title="🛠 Admin Dashboard" />

      {message && (
        <div className="fixed top-4 right-4 bg-black text-white px-4 py-2 rounded shadow">
          {message}
        </div>
      )}

      <div className="p-6 max-w-7xl mx-auto">

        <div className="bg-white p-5 rounded-xl shadow mb-6 text-center">
          <h2>Total Revenue</h2>
          <p className="text-2xl text-green-600 font-bold">
            ₹{totalRevenue}
          </p>
        </div>

        <div className="bg-white p-5 rounded-xl shadow mb-6">
          <h2>Add Slot</h2>

          <div className="grid md:grid-cols-3 gap-4">
            <input
              placeholder="Slot"
              value={form.slotNumber}
              onChange={(e) =>
                setForm({ ...form, slotNumber: e.target.value })
              }
              className="border p-2 rounded"
            />

            <select
              value={form.level}
              onChange={(e) =>
                setForm({ ...form, level: e.target.value })
              }
              className="border p-2 rounded"
            >
              <option value="">Select Level</option>
              <option value="1">Level 1</option>
              <option value="2">Level 2</option>
              <option value="Basement">Basement</option>
            </select>

            <input
              type="number"
              placeholder="Price"
              value={form.price}
              onChange={(e) =>
                setForm({ ...form, price: e.target.value })
              }
              className="border p-2 rounded"
            />

            <button
              onClick={addSlot}
              className="bg-blue-600 text-white py-2 col-span-full rounded"
            >
              Add Slot
            </button>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {safeSlots.map((slot: any) => (
            <div
              key={slot._id}
              className={`p-5 rounded-xl text-white ${
                slot.status === "available"
                  ? "bg-green-500"
                  : "bg-red-500"
              }`}
            >
              <h3>{slot.slotNumber}</h3>
              <p>Level {slot.level}</p>
              <p>₹{slot.price}/hr</p>

              {slot.status === "occupied" ? (
                <button
                  onClick={() => cancel(slot._id)}
                  disabled={loadingId === slot._id}
                  className="bg-white text-red-600 w-full mt-2 py-2 rounded"
                >
                  {loadingId === slot._id ? "..." : "Exit"}
                </button>
              ) : (
                <button
                  onClick={() => deleteSlot(slot._id)}
                  className="bg-black w-full mt-2 py-2 rounded"
                >
                  Delete
                </button>
              )}
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}