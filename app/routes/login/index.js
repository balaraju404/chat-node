const router = require("express").Router()
const { check, validationResult } = require("express-validator")
const loginCtrl = require("../../controllers/login")

router.post("/sign-up", [
 check("username").isLength({ min: 6, max: 16 }).withMessage("Username must be between 6 and 16 characters long"),
 check("email").isEmail().withMessage("Invalid email format"),
 check("gender_id").isInt({ min: 1 }).withMessage("Invalid gender ID"),
 check("password").isLength({ min: 6, max: 12 }).withMessage("Password must be between 6 and 12 characters long")
], (req, res, next) => {
 try {
  const errors = validationResult(req)
  if (!errors.isEmpty()) return res.status(VALIDATION_ERROR_CODE).json({ errors: errors.array() })
  loginCtrl.signUp(req, res)
 } catch (error) {
  res.status(SERVER_ERROR_CODE).json({ message: error.message })
 }
})

router.post("/", [
 check("email").isEmail().withMessage("Invalid email format"),
 check("password").isLength({ min: 1 }).withMessage("Invalid Password")
], (req, res, next) => {
 try {
  const errors = validationResult(req)
  if (!errors.isEmpty()) return res.status(VALIDATION_ERROR_CODE).json({ errors: errors.array() })
  loginCtrl.login(req, res)
 } catch (error) {
  res.status(SERVER_ERROR_CODE).json({ message: error.message })
 }
})

router.put("/", [
 check("email").isEmail().withMessage("Invalid email format"),
 check("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters long")
], (req, res, next) => {
 try {
  const errors = validationResult(req)
  if (!errors.isEmpty()) return res.status(VALIDATION_ERROR_CODE).json({ errors: errors.array() })
  loginCtrl.forgetPassword(req, res)
 } catch (error) {
  res.status(SERVER_ERROR_CODE).json({ message: error.message })
 }
})

router.post("/send_otp", [
 check("email").isEmail().withMessage("Invalid email format"),
], (req, res, next) => {
 try {
  const errors = validationResult(req)
  if (!errors.isEmpty()) return res.status(VALIDATION_ERROR_CODE).json({ errors: errors.array() })
  loginCtrl.sendOtp(req, res)
 } catch (error) {
  res.status(SERVER_ERROR_CODE).json({ message: error.message })
 }
})

router.post("/verify_otp", [
 check("otp_id").isMongoId().withMessage("Invalid otp id"),
 check("otp").isLength({ min: 6 }).withMessage("Invalid OTP"),
], (req, res, next) => {
 try {
  const errors = validationResult(req)
  if (!errors.isEmpty()) return res.status(VALIDATION_ERROR_CODE).json({ errors: errors.array() })
  loginCtrl.verifyOtp(req, res)
 } catch (error) {
  res.status(SERVER_ERROR_CODE).json({ message: error.message })
 }
})
module.exports = router