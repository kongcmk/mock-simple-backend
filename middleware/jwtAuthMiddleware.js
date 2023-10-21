const jwt = require("jsonwebtoken");
require("dotenv").config();

const accessSecretKey = process.env.ACCESS_TOKEN_SECRET;

exports.authToken = (req, res, next) => {
  const token = req.headers["Authorization"];

  if (!token || !token.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  // ตรวจสอบความถูกต้องของ JWT และดำเนินการต่อไป
  jwt.verify(token.replace("Bearer ", ""), accessSecretKey, (error, decoded) => {
    if (error) {
      console.error(error);
      return res.status(403).json({ error: "Forbidden" });
    }

    req.user = decoded; // ถ้า JWT ถูกต้อง, จะถอดรหัสและเก็บข้อมูลผู้ใช้ใน req.user
    next();
  });
};
