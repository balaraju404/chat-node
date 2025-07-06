const { google } = require("googleapis")
const path = require("path")
const axios = require("axios")

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

// Send the push notification to multiple device tokens using FCM API
async function sendPushNotification(deviceTokens, msgContent = {}, data = {}) {
 try {
  const accessToken = await getAccessToken() // Get OAuth token

  // FCM HTTP v1 API endpoint
  const url = `https://fcm.googleapis.com/v1/projects/${PROJECT_ID}/messages:send`

  // Use for...of loop to handle async tasks in sequence
  for (const token of deviceTokens) {
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
  }
 } catch (error) {
  console.error("Error sending notification:", error.response ? error.response.data : error.message)
 }
}

module.exports = { sendPushNotification }
