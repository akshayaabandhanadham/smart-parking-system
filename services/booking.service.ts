import mongoose from "mongoose";
import Booking from "@/models/Booking";
import Slot from "@/models/Slot";

/**
 * CREATE BOOKING
 */
export const createBooking = async (data: {
  slotId: string;
  userId: string;
  vehicleType: string;
  vehicleNumber: string;
}) => {
  const { slotId, userId, vehicleType, vehicleNumber } = data;

  if (!slotId || !userId || !vehicleType || !vehicleNumber) {
    throw new Error("All fields required");
  }

  const sid = new mongoose.Types.ObjectId(slotId);

  const exists = await Booking.findOne({
    slotId: sid,
    status: "ACTIVE",
  });

  if (exists) {
    throw new Error("Slot already booked");
  }

  const slot = await Slot.findById(sid);

  const booking = await Booking.create({
    slotId: sid,
    userId,
    vehicleType,
    vehicleNumber,
    startTime: new Date(),
    status: "ACTIVE",
    level: slot?.level,
    slotNumber: slot?.slotNumber,
  });

  return {
    ...booking.toObject(),
    level: slot?.level,
    slotNumber: slot?.slotNumber,
  };
};

/**
 * EXIT BOOKING
 */
export const cancelBooking = async (slotId: string) => {
  const sid = new mongoose.Types.ObjectId(slotId);

  const booking = await Booking.findOne({
    slotId: sid,
    status: "ACTIVE",
  });

  if (!booking) {
    throw new Error("No active booking found");
  }

  const endTime = new Date();
  const start = new Date(booking.startTime);

  const diffMs = endTime.getTime() - start.getTime();

  // ⏱ time
  const totalSeconds = Math.floor(diffMs / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  // 🚗 vehicle pricing
  const rates: any = {
    bike: 20,
    car: 50,
    truck: 100,
  };

  const rate = rates[booking.vehicleType] || 50;

  const hours = diffMs / (1000 * 60 * 60);

  let amount = hours * rate;

  // ✅ minimum 1 hour
  if (hours < 1) amount = rate;

  booking.endTime = endTime;
  booking.totalAmount = amount;
  booking.status = "COMPLETED";

  await booking.save();

  return {
    minutes,
    seconds,
    amount: amount.toFixed(2),
    slotNumber: booking.slotNumber,
    level: booking.level,
  };
};