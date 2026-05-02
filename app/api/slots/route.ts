import connectDB from "@/lib/db";
import Slot from "@/models/Slot";
import Booking from "@/models/Booking";
import { getAllSlots } from "@/services/slot.service";
import { withAuth } from "@/lib/withAuth";
import mongoose from "mongoose";
import { slotSchema } from "@/lib/validators";
import { success, error } from "@/lib/response";

export async function GET() {
  try {
    await connectDB();
    const slots = await getAllSlots();
    return success(slots);
  } catch {
    return error("Failed to fetch slots");
  }
}

export const POST = withAuth(async (req: Request) => {
  try {
    await connectDB();

    const body = await req.json();
    const parsed = slotSchema.parse(body);

    const slot = await Slot.create({
      slotNumber: parsed.slotNumber.trim(),
      level: parsed.level.trim(),
      price: parsed.price,
      status: "available",
    });

    return success(slot);
  } catch (err: any) {
    if (err.code === 11000) {
      return error("Slot already exists");
    }
    return error(err.message || "Failed to create slot");
  }
}, "admin");

export const DELETE = withAuth(async (req: Request) => {
  try {
    await connectDB();

    const { slotId } = await req.json();

    if (!slotId || !mongoose.Types.ObjectId.isValid(slotId)) {
      return error("Invalid slotId");
    }

    const sid = new mongoose.Types.ObjectId(slotId);

    const active = await Booking.findOne({
      slotId: sid,
      status: "ACTIVE",
    });

    if (active) {
      return error("Cannot delete occupied slot");
    }

    const deleted = await Slot.findByIdAndDelete(sid);

    if (!deleted) {
      return error("Slot not found");
    }

    return success("Slot deleted");
  } catch (err: any) {
    return error(err.message || "Failed to delete slot");
  }
}, "admin");