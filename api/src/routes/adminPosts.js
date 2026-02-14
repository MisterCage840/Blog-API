const router = require("express").Router()
const { requireAuth } = require("../middleware/auth")
const {
  listAll,
  getById,
  createPost,
  updatePost,
  deletePost,
} = require("../controllers/postsController")

router.use(requireAuth)

router.get("/", listAll)
router.get("/:id", getById)
router.post("/", createPost)
router.put("/:id", updatePost)
router.delete("/:id", deletePost)

module.exports = router
