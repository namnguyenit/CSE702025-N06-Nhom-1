const OrderModels = require("../models/order-models");
//

class DashboardControllers {
  index(req, res) {
    return res.render("dashboard/dashboard");
  }
  async priceTotal(req, res) {
    const result = await OrderModels.aggregate([
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$totalAmount" },
        },
      },
    ]);
    const totalAmount = result[0]?.totalRevenue || 0;
    res.json({ totalAmount });
  }
  async totalMonth(req, res) {
    const result = await OrderModels.aggregate([
      {
        $match: {
          orderDate: { $exists: true }, // Bỏ qua đơn hàng không có ngày
        },
      },
      {
        $project: {
          month: { $month: "$orderDate" }, // Lấy tháng từ orderDate
          totalAmount: 1,
        },
      },
      {
        $group: {
          _id: "$month",
          total: { $sum: "$totalAmount" },
        },
      },
      {
        $project: {
          _id: 0,
          month: "$_id",
          total: 1,
        },
      },
      {
        $sort: { month: 1 },
      },
    ]);
    const monthlyTotals = [...Array(12)].map((_, index) => {
      const month = index + 1;
      const found = result.find((item) => item.month === month);
      return found ? found.total : 0;
    });
    res.json({ monthlyTotals });
  }
}

module.exports = new DashboardControllers();
