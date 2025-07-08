const router = require("express").Router()
const { check, validationResult } = require("express-validator")
const cmntsCtrl = require("../../controllers/comments")

router.post("/addComment", [
 check("created_by").isMongoId().withMessage("Invalid created_by"),
 check("post_id").isMongoId().withMessage("Invalid post id")
], (req, res) => {
 try {
  const errors = validationResult(req)
  if (!errors.isEmpty()) return res.status(VALIDATION_ERROR_CODE).json({ errors: errors.array() })
  cmntsCtrl.addComment(req, res)
 } catch (error) {
  res.status(SERVER_ERROR_CODE).json({ message: error.message })
 }
})

router.post("/updateComment", [
 check("comment_id").isMongoId().withMessage("Invalid comment id")
], (req, res) => {
 try {
  const errors = validationResult(req)
  if (!errors.isEmpty()) return res.status(VALIDATION_ERROR_CODE).json({ errors: errors.array() })
  cmntsCtrl.updateComment(req, res)
 } catch (error) {
  res.status(SERVER_ERROR_CODE).json({ message: error.message })
 }
})

router.post("/deleteComment", [
 check("comment_id").isMongoId().withMessage("Invalid comment id")
], (req, res) => {
 try {
  const errors = validationResult(req)
  if (!errors.isEmpty()) return res.status(VALIDATION_ERROR_CODE).json({ errors: errors.array() })
  cmntsCtrl.deleteComment(req, res)
 } catch (error) {
  res.status(SERVER_ERROR_CODE).json({ message: error.message })
 }
})
module.exports = router