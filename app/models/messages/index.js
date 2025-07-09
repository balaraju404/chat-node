const { mongoQuery, mongoObjId } = require("@cs7player/login-lib")
const { getIO, getSocketIdFromUserId } = require("../../utils/socketConnection")
const notifications = require("../../utils/notifications")

exports.send = async (reqParams) => {
 try {
  const sender_id = mongoObjId(reqParams["user_id"])
  const receiver_id = mongoObjId(reqParams["receiver_id"])
  const msg = reqParams["msg"]
  const message_status = 0
  const created_at = new Date()
  const result = await mongoQuery.insertOne(MESSAGES, { sender_id, receiver_id, msg, message_status, created_at })
  const msg_id = result["insertedId"]
  const username = reqParams[TOKEN_USER_DATA_KEY]?.["username"]
  const notificationParams = {
   sender_id: reqParams["user_id"], receiver_id: reqParams["receiver_id"], title: username, message: msg,
   data: { type: 2, action: 1, data: { ref_id: receiver_id, username: username } }
  }
  await notifications.send(notificationParams)
  const io = getIO()
  const socketId = getSocketIdFromUserId(reqParams["receiver_id"])
  if (socketId) {
   io.to(socketId).emit("msg", { _id: msg_id, sender_id: reqParams["user_id"], receiver_id: reqParams["receiver_id"], msg, message_status, created_at })
   await this.update({ msg_id: mongoObjId(result["insertedId"]), message_status: 1 })
  }
  return result
 } catch (error) {
  throw error
 }
}

exports.update = async (reqParams) => {
 try {
  const updateObj = {}
  if ("msg" in reqParams) {
   updateObj["msg"] = reqParams["msg"]
   updateObj["is_edited"] = 1
  }
  if ("message_status" in reqParams) updateObj["message_status"] = reqParams["message_status"]
  updateObj["created_at"] = new Date()
  const whr = { "_id": mongoObjId(reqParams["msg_id"]) }
  const result = await mongoQuery.updateOne(MESSAGES, whr, updateObj)
  return result || []
 } catch (error) {
  throw error
 }
}

exports.delete = async (reqParams) => {
 try {
  const _id = mongoObjId(reqParams["msg_id"])
  const result = await mongoQuery.deleteOne(MESSAGES, { _id })
  return result || []
 } catch (error) {
  throw error
 }
}

exports.details = async (reqParams) => {
 try {
  const user_id = mongoObjId(reqParams["user_id"])
  const friend_id = mongoObjId(reqParams["friend_id"])
  const pageNum = reqParams["page_num"] || 1
  const pageLimit = reqParams["page_limit"] || 25
  const pipeline = [
   { $match: { $or: [{ $and: [{ "sender_id": user_id }, { "receiver_id": friend_id }] }, { $and: [{ "receiver_id": user_id }, { "sender_id": friend_id }] }] } },
   { $sort: { created_at: 1 } },
   { $skip: ((pageNum - 1) * pageLimit) },
   { $limit: pageLimit }
  ]
  const result = await mongoQuery.getDetails(MESSAGES, pipeline)
  const filter = { receiver_id: user_id, sender_id: friend_id, message_status: 0 }
  const update = { message_status: 2 }
  await mongoQuery.updateMany(MESSAGES, filter, update)
  return result
 } catch (error) {
  throw error
 }
}