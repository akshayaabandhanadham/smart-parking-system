import { z } from "zod";

// 🚗 Booking validation (already exists)
export const bookingSchema = z.object({
  slotId: z.string(),
  vehicleType: z.enum(["bike", "car", "truck"]),
  vehicleNumber: z.string().min(4),
});

// 🅿️ Slot validation (ADD THIS)
export const slotSchema = z.object({
  slotNumber: z.string().min(1, "Slot number required"),
  level: z.string().min(1, "Level required"),
  price: z.number().positive("Price must be positive"),
});