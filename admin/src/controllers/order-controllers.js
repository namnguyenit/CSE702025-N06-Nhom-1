const OrderModels = require("../models/order-models");
const PopupService = require("../service/popup-service");

class OrderControllers {
  async index(req, res) {
    const orders = await OrderModels.find({});
    const nameTable = "Order Table";
    res.render("orders/index", { nameTable, orders });
  }
  async approved(req, res) {
    const id = req.body?.id;
    const order = await OrderModels.findById(id);
    order.status = "waiting";
    await order.save();
    PopupService.message(req, res, "success", "- Đã duyệt đơn hàng -");
    return res.redirect("/orders");
  }
}

module.exports = new OrderControllers();
