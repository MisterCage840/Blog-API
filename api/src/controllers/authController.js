const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const prisma = require("../lib/prisma")
const { registerSchema, loginSchema } = require("../validators/auth")

async function register(req, res) {
  const parsed = registerSchema.safeParse(req.body)
  if (!parsed.success)
    return res.status(400).json({ error: parsed.error.flatten() })

  const { email, password, username } = parsed.data

  const existing = await prisma.user.findUnique({ where: { email } })
  if (existing) return res.status(409).json({ error: "Email already in use" })

  const passwordHash = await bcrypt.hash(password, 12)
  const user = await prisma.user.create({
    data: { email, username, passwordHash, role: "AUTHOR" },
  })

  res.status(201).json({
    id: user.id,
    email: user.email,
    username: user.username,
    role: user.role,
  })
}

async function login(req, res) {
  const parsed = loginSchema.safeParse(req.body)
  if (!parsed.success)
    return res.status(400).json({ error: parsed.error.flatten() })

  const { email, password } = parsed.data

  const user = await prisma.user.findUnique({ where: { email } })
  if (!user) return res.status(401).json({ error: "Invalid credentials" })

  const ok = await bcrypt.compare(password, user.passwordHash)
  if (!ok) return res.status(401).json({ error: "Invalid credentials" })

  const token = jwt.sign(
    { sub: user.id, role: user.role, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: "7d" },
  )

  res.json({ token })
}

function me(req, res) {
  res.json({ user: req.user })
}

module.exports = { register, login, me }
