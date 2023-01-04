const admin = require("../config/firebase-config");

class Middleware {
  async decodeToken(req, res) {
    const token = req.headers.authorization.split(" "[1]);

    try {
      const decodeValue = admin.auth().verifyIdToken(token);
      if (decodeValue) {
        return next();
      }

      return res.json({ message: "unauthorized" });
    } catch (error) {
      return res.json({
        success: false,
        message: "couldn't decode token",
        error: error.message,
      });
    }
  }
}

module.exports = new Middleware();
