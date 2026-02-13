const router = require("express").Router()
const { requireAuth } = require("../middleware/auth")
const {
  listRecent,
  deleteComment,
  editComment,
} = require("../controllers/commentsController")

router.use(requireAuth)

router.get("/", listRecent)
router.delete("/:id", deleteComment)
router.put("/:id", editComment)

module.exports = router
