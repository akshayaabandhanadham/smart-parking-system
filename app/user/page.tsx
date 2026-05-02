"use client";

import useSWR from "swr";
import { useState } from "react";
import SlotCard from "@/components/SlotCard";
import Navbar from "@/components/Navbar";
import Chatbot from "@/components/Chatbot";

const fetcher = async (url: string) => {
  const res = await fetch(url);
  const json = await res.json();

  if (!res.ok) throw new Error(json.error || "Fetch failed");
  return json.data || [];
};

export default function UserPage() {
  const { data, mutate, isLoading, error } = useSWR(
    "/api/slots",
    fetcher,
    { refreshInterval: 5000 }
  );

  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [message, setMessage] = useState<string>("");

  const showMessage = (msg: string) => {
    setMessage(msg);
    setTimeout(() => setMessage(""), 3000);
  };

  const book = async (id: string, type: string, number: string) => {
    if (!type || !number) {
      showMessage("Enter vehicle details");
      return;
    }

    try {
      setLoadingId(id);

      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          slotId: id,
          vehicleType: type,
          vehicleNumber: number.trim(),
        }),
      });

      const json = await res.json();

      if (!res.ok) {
        showMessage(json.error || "Booking failed");
        return;
      }

      const r = json.data;

      showMessage(`Parked at ${r.slotNumber} (${r.level})`);
      mutate();
    } catch {
      showMessage("Network error");
    } finally {
      setLoadingId(null);
    }
  };

  const cancel = async (slotId: string) => {
    try {
      setLoadingId(slotId);

      const res = await fetch("/api/bookings", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slotId }),
      });

      const json = await res.json();

      if (!res.ok) {
        showMessage(json.error || "Exit failed");
        return;
      }

      const r = json.data;

      showMessage(`₹${r.amount} • ${r.minutes}m ${r.seconds}s`);
      mutate();
    } catch {
      showMessage("Network error");
    } finally {
      setLoadingId(null);
    }
  };

  if (isLoading) return <p className="p-6">Loading...</p>;
  if (error) return <p className="p-6 text-red-500">Failed to load slots</p>;

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar title="User Dashboard" />

      {message && (
        <div className="fixed top-4 right-4 bg-black text-white px-4 py-2 rounded shadow">
          {message}
        </div>
      )}

      <div className="p-6 grid md:grid-cols-3 gap-4">
        {(data || []).map((slot: any) => (
          <SlotCard
            key={slot._id}
            slot={slot}
            onBook={book}
            onCancel={cancel}
            loadingId={loadingId}
          />
        ))}
      </div>

      <Chatbot slots={data || []} />
    </div>
  );
}