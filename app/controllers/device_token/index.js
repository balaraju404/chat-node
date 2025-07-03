const deviceToken = require("../../models/device_token")
exports.add = async (req, res) => {
 try {
  const reqParams = req["body"] || {}
  const result = await deviceToken.add(reqParams)
  if (result["insertedId"]) res.status(200).json({ status: true, msg: "Device token added successfully.", insertedId: result["insertedId"] })
  else res.status(400).json({ status: false, msg: "Failed to Add Record" })
 } catch (error) {
  res.status(500).json({ status: false, msg: "Internal server error", error: error })
 }
}

exports.update = async (req, res) => {
 try {
  const reqParams = req["body"] || {}
  const result = await deviceToken.update(reqParams)
  res.status(200).json({ status: result["status"], msg: result["msg"] })
 } catch (error) {
  res.status(500).json({ status: false, msg: "Internal server error", error: error })
 }
}

exports.del = async (req, res) => {
 try {
  const reqParams = req["params"] || {}
  const result = await deviceToken.del(reqParams)
  res.status(200).json({ status: result["status"], msg: result["msg"] })
 } catch (error) {
  res.status(500).json({ status: false, msg: "Internal server error", error: error })
 }
}

exports.details = async (req, res) => {
 try {
  const reqParams = req["body"] || {}
  const result = await deviceToken.details(reqParams)
  if (result["data"]) res.status(200).json({ status: result["status"], data: result["data"] })
  else res.status(200).json({ status: result["status"], msg: result["msg"] })
 } catch (error) {
  res.status(500).json({ status: false, msg: "Internal server error", error: error })
 }
}