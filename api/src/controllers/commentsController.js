const prisma = require("../lib/prisma")
const { commentCreateSchema } = require("../validators/comments")

async function addComment(req, res) {
  const { postId } = req.params

  const post = await prisma.post.findFirst({
    where: { id: postId, published: true },
  })
  if (!post) return res.status(404).json({ error: "Post not found" })

  const parsed = commentCreateSchema.safeParse(req.body)
  if (!parsed.success)
    return res.status(400).json({ error: parsed.error.flatten() })

  const comment = await prisma.comment.create({
    data: { ...parsed.data, postId },
  })

  res.status(201).json(comment)
}

// Admin
async function listRecent(req, res) {
  const comments = await prisma.comment.findMany({
    orderBy: { createdAt: "desc" },
    take: 100,
    select: {
      id: true,
      content: true,
      name: true,
      email: true,
      createdAt: true,
      post: { select: { id: true, title: true } },
    },
  })
  res.json(comments)
}

async function deleteComment(req, res) {
  const { id } = req.params
  const existing = await prisma.comment.findUnique({ where: { id } })
  if (!existing) return res.status(404).json({ error: "Comment not found" })

  await prisma.comment.delete({ where: { id } })
  res.status(204).send()
}

async function editComment(req, res) {
  const { id } = req.params
  const { content } = req.body || {}
  if (!content || typeof content !== "string")
    return res.status(400).json({ error: "content is required" })

  const existing = await prisma.comment.findUnique({ where: { id } })
  if (!existing) return res.status(404).json({ error: "Comment not found" })

  const updated = await prisma.comment.update({
    where: { id },
    data: { content },
  })
  res.json(updated)
}

module.exports = { addComment, listRecent, deleteComment, editComment }
