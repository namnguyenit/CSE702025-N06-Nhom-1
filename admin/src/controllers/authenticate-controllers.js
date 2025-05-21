const users = require("../models/users");
const bcrypt = require("bcrypt");

class AuthenticateControllers {
  //showLoginForm
  showLoginForm(req, res) {
    const err = req.query.err;
    res.render("authenticate/login", { err });
  }
  //handleLogin
  async handleLogin(req, res) {
    let { account: inputAccount, password: inputPassword } = req.body;

    const user = await users.findOne({ account: inputAccount });
    //Nếu ko tồn tại
    if (!user) {
      res.redirect("/login?err=no-user");
      return;
    }
    //Nếu sai mật khẩu
    const match = await bcrypt.compare(inputPassword, user.password);
    if (match) {
      // Mật khẩu đúng → đăng nhập thành công
      res.redirect("/dashboard");
    } else {
      res.redirect("/login?err=incorrect-password");
    }
  }
  //showSignupForm
  showSignupForm(req, res) {
    const err = req.query.err;
    res.render("authenticate/signup", { err });
  }
  //handleSignupForm
  async handleSignup(req, res) {
    let { account, password, passwordConfirm } = req.body;

    if (password != passwordConfirm) {
      res.redirect("/signup?err=not-match");
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new users({
      account: account,
      password: hashedPassword,
    });
    await newUser
      .save()
      .then((doc) => {
        res.redirect("/dashboard");
      })
      .catch((err) => {
        console.error("Errod:", err);
      });
  }
}

module.exports = new AuthenticateControllers();
