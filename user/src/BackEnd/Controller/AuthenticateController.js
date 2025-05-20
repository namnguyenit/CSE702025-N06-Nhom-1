class AuthenticateController {
  index(req, res) {
    res.render("Authenticate");
  }
}

module.exports = new AuthenticateController();
