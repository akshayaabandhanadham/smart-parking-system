import Slot from "@/models/Slot";
import Booking from "@/models/Booking";

export const getAllSlots = async () => {
  const now = new Date();
  const slots = await Slot.find();

  return Promise.all(
    slots.map(async (slot: any) => {
      const active = await Booking.findOne({
        slotId: slot._id,
        status: "ACTIVE",
      });

      return {
        ...slot.toObject(),
        status: active ? "booked" : "available",
        startTime: active?.startTime || null, // 🔥 needed for timer
      };
    })
  );
};