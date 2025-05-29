//

class DashboardControllers {
  index(req, res) {
    return res.render("dashboard/dashboard");
  }
}

module.exports = new DashboardControllers();
