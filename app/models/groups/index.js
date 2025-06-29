const { mongoQuery, mongoObjId } = require("@cs7player/login-lib")

exports.create = async (reqParams) => {
 try {
  const groupname = reqParams["groupname"]
  const description = reqParams["description"] || ""
  const created_by = mongoObjId(reqParams["user_id"])
  const members = [created_by]
  const admins = [created_by]
  const created_at = new Date()
  const result = await mongoQuery.insertOne(GROUPS, { groupname, description, admins, members, created_by, created_at })
  return result || []
 } catch (error) {
  throw error
 }
}

exports.addMembers = async (reqParams) => {
 try {
  const group_id = mongoObjId(reqParams["group_id"])
  const members = reqParams["members"].map(m => mongoObjId(m))
  const result = await mongoQuery.updateOne(GROUPS, { "_id": group_id }, { $push: { members: { $each: members } } }, 0)
  return result || []
 } catch (error) {
  throw error
 }
}

exports.removeMember = async (reqParams) => {
 try {
  const group_id = mongoObjId(reqParams["group_id"])
  const friend_id = mongoObjId(reqParams["friend_id"])
  const result = await mongoQuery.updateOne(GROUPS, { "_id": group_id }, { $pull: { members: friend_id, admins: friend_id } }, 0)
  return result || []
 } catch (error) {
  throw error
 }
}

exports.addAdmin = async (reqParams) => {
 try {
  const group_id = mongoObjId(reqParams["group_id"])
  const friend_id = mongoObjId(reqParams["friend_id"])
  const result = await mongoQuery.updateOne(GROUPS, { "_id": group_id }, { $push: { admins: friend_id } }, 0)
  return result || []
 } catch (error) {
  throw error
 }
}

exports.removeAdmin = async (reqParams) => {
 try {
  const group_id = mongoObjId(reqParams["group_id"])
  const friend_id = mongoObjId(reqParams["friend_id"])
  const result = await mongoQuery.updateOne(GROUPS, { "_id": group_id }, { $pull: { admins: friend_id } }, 0)
  return result || []
 } catch (error) {
  throw error
 }
}

exports.update = async (reqParams) => {
 try {
  const updateObj = {}
  if ("groupname" in reqParams) updateObj["groupname"] = reqParams["groupname"]
  if ("description" in reqParams) updateObj["description"] = reqParams["description"]
  updateObj["created_at"] = new Date()
  const whr = { "_id": mongoObjId(reqParams["group_id"]) }
  const result = await mongoQuery.updateOne(GROUPS, whr, updateObj)
  return result || []
 } catch (error) {
  throw error
 }
}

exports.leave = async (reqParams) => {
 try {
  const group_id = mongoObjId(reqParams["group_id"])
  const user_id = mongoObjId(reqParams["user_id"])
  const result = await mongoQuery.updateOne(GROUPS, { "_id": group_id }, { $pull: { members: user_id, admins: user_id } }, 0)
  return result || []
 } catch (error) {
  throw error
 }
}

exports.delete = async (reqParams) => {
 try {
  const _id = mongoObjId(reqParams["group_id"])
  const result = await mongoQuery.deleteOne(GROUPS, { _id })
  return result || []
 } catch (error) {
  throw error
 }
}

exports.friends = async (reqParams) => {
 try {
  const group_id = mongoObjId(reqParams["group_id"])
  const user_id = mongoObjId(reqParams["user_id"])
  const member_arr = await mongoQuery.getDetails(GROUPS, [{ $match: { "_id": group_id } }])
  const memberIds = member_arr[0]?.members || []
  let pipeline = [
   { $match: { user_id } },
   {
    $lookup: {
     from: USERS,
     localField: "friends",
     foreignField: "_id",
     as: "joinedData"
    }
   },
   {
    $addFields: {
     joinedData: {
      $map: {
       input: "$joinedData",
       as: "user",
       in: {
        $mergeObjects: [
         "$$user",
         {
          is_add: {
           $in: ["$$user._id", memberIds]
          }
         }
        ]
       }
      }
     }
    }
   },
   { $unwind: "$joinedData" },
   {
    $project: {
     "_id": "$joinedData._id",
     "username": "$joinedData.username",
     "gender_id": "$joinedData.gender_id",
     "is_add": "$joinedData.is_add"
    }
   }
  ]
  const result = await mongoQuery.getDetails(FRIENDS, pipeline)
  return result || []
 } catch (error) {
  throw error
 }
}

exports.details = async (reqParams) => {
 try {
  const whr = {}
  if ("group_id" in reqParams) whr["_id"] = mongoObjId(reqParams["group_id"])
  if ("user_id" in reqParams) whr["members"] = mongoObjId(reqParams["user_id"])

  const pipeline = [
   { $match: whr },
   { $addFields: { group_id: "$_id" } },
   {
    $lookup: {
     from: USERS,
     let: { memberIds: "$members" },
     pipeline: [
      { $match: { $expr: { $in: ["$_id", "$$memberIds"] } } },
      { $project: { _id: 0, user_id: "$_id", username: 1, gender_id: 1 } }
     ],
     as: "members_info"
    }
   },
   {
    $lookup: {
     from: USERS,
     let: { adminIds: "$admins" },
     pipeline: [
      { $match: { $expr: { $in: ["$_id", "$$adminIds"] } } },
      { $project: { _id: 0, user_id: "$_id", username: 1, gender_id: 1 } }
     ],
     as: "admins_info"
    }
   },
   { $project: { _id: 0 } },
   { $sort: { created_at: 1 } }
  ]
  const result = await mongoQuery.getDetails(GROUPS, pipeline)
  return result || []
 } catch (error) {
  throw error
 }
}