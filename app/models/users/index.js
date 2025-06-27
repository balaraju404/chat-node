const { mongoQuery, mongoObjId } = require("@cs7player/login-lib")

exports.updateUser = async (reqParams) => {
 try {
  const updateObj = {}
  if ("username" in reqParams) updateObj["username"] = reqParams["username"]
  const usernameDetails = await checkUsername(reqParams["username"])
  if (usernameDetails.length > 0) return { "status": DUPLICATE_ENTRY_CODE, "msg": "Username already Exists!!!" }
  if ("gender_id" in reqParams) updateObj["gender_id"] = reqParams["gender_id"]
  if ("gender_name" in reqParams) updateObj["gender_name"] = reqParams["gender_name"]
  if ("about" in reqParams) updateObj["about"] = reqParams["about"]
  if ("is_verified" in reqParams) updateObj["is_verified"] = reqParams["is_verified"]
  updateObj["updated_at"] = new Date()
  const whr = { "_id": mongoObjId(reqParams["user_id"]) }
  const result = await mongoQuery.updateOne(USERS, whr, updateObj)
  return result
 } catch (error) {
  throw error
 }
}

const checkUsername = async (username) => {
 try {
  const result = await mongoQuery.getDetails(USERS, [{ $match: { username } }])
  return result
 } catch (error) {
  throw error
 }
}

exports.getUsers = async (reqParams) => {
 try {
  const whr = {}
  if ("user_id" in reqParams) whr["_id"] = mongoObjId(reqParams["user_id"])
  if ("email" in reqParams) whr["email"] = reqParams["email"]
  let searchKey = ""
  if ("username" in reqParams) searchKey = reqParams["username"].trim()
  if (searchKey !== "") whr["username"] = new RegExp(searchKey, "i")
  const isNeedPwd = reqParams["is_need_password"] || 0

  const pipeline = [
   { $match: whr },
   { $addFields: { user_id: "$_id" } },
   { $project: { _id: 0, password: 0 } }
  ]
  const result = await mongoQuery.getDetails(USERS, pipeline)
  return result
 } catch (error) {
  throw error
 }
}

exports.paging = async (reqParams) => {
 try {
  const { page = 1, limit = 10, isNeedPwd = true } = reqParams
  const skip = (page - 1) * limit
  let searchKey = ""
  if ("username" in reqParams) searchKey = reqParams["username"].trim()
  if (searchKey !== "") whr["username"] = new RegExp(searchKey, "i")

  const pipeline = [{ $skip: skip }, { $limit: limit }]
  if (!isNeedPwd) pipeline.push({ $project: { password: 0 } })

  const result = await mongoQuery.getDetails(USERS, pipeline)
  return { "data": result, "count": result.length }
 } catch (error) {
  throw error
 }
}

exports.others = async (reqParams) => {
 try {
  const user_id = mongoObjId(reqParams["user_id"])
  const username = reqParams["search_text"] || ""

  const userData = await mongoQuery.getDetails(FRIENDS, [{ $match: { user_id } }])
  const friends_list = userData[0]["friends"]
  friends_list.push(user_id)

  const pipeline = [
   { $match: { _id: { $nin: friends_list }, username: { $regex: username, $options: "i" } } },
   { $addFields: { user_id: "$_id" } },
   { $project: { _id: 0, password: 0, is_verified: 0 } },
   { $sort: { username: 1 } }
  ]
  const result = await mongoQuery.getDetails(USERS, pipeline)

  const pipeline2 = [
   { $match: { sender_id: user_id } },
   { $project: { _id: 0, req_id: "$_id", receiver_id: 1 } }
  ]
  const sendedInviteData = await mongoQuery.getDetails(INVITATIONS, pipeline2)

  const pipeline3 = [
   { $match: { receiver_id: user_id } },
   { $project: { _id: 0, req_id: "$_id", sender_id: 1 } }
  ]
  const receivedInviteData = await mongoQuery.getDetails(INVITATIONS, pipeline3)

  const sentMap = new Map(sendedInviteData.map(item => [item.receiver_id.toString(), item.req_id]))
  const receiveMap = new Map(receivedInviteData.map(item => [item.sender_id.toString(), item.req_id]))
  result.forEach(user => {
   user["req_flag"] = 0
   const sendId = sentMap.get(user.user_id.toString())
   if (sendId) {
    user["req_flag"] = 1
    user["req_id"] = sendId
   }
   const receiveId = receiveMap.get(user.user_id.toString())
   if (receiveId) {
    user["req_flag"] = 2
    user["req_id"] = receiveId
   }
  })
  return { "data": result, "count": result.length }
 } catch (error) {
  throw error
 }
}

exports.friendsList = async (reqParams) => {
 try {
  const user_id = mongoObjId(reqParams["user_id"])
  const username = reqParams["search_text"] || ""

  const friends_arr = await mongoQuery.getDetails(FRIENDS, [{ $match: { user_id } }, { $project: { "_id": 0, "user_id": 0 } }])
  if (!friends_arr.length) return { data: [], count: 0 }

  const matchedFriendIds = friends_arr[0]?.friends || []
  const matchQuery = { _id: { $in: matchedFriendIds } }
  if (username) matchQuery.username = { $regex: username, $options: "i" }

  const pipeline = [
   { $match: matchQuery },
   { $addFields: { user_id: "$_id" } },
   { $project: { _id: 0, password: 0, is_verified: 0, email: 0 } },
   { $sort: { username: 1 } }
  ]

  const result = await mongoQuery.getDetails(USERS, pipeline)
  return { data: result, count: result.length }
 } catch (error) {
  throw error
 }
}