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
    return res.send("DE");
  }
}

module.exports = new OrderControllers();
