const groupMsgsMdl = require("../../models/group_msgs")

exports.send = async (req, res) => {
 try {
  const reqParams = req["body"] || {}
  reqParams[TOKEN_USER_DATA_KEY] = req["user"] || {}
  const result = await groupMsgsMdl.send(reqParams)
  res.status(result["status"] || SUCCESS_CODE).json({ status: true, msg: "Message sent successfully." })
 } catch (error) {
  res.status(SERVER_ERROR_CODE).json({ status: false, msg: SERVER_ERROR_MESSAGE, error: error?.message || error })
 }
}

exports.update = async (req, res) => {
 try {
  const reqParams = req["body"] || {}
  const result = await groupMsgsMdl.update(reqParams)
  res.status(result["status"] || SUCCESS_CODE).json({ status: true, msg: UPDATE_SUCCESS })
 } catch (error) {
  res.status(SERVER_ERROR_CODE).json({ status: false, msg: SERVER_ERROR_MESSAGE, error: error?.message || error })
 }
}

exports.delete = async (req, res) => {
 try {
  const reqParams = req["body"] || {}
  const result = await groupMsgsMdl.delete(reqParams)
  res.status(result["status"] || SUCCESS_CODE).json({ status: true, msg: DELETE_SUCCESS })
 } catch (error) {
  res.status(SERVER_ERROR_CODE).json({ status: false, msg: SERVER_ERROR_MESSAGE, error: error?.message || error })
 }
}

exports.details = async (req, res) => {
 try {
  const reqParams = req["body"] || {}
  const result = await groupMsgsMdl.details(reqParams)
  res.status(result["status"] || SUCCESS_CODE).json({ status: true, data: result })
 } catch (error) {
  res.status(SERVER_ERROR_CODE).json({ status: false, msg: SERVER_ERROR_MESSAGE, error: error?.message || error })
 }
}