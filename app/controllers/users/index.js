const usersMdl = require("../../models/users")

exports.updateUser = async (req, res) => {
 try {
  const reqParams = req["body"] || {}
  const result = await usersMdl.updateUser(reqParams)
  res.status(result["status"] || SUCCESS_CODE).json({ "status": result["acknowledged"] || false, "msg": result["msg"] || "Profile updated successfully." })
 } catch (error) {
  res.status(SERVER_ERROR_CODE).json({ status: false, msg: SERVER_ERROR_MESSAGE, error: error?.message || error })
 }
}

exports.getUsers = async (req, res) => {
 try {
  const reqParams = req["body"] || {}
  const result = await usersMdl.getUsers(reqParams)
  res.status(result["status"] || SUCCESS_CODE).json({ "status": true, "data": result || [] })
 } catch (error) {
  res.status(SERVER_ERROR_CODE).json({ status: false, msg: SERVER_ERROR_MESSAGE, error: error?.message || error })
 }
}

exports.others = async (req, res) => {
 try {
  const reqParams = req["body"] || {}
  const result = await usersMdl.others(reqParams)
  res.status(result["status"] || SUCCESS_CODE).json({ "status": true, "data": result["data"] || [] })
 } catch (error) {
  res.status(SERVER_ERROR_CODE).json({ status: false, msg: SERVER_ERROR_MESSAGE, error: error?.message || error })
 }
}

exports.friendsList = async (req, res) => {
 try {
  const reqParams = req["body"] || {}
  const result = await usersMdl.friendsList(reqParams)
  res.status(result["status"] || SUCCESS_CODE).json({ "status": true, "data": result["data"] || [] })
 } catch (error) {
  res.status(SERVER_ERROR_CODE).json({ status: false, msg: SERVER_ERROR_MESSAGE, error: error?.message || error })
 }
}