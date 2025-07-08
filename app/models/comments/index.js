const { mongoQuery, mongoObjId } = require("@cs7player/login-lib")

exports.addComment = async (reqParams) => {
 try {
  const post_id = mongoObjId(reqParams["post_id"]);
  const comment = [reqParams["comment"]];
  const created_by = mongoObjId(reqParams["created_by"]);
  const created_at = new Date()
  const result = await mongoQuery.insertOne(COMMENTS, { post_id, comment, created_by, created_at })
  const filter = { _id: mongoObjId(reqParams["post_id"]) };
  const update = mongoObjId(result.insertedId)
  const updateResult = await mongoQuery.updateOne(POSTS, filter, { $addToSet: { comment: update } }, 0);
  return updateResult || []
 } catch (error) {
  throw error
 }
}

exports.updateComment = async (reqParams) => {
 try {
  const filter = {_id: mongoObjId(reqParams["comment_id"])};
  const update = {
   $set: {
    comment: [reqParams["comment"]],
    updated_at: new Date(),
   },
  };
  const updateResult = await mongoQuery.updateOne(COMMENTS, filter, update, 0);
  return updateResult || [];
 } catch (error) {
  throw error;
 }
};

exports.deleteComment = async (reqParams) => {
 try {
  const whr = { _id: mongoObjId(reqParams["comment_id"]) || 0 }
  const result = await mongoQuery.deleteOne(COMMENTS, whr)
  return result || [];
 } catch (error) {
  throw error;
 }
};