const dashboardMdl = require("../../models/dashboard")

exports.chats = async (req, res) => {
 try {
  const reqParams = req["body"] || {}
  const result = await dashboardMdl.chats(reqParams)
  res.status(result["status"] || SUCCESS_CODE).json({ "status": true, "data": result })
 } catch (error) {
  res.status(SERVER_ERROR_CODE).json({ status: false, msg: SERVER_ERROR_MESSAGE, error: error?.message || error })
 }
}

exports.groups = async (req, res) => {
 try {
  const reqParams = req["body"] || {}
  const result = await dashboardMdl.groups(reqParams)
  res.status(result["status"] || SUCCESS_CODE).json({ "status": true, "data": result })
 } catch (error) {
  res.status(SERVER_ERROR_CODE).json({ status: false, msg: SERVER_ERROR_MESSAGE, error: error?.message || error })
 }
}