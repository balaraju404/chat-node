const notifications = require("../../models/notifications")

exports.send = async (req, res) => {
 try {
  const reqParams = req["body"] || {}
  const result = await notifications.send(reqParams)
  if (result["insertedId"]) res.status(200).json({ status: result["status"], msg: result["msg"], insertedId: result["insertedId"] })
  else res.status(200).json({ status: result["status"], msg: result["msg"] })
 } catch (error) {
  res.status(500).json({ status: false, msg: "Internal server error", error: error })
 }
}

exports.update = async (req, res) => {
 try {
  const reqParams = req["body"] || {}
  const result = await notifications.update(reqParams)
  res.status(200).json({ status: result["status"], msg: result["msg"] })
 } catch (error) {
  res.status(500).json({ status: false, msg: "Internal server error", error: error })
 }
}

exports.del = async (req, res) => {
 try {
  const reqParams = req["body"] || {}
  const result = await notifications.del(reqParams)
  res.status(200).json({ status: result["status"], msg: result["msg"] })
 } catch (error) {
  res.status(500).json({ status: false, msg: "Internal server error", error: error })
 }
}

exports.details = async (req, res) => {
 try {
  const reqParams = req["body"] || {}
  const result = await notifications.details(reqParams)
  res.status(200).json({ status: result["status"], data: result })
 } catch (error) {
  res.status(500).json({ status: false, msg: "Internal server error", error: error })
 }
}

exports.count = async (req, res) => {
 try {
  const reqParams = req["body"] || {}
  const result = await notifications.count(reqParams)
  if (result["status"]) res.status(200).json({ status: result["status"], count: result["count"] || 0 })
  else res.status(200).json({ status: result["status"], msg: result["msg"] })
 } catch (error) {
  res.status(500).json({ status: false, msg: "Internal server error", error: error })
 }
}