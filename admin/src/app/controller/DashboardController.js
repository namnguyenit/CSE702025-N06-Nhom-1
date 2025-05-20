class DashboardController {
  index(req, res) {
    res.render("Dashboard/index");
  }
}

module.exports = new DashboardController();
