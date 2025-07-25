const loginMdl = require("../../models/login")

exports.signUp = async (req, res) => {
 try {
  const reqParams = req["body"] || {}
  const result = await loginMdl.signUp(reqParams)
  res.status(result["status"] || SUCCESS_CODE).json({ "status": result["acknowledged"] || false, "msg": result["msg"] || "Account created successfully." })
 } catch (error) {
  res.status(SERVER_ERROR_CODE).json({ status: false, msg: SERVER_ERROR_MESSAGE, error: error?.message || error })
 }
}

exports.resetPassword = async (req, res) => {
 try {
  const reqParams = req["body"] || {}
  const result = await loginMdl.resetPassword(reqParams)
  res.status(result["status"] || SUCCESS_CODE).json({ "status": result["acknowledged"] || false, "msg": result["msg"] || "Password reset successfully." })
 } catch (error) {
  res.status(SERVER_ERROR_CODE).json({ status: false, msg: SERVER_ERROR_MESSAGE, error: error?.message || error })
 }
}

exports.login = async (req, res) => {
 try {
  const reqParams = req["body"] || {}
  const result = await loginMdl.login(reqParams)
  res.status(result["status"] || SUCCESS_CODE).json({ "status": !result["status"], "msg": result["msg"], "data": result["data"], "token": result["token"] || "", "device_id": result["device_id"] || "" })
 } catch (error) {
  res.status(SERVER_ERROR_CODE).json({ status: false, msg: SERVER_ERROR_MESSAGE, error: error?.message || error })
 }
}

exports.sendOtp = async (req, res) => {
 try {
  const reqParams = req["body"] || {}
  const result = await loginMdl.sendOtp(reqParams)
  res.status(result["status"] ? SUCCESS_CODE : NOT_FOUND_CODE).json({ "status": result["status"], "msg": result["msg"], "otp_id": result["otp_id"] })
 } catch (error) {
  res.status(SERVER_ERROR_CODE).json({ status: false, msg: SERVER_ERROR_MESSAGE, error: error?.message || error })
 }
}

exports.verifyOtp = async (req, res) => {
 try {
  const reqParams = req["body"] || {}
  const result = await loginMdl.verifyOtp(reqParams)
  res.status(result["status"] ? SUCCESS_CODE : NOT_FOUND_CODE).json({ "status": result["status"], "msg": result["msg"] })
 } catch (error) {
  res.status(SERVER_ERROR_CODE).json({ status: false, msg: SERVER_ERROR_MESSAGE, error: error?.message || error })
 }
}