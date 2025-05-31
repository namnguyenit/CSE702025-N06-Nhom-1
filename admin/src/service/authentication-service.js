const AdminSessionModels = require("./session/admin-session-models");

class AuthenticationService {
  async hasAuthenticate(req, res) {
    const cookie = req.cookies?.AdminSession;
    if (!cookie) return 0;
    const session = await AdminSessionModels.findOne({ sessionID: cookie });
    if (session) return 1;
    return 0;
  }
  async isAdmin(req, res) {
    const cookie = req.cookies?.AdminSession;
    if (!cookie) return 0;
    const session = await AdminSessionModels.findOne({ sessionID: cookie });
    if (session.role == "Admin") return 1;
    return 0;
  }
}

module.exports = new AuthenticationService();
