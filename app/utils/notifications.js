const notificationConn = require("./notification-conn")
const deviceToken = require("../models/device_token")
const { mongoQuery, mongoObjId } = require("@cs7player/login-lib")

exports.send = async (reqParams) => {
 try {
  const skipStore = reqParams["skip_store"] || 0
  const sender_id = reqParams["sender_id"]
  const receiver_id = reqParams["receiver_id"]
  const title = reqParams["title"]
  const message = reqParams["message"]
  const data = reqParams["data"] || {}

  // Fetch device tokens
  const deviceParams = { user_id: receiver_id }
  const result = await deviceToken.details(deviceParams)
  const tokensData = result["data"] || []
  const deviceTokenList = tokensData.map(item => item["device_token"])

  // Prepare push message
  const msgContent = { title, message }

  // Send push notification if any tokens found
  if (deviceTokenList.length > 0) await notificationConn.sendPushNotification(deviceTokenList, msgContent, data)

  // Prepare notification DB entry
  const baseInsertObj = {
   sender_id: mongoObjId(sender_id),
   title,
   message,
   status: 1,
   created_at: new Date()
  }

  // Insert into MongoDB if skipStore is not set
  if (skipStore == 0) {
   if (Array.isArray(receiver_id)) {
    for (const id of receiver_id) {
     const insertObj = { ...baseInsertObj, receiver_id: mongoObjId(id) }
     await mongoQuery.insertOne(TBL_NOTIFICATIONS, insertObj)
    }
   } else {
    const insertObj = { ...baseInsertObj, receiver_id: mongoObjId(receiver_id) }
    await mongoQuery.insertOne(TBL_NOTIFICATIONS, insertObj)
   }
  }

 } catch (error) {
  console.error("Error in sending notification:", error)
  throw error
 }
}