import mongoose from "mongoose";

const BookingSchema = new mongoose.Schema(
  {
    slotId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Slot",
      required: true,
      index: true,
    },

    userId: {
      type: String,
      required: true,
      index: true,
      trim: true,
    },

    vehicleType: {
      type: String,
      enum: ["bike", "car", "truck"],
      required: true,
    },

    vehicleNumber: {
      type: String,
      required: true,
      uppercase: true,
      trim: true,
    },

    startTime: {
      type: Date,
      required: true,
      default: Date.now,
    },

    endTime: {
      type: Date,
      default: null,
    },

    pricePerHour: {
      type: Number,
      required: true,
      min: 0,
    },

    totalAmount: {
      type: Number,
      default: 0,
      min: 0,
    },

    status: {
      type: String,
      enum: ["ACTIVE", "COMPLETED"],
      default: "ACTIVE",
      index: true,
    },

    level: {
      type: String,
      required: true,
      trim: true,
    },

    slotNumber: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { timestamps: true }
);

BookingSchema.index(
  { slotId: 1, status: 1 },
  {
    unique: true,
    partialFilterExpression: { status: "ACTIVE" },
  }
);

export default mongoose.models.Booking ||
  mongoose.model("Booking", BookingSchema);