class AuthenticateControllers {
  showLoginForm(req, res) {
    res.render("authenticate/login");
  }
  handleLogin(req, res) {}
}

module.exports = new AuthenticateControllers();
