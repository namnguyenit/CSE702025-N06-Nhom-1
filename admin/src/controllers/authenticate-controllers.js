const users = require("../models/users");

class AuthenticateControllers {
  showLoginForm(req, res) {
    res.render("authenticate/login");
  }
  async handleLogin(req, res) {
    // let { acc, pas } = req.body;
    const newUser = new users({
      account: req.body.acc,
      password: req.body.paw,
    });
    await newUser
      .save()
      .then((doc) => {
        console.log("Saved");
      })
      .catch((err) => {
        console.error("Errod:", err);
      });
    res.redirect("/");
  }
}

module.exports = new AuthenticateControllers();
