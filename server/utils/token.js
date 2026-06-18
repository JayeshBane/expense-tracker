const jwt = require("jsonwebtoken");

const JWT_EXPIRES_IN = "7d";

// Sign a JWT carrying the user's id. Throws if JWT_SECRET is unset so the
// failure is loud rather than producing unverifiable tokens.
const signToken = (userId) => {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not set");
  }

  return jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  });
};

const verifyToken = (token) => jwt.verify(token, process.env.JWT_SECRET);

module.exports = { signToken, verifyToken };
