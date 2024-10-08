const jwt = require("jsonwebtoken");

const { JWT_ADMIN_SECRET } = require("../config");
const { adminModel } = require("../db.js");
const { default: mongoose } = require("mongoose");

async function adminAuth(req, res, next) {
  const token = req.headers.authorization;

  try {
    const decoded = jwt.verify(token, JWT_ADMIN_SECRET);

    const decodedAdminId = new mongoose.Types.ObjectId(decoded._id);
    const result = await adminModel.findById(decodedAdminId);

    

    if (result) {
      req.adminId = decodedAdminId;
      req.adminUsername = result.username;

      next();
    } else {
      res.json({
        message: "Token invalid",
      });
    }
  } catch (e) {
    console.log(e);
    res.json({
      message: "Token Invalid",
    });
  }
}

module.exports = { adminAuth };
