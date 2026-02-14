const prisma = require("../lib/prisma")
const { postCreateSchema, postUpdateSchema } = require("../validators/posts")

async function listPublished(req, res) {
  const posts = await prisma.post.findMany({
    where: { published: true },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      title: true,
      content: true,
      createdAt: true,
      updatedAt: true,
      publishedAt: true,
      author: { select: { username: true, email: true } },
    },
  })
  res.json(posts)
}

async function getPublished(req, res) {
  const { id } = req.params
  const post = await prisma.post.findFirst({
    where: { id, published: true },
    select: {
      id: true,
      title: true,
      content: true,
      createdAt: true,
      updatedAt: true,
      publishedAt: true,
      author: { select: { username: true, email: true } },
      comments: {
        orderBy: { createdAt: "desc" },
        select: { id: true, content: true, name: true, createdAt: true },
      },
    },
  })
  if (!post) return res.status(404).json({ error: "Post not found" })
  res.json(post)
}

// Admin
async function listAll(req, res) {
  const posts = await prisma.post.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      title: true,
      published: true,
      createdAt: true,
      updatedAt: true,
      publishedAt: true,
    },
  })
  res.json(posts)
}

async function getById(req, res) {
  const { id } = req.params
  const post = await prisma.post.findUnique({
    where: { id },
    select: {
      id: true,
      title: true,
      content: true,
      published: true,
      createdAt: true,
      updatedAt: true,
      publishedAt: true,
    },
  })

  if (!post) return res.status(404).json({ error: "Post not found" })
  res.json(post)
}

async function createPost(req, res) {
  const parsed = postCreateSchema.safeParse(req.body)
  if (!parsed.success)
    return res.status(400).json({ error: parsed.error.flatten() })

  const { title, content } = parsed.data
  const authorId = req.user.sub

  const post = await prisma.post.create({
    data: { title, content, authorId },
  })

  res.status(201).json(post)
}

async function updatePost(req, res) {
  const { id } = req.params
  const parsed = postUpdateSchema.safeParse(req.body)
  if (!parsed.success)
    return res.status(400).json({ error: parsed.error.flatten() })

  const data = { ...parsed.data }

  if (typeof data.published === "boolean") {
    data.publishedAt = data.published ? new Date() : null
  }

  const existing = await prisma.post.findUnique({ where: { id } })
  if (!existing) return res.status(404).json({ error: "Post not found" })

  const post = await prisma.post.update({ where: { id }, data })
  res.json(post)
}

async function deletePost(req, res) {
  const { id } = req.params
  const existing = await prisma.post.findUnique({ where: { id } })
  if (!existing) return res.status(404).json({ error: "Post not found" })

  await prisma.comment.deleteMany({ where: { postId: id } })
  await prisma.post.delete({ where: { id } })

  res.status(204).send()
}

module.exports = {
  listPublished,
  getPublished,
  listAll,
  getById,
  createPost,
  updatePost,
  deletePost,
}
