const BASE = import.meta.env.VITE_API_BASE_URL

function authHeaders() {
  const token = localStorage.getItem("token")
  return token ? { Authorization: `Bearer ${token}` } : {}
}

export async function register(payload) {
  const res = await fetch(`${BASE}/api/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  })
  if (!res.ok) throw new Error("Register failed")
  return res.json()
}

export async function login(payload) {
  const res = await fetch(`${BASE}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  })
  if (!res.ok) throw new Error("Login failed")
  return res.json()
}

export async function listPostsAdmin() {
  const res = await fetch(`${BASE}/api/admin/posts`, { headers: authHeaders() })
  if (!res.ok) throw new Error("Failed to load admin posts")
  return res.json()
}

export async function getPostAdmin(id) {
  const res = await fetch(`${BASE}/api/admin/posts/${id}`, {
    headers: authHeaders(),
  })
  if (!res.ok) throw new Error("Failed to load post")
  return res.json()
}

export async function createPost(payload) {
  const res = await fetch(`${BASE}/api/admin/posts`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: JSON.stringify(payload),
  })
  if (!res.ok) throw new Error("Failed to create post")
  return res.json()
}

export async function updatePost(id, payload) {
  const res = await fetch(`${BASE}/api/admin/posts/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: JSON.stringify(payload),
  })
  if (!res.ok) throw new Error("Failed to update post")
  return res.json()
}

export async function deletePost(id) {
  const res = await fetch(`${BASE}/api/admin/posts/${id}`, {
    method: "DELETE",
    headers: authHeaders(),
  })
  if (!res.ok) throw new Error("Failed to delete post")
}

export async function listCommentsAdmin() {
  const res = await fetch(`${BASE}/api/admin/comments`, {
    headers: authHeaders(),
  })
  if (!res.ok) throw new Error("Failed to load comments")
  return res.json()
}

export async function deleteComment(id) {
  const res = await fetch(`${BASE}/api/admin/comments/${id}`, {
    method: "DELETE",
    headers: authHeaders(),
  })
  if (!res.ok) throw new Error("Failed to delete comment")
}
