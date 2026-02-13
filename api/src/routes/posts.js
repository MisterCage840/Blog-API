const router = require("express").Router()
const {
  listPublished,
  getPublished,
} = require("../controllers/postsController")

router.get("/", listPublished)
router.get("/:id", getPublished)

module.exports = router
