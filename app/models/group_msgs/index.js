const { mongoQuery, mongoObjId } = require("@cs7player/login-lib")

exports.msg = async (reqParams) => {
 try {
  const group_id = reqParams["group_id"];
  const msg = reqParams["msg"];
  const texted_by = mongoObjId(reqParams["user_id"]);
  const seen_by = [texted_by];
  const created_at = new Date();
  const result = await mongoQuery.insertOne(GROUPS_MSG, { group_id, msg, texted_by, seen_by, created_at })
  return result || [];
 } catch (error) {
  throw error
 }
}

exports.chat = async (reqParams) => {
 try {
  const group_id = reqParams["group_id"];
  const user_id = mongoObjId(reqParams["user_id"]);
  let pipeline = [
   { $match: { group_id } },
   {
    $lookup: {
     from: USERS,
     localField: "texted_by",
     foreignField: "_id",
     as: "joinedData"
    }
   },
   { $unwind: "$joinedData" },
   { $addFields: { "username": "$joinedData.username" } },
   { $project: { msg: 1, texted_by: 1, username: 1, created_at: 1 } },
   { $sort: { created_at: -1 } }
  ]
  const result = await mongoQuery.getDetails(GROUPS_MSG, pipeline)
  const filter = { group_id, seen_by: { $nin: [user_id] } }
  const update = { $addToSet: { seen_by: user_id } }
  await mongoQuery.updateMany(GROUPS_MSG, filter, update, 0)
  return result || [];
 } catch (error) {
  throw error
 }
}

exports.dashboard = async (reqParams) => {
 try {
  const user_id = mongoObjId(reqParams["user_id"]);
  const group_list = await mongoQuery.getDetails(GROUPS, [{ $match: { members: user_id } }, { $project: { admins: 0, members: 0, created_by: 0, created_at: 0 } },])

  if (!group_list.length) return { data: [], count: 0 }
  const matchedgroupIds = group_list.map(group => group._id.toString());
  const pipeline = [
   {
    $match: {
     group_id: { $in: matchedgroupIds },seen_by: { $ne: user_id }
    }
   },
   { $sort: { created_at: -1 } },
   {
    $group: {
     _id: "$group_id",
     last_msg: { $first: "$msg" },
     last_msg_time: { $first: "$created_at" },
     count: { $sum: 1 }
    }
   }
  ];
  const lastMessages = await mongoQuery.getDetails(GROUPS_MSG, pipeline);
  const result = {
   group_id: group_list[0]._id,
   group_name: group_list[0].groupname,
   last_message: lastMessages
  };
  return result;
 } catch (error) {
  throw error
 }
}

exports.update = async (reqParams) => {
 try {
  const updateObj = {}
  if ("msg" in reqParams) updateObj["msg"] = reqParams["msg"]
  updateObj["created_at"] = new Date()
  const whr = { "_id": mongoObjId(reqParams["group_msg_id"]) }
  const result = await mongoQuery.updateOne(GROUPS_MSG, whr, updateObj)
  return result || []
 } catch (error) {
  throw error
 }
}

exports.delete = async (reqParams) => {
 try {
  const _id = mongoObjId(reqParams["group_msg_id"])
  const result = await mongoQuery.deleteOne(GROUPS_MSG, { _id })
  return result || []
 } catch (error) {
  throw error
 }
}