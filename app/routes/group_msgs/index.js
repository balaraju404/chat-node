const router = require("express").Router()
const { check, validationResult } = require("express-validator")
const groupsMsgCtrl = require("../../controllers/group_msgs")

router.post("/send", [
 check("group_id").isMongoId().withMessage("Invalid group id"),
 check("msg").trim().isString().isLength({ min: 1 }).withMessage("Invalid message")
], (req, res, next) => {
 try {
  const errors = validationResult(req)
  if (!errors.isEmpty()) return res.status(VALIDATION_ERROR_CODE).json({ errors: errors.array() })
  groupsMsgCtrl.send(req, res)
 } catch (error) {
  res.status(SERVER_ERROR_CODE).json({ message: error.message })
 }
})

router.post("/update", [
 check("group_msg_id").isMongoId().withMessage("Invalid Group Msg Id"),
], (req, res, next) => {
 try {
  const errors = validationResult(req)
  if (!errors.isEmpty()) return res.status(VALIDATION_ERROR_CODE).json({ errors: errors.array() })
  groupsMsgCtrl.update(req, res)
 } catch (error) {
  res.status(SERVER_ERROR_CODE).json({ message: error.message })
 }
})

router.post("/delete", [
 check("group_msg_id").isMongoId().withMessage("Invalid Group Msg Id"),
], (req, res, next) => {
 try {
  const errors = validationResult(req)
  if (!errors.isEmpty()) return res.status(VALIDATION_ERROR_CODE).json({ errors: errors.array() })
  groupsMsgCtrl.delete(req, res)
 } catch (error) {
  res.status(SERVER_ERROR_CODE).json({ message: error.message })
 }
})

router.post("/details", [
 check("group_id").isMongoId().withMessage("Invalid group id")
], (req, res, next) => {
 try {
  const errors = validationResult(req)
  if (!errors.isEmpty()) return res.status(VALIDATION_ERROR_CODE).json({ errors: errors.array() })
  groupsMsgCtrl.details(req, res)
 } catch (error) {
  res.status(SERVER_ERROR_CODE).json({ message: error.message })
 }
})

module.exports = router