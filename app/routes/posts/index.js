const router = require("express").Router()
const { check, validationResult } = require("express-validator")
const postsCtrl = require("../../controllers/posts")

router.post("/create", [
 check("created_by").isMongoId().withMessage("Invalid created_by id")
], (req, res) => {
 try {
  const errors = validationResult(req)
  if (!errors.isEmpty()) return res.status(VALIDATION_ERROR_CODE).json({ errors: errors.array() })
  postsCtrl.createPosts(req, res)
 } catch (error) {
  res.status(SERVER_ERROR_CODE).json({ message: error.message })
 }
})


router.post("/like", [
 check("user_id").isMongoId().withMessage("Invalid user id"),
 check("post_id").isMongoId().withMessage("Invalid post id")
], (req, res) => {
 try {
  const errors = validationResult(req)
  if (!errors.isEmpty()) return res.status(VALIDATION_ERROR_CODE).json({ errors: errors.array() })
  postsCtrl.like(req, res)
 } catch (error) {
  res.status(SERVER_ERROR_CODE).json({ message: error.message })
 }
})

module.exports = router