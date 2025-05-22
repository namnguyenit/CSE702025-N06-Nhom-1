const users = require("../models/user-models");
const bcrypt = require("bcrypt");
const AuthenticateService = require("../service/authenticate-service");

class AuthenticateControllers {
  //showLoginForm
  showLoginForm(req, res) {
    const popup = req.query;
    res.render("authenticate/login", { popup });
  }
  //handleLogin
  async handleLogin(req, res) {
    try {
      let { account: inputAccount, password: inputPassword } = req.body;

      const user = await users.findOne({ account: inputAccount });
      //Nếu ko tồn tại
      if (!user) {
        res.redirect("/login?type=error&info=no-user");
        return;
      }
      //Nếu sai mật khẩu
      const match = await bcrypt.compare(inputPassword, user.password);
      if (match) {
        // Mật khẩu đúng → đăng nhập thành công
        AuthenticateService.setSession(req, res);
        //
        res.redirect("/users");
      } else {
        res.redirect("/login?type=error&info=incorrect-password");
      }
    } catch (error) {
      //log và thông báo về lỗi
      console.error("Error in handleLogin:", error);
      return res.status(500).redirect("/login");
    }
  }
  //showSignupForm
  showSignupForm(req, res) {
    const popup = req.query;
    res.render("authenticate/signup", { popup });
  }
  //handleSignup
  async handleSignup(req, res) {
    try {
      //Validate dữ liệu
      let { account, password, passwordConfirm } = req.body;
      if (password != passwordConfirm) {
        return res.redirect("/signup?type=error&info=not-match");
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
      return res.redirect("/users");
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
