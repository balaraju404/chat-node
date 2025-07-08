const { mongoQuery, mongoObjId } = require("@cs7player/login-lib")
const { getIO, getSocketIdFromUserId } = require("../../utils/socketConnection");

exports.send = async (reqParams) => {
 try {
  const group_id = mongoObjId(reqParams["group_id"])
  const msg = reqParams["msg"]
  const texted_by = mongoObjId(reqParams["user_id"])
  const seen_by = [texted_by]
  const created_at = new Date()
  const result = await mongoQuery.insertOne(GROUP_MESSAGES, { group_id, msg, texted_by, seen_by, created_at })
  const msg_id = result["insertedId"]
  let pipeline  = [
   { $match: { _id: group_id } },
   {
    $lookup: {
     from: USERS,
     localField: "members",
     foreignField: "_id",
     as: "joinedData"
    }
   },
   { $unwind: "$joinedData" },
   { $addFields: { "username": "$joinedData.username", "member_id": "$joinedData._id" } },
   { $project: {joinedData:0}}
  ]
  const groupData = await mongoQuery.getDetails(GROUPS, pipeline)
  const io = getIO()
  groupData.forEach((obj) => {
   const socketId = getSocketIdFromUserId(obj["member_id"])
   if (socketId && obj["member_id"] != reqParams["user_id"]) {
    io.to(socketId).emit("group_msg", { _id: msg_id, group_id: reqParams["group_id"], username: obj["username"], msg, created_at })
   }
  });
  return result || []
 } catch (error) {
  throw error
 }
}

exports.update = async (reqParams) => {
 try {
  const updateObj = {}
  if ("msg" in reqParams) updateObj["msg"] = reqParams["msg"]
  updateObj["created_at"] = new Date()
  const whr = { "_id": mongoObjId(reqParams["group_msg_id"]) }
  const result = await mongoQuery.updateOne(GROUP_MESSAGES, whr, updateObj)
  return result || []
 } catch (error) {
  throw error
 }
}

exports.delete = async (reqParams) => {
 try {
  const _id = mongoObjId(reqParams["group_msg_id"])
  const result = await mongoQuery.deleteOne(GROUP_MESSAGES, { _id })
  return result || []
 } catch (error) {
  throw error
 }
}

exports.details = async (reqParams) => {
 try {
  const group_id = mongoObjId(reqParams["group_id"])
  const user_id = mongoObjId(reqParams["user_id"])
  let pipeline = [
   { $match: { group_id } },
   {
    $lookup: {
     from: USERS,
     localField: "texted_by",
     foreignField: "_id",
     as: "joinedData"
    }
   },
   { $unwind: "$joinedData" },
   { $addFields: { "username": "$joinedData.username" } },
   { $project: { msg: 1, texted_by: 1, username: 1, created_at: 1 } },
   { $sort: { created_at: 1 } }
  ]
  const result = await mongoQuery.getDetails(GROUP_MESSAGES, pipeline)
  const filter = { group_id, seen_by: { $nin: [user_id] } }
  const update = { $addToSet: { seen_by: user_id } }
  await mongoQuery.updateMany(GROUP_MESSAGES, filter, update, 0)
  return result || []
 } catch (error) {
  throw error
 }
}