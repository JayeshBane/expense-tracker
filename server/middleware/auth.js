const { verifyToken } = require("../utils/token");

// Reads `Authorization: Bearer <token>`, verifies it, and attaches `req.userId`.
// Responds 401 when the header is missing or the token is invalid/expired.
const authMiddleware = (req, res, next) => {
  const header = req.headers.authorization || "";
  const [scheme, token] = header.split(" ");

  if (scheme !== "Bearer" || !token) {
    return res.status(401).json({ error: "Authentication required" });
  }

  try {
    const payload = verifyToken(token);
    req.userId = payload.userId;
    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
};

module.exports = authMiddleware;
