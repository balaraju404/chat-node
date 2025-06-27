const groupsMdl = require("../../models/groups")

exports.create = async (req, res) => {
 try {
  const reqParams = req["body"] || {}
  const result = await groupsMdl.create(reqParams)
  res.status(result["status"] || SUCCESS_CODE).json({ "status": true, "msg": result["msg"] || "Group Created Successfully." })
 } catch (error) {
  res.status(SERVER_ERROR_CODE).json({ "status": false, "msg": SERVER_ERROR_MESSAGE })
 }
}

exports.add = async (req, res) => {
 try {
  const reqParams = req["body"] || {}
  const result = await groupsMdl.add(reqParams)
  res.status(result["status"] || SUCCESS_CODE).json({ "status": true, "msg": result["msg"] || "Success" })
 } catch (error) {
  res.status(SERVER_ERROR_CODE).json({ "status": false, "msg": SERVER_ERROR_MESSAGE })
 }
}

exports.friends = async (req, res) => {
 try {
  const reqParams = req["body"] || {}
  const result = await groupsMdl.friends(reqParams)
  res.status(result["status"] || SUCCESS_CODE).json({ "status": true, "data": result })
 } catch (error) {
  res.status(SERVER_ERROR_CODE).json({ "status": false, "msg": SERVER_ERROR_MESSAGE })
 }
}

exports.leave = async (req, res) => {
 try {
  const reqParams = req["body"] || {}
  const result = await groupsMdl.leave(reqParams)
  res.status(result["status"] || SUCCESS_CODE).json({ "status": true, "data": result })
 } catch (error) {
  res.status(SERVER_ERROR_CODE).json({ "status": false, "msg": SERVER_ERROR_MESSAGE })
 }
}

exports.update = async (req, res) => {
 try {
  const reqParams = req["body"] || {}
  const result = await groupsMdl.update(reqParams)
  res.status(result["status"] || SUCCESS_CODE).json({ "status": true, "msg": UPDATE_SUCCESS  })
 } catch (error) {
  res.status(SERVER_ERROR_CODE).json({ "status": false, "msg": SERVER_ERROR_MESSAGE })
 }
}

exports.delete = async (req, res) => {
 try {
  const reqParams = req["body"] || {}
  const result = await groupsMdl.delete(reqParams)
  res.status(result["status"] || SUCCESS_CODE).json({ "status": true, "msg": DELETE_SUCCESS })
 } catch (error) {
  res.status(SERVER_ERROR_CODE).json({ "status": false, "msg": SERVER_ERROR_MESSAGE })
 }
}