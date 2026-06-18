const bcrypt = require("bcryptjs");
const prisma = require("../db/prisma");
const { signToken } = require("../utils/token");

// Shape a user record for the client — never leak the password hash.
const publicUser = (user) => ({
  id: user.id,
  email: user.email,
  name: user.name,
});

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// POST /api/auth/register
// Public registration is gated behind ALLOW_REGISTRATION so the deployment can
// run single-user until it's ready to open up.
const register = async (req, res) => {
  try {
    if (process.env.ALLOW_REGISTRATION !== "true") {
      return res.status(403).json({ error: "Registration is disabled" });
    }

    const { email, password, name } = req.body;

    if (!email || !EMAIL_RE.test(email)) {
      return res.status(400).json({ error: "A valid email is required" });
    }
    if (!password || password.length < 8) {
      return res
        .status(400)
        .json({ error: "Password must be at least 8 characters" });
    }

    const normalisedEmail = email.trim().toLowerCase();

    const existing = await prisma.user.findUnique({
      where: { email: normalisedEmail },
    });
    if (existing) {
      return res.status(409).json({ error: "Email already registered" });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        email: normalisedEmail,
        passwordHash,
        name: name?.trim() || null,
      },
    });

    const token = signToken(user.id);
    res.status(201).json({ token, user: publicUser(user) });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// POST /api/auth/login
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    const user = await prisma.user.findUnique({
      where: { email: email.trim().toLowerCase() },
    });

    // Same response whether the email is unknown or the password is wrong, so
    // we don't reveal which accounts exist.
    const ok = user && (await bcrypt.compare(password, user.passwordHash));
    if (!ok) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const token = signToken(user.id);
    res.json({ token, user: publicUser(user) });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET /api/auth/me  (behind authMiddleware)
const me = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({ where: { id: req.userId } });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json({ user: publicUser(user) });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { register, login, me };
