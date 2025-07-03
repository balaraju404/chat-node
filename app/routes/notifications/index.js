const routes = require("express").Router()
const notifications = require("../../controllers/notifications")
const { check, validationResult } = require("express-validator")

routes.post("/send", [
 check("sender_id").isMongoId().withMessage("Sender Id is required"),
 check("receiver_id").isMongoId().withMessage("Receiver Id is required"),
 check("title").not().isEmpty().withMessage("Title is required"),
 check("message").not().isEmpty().withMessage("Message is required")
], (req, res, next) => {
 try {
  const errors = validationResult(req)
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() })
  notifications.send(req, res)
 } catch (error) {
  console.error(error)
 }
})

routes.put("/update", [
 check("notification_id").isMongoId().withMessage("Notification Id is required")
], (req, res, next) => {
 try {
  const errors = validationResult(req)
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() })
  notifications.update(req, res)
 } catch (error) {
  console.error(error)
 }
})

routes.post("delete", [
 check("notification_id").isMongoId().withMessage("Notification Id is required")
], (req, res, next) => {
 try {
  const errors = validationResult(req)
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() })
  notifications.del(req, res)
 } catch (error) {
  console.error(error)
 }
})


routes.post("/details", (req, res, next) => {
 try {
  notifications.details(req, res)
 } catch (error) {
  console.error(error)
 }
})

routes.post("/count", [
 check("receiver_id").isMongoId().withMessage("Invalid Receiver Id")
], (req, res, next) => {
 try {
  const errors = validationResult(req)
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() })
  notifications.count(req, res)
 } catch (error) {
  console.error(error)
 }
})

module.exports = routes