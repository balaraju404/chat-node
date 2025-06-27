const router = require("express").Router();
const { check, validationResult } = require('express-validator');
const groupsCtrl = require("../../controllers/groups")

router.post("/create", [
 check("groupname").trim().isString().isLength({ min: 4 }).withMessage("Invalid groupname")
], (req, res, next) => {
 try {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(VALIDATION_ERROR_CODE).json({ errors: errors.array() });
  groupsCtrl.create(req, res)
 } catch (error) {
  res.status(SERVER_ERROR_CODE).json({ message: error.message });
 }
})

router.put("/add", [
 check("group_id").isMongoId().withMessage("Invalid group_id"),
 check("friends_ids").isArray().withMessage("friends_ids must be an array"),
 check("friends_ids.*").isMongoId().withMessage("Invalid friend id"),
 check("admin_ids").isArray().withMessage("admin_ids must be an array"),
 check("admin_ids.*").isMongoId().withMessage("Invalid admin id"),
], (req, res, next) => {
 try {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(VALIDATION_ERROR_CODE).json({ errors: errors.array() });
  groupsCtrl.add(req, res)
 } catch (error) {
  res.status(SERVER_ERROR_CODE).json({ message: error.message });
 }
})

router.post("/friends", [
 check("group_id").isMongoId().withMessage("Invalid group_id"),
], (req, res, next) => {
 try {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(VALIDATION_ERROR_CODE).json({ errors: errors.array() });
  groupsCtrl.friends(req, res)
 } catch (error) {
  res.status(SERVER_ERROR_CODE).json({ message: error.message });
 }
})

router.put("/leave", [
 check("group_id").isMongoId().withMessage("Invalid group_id"),
], (req, res, next) => {
 try {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(VALIDATION_ERROR_CODE).json({ errors: errors.array() });
  groupsCtrl.leave(req, res)
 } catch (error) {
  res.status(SERVER_ERROR_CODE).json({ message: error.message });
 }
})

router.post("/update", [
 check("group_id").isMongoId().withMessage("Invalid Group Id"),
], (req, res, next) => {
 try {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(VALIDATION_ERROR_CODE).json({ errors: errors.array() });
  groupsCtrl.update(req, res)
 } catch (error) {
  res.status(SERVER_ERROR_CODE).json({ message: error.message });
 }
})

router.post("/delete", [
 check("group_id").isMongoId().withMessage("Invalid Group Id"),
], (req, res, next) => {
 try {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(VALIDATION_ERROR_CODE).json({ errors: errors.array() });
  groupsCtrl.delete(req, res)
 } catch (error) {
  res.status(SERVER_ERROR_CODE).json({ message: error.message });
 }
})
module.exports = router;