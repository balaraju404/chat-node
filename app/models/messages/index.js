const { mongoQuery, mongoObjId } = require("@cs7player/login-lib")
const { getIO, getSocketIdFromUserId } = require("../../utils/socketConnection");

exports.send = async (reqParams) => {
 try {
  const sender_id = mongoObjId(reqParams["user_id"])
  const receiver_id = mongoObjId(reqParams["receiver_id"])
  const msg = reqParams["msg"]
  const is_seen = 0
  const created_at = new Date()
  const result = await mongoQuery.insertOne(MESSAGES, { sender_id, receiver_id, msg, is_seen, created_at })
  const msg_id = result['insertedId'];
  const io = getIO();
  const socketId = getSocketIdFromUserId(reqParams["receiver_id"]);
  if (socketId) {
    io.to(socketId).emit("msg", {_id:msg_id,sender_id:reqParams["user_id"], receiver_id:reqParams["receiver_id"], msg, is_seen, created_at});
  }
  return result
 } catch (error) {
  throw error
 }
}

exports.update = async (reqParams) => {
 try {
  const updateObj = {}
  if ("msg" in reqParams) updateObj["msg"] = reqParams["msg"]
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
  const pipeline = [
   { $match: { $or: [{ $and: [{ "sender_id": user_id }, { "receiver_id": friend_id }] }, { $and: [{ "receiver_id": user_id }, { "sender_id": friend_id }] }] } },
   { $sort: { created_at: 1 } }
  ]
  const result = await mongoQuery.getDetails(MESSAGES, pipeline)
  const filter = { receiver_id: user_id, sender_id: friend_id, is_seen: 0 }
  const update = { is_seen: 1 }
  await mongoQuery.updateMany(MESSAGES, filter, update)
  return result
 } catch (error) {
  throw error
 }
}