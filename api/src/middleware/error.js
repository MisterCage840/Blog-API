function notFound(req, res) {
  res.status(404).json({ error: "Not found" })
}

// eslint-disable-next-line no-unused-vars
function errorHandler(err, req, res, next) {
  console.error(err)
  res.status(500).json({ error: "Server error" })
}

module.exports = { notFound, errorHandler }
