const router = require("express").Router({ mergeParams: true })
const { addComment } = require("../controllers/commentsController")

router.post("/", addComment)

module.exports = router
