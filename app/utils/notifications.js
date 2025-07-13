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
  const deviceParams = { user_id: receiver_id }
  const result = await deviceToken.details(deviceParams)
  const tokensData = result["data"] || []
  const deviceTokenList = tokensData.map(item => item["device_token"])
  const msgContent = { title: title, message: message }
  if (deviceTokenList.length) await notificationConn.sendPushNotification(deviceTokenList, msgContent, data)
  const insertObj = {
   sender_id: mongoObjId(sender_id),
   receiver_id: mongoObjId(receiver_id),
   title,
   message,
   status: 1,
   created_at: new Date()
  }
  if (skipStore == 0) await mongoQuery.insertOne(TBL_NOTIFICATIONS, insertObj)
 } catch (error) {
  throw error
 }
}