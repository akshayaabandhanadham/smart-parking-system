"use client";

import { useEffect, useState } from "react";

type Slot = {
  _id: string;
  slotNumber: string;
  isAvailable: boolean;
};

export default function SlotGrid() {
  const [slots, setSlots] = useState<Slot[]>([]);

  // 🔄 Fetch slots
  const fetchSlots = async () => {
    const res = await fetch("/api/slots");
    const data = await res.json();
    setSlots(data);
  };

  useEffect(() => {
    fetchSlots();
  }, []);

  // 🚀 Book slot
  const bookSlot = async (slotId: string) => {
    const res = await fetch("/api/bookings", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        slotId,
        userId: "user123",
        startTime: new Date().toISOString(),
        endTime: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
      }),
    });

    const data = await res.json();

    if (res.ok) {
      alert("✅ Slot booked!");
      fetchSlots(); // refresh UI
    } else {
      alert("❌ " + data.message);
    }
  };

  return (
    <div className="grid grid-cols-3 gap-4 p-6">
      {slots.map((slot) => (
        <button
          key={slot._id}
          onClick={() => slot.isAvailable && bookSlot(slot._id)}
          className={`p-6 rounded-xl text-white font-bold text-lg ${
            slot.isAvailable ? "bg-green-500" : "bg-red-500"
          }`}
        >
          {slot.slotNumber}
        </button>
      ))}
    </div>
  );
}