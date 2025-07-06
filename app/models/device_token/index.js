const { mongoQuery, mongoObjId } = require("@cs7player/login-lib")

exports.add = async (reqParams) => {
 try {
  const insertRec = {
   user_id: mongoObjId(reqParams["user_id"]) || "",
   device_token: reqParams["device_token"] || "",
   created_at: new Date(),
   status: 1
  }

  const result = await mongoQuery.insertOne(TBL_DEVICE_TOKENS, insertRec)
  return result
 } catch (error) {
  throw error
 }
}

exports.update = async (reqParams) => {
 try {
  const device_token_id = reqParams["device_token_id"] || 0
  const status = reqParams["status"] || 0

  const updateRec = { modified_at: new Date(), status: status }
  const whr = { _id: mongoObjId(device_token_id) }

  await mongoQuery.updateOne(TBL_DEVICE_TOKENS, whr, updateRec)
  const msg = "Record Updated Successfully"
  return { status: true, msg: msg, "device_token_id": device_token_id }
 } catch (error) {
  throw error
 }
}
exports.del = async (reqParams) => {
 try {
  const whr = { _id: mongoObjId(reqParams["device_token_id"]) || 0 }
  await mongoQuery.deleteOne(TBL_DEVICE_TOKENS, whr)
  return { status: true, msg: "Record Deleted Successfully" }
 } catch (error) {
  throw error
 }
}
exports.details = async (reqParams) => {
 try {
  const whr = {}
  if ("device_token_id" in reqParams) whr["_id"] = mongoObjId(reqParams["device_token_id"])
  if ("user_id" in reqParams) whr["user_id"] = mongoObjId(reqParams["user_id"])
  if ("status" in reqParams) whr["status"] = reqParams["status"] || 1

  const pipeline = [
   { $match: whr },
   { $addFields: { device_token_id: "$_id" } },
   { $project: { _id: 0 } },
   { $sort: { created_at: -1 } }
  ]

  const result = await mongoQuery.getDetails(TBL_DEVICE_TOKENS, pipeline)
  return { status: true, data: result }
 } catch (error) {
  return { status: false, msg: "Internal server error", error }
 }
}