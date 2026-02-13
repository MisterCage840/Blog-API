import { useEffect, useState } from "react"
import { getPosts, getPost, addComment } from "./api"
import "./App.css"

function formatDate(d) {
  return new Date(d).toLocaleString()
}

export default function App() {
  const [posts, setPosts] = useState([])
  const [activeId, setActiveId] = useState(null)
  const [activePost, setActivePost] = useState(null)
  const [loading, setLoading] = useState(true)

  const [comment, setComment] = useState({ content: "", name: "", email: "" })
  const [err, setErr] = useState("")

  useEffect(() => {
    ;(async () => {
      try {
        const data = await getPosts()
        setPosts(data)
      } catch (e) {
        setErr(String(e.message || e))
      } finally {
        setLoading(false)
      }
    })()
  }, [])

  async function openPost(id) {
    setErr("")
    setActiveId(id)
    const p = await getPost(id)
    setActivePost(p)
  }

  async function submitComment(e) {
    e.preventDefault()
    setErr("")
    if (!activeId) return

    const payload = {
      content: comment.content,
      name: comment.name || undefined,
      email: comment.email || undefined,
    }

    try {
      await addComment(activeId, payload)
      setComment({ content: "", name: "", email: "" })
      const p = await getPost(activeId)
      setActivePost(p)
    } catch (e2) {
      setErr(String(e2.message || e2))
    }
  }

  if (loading) return <div className="app-loading">Loading…</div>

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <h2 className="sidebar-title">Blog</h2>
        {err ? <p className="error-text">{err}</p> : null}
        {posts.length === 0 ? <p>No posts yet.</p> : null}
        <ul className="post-list">
          {posts.map((p) => (
            <li key={p.id}>
              <button
                onClick={() => openPost(p.id)}
                className={`post-card ${p.id === activeId ? "active" : ""}`}
              >
                <div className="post-card-title">{p.title}</div>
                <div className="post-card-meta">
                  {p.publishedAt
                    ? `Published ${formatDate(p.publishedAt)}`
                    : `Created ${formatDate(p.createdAt)}`}
                </div>
              </button>
            </li>
          ))}
        </ul>
      </aside>

      <main className="content">
        {!activePost ? (
          <div className="empty-state">Select a post.</div>
        ) : (
          <article className="article">
            <h1 className="article-title">{activePost.title}</h1>
            <div className="article-meta">
              {activePost.publishedAt
                ? `Published ${formatDate(activePost.publishedAt)}`
                : ""}
            </div>
            <div className="article-content">
              {activePost.content}
            </div>

            <hr className="section-divider" />

            <h3 className="section-title">Comments</h3>
            {activePost.comments?.length ? (
              <div className="comments-grid">
                {activePost.comments.map((c) => (
                  <div key={c.id} className="comment-card">
                    <div className="comment-meta">
                      {c.name ? c.name : "Anonymous"} •{" "}
                      {formatDate(c.createdAt)}
                    </div>
                    <div className="comment-content">
                      {c.content}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p>No comments yet.</p>
            )}

            <hr className="section-divider" />

            <h3 className="section-title">Add a comment</h3>
            <form onSubmit={submitComment} className="comment-form">
              <textarea
                required
                rows={4}
                placeholder="Your comment"
                value={comment.content}
                className="form-control text-area"
                onChange={(e) =>
                  setComment({ ...comment, content: e.target.value })
                }
              />
              <input
                placeholder="Name (optional)"
                value={comment.name}
                className="form-control"
                onChange={(e) =>
                  setComment({ ...comment, name: e.target.value })
                }
              />
              <input
                placeholder="Email (optional)"
                value={comment.email}
                className="form-control"
                onChange={(e) =>
                  setComment({ ...comment, email: e.target.value })
                }
              />
              <button type="submit" className="submit-btn">
                Submit
              </button>
            </form>
          </article>
        )}
      </main>
    </div>
  )
}
