import connectDB from "@/lib/db";
import Slot from "@/models/Slot";

export async function GET() {
  try {
    await connectDB();

    // 🔥 FORCE DELETE OLD DATA
    await Slot.deleteMany({});

    // 🔥 INSERT FRESH DATA WITH LEVEL
    const slots = await Slot.insertMany([
      { slotNumber: "A1", level: "1", price: 50, status: "available" },
      { slotNumber: "A2", level: "1", price: 60, status: "available" },
      { slotNumber: "A3", level: "1", price: 70, status: "available" },
      { slotNumber: "B1", level: "2", price: 40, status: "available" },
      { slotNumber: "B2", level: "2", price: 45, status: "available" },
      { slotNumber: "C1", level: "Basement", price: 30, status: "available" }
    ]);

    return Response.json({
      success: true,
      message: "Database RESET & seeded successfully ✅",
      data: slots,
    });
  } catch (error: any) {
    return Response.json(
      {
        success: false,
        message: error.message,
      },
      { status: 500 }
    );
  }
}