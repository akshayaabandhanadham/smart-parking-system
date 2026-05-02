import connectDB from "@/lib/db";
import { getRevenueStats } from "@/services/analytics.service";

/**
 * GET /api/analytics
 * Returns revenue statistics
 */
export async function GET() {
  try {
    await connectDB();

    const stats = await getRevenueStats();

    return Response.json(
      {
        success: true,
        data: stats,
      },
      { status: 200 }
    );

  } catch (error: any) {
    console.error("GET /api/analytics ERROR:", error);

    return Response.json(
      {
        success: false,
        message: error.message || "Failed to fetch analytics",
      },
      { status: 500 }
    );
  }
}