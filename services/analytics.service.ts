import Booking from "@/models/Booking";

export const getRevenueStats = async () => {
  const result = await Booking.aggregate([
    { $match: { status: "COMPLETED" } },

    {
      $lookup: {
        from: "slots",
        localField: "slotId",
        foreignField: "_id",
        as: "slot",
      },
    },

    {
      $unwind: {
        path: "$slot",
        preserveNullAndEmptyArrays: false,
      },
    },

    {
      $addFields: {
        hours: {
          $divide: [
            { $subtract: ["$endTime", "$startTime"] },
            3600000,
          ],
        },
      },
    },

    {
      $addFields: {
        revenue: {
          $multiply: ["$hours", "$slot.price"],
        },
      },
    },

    {
      $group: {
        _id: "$slot.zone",
        total: { $sum: "$revenue" },
      },
    },
  ]);

  let totalRevenue = 0;
  const zoneRevenue: Record<string, number> = {};

  result.forEach((r) => {
    const value = Math.round(r.total); // 🔥 rounding
    zoneRevenue[r._id] = value;
    totalRevenue += value;
  });

  return { totalRevenue, zoneRevenue };
};