"use client";

import { useState } from "react";

type Slot = {
  _id: string;
  slotNumber: string;
  status: string;
  level?: string;
  price?: number;
};

export default function SlotCard({
  slot,
  onBook,
  onCancel,
  loadingId,
}: {
  slot: Slot;
  onBook: (id: string, type: string, number: string) => void;
  onCancel: (id: string) => void;
  loadingId?: string | null;
}) {
  const [vehicleType, setVehicleType] = useState("");
  const [vehicleNumber, setVehicleNumber] = useState("");

  const available = slot.status === "available";
  const isLoading = loadingId === slot._id;

  return (
    <div
      className={`p-6 rounded-xl shadow text-white ${
        available ? "bg-green-500" : "bg-red-500"
      }`}
    >
      {/* SLOT INFO */}
      <h2 className="text-xl font-bold">
        {slot.slotNumber} (Level {slot.level})
      </h2>

      <p>💰 ₹{slot.price}/hr</p>

      <p className="mb-2">
        {available ? "🟢 Available" : "🔴 Occupied"}
      </p>

      {/* INPUTS (ONLY WHEN AVAILABLE) */}
      {available && (
        <>
          <select
            value={vehicleType}
            onChange={(e) => setVehicleType(e.target.value)}
            className="w-full p-2 rounded text-black mb-2"
          >
            <option value="">Select Vehicle</option>
            <option value="bike">Bike</option>
            <option value="car">Car</option>
            <option value="truck">Truck</option>
          </select>

          <input
            type="text"
            placeholder="Vehicle Number"
            value={vehicleNumber}
            onChange={(e) => setVehicleNumber(e.target.value)}
            className="w-full p-2 rounded text-black mb-2"
          />

          <button
            onClick={() => {
              if (!vehicleType || !vehicleNumber) {
                alert("Enter all details");
                return;
              }
              onBook(slot._id, vehicleType, vehicleNumber);

              // ✅ CLEAR INPUTS AFTER BOOKING
              setVehicleType("");
              setVehicleNumber("");
            }}
            disabled={isLoading}
            className="bg-white text-green-600 w-full py-2 rounded"
          >
            {isLoading ? "Parking..." : "Confirm"}
          </button>
        </>
      )}

      {/* EXIT */}
      {!available && (
        <button
          onClick={() => onCancel(slot._id)}
          disabled={isLoading}
          className="bg-white text-red-600 w-full py-2 rounded mt-2"
        >
          {isLoading ? "Exiting..." : "Exit"}
        </button>
      )}
    </div>
  );
}