const { z } = require("zod")

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  username: z.string().min(2).max(50).optional(),
})

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
})

module.exports = { registerSchema, loginSchema }
