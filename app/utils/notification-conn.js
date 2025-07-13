const { google } = require("googleapis")
const path = require("path")
const axios = require("axios")
const { mongoQuery } = require("@cs7player/login-lib")

// Path to the service account file
const SERVICE_ACCOUNT_FILE = path.join(__dirname, FIREBASE_SERVICE_ACCOUNT_PATH)

// Get an access token using the service account
async function getAccessToken() {
 try {
  const auth = new google.auth.GoogleAuth({ keyFile: SERVICE_ACCOUNT_FILE, scopes: ["https://www.googleapis.com/auth/firebase.messaging"], projectId: PROJECT_ID })

  // Get the OAuth 2.0 access token
  const authClient = await auth.getClient()
  const accessToken = await authClient.getAccessToken()

  // The access token is inside `token` field
  return accessToken.token
 } catch (error) {
  console.error("Error authenticating with Firebase:", error)
  throw error
 }
}

// Helper function to delete token from MongoDB if invalid
async function deleteTokenFromDB(token) {
 try {
  // delete invalid token
  await mongoQuery.deleteOne(TBL_DEVICE_TOKENS, { device_token: token })
 } catch (err) {
  console.warn(`⚠️ Failed to delete token ${token} from DB:`, err.message)
 }
}

// Send the push notification to multiple device tokens using FCM API
async function sendPushNotification(deviceTokens, msgContent = {}, data = {}) {
 try {
  const accessToken = await getAccessToken() // Get OAuth token

  // FCM HTTP v1 API endpoint
  const url = `https://fcm.googleapis.com/v1/projects/${PROJECT_ID}/messages:send`

  // Use for...of loop to handle async tasks in sequence
  for (const token of deviceTokens) {
   try {
    // Define the notification payload
    const message = { message: { token, notification: { title: msgContent["title"] || "", body: msgContent["message"] || "" }, data } }

    // Send the POST request to FCM API
    const response = await axios.post(url, message, {
     headers: { "Authorization": `Bearer ${accessToken}`, "Content-Type": "application/json" }
    })

    // Check the response for success
    if (response.status === 200) {
     console.log(`Notification sent successfully to token ${token}:`, response.data)
    } else {
     console.error(`Failed to send notification to token ${token}:`, response.data)
    }
   } catch (error) {
    // Check if the token is invalid (404 error from FCM)
    const errData = error.response?.data
    const errCode = errData?.error?.code
    const errMsg = errData?.error?.message

    console.error(`Error sending notification to token ${token}:`, errMsg)

    if (errCode === 404 && errMsg?.includes("Requested entity was not found")) {
     // Token is invalid or expired — delete it from DB
     await deleteTokenFromDB(token)
    }
   }
  }
 } catch (error) {
  console.error("Error sending notification:", error.response ? error.response.data : error.message)
 }
}

module.exports = { sendPushNotification }