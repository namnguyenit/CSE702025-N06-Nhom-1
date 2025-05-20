const users = require("../models/users");
const bcrypt = require("bcrypt");

class AuthenticateControllers {
  showLoginForm(req, res) {
    res.render("authenticate/login");
  }
  async handleLogin(req, res) {
    let { acc, paw } = req.body;

    const hashedPassword = await bcrypt.hash(paw, 10);

    const newUser = new users({
      account: acc,
      password: hashedPassword,
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
