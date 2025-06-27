const { mongoQuery, mongoObjId } = require("@cs7player/login-lib")

exports.create = async (reqParams) => {
 try {
  const groupname = reqParams["groupname"];
  const created_by = mongoObjId(reqParams["user_id"]);
  const members = [created_by];
  const admins = [created_by];
  const created_at = new Date();
  const result = await mongoQuery.insertOne(GROUPS, { groupname, admins, members, created_by, created_at })
  return result || []
 } catch (error) {
  throw error
 }
}

exports.add = async (reqParams) => {
 try {
  const group_id = mongoObjId(reqParams["group_id"]);
  const isAdmin = reqParams["is_admin"] || 0;
  const members = reqParams["friends_ids"].map(m => mongoObjId(m));
  const admins = reqParams["admin_ids"].map(m => mongoObjId(m));
  let update = { members };
  if (isAdmin == 1) {
   update = { admins };
  }
  const result = await mongoQuery.updateOne(GROUPS, { "_id": group_id }, update);
  return result || []
 } catch (error) {
  throw error
 }
}

exports.friends = async (reqParams) => {
 try {
  const group_id = mongoObjId(reqParams["group_id"]);
  const user_id = mongoObjId(reqParams["user_id"]);
  const member_arr = await mongoQuery.getDetails(GROUPS, [{ $match: { "_id": group_id } }])
  const memberIds = member_arr[0]?.members || [];
  let pipeline = [
   { $match: { user_id } },
   {
    $lookup: {
     from: USERS,
     localField: "friends",
     foreignField: "_id",
     as: "joinedData"
    }
   },
   {
    $addFields: {
     joinedData: {
      $map: {
       input: "$joinedData",
       as: "user",
       in: {
        $mergeObjects: [
         "$$user",
         {
          is_add: {
           $in: ["$$user._id", memberIds]
          }
         }
        ]
       }
      }
     }
    }
   },
   { $unwind: "$joinedData" },
   {
    $project: {
     "_id": "$joinedData._id",
     "username": "$joinedData.username",
     "gender_id": "$joinedData.gender_id",
     "id_add": "$joinedData.is_add"
    }
   }
  ]
  const result = await mongoQuery.getDetails(FRIENDS, pipeline)
  return result || []
 } catch (error) {
  throw error
 }
}

exports.leave = async (reqParams) => {
 try {
  const group_id = mongoObjId(reqParams["group_id"]);
  const user_id = mongoObjId(reqParams["user_id"]);
  const result = await mongoQuery.updateOne(GROUPS, { "_id": group_id }, { $pull: { members: user_id, admins : user_id} }, 0)
  return result || []
 } catch (error) {
  throw error
 }
}

exports.update = async (reqParams) => {
 try {
  const updateObj = {}
  if ("groupname" in reqParams) updateObj["groupname"] = reqParams["groupname"]
  updateObj["created_at"] = new Date()
  const whr = { "_id": mongoObjId(reqParams["group_id"]) }
  const result = await mongoQuery.updateOne(GROUPS, whr, updateObj)
  return result || []
 } catch (error) {
  throw error
 }
}

exports.delete = async (reqParams) => {
 try {
  const _id = mongoObjId(reqParams["group_id"])
  const result = await mongoQuery.deleteOne(GROUPS, { _id })
  return result || []
 } catch (error) {
  throw error
 }
}