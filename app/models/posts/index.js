const { mongoQuery, mongoObjId } = require("@cs7player/login-lib")

exports.createPosts = async (reqParams) => {
 try {
  const content = reqParams["content"];
  const tag = [reqParams["tag"]];
  const like = [reqParams["like"]];
  const share = [reqParams["share"]];
  const comment = [reqParams["comment"]];
  const created_by = mongoObjId(reqParams["created_by"]);
  const created_at = new Date()
  const result = await mongoQuery.insertOne(POSTS, { content, tag, like, share, comment, created_by, created_at })
  return result || []
 } catch (error) {
  throw error
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