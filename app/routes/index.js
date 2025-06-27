const router = require("express").Router()
const login = require("./login")
const users = require("./users")
const msgs = require("./messages")
const invitations = require("./invitations")
const groups = require("./groups")
const group_msgs = require("./group_msgs")

router.use("/login", login)
router.use("/users", users)
router.use("/invite", invitations)
router.use("/msgs", msgs)
router.use("/groups", groups)
router.use("/group_msgs", group_msgs)

router.get("/", (req, res) => {
 res.status(200).json({ message: "Welcome to the API" })
})

router.get("/health-check", (req, res) => {
 res.status(200).json({ status: "ok", message: "Server is up and running" })
})

module.exports = router