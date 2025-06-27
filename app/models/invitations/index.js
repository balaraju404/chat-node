const { mongoQuery, mongoObjId } = require("@cs7player/login-lib")

exports.invite = async (reqParams) => {
 try {
  const sender_id = mongoObjId(reqParams["user_id"])
  const receiver_id = mongoObjId(reqParams["receiver_id"])
  created_at = new Date()
  const result = await mongoQuery.insertOne(INVITATIONS, { sender_id, receiver_id, created_at })
  return result || []
 } catch (error) {
  throw error
 }
}

exports.sended = async (reqParams) => {
 try {
  const user_id = mongoObjId(reqParams["user_id"])
  const pipeline = [
   { $match: { "sender_id": user_id } },
   {
    $lookup: {
     from: USERS,
     localField: "receiver_id",
     foreignField: "_id",
     as: "joinedData"
    }
   },
   { $unwind: "$joinedData" },
   {
    $addFields: {
     "user_id": "$_id",
     "username": "$joinedData.username",
     "gender_id": "$joinedData.gender_id"
    }
   },
   {
    $project: {
     "_id": 1,
     "joinedData": 0,
     "sender_id": 0,
     "receiver_id": 0
    }
   }
  ]
  const result = await mongoQuery.getDetails(INVITATIONS, pipeline)
  return result || []
 } catch (error) {
  throw error
 }
}

exports.received = async (reqParams) => {
 try {
  const user_id = mongoObjId(reqParams["user_id"])
  const pipeline = [
   { $match: { "receiver_id": user_id } },
   {
    $lookup: {
     from: USERS,
     localField: "sender_id",
     foreignField: "_id",
     as: "joinedData"
    }
   },
   { $unwind: "$joinedData" },
   {
    $addFields: {
     "_id": "$_id",
     "user_id": "$joinedData._id",
     "username": "$joinedData.username",
     "gender_id": "$joinedData.gender_id"
    }
   },
   {
    $project: {
     "_id": 1,
     "joinedData": 0,
     "sender_id": 0,
     "receiver_id": 0
    }
   }
  ]
  const result = await mongoQuery.getDetails(INVITATIONS, pipeline)
  return result || []
 } catch (error) {
  throw error
 }
}

exports.accept = async (reqParams) => {
 try {
  const _id = mongoObjId(reqParams["_id"])
  const data = await mongoQuery.getDetails(INVITATIONS, [{ $match: { _id } }])
  const user_id = mongoObjId(data[0]["receiver_id"])
  const friend_id = mongoObjId(data[0]["sender_id"])
  const result = await mongoQuery.updateOne(FRIENDS, { user_id }, { $addToSet: { friends: friend_id } }, 0)
  await mongoQuery.updateOne(FRIENDS, { "user_id": friend_id }, { $addToSet: { friends: user_id } }, 0)
  await mongoQuery.deleteOne(INVITATIONS, { _id })
  return result || []
 } catch (error) {
  throw error
 }
}

exports.decline = async (reqParams) => {
 try {
  const _id = mongoObjId(reqParams["_id"])
  const result = await mongoQuery.deleteOne(INVITATIONS, { _id })
  return result || []
 } catch (error) {
  throw error
 }
}

exports.unfriend = async (reqParams) => {
 try {
  const user_id = mongoObjId(reqParams["user_id"])
  const friend_id = mongoObjId(reqParams["friend_id"])
  const result = await mongoQuery.updateOne(FRIENDS, { user_id }, { $pull: { friends: friend_id } }, 0)
  await mongoQuery.updateOne(FRIENDS, { user_id: friend_id }, { $pull: { friends: user_id } }, 0)
  return result || []
 } catch (error) {
  throw error
 }
}