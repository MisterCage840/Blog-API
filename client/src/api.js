const BASE = import.meta.env.VITE_API_BASE_URL

export async function getPosts() {
  const res = await fetch(`${BASE}/api/posts`)
  if (!res.ok) throw new Error("Failed to load posts")
  return res.json()
}

export async function getPost(id) {
  const res = await fetch(`${BASE}/api/posts/${id}`)
  if (!res.ok) throw new Error("Failed to load post")
  return res.json()
}

export async function addComment(postId, payload) {
  const res = await fetch(`${BASE}/api/posts/${postId}/comments`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  })
  if (!res.ok) {
    const data = await res.json().catch(() => ({}))
    throw new Error(
      data?.error ? JSON.stringify(data.error) : "Failed to add comment",
    )
  }
  return res.json()
}
