const postsMdl = require("../../models/posts")

exports.createPosts = async (req, res) => {
 try {
  const reqParams = req["body"] || {}
  reqParams['username'] = req["user"]['username']
  const result = await postsMdl.createPosts(reqParams)
  res.status(result["status"] || SUCCESS_CODE).json({ "status": result["acknowledged"] || false, "msg": result["msg"] || "Posted Successfully." })
 } catch (error) {
  res.status(SERVER_ERROR_CODE).json({ status: false, msg: SERVER_ERROR_MESSAGE, error: error?.message || error })
 }
}

exports.like = async (req, res) => {
 try {
  const reqParams = req["body"] || {}
  const result = await postsMdl.like(reqParams)
  res.status(result["status"] || SUCCESS_CODE).json({ "status": true , "msg": result || UPDATE_SUCCESS })
 } catch (error) {
  res.status(SERVER_ERROR_CODE).json({ status: false, msg: SERVER_ERROR_MESSAGE, error: error?.message || error })
 }
}