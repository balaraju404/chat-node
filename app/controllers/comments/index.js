const cmntsMdl = require("../../models/comments")

exports.addComment = async (req, res) => {
 try {
  const reqParams = req["body"] || {}
  const result = await cmntsMdl.addComment(reqParams)
  res.status(result["status"] || SUCCESS_CODE).json({ "status": true , "msg": "Comment Added Successfully" || UPDATE_SUCCESS })
 } catch (error) {
  res.status(SERVER_ERROR_CODE).json({ status: false, msg: SERVER_ERROR_MESSAGE, error: error?.message || error })
 }
}

exports.updateComment = async (req, res) => {
 try {
  const reqParams = req["body"] || {}
  const result = await cmntsMdl.updateComment(reqParams)
  res.status(result["status"] || SUCCESS_CODE).json({ "status": true , "msg": "Comment Updated Successfully" || UPDATE_SUCCESS })
 } catch (error) {
  res.status(SERVER_ERROR_CODE).json({ status: false, msg: SERVER_ERROR_MESSAGE, error: error?.message || error })
 }
}

exports.deleteComment = async (req, res) => {
 try {
  const reqParams = req["body"] || {}
  const result = await cmntsMdl.deleteComment(reqParams)
  res.status(result["status"] || SUCCESS_CODE).json({ "status": true , "msg": DELETE_SUCCESS })
 } catch (error) {
  res.status(SERVER_ERROR_CODE).json({ status: false, msg: SERVER_ERROR_MESSAGE, error: error?.message || error })
 }
}