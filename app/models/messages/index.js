const { mongoQuery, mongoObjId } = require("@cs7player/login-lib")

exports.messages = async (reqParams) => {
 try {
  const sender_id = mongoObjId(reqParams["user_id"])
  const receiver_id = mongoObjId(reqParams["receiver_id"])
  const msg = reqParams["msg"]
  const is_seen = 0
  const created_at = new Date()
  const result = await mongoQuery.insertOne(MESSAGES, { sender_id, receiver_id, msg, is_seen, created_at })
  return result
 } catch (error) {
  throw error
 }
}

exports.chat = async (reqParams) => {
 try {
  const user_id = mongoObjId(reqParams["user_id"])
  const friend_id = mongoObjId(reqParams["friend_id"])
  const pipeline = [
   {
    $match: {
     $or: [
      { $and: [{ "sender_id": user_id }, { "receiver_id": friend_id }] },
      { $and: [{ "receiver_id": user_id }, { "sender_id": friend_id }] }
     ]
    }
   },
   { $sort: { created_at: -1 } }
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

exports.dashBoard = async (reqParams) => {
 try {
  const user_id = mongoObjId(reqParams["user_id"])
  const pipeline1 = [{ $match: { user_id } }, { $project: { "_id": 0, "user_id": 0 } }]
  const friendsList = await mongoQuery.getDetails(FRIENDS, pipeline1)
  const friendsIds = friendsList[0]["friends"]
  const pipeline2 = [
   {
    $match: {
     $or: [
      { $and: [{ "sender_id": user_id }, { "receiver_id": { $in: friendsIds } }] },
      { $and: [{ "receiver_id": user_id }, { "sender_id": { $in: friendsIds } }] },
     ]
    }
   },
   {
    $addFields: {
     friend_id: {
      $cond: [
       { $eq: ["$sender_id", user_id] },
       "$receiver_id",
       "$sender_id"
      ]
     }
    }
   },
   {
    $sort: { created_at: -1 }
   },
   {
    $group: {
     _id: "$friend_id",
     last_message: { $first: "$$ROOT" },
     unseen_count: {
      $sum: {
       $cond: [
        {
         $and: [
          { $eq: ["$receiver_id", user_id] },
          { $eq: ["$is_seen", 0] }
         ]
        },
        1,
        0
       ]
      }
     }
    }
   },
   {
    $lookup: {
     from: "users",
     localField: "_id",
     foreignField: "_id",
     as: "friend_info"
    }
   },
   {
    $unwind: "$friend_info"
   },
   {
    $project: {
     _id: 0,
     friend_id: "$_id",
     last_message: {
      msg: "$last_message.msg",
      created_at: "$last_message.created_at",
      sender_id: "$last_message.sender_id"
     },
     unseen_count: 1,
     username: "$friend_info.username",
     gender_id: "$friend_info.gender_id"
    }
   },
   {
    $sort: { "last_message.created_at": -1 }
   }
  ]
  const result = await mongoQuery.getDetails(MESSAGES, pipeline2)
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