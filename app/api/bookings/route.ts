import connectDB from "@/lib/db";
import Booking from "@/models/Booking";
import Slot from "@/models/Slot";
import mongoose from "mongoose";
import { bookingSchema } from "@/lib/validators";
import { success, error } from "@/lib/response";

export async function POST(req: Request) {
  await connectDB();

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const body = await req.json();
    const parsed = bookingSchema.parse(body);

    if (!mongoose.Types.ObjectId.isValid(parsed.slotId)) {
      throw new Error("Invalid slotId");
    }

    const sid = new mongoose.Types.ObjectId(parsed.slotId);

    const slot = await Slot.findById(sid).session(session);

    if (!slot) throw new Error("Slot not found");
    if (slot.status === "occupied") throw new Error("Slot already occupied");

    const booking = await Booking.create(
      [
        {
          slotId: sid,
          userId: "guest",
          vehicleType: parsed.vehicleType,
          vehicleNumber: parsed.vehicleNumber.trim(),
          startTime: new Date(),
          status: "ACTIVE",
          level: slot.level,
          slotNumber: slot.slotNumber,
          pricePerHour: slot.price,
        },
      ],
      { session }
    );

    slot.status = "occupied";
    await slot.save({ session });

    await session.commitTransaction();
    session.endSession();

    return success(booking[0]);
  } catch (err: any) {
    await session.abortTransaction();
    session.endSession();
    return error(err.message || "Booking failed");
  }
}

export async function DELETE(req: Request) {
  await connectDB();

  try {
    const { slotId } = await req.json();

    if (!slotId || !mongoose.Types.ObjectId.isValid(slotId)) {
      return error("Invalid slotId");
    }

    const sid = new mongoose.Types.ObjectId(slotId);

    const booking = await Booking.findOne({
      slotId: sid,
      status: "ACTIVE",
    });

    if (!booking) return error("No active booking");

    const start = new Date(booking.startTime).getTime();
    const end = Date.now();
    const diff = end - start;

    const totalSeconds = Math.floor(diff / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;

    const rate = booking.pricePerHour || 50;

    let amount = (diff / (1000 * 60 * 60)) * rate;
    amount = Math.max(rate, Math.ceil(amount));

    booking.status = "COMPLETED";
    booking.totalAmount = amount;
    booking.endTime = new Date();

    await booking.save();

    await Slot.findByIdAndUpdate(sid, { status: "available" });

    return success({
      minutes,
      seconds,
      amount,
      slotNumber: booking.slotNumber,
      level: booking.level,
    });
  } catch (err: any) {
    return error(err.message || "Exit failed");
  }
}