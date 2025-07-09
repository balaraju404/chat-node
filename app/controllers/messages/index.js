const msgMdl = require("../../models/messages")

exports.send = async (req, res) => {
 try {
  const reqParams = req["body"] || {}
  reqParams[TOKEN_USER_DATA_KEY] = req["user"] || {}
  const result = await msgMdl.send(reqParams)
  res.status(result["status"] || SUCCESS_CODE).json({ "status": true, "data": result || [] })
 } catch (error) {
  res.status(SERVER_ERROR_CODE).json({ status: false, msg: SERVER_ERROR_MESSAGE })
 }
}

exports.update = async (req, res) => {
 try {
  const reqParams = req["body"] || {}
  const result = await msgMdl.update(reqParams)
  res.status(result["status"] || SUCCESS_CODE).json({ "status": true, "msg": UPDATE_SUCCESS })
 } catch (error) {
  res.status(SERVER_ERROR_CODE).json({ "status": false, "msg": SERVER_ERROR_MESSAGE })
 }
}

exports.delete = async (req, res) => {
 try {
  const reqParams = req["body"] || {}
  const result = await msgMdl.delete(reqParams)
  res.status(result["status"] || SUCCESS_CODE).json({ "status": true, "msg": DELETE_SUCCESS })
 } catch (error) {
  res.status(SERVER_ERROR_CODE).json({ "status": false, "msg": SERVER_ERROR_MESSAGE })
 }
}

exports.details = async (req, res) => {
 try {
  const reqParams = req["body"] || {}
  const result = await msgMdl.details(reqParams)
  res.status(result["status"] || SUCCESS_CODE).json({ "status": true, "data": result || [] })
 } catch (error) {
  res.status(SERVER_ERROR_CODE).json({ status: false, msg: SERVER_ERROR_MESSAGE })
 }
}