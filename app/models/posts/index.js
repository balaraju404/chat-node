const { mongoQuery, mongoObjId } = require("@cs7player/login-lib")
const { getIO, getSocketIdFromUserId } = require("../../utils/socketConnection");
const notifications = require("../../utils/notifications")

exports.createPosts = async (reqParams) => {
 try {
  const content = reqParams["content"];
  const tag = reqParams["tag"].map(id => mongoObjId(id));
  const like = [];
  const share = [];
  const comment = [];
  const created_by = mongoObjId(reqParams["user_id"]);
  const created_at = new Date()
  const result = await mongoQuery.insertOne(POSTS, { content, tag, like, share, comment, created_by, created_at })
  await tagging({ tag, post_id: result['insertedId'], user_id: reqParams["user_id"], username: reqParams['username'] })
  return result || []
 } catch (error) {
  throw error
 }
}

tagging = async (data) => {
 try {
  const io = getIO()
  data['tag'].forEach(async id => {
   const notificationParams = { sender_id: data["user_id"], receiver_id: id, title: tagged, message: data['username'] + ": Tag on this post." }
   await notifications.send(notificationParams)
   const sender_id = mongoObjId(data["user_id"])
   const receiver_id = mongoObjId(id)
   const msg = `@${data['username']} tagged you on this post`
   const is_seen = 0
   const created_at = new Date()
   const result = await mongoQuery.insertOne(MESSAGES, { sender_id, receiver_id, msg, is_seen, created_at, post_id: data["post_id"] })
   const msg_id = result["insertedId"]
   const socketId = getSocketIdFromUserId(id)
   if (socketId) {
    io.to(socketId).emit("msg", { _id: msg_id, sender_id, receiver_id, msg, is_seen, created_at })
   }
  });
 } catch (err) {
  throw err;
 }
}

exports.like = async (reqParams) => {
 try {
  const user_id = mongoObjId(reqParams["user_id"]);
  const post_id = mongoObjId(reqParams["post_id"]);
  const is_like = reqParams["is_like"];
  let updateResult;
  if (is_like === 1) {
   updateResult = await mongoQuery.updateOne(POSTS, { _id: post_id }, { $pull: { like: user_id } }, 0);
   if (updateResult.modifiedCount === 0) {
    return "Post was not previously liked.";
   }
   return "Post unliked successfully.";
  } else {
   updateResult = await mongoQuery.updateOne(POSTS, { _id: post_id }, { $addToSet: { like: user_id } }, 0);
   if (updateResult.modifiedCount === 0) {
    return "Post already liked.";
   }
   return "Post liked successfully.";
  }
 } catch (err) {
  throw err;
 }
};