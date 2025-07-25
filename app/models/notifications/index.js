const { mongoQuery, mongoObjId } = require("@cs7player/login-lib")
// const { sendPushNotification } = require("../../utils/notification-conn")
const deviceToken = require("../device_token")

exports.send = async (reqParams) => {
 try {
  const sender_id = reqParams["sender_id"] || 0
  const receiver_id = reqParams["receiver_id"] || 0
  const title = reqParams["title"] || ""
  const message = reqParams["message"] || []
  const link = reqParams["link"] || ""
  const ref_id = reqParams["ref_id"] || ""
  const status = 1
  const insertRec = { "sender_id": sender_id, "receiver_id": receiver_id, "title": title, "message": message, "link": link, "ref_id": ref_id, "sent_date": new Date(), "status": status }

  const result = await mongoQuery.insertOne(TBL_NOTIFICATIONS, insertRec)
  const params = { "id": receiver_id, "status": 1 }
  const res = await deviceToken.details(params)

  if (res["status"]) {
   const tokens = res["data"].map((m) => m["device_token"])
   if (tokens.length > 0) {
    const msgContent = { "title": title, "message": message }
    // await sendPushNotification(tokens, msgContent, { id: ref_id })
   }
  }
  const notification_id = result["insertedId"].toString()
  return { status: true, msg: "Notification sent successfully", insertedId: notification_id }
 } catch (error) {
  throw error
 }
}

exports.update = async (reqParams) => {
 try {
  const notification_id = reqParams["notification_id"] || 0
  const status = reqParams["status"] || 0

  const updateRec = { modified_at: new Date(), status: status }
  const whr = { _id: mongoObjId(notification_id) }

  await mongoQuery.updateOne(TBL_NOTIFICATIONS, whr, updateRec)
  const msg = "Record Updated Successfully"
  return { status: true, msg: msg, "notification_id": notification_id }
 } catch (error) {
  throw error
 }
}

exports.del = async (reqParams) => {
 try {
  const whr = { _id: mongoObjId(reqParams["notification_id"]) || 0 }
  await mongoQuery.deleteOne(TBL_NOTIFICATIONS, whr)
  return { status: true, msg: "Record Deleted Successfully" }
 } catch (error) {
  throw error
 }
}

exports.details = async (reqParams) => {
 try {
  const matchConditions = {}
  if ("notification_id" in reqParams) matchConditions._id = new ObjectId(reqParams["notification_id"])
  if ("user_id" in reqParams) matchConditions.receiver_id = reqParams["user_id"]
  if ("status" in reqParams) matchConditions.status = reqParams["status"]

  const pipeline = [
   { $match: matchConditions },
   { $addFields: { notification_id: "$_id" } },
   { $project: { _id: 0 } },
   { $sort: { created_at: -1 } }
  ]

  const result = await mongoQuery.getDetails(TBL_NOTIFICATIONS, pipeline)
  return result
 } catch (error) {
  throw error
 }
}

exports.count = async (reqParams) => {
 try {
  const matchConditions = {}
  if ("user_id" in reqParams) matchConditions.receiver_id = reqParams["user_id"]
  if ("status" in reqParams) {
   let status = reqParams["status"] || []
   if (!Array.isArray(status)) status = [status]
   matchConditions.status = { $in: status }
  }
  const db = await connectDB()
  const collection = db.collection(TBL_NOTIFICATIONS)
  const count = await collection.countDocuments(matchConditions)
  return { status: true, count: count || 0 }
 } catch (error) {
  throw error
 }
}