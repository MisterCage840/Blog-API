import { useEffect, useMemo, useState } from "react"
import {
  register,
  login,
  listPostsAdmin,
  createPost,
  updatePost,
  deletePost,
  listCommentsAdmin,
  deleteComment,
} from "./api"

function formatDate(d) {
  return new Date(d).toLocaleString()
}

export default function App() {
  const [token, setToken] = useState(localStorage.getItem("token") || "")
  const isAuthed = useMemo(() => Boolean(token), [token])

  const [authMode, setAuthMode] = useState("login") // login | register
  const [authForm, setAuthForm] = useState({
    email: "",
    password: "",
    username: "",
  })
  const [err, setErr] = useState("")

  const [posts, setPosts] = useState([])
  const [selected, setSelected] = useState(null)
  const [editor, setEditor] = useState({ title: "", content: "" })

  const [comments, setComments] = useState([])

  async function refresh() {
    const p = await listPostsAdmin()
    setPosts(p)
    const c = await listCommentsAdmin()
    setComments(c)
  }

  useEffect(() => {
    if (!isAuthed) return
    refresh().catch((e) => setErr(String(e.message || e)))
  }, [isAuthed])

  async function handleAuth(e) {
    e.preventDefault()
    setErr("")
    try {
      if (authMode === "register") {
        await register({
          email: authForm.email,
          password: authForm.password,
          username: authForm.username || undefined,
        })
      }
      const data = await login({
        email: authForm.email,
        password: authForm.password,
      })
      localStorage.setItem("token", data.token)
      setToken(data.token)
    } catch (e2) {
      setErr(String(e2.message || e2))
    }
  }

  function logout() {
    localStorage.removeItem("token")
    setToken("")
    setSelected(null)
    setEditor({ title: "", content: "" })
  }

  async function pickPost(p) {
    setSelected(p)
    // For simplicity, edit using current values only (we don’t fetch full post in admin)
    setEditor({ title: p.title, content: "" }) // optional: build an admin GET-by-id route if you want full content
  }

  async function newPost() {
    setErr("")
    try {
      const created = await createPost({
        title: "New post",
        content: "Write here...",
      })
      setSelected(created)
      setEditor({ title: created.title, content: created.content })
      await refresh()
    } catch (e) {
      setErr(String(e.message || e))
    }
  }

  async function savePost() {
    if (!selected) return
    setErr("")
    try {
      await updatePost(selected.id, {
        title: editor.title,
        content: editor.content,
      })
      await refresh()
    } catch (e) {
      setErr(String(e.message || e))
    }
  }

  async function togglePublish(p) {
    setErr("")
    try {
      await updatePost(p.id, { published: !p.published })
      await refresh()
    } catch (e) {
      setErr(String(e.message || e))
    }
  }

  async function removePost(p) {
    setErr("")
    try {
      await deletePost(p.id)
      if (selected?.id === p.id) setSelected(null)
      await refresh()
    } catch (e) {
      setErr(String(e.message || e))
    }
  }

  async function removeComment(id) {
    setErr("")
    try {
      await deleteComment(id)
      await refresh()
    } catch (e) {
      setErr(String(e.message || e))
    }
  }

  if (!isAuthed) {
    return (
      <div className="auth-shell">
        <div className="auth-card">
          <h2 className="panel-title">Admin</h2>
          <p className="auth-copy">
          {authMode === "register"
            ? "Create your first author account (run once)."
            : "Login to manage posts & comments."}
          </p>
          {err ? <p className="error-text">{err}</p> : null}

          <form onSubmit={handleAuth} className="stack">
            <input
              required
              placeholder="Email"
              value={authForm.email}
              onChange={(e) =>
                setAuthForm({ ...authForm, email: e.target.value })
              }
              className="field-input"
            />
            <input
              required
              type="password"
              placeholder="Password (min 8 chars)"
              value={authForm.password}
              onChange={(e) =>
                setAuthForm({ ...authForm, password: e.target.value })
              }
              className="field-input"
            />
            {authMode === "register" ? (
              <input
                placeholder="Username (optional)"
                value={authForm.username}
                onChange={(e) =>
                  setAuthForm({ ...authForm, username: e.target.value })
                }
                className="field-input"
              />
            ) : null}

            <button type="submit" className="btn btn-primary">
              {authMode === "register" ? "Register + Login" : "Login"}
            </button>

            <button
              type="button"
              onClick={() =>
                setAuthMode(authMode === "login" ? "register" : "login")
              }
              className="btn btn-ghost"
            >
              Switch to {authMode === "login" ? "Register" : "Login"}
            </button>
          </form>
        </div>
      </div>
    )
  }

  return (
    <div className="admin-layout">
      <aside className="panel sidebar-panel">
        <div className="panel-head">
          <h2 className="panel-title">Posts</h2>
          <button onClick={logout} className="btn btn-ghost btn-sm">
            Logout
          </button>
        </div>

        {err ? <p className="error-text">{err}</p> : null}

        <div className="toolbar">
          <button onClick={newPost} className="btn btn-primary">
            New Post
          </button>
          <button onClick={() => refresh()} className="btn btn-ghost">
            Refresh
          </button>
        </div>

        <ul className="list-reset stack">
          {posts.map((p) => (
            <li key={p.id}>
              <div className="card">
                <div className="card-title">{p.title}</div>
                <div className="meta-text">
                  {p.published ? "Published" : "Draft"} •{" "}
                  {formatDate(p.updatedAt)}
                </div>
                <div className="toolbar compact">
                  <button onClick={() => pickPost(p)} className="btn btn-ghost btn-sm">
                    Edit
                  </button>
                  <button onClick={() => togglePublish(p)} className="btn btn-ghost btn-sm">
                    {p.published ? "Unpublish" : "Publish"}
                  </button>
                  <button onClick={() => removePost(p)} className="btn btn-danger btn-sm">
                    Delete
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>

        <hr className="divider" />
        <h3 className="section-title">Recent Comments</h3>
        <div className="stack">
          {comments.map((c) => (
            <div key={c.id} className="card">
              <div className="meta-text">
                {c.name || "Anonymous"} on <b>{c.post?.title}</b> •{" "}
                {formatDate(c.createdAt)}
              </div>
              <div className="comment-text">{c.content}</div>
              <button onClick={() => removeComment(c.id)} className="btn btn-danger btn-sm">
                Delete
              </button>
            </div>
          ))}
        </div>
      </aside>

      <main className="panel editor-panel">
        <h2 className="panel-title">Editor</h2>
        {!selected ? (
          <p className="hint-text">Select a post to edit.</p>
        ) : (
          <div className="editor-stack">
            <input
              value={editor.title}
              onChange={(e) => setEditor({ ...editor, title: e.target.value })}
              placeholder="Title"
              className="field-input"
            />
            <textarea
              rows={14}
              value={editor.content}
              onChange={(e) =>
                setEditor({ ...editor, content: e.target.value })
              }
              placeholder="Content"
              className="field-input textarea-input"
            />
            <button onClick={savePost} className="btn btn-primary">
              Save Changes
            </button>
            <p className="hint-text">
              Tip: For full admin editing with prefilled content, add an admin
              “GET post by id” route that returns title+content.
            </p>
          </div>
        )}
      </main>
    </div>
  )
}
