const router = require("express").Router()
const { check, validationResult } = require("express-validator")
const msgCtrl = require("../../controllers/messages")

router.post("/msg", [
 check("receiver_id").isMongoId().withMessage("Invalid receiver id"),
 check("msg").trim().isString().isLength({ min: 1 }).withMessage("Invalid Message")
], (req, res, next) => {
 try {
  const errors = validationResult(req)
  if (!errors.isEmpty()) return res.status(VALIDATION_ERROR_CODE).json({ errors: errors.array() })
  msgCtrl.messages(req, res)
 } catch (error) {
  res.status(SERVER_ERROR_CODE).json({ message: error.message })
 }
})

router.post("/chat", [
 check("friend_id").isMongoId().withMessage("Invalid friend id")
], (req, res, next) => {
 try {
  const errors = validationResult(req)
  if (!errors.isEmpty()) return res.status(VALIDATION_ERROR_CODE).json({ errors: errors.array() })
  msgCtrl.chat(req, res)
 } catch (error) {
  res.status(SERVER_ERROR_CODE).json({ message: error.message })
 }
})

router.post("/dashboard", [], (req, res, next) => {
 try {
  const errors = validationResult(req)
  if (!errors.isEmpty()) return res.status(VALIDATION_ERROR_CODE).json({ errors: errors.array() })
  msgCtrl.dashBoard(req, res)
 } catch (error) {
  res.status(SERVER_ERROR_CODE).json({ message: error.message })
 }
})

router.post("/update", [
 check("msg_id").isMongoId().withMessage("Invalid Message Id"),
], (req, res, next) => {
 try {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(VALIDATION_ERROR_CODE).json({ errors: errors.array() });
  msgCtrl.update(req, res)
 } catch (error) {
  res.status(SERVER_ERROR_CODE).json({ message: error.message });
 }
})

router.post("/delete", [
 check("msg_id").isMongoId().withMessage("Invalid Message Id"),
], (req, res, next) => {
 try {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(VALIDATION_ERROR_CODE).json({ errors: errors.array() });
  msgCtrl.delete(req, res)
 } catch (error) {
  res.status(SERVER_ERROR_CODE).json({ message: error.message });
 }
})
module.exports = router