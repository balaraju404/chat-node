const notificationConn = require("./notification-conn")
const deviceToken = require("../models/device_token")

exports.send = async (reqParams) => {
 try {
  const sender_id = reqParams["sender_id"]
  const receiver_id = reqParams["receiver_id"]
  const title = reqParams["title"]
  const message = reqParams["message"]
  const deviceParams = { user_id: receiver_id }
  const result = await deviceToken.details(deviceParams)
  const data = result["data"] || []
  const deviceTokenList = data.map(item => item["device_token"])
  const msgContent = { title: title, message: message }
  await notificationConn.sendPushNotification(deviceTokenList, msgContent)
 } catch (error) {
  throw error
 }
}