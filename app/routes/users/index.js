const router = require("express").Router()
const { check, validationResult } = require("express-validator")
const usersCtrl = require("../../controllers/users")

router.put("/update", [
 check("username").optional().isLength({ min: 6, max: 16 }).withMessage("Username must be between 6 and 16 characters long")
], (req, res) => {
 try {
  const errors = validationResult(req)
  if (!errors.isEmpty()) return res.status(VALIDATION_ERROR_CODE).json({ errors: errors.array() })
  usersCtrl.updateUser(req, res)
 } catch (error) {
  res.status(SERVER_ERROR_CODE).json({ message: error.message })
 }
})

router.post("/details", [], (req, res) => {
 try {
  const errors = validationResult(req)
  if (!errors.isEmpty()) return res.status(VALIDATION_ERROR_CODE).json({ errors: errors.array() })
  usersCtrl.getUsers(req, res)
 } catch (error) {
  res.status(SERVER_ERROR_CODE).json({ message: error.message })
 }
})

router.post("/others", [], (req, res) => {
 try {
  const errors = validationResult(req)
  if (!errors.isEmpty()) return res.status(VALIDATION_ERROR_CODE).json({ errors: errors.array() })
  usersCtrl.others(req, res)
 } catch (error) {
  res.status(SERVER_ERROR_CODE).json({ message: error.message })
 }
})

router.post("/friends", [], (req, res) => {
 try {
  const errors = validationResult(req)
  if (!errors.isEmpty()) return res.status(VALIDATION_ERROR_CODE).json({ errors: errors.array() })
  usersCtrl.friendsList(req, res)
 } catch (error) {
  res.status(SERVER_ERROR_CODE).json({ message: error.message })
 }
})

module.exports = router