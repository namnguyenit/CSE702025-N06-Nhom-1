const users = require("../models/users");
const bcrypt = require("bcrypt");
const AuthenticateService = require("../service/authenticate-service");

class AuthenticateControllers {
  //showLoginForm
  showLoginForm(req, res) {
    const err = req.query.err;
    res.render("authenticate/login", { err });
  }
  //handleLogin
  async handleLogin(req, res) {
    try {
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
        AuthenticateService.setSession(req, res);
        //
        res.redirect("/dashboard");
      } else {
        res.redirect("/login?err=incorrect-password");
      }
    } catch (error) {
      //log và thông báo về lỗi
      console.error("Error in handleLogin:", error);
      return res.status(500).redirect("/login");
    }
  }
  //showSignupForm
  showSignupForm(req, res) {
    const err = req.query.err;
    res.render("authenticate/signup", { err });
  }
  //handleSignup
  async handleSignup(req, res) {
    try {
      //Validate dữ liệu
      let { account, password, passwordConfirm } = req.body;
      if (password != passwordConfirm) {
        res.redirect("/signup?err=not-match");
        return;
      }
      //Set sesion
      AuthenticateService.setSession(req, res);
      //Lưu tài khoản
      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = new users({
        account: account,
        password: hashedPassword,
      });
      await newUser.save();
      return res.redirect("/dashboard");
    } catch (error) {
      //log và thông báo về lỗi
      console.error("Error in handleSignup:", error);
      return res.status(500).redirect("/signup");
    }
  }
  //handleLogout
  handleLogout(req, res) {
    AuthenticateService.clearSesion(req, res);
    res.redirect("/");
  }
}

module.exports = new AuthenticateControllers();
