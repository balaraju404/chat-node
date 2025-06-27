const router = require("express").Router();
const { check, validationResult } = require('express-validator');
const groupsMsgCtrl = require("../../controllers/group_msgs")

router.post("/msg", [
 check("group_id").isMongoId().withMessage("Invalid group id"),
 check("msg").trim().isString().isLength({ min: 4 }).withMessage("Invalid message")
], (req, res, next) => {
 try {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(VALIDATION_ERROR_CODE).json({ errors: errors.array() });
  groupsMsgCtrl.msg(req, res)
 } catch (error) {
  res.status(SERVER_ERROR_CODE).json({ message: error.message });
 }
})

router.post("/chat", [
 check("group_id").isMongoId().withMessage("Invalid group id")
], (req, res, next) => {
 try {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(VALIDATION_ERROR_CODE).json({ errors: errors.array() });
  groupsMsgCtrl.chat(req, res)
 } catch (error) {
  res.status(SERVER_ERROR_CODE).json({ message: error.message });
 }
})

router.post("/dashboard", (req, res, next) => {
 try {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(VALIDATION_ERROR_CODE).json({ errors: errors.array() });
  groupsMsgCtrl.dashboard(req, res)
 } catch (error) {
  res.status(SERVER_ERROR_CODE).json({ message: error.message });
 }
})

router.post("/update", [
 check("group_msg_id").isMongoId().withMessage("Invalid Group Msg Id"),
], (req, res, next) => {
 try {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(VALIDATION_ERROR_CODE).json({ errors: errors.array() });
  groupsMsgCtrl.update(req, res)
 } catch (error) {
  res.status(SERVER_ERROR_CODE).json({ message: error.message });
 }
})

router.post("/delete", [
 check("group_msg_id").isMongoId().withMessage("Invalid Group Msg Id"),
], (req, res, next) => {
 try {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(VALIDATION_ERROR_CODE).json({ errors: errors.array() });
  groupsMsgCtrl.delete(req, res)
 } catch (error) {
  res.status(SERVER_ERROR_CODE).json({ message: error.message });
 }
})

module.exports = router;