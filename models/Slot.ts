import mongoose from "mongoose";

const SlotSchema = new mongoose.Schema(
  {
    slotNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    level: {
      type: String,
      required: true,
      trim: true,
    },

    price: {
      type: Number,
      required: true,
      min: 0,
    },

    vehiclePricing: {
      car: { type: Number, default: 50, min: 0 },
      bike: { type: Number, default: 20, min: 0 },
      truck: { type: Number, default: 100, min: 0 },
    },

    status: {
      type: String,
      enum: ["available", "occupied"],
      default: "available",
    },
  },
  { timestamps: true }
);

export default mongoose.models.Slot ||
  mongoose.model("Slot", SlotSchema);