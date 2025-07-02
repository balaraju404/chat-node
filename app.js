const loginLib = require("@cs7player/login-lib")
const express = require("express")
const cors = require("cors")
const http = require("http");
const app = express()
require("./app/utils/constants")
const allow_origns = ALLOW_ORIGNS
const corsOptions = {
 origin: (origin, callback) => {
  if (!origin || allow_origns.includes(origin) || IS_ALLOW_ORIGN == 1) {
   callback(null, true)
  } else {
   callback(new Error("Not allowed by CORS"))
  }
 }
}
app.use(cors(corsOptions))

app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({ extended: true })) // For form data
app.use(loginLib.jwt.verifyToken) // verify token
const server = http.createServer(app);
// routes
const { initIO } = require("./app/utils/socketConnection");
initIO(server, corsOptions);
const routes = require("./app/routes")
app.use(routes)

server.listen(PORT, async () => {
 try {
  // Await DB connection setup
  await loginLib.mongoConnection()
  console.log(`Server is running on port ${PORT}`)
 } catch (err) {
  console.error("Failed to connect to DB:", err)
  process.exit(1) // Exit the app if DB connection fails
 }
})