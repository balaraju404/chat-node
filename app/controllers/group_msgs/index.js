const groupMsgsMdl = require("../../models/group_msgs")

exports.msg = async (req, res) => {
 try {
  const reqParams = req["body"] || {}
  const result = await groupMsgsMdl.msg(reqParams)
  res.status(result["status"] || SUCCESS_CODE).json({ "status": true, "msg": "Successfully." })
 } catch (error) {
  res.status(SERVER_ERROR_CODE).json({ "status": false, "msg": SERVER_ERROR_MESSAGE })
 }
}

exports.chat = async (req, res) => {
 try {
  const reqParams = req["body"] || {}
  const result = await groupMsgsMdl.chat(reqParams)
  res.status(result["status"] || SUCCESS_CODE).json({ "status": true, "data": result })
 } catch (error) {
  res.status(SERVER_ERROR_CODE).json({ "status": false, "msg": SERVER_ERROR_MESSAGE })
 }
}

exports.dashboard = async (req, res) => {
 try {
  const reqParams = req["body"] || {}
  const result = await groupMsgsMdl.dashboard(reqParams)
  res.status(result["status"] || SUCCESS_CODE).json({ "status": true, "data": result })
 } catch (error) {
  res.status(SERVER_ERROR_CODE).json({ "status": false, "msg": SERVER_ERROR_MESSAGE })
 }
}

exports.update = async (req, res) => {
 try {
  const reqParams = req["body"] || {}
  const result = await groupMsgsMdl.update(reqParams)
  res.status(result["status"] || SUCCESS_CODE).json({ "status": true, "msg": UPDATE_SUCCESS })
 } catch (error) {
  res.status(SERVER_ERROR_CODE).json({ "status": false, "msg": SERVER_ERROR_MESSAGE })
 }
}

exports.delete = async (req, res) => {
 try {
  const reqParams = req["body"] || {}
  const result = await groupMsgsMdl.delete(reqParams)
  res.status(result["status"] || SUCCESS_CODE).json({ "status": true, "msg": DELETE_SUCCESS })
 } catch (error) {
  res.status(SERVER_ERROR_CODE).json({ "status": false, "msg": SERVER_ERROR_MESSAGE })
 }
}