const routes = require("express").Router()
const deviceToken = require("../../controllers/device_token")
const { check, validationResult } = require("express-validator")

routes.post("/", [
 check("device_token").not().isEmpty().withMessage("Device Token is required")
], (req, res, next) => {
 try {
  const errors = validationResult(req)
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() })
  deviceToken.add(req, res, next)
 } catch (error) {
  console.error(error)
 }
})

routes.put("/", [
 check("device_token_id").isMongoId().withMessage("Device Token Id is required")
], (req, res, next) => {
 try {
  const errors = validationResult(req)
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() })
  deviceToken.update(req, res, next)
 } catch (error) {
  console.error(error)
 }
})

routes.post("/delete", [
 check("device_token_id").isMongoId().withMessage("Device Token Id is required")
], (req, res, next) => {
 try {
  const errors = validationResult(req)
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() })
  deviceToken.del(req, res, next)
 } catch (error) {
  console.error(error)
 }
})

routes.post("/details", (req, res, next) => {
 try {
  deviceToken.details(req, res, next)
 } catch (error) {
  console.error(error)
 }
})

module.exports = routes