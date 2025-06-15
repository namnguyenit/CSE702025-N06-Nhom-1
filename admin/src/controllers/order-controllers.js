const OrderModels = require("../models/order-models");
const PopupService = require("../service/popup-service");

class OrderControllers {
  async index(req, res) {
    const orders = await OrderModels.find({}).sort({ orderDate: -1 });
    const nameTable = "Order Table";
    res.render("orders/index", { nameTable, orders });
  }
  async approved(req, res) {
    const id = req.body?.id;
    const order = await OrderModels.findById(id);
    if (order.status != "pending") {
      PopupService.message(req, res, "error", "Trạng thái không hợp lệ!");
      return res.redirect("/orders");
    }
    order.status = "waiting";
    await order.save();
    PopupService.message(req, res, "success", "- Đã duyệt đơn hàng -");
    return res.redirect("/orders");
  }
  async detail(req, res) {
    const nameForm = "Order";
    const nameTable = "Detail";
    const order = await OrderModels.findById(req.body.id);
    return res.render("orders/detail", { nameForm, nameTable, order });
  }
  async cancelled(req, res) {
    try {
      //Tìm theo ID và xóa
      const order = await OrderModels.findById(req.body.id);
      if (order.status == "delivered") {
        return res.status(500).end();
      }
      if (order.status == "cancelled") {
        return res.status(500).end();
      }
      order.status = "cancelled";
      await order.save();
      return res.status(204).end();
    } catch (error) {
      //log và thông báo về lỗi
      console.error("Error in OrderControllers.cancelled:", error);
      return res
        .status(500)
        .json({ error: "Error in OrderControllers.cancelled" });
    }
  }
}

module.exports = new OrderControllers();
