const loginMdl = require("../../models/login")

exports.signUp = async (req, res) => {
 try {
  const reqParams = req["body"] || {}
  const result = await loginMdl.signUp(reqParams)
  res.status(result["status"] || SUCCESS_CODE).json({ "status": result["acknowledged"] || false, "msg": result["msg"] || "Account created successfully." })
 } catch (error) {
  res.status(SERVER_ERROR_CODE).json({ "status": false, "msg": SERVER_ERROR_MESSAGE })
 }
}

exports.login = async (req, res) => {
 try {
  const reqParams = req["body"] || {}
  const result = await loginMdl.login(reqParams)
  res.status(result["status"] || SUCCESS_CODE).json({ "status": !result["status"], "msg": result["msg"], "data": result["data"], "token": result["token"] || "" })
 } catch (error) {
  res.status(SERVER_ERROR_CODE).json({ "status": false, "msg": SERVER_ERROR_MESSAGE })
 }
}

exports.forgetPassword = async (req, res) => {
 try {
  const reqParams = req["body"] || {}
  const result = await loginMdl.forgetPassword(reqParams)
  res.status(result["status"] || SUCCESS_CODE).json({ "status": result["acknowledged"] || false, "msg": result["msg"] || "Password updated successfully." })
 } catch (error) {
  res.status(SERVER_ERROR_CODE).json({ "status": false, "msg": SERVER_ERROR_MESSAGE })
 }
}