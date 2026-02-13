const { z } = require("zod")

const commentCreateSchema = z.object({
  content: z.string().min(1).max(2000),
  name: z.string().min(1).max(80).optional(),
  email: z.string().email().optional(),
})

module.exports = { commentCreateSchema }
