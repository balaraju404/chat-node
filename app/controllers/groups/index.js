const groupsMdl = require("../../models/groups")

exports.create = async (req, res) => {
 try {
  const reqParams = req["body"] || {}
  const result = await groupsMdl.create(reqParams)
  res.status(result["status"] || SUCCESS_CODE).json({ "status": true, "msg": result["msg"] || "Group created successfully." })
 } catch (error) {
  res.status(SERVER_ERROR_CODE).json({ status: false, msg: SERVER_ERROR_MESSAGE, error: error?.message || error })
 }
}

exports.addMembers = async (req, res) => {
 try {
  const reqParams = req["body"] || {}
  reqParams[TOKEN_USER_DATA_KEY] = req["user"] || {}
  const result = await groupsMdl.addMembers(reqParams)
  res.status(result["status"] || SUCCESS_CODE).json({ "status": true, "msg": "Members added successfully." })
 } catch (error) {
  res.status(SERVER_ERROR_CODE).json({ status: false, msg: SERVER_ERROR_MESSAGE, error: error?.message || error })
 }
}

exports.removeMember = async (req, res) => {
 try {
  const reqParams = req["body"] || {}
  reqParams[TOKEN_USER_DATA_KEY] = req["user"] || {}
  const result = await groupsMdl.removeMember(reqParams)
  res.status(result["status"] || SUCCESS_CODE).json({ "status": true, "msg": "Member removed successfully." })
 } catch (error) {
  res.status(SERVER_ERROR_CODE).json({ status: false, msg: SERVER_ERROR_MESSAGE, error: error?.message || error })
 }
}

exports.addAdmin = async (req, res) => {
 try {
  const reqParams = req["body"] || {}
  reqParams[TOKEN_USER_DATA_KEY] = req["user"] || {}
  const result = await groupsMdl.addAdmin(reqParams)
  res.status(result["status"] || SUCCESS_CODE).json({ "status": true, "msg": "Admin added successfully." })
 } catch (error) {
  res.status(SERVER_ERROR_CODE).json({ status: false, msg: SERVER_ERROR_MESSAGE, error: error?.message || error })
 }
}

exports.removeAdmin = async (req, res) => {
 try {
  const reqParams = req["body"] || {}
  reqParams[TOKEN_USER_DATA_KEY] = req["user"] || {}
  const result = await groupsMdl.removeAdmin(reqParams)
  res.status(result["status"] || SUCCESS_CODE).json({ "status": true, "msg": "Admin removed successfully." })
 } catch (error) {
  res.status(SERVER_ERROR_CODE).json({ status: false, msg: SERVER_ERROR_MESSAGE, error: error?.message || error })
 }
}

exports.update = async (req, res) => {
 try {
  const reqParams = req["body"] || {}
  const result = await groupsMdl.update(reqParams)
  res.status(result["status"] || SUCCESS_CODE).json({ "status": true, "msg": UPDATE_SUCCESS })
 } catch (error) {
  res.status(SERVER_ERROR_CODE).json({ status: false, msg: SERVER_ERROR_MESSAGE, error: error?.message || error })
 }
}

exports.leave = async (req, res) => {
 try {
  const reqParams = req["body"] || {}
  const result = await groupsMdl.leave(reqParams)
  res.status(result["status"] || SUCCESS_CODE).json({ "status": true, "data": result })
 } catch (error) {
  res.status(SERVER_ERROR_CODE).json({ status: false, msg: SERVER_ERROR_MESSAGE, error: error?.message || error })
 }
}

exports.delete = async (req, res) => {
 try {
  const reqParams = req["body"] || {}
  const result = await groupsMdl.delete(reqParams)
  res.status(result["status"] || SUCCESS_CODE).json({ "status": true, "msg": DELETE_SUCCESS })
 } catch (error) {
  res.status(SERVER_ERROR_CODE).json({ status: false, msg: SERVER_ERROR_MESSAGE, error: error?.message || error })
 }
}

exports.friends = async (req, res) => {
 try {
  const reqParams = req["body"] || {}
  const result = await groupsMdl.friends(reqParams)
  res.status(result["status"] || SUCCESS_CODE).json({ "status": true, "data": result })
 } catch (error) {
  res.status(SERVER_ERROR_CODE).json({ status: false, msg: SERVER_ERROR_MESSAGE, error: error?.message || error })
 }
}

exports.details = async (req, res) => {
 try {
  const reqParams = req["body"] || {}
  const result = await groupsMdl.details(reqParams)
  res.status(result["status"] || SUCCESS_CODE).json({ "status": true, "data": result })
 } catch (error) {
  res.status(SERVER_ERROR_CODE).json({ status: false, msg: SERVER_ERROR_MESSAGE, error: error?.message || error })
 }
}