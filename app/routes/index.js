const router = require("express").Router()
const login = require("./login")
const users = require("./users")
const msgs = require("./messages")
const invitations = require("./invitations")
const groups = require("./groups")
const group_msgs = require("./group_msgs")
const dashboard = require("./dashboard")
const device_token = require("./device_token")
const notifications = require('./notifications')
const posts = require('./posts')
const comments = require('./comments')

router.use("/login", login)
router.use("/users", users)
router.use("/invite", invitations)
router.use("/chat", msgs)
router.use("/groups", groups)
router.use("/group_chat", group_msgs)
router.use("/dashboard", dashboard)
router.use("/device_token", device_token)
router.use('/notifications', notifications)
router.use('/posts', posts)
router.use('/comments', comments)

router.get("/", (req, res) => {
 res.status(200).json({ message: "Welcome to the API" })
})

router.get("/health-check", (req, res) => {
 res.status(200).json({ status: "ok", message: "Server is up and running" })
})

module.exports = router