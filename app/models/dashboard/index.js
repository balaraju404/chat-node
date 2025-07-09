const { mongoQuery, mongoObjId } = require("@cs7player/login-lib")
const { getSocketIdFromUserId } = require("../../utils/socketConnection");

exports.chats = async (reqParams) => {
 try {
  const user_id = mongoObjId(reqParams["user_id"])
  const pipeline1 = [{ $match: { user_id } }, { $project: { "_id": 0, "user_id": 0 } }]
  let friendsIds = []
  if ("friend_id" in reqParams) {
   const friend_id = mongoObjId(reqParams["friend_id"])
   friendsIds.push(friend_id)
  } else {
   const friendsList = await mongoQuery.getDetails(FRIENDS, pipeline1)
   friendsIds = friendsList[0]["friends"]
  }
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
          { $eq: ["$message_status", 0] }
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
  result.forEach(m => {
   const socketId = getSocketIdFromUserId(m.friend_id);
   m.is_active = socketId ? 1 : 0;
  });
  return result
 } catch (error) {
  throw error
 }
}

exports.groups = async (reqParams) => {
 try {
  const user_id = mongoObjId(reqParams["user_id"])

  const pipeline = [
   { $match: { members: user_id } },
   { $addFields: { group_id: "$_id" } },

   // Lookup Last Message
   {
    $lookup: {
     from: GROUP_MESSAGES,
     let: { gid: "$_id" },
     pipeline: [
      { $match: { $expr: { $eq: ["$group_id", "$$gid"] } } },
      { $sort: { created_at: -1 } },
      { $limit: 1 },
      { $lookup: { from: USERS, localField: "texted_by", foreignField: "_id", as: "sender_info" } },
      { $unwind: { path: "$sender_info", preserveNullAndEmptyArrays: true } },
      { $project: { _id: 0, msg: 1, created_at: 1, texted_by: 1, username: "$sender_info.username" } }
     ],
     as: "last_message"
    }
   },
   { $unwind: { path: "$last_message", preserveNullAndEmptyArrays: true } },

   // Lookup unseen count
   {
    $lookup: {
     from: GROUP_MESSAGES,
     let: { gid: "$_id" },
     pipeline: [
      { $match: { $expr: { $and: [{ $eq: ["$group_id", "$$gid"] }, { $ne: ["$texted_by", user_id] }, { $not: { $in: [user_id, "$seen_by"] } }] } } },
      { $count: "unseen_count" }
     ],
     as: "unseen_info"
    }
   },
   { $addFields: { unseen_count: { $cond: [{ $gt: [{ $size: "$unseen_info" }, 0] }, { $arrayElemAt: ["$unseen_info.unseen_count", 0] }, 0] } } },
   { $project: { _id: 0 } },
   { $sort: { "last_message.created_at": -1, created_at: -1 } }
  ]

  const result = await mongoQuery.getDetails(GROUPS, pipeline)
  return result || []
 } catch (error) {
  throw error
 }
}