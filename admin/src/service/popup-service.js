//message,title,icon,draggable,text
class PopupService {
  message(req, res, icon, title) {
    this.setCookie(req, res, "icon", icon);
    this.setCookie(req, res, "title", title);
  }
  setCookie(req, res, key, value) {
    res.cookie(key, value, {
      httpOnly: false,
      sameSite: "strict",
      maxAge: 60 * 60 * 1000, //*1000 -> (s)
    });
  }
}

module.exports = new PopupService();
