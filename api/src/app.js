require("dotenv").config()
const express = require("express")
const cors = require("cors")
const morgan = require("morgan")

const authRoutes = require("./routes/auth")
const postsRoutes = require("./routes/posts")
const adminPostsRoutes = require("./routes/adminPosts")
const adminCommentsRoutes = require("./routes/adminComments")
const commentsRoutes = require("./routes/comments")
const { notFound, errorHandler } = require("./middleware/error")

const app = express()

app.use(express.json())
app.use(morgan("dev"))

app.use(
  cors({
    origin: true, // temporarily allow all origins
    credentials: false,
  }),
)

app.options(/.*/, cors())

app.get("/health", (req, res) => res.json({ ok: true }))

app.use("/api/auth", authRoutes)

// Public
app.use("/api/posts", postsRoutes)
app.use("/api/posts/:postId/comments", commentsRoutes)

// Admin
app.use("/api/admin/posts", adminPostsRoutes)
app.use("/api/admin/comments", adminCommentsRoutes)

app.use(notFound)
app.use(errorHandler)

module.exports = app
