class DashboardControllers {
  index(req, res) {
    res.render("Dashboard/index");
  }
}

module.exports = new DashboardControllers();
