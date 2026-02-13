const { z } = require("zod")

const postCreateSchema = z.object({
  title: z.string().min(1).max(200),
  content: z.string().min(1),
})

const postUpdateSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  content: z.string().min(1).optional(),
  published: z.boolean().optional(),
})

module.exports = { postCreateSchema, postUpdateSchema }
