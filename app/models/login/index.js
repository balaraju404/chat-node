const { mongoQuery, mongoObjId } = require("@cs7player/login-lib")
const pbkdf = require("@cs7player/login-lib").pbkdf
const otp = require("@cs7player/login-lib").otp
const jwt = require("@cs7player/login-lib").jwt
const helper = require("../../utils/helper")
const deviceToken = require("../device_token")
const emailSender = require("../../utils/email-sender")

exports.signUp = async (reqParams) => {
 try {
  let { username, email, gender_id, gender_name, password, is_verified } = reqParams
  const usernameDetails = await checkUsername(username)
  if (usernameDetails.length > 0) return { "status": DUPLICATE_ENTRY_CODE, "msg": "Username already taken" }
  const emailDetails = await checkEmail(email)
  if (emailDetails.length > 0) return { "status": DUPLICATE_ENTRY_CODE, "msg": "Email already taken" }
  password = await pbkdf.hashPassword(password)
  created_at = new Date()
  const result = await mongoQuery.insertOne(USERS, { username, email, gender_id, gender_name, password, is_verified, created_at })
  await mongoQuery.insertOne(FRIENDS, { user_id: result["insertedId"], friends: [] })
  return result
 } catch (error) {
  throw error
 }
}

exports.forgetPassword = async (reqParams) => {
 try {
  let { email, password } = reqParams
  const userData = await checkEmail(email)
  if (userData.length == 0) return { "status": NOT_FOUND_CODE, "msg": "No account found." }
  const _id = userData[0]["_id"]
  password = await pbkdf.hashPassword(password)
  const result = await mongoQuery.updateOne(USERS, { _id }, { password })
  const otp = await otp({ username, email })
  return result
 } catch (error) {
  throw error
 }
}

exports.login = async (reqParams) => {
 try {
  const { email, password } = reqParams
  const userData = await checkEmail(email)
  if (userData.length == 0) return { "status": NOT_FOUND_CODE, "msg": "No account found." }
  userObj = userData[0]
  const userPwd = userObj["password"]
  const checkPwdStatus = await pbkdf.checkPassword(password, userPwd)
  if (!checkPwdStatus) return { "status": AUTH_ERROR_CODE, "msg": "Incorrect password" }
  userObj["user_id"] = userObj["_id"]
  delete userObj["_id"]
  delete userObj["password"]
  const tokenRes = await jwt.generateToken(userObj)
  if (tokenRes) {
   if ("device_token" in reqParams) {
    const params = { user_id: userObj["user_id"], device_token: reqParams["device_token"] }
    await deviceToken.add(params)
   }
   return { "msg": "Login successful.", "data": userObj, "token": tokenRes }
  }
  else return { "msg": tokenRes["msg"], "status": tokenRes["status_code"] }
 } catch (error) {
  throw error
 }
}

exports.sendOtp = async (reqParams) => {
 try {
  const { email } = reqParams
  const userData = await checkEmail(email)
  if (userData.length > 0) return { status: false, msg: "Email already exists." }
  const otp = helper.generateOTP()
  const subject = "OTP for Email Verification"
  const body = `Your OTP is ${otp} for email verification.`
  const res = await emailSender.sendEmail(email, subject, body)
  if (res["status"]) {
   const insertObj = { otp: otp, status: 0, created_at: new Date() }
   const insertResult = await mongoQuery.insertOne(OTPS, insertObj)
   return { status: true, otp_id: insertResult["insertedId"], msg: "OTP Sent Successfully" }
  }
  return res
 } catch (error) {
  throw error
 }
}

exports.verifyOtp = async (reqParams) => {
 try {
  const { otp_id, otp } = reqParams
  const whr = { _id: mongoObjId(otp_id), otp: otp, status: 0 }
  const pipeline = [{ $match: whr }]
  const insertResult = await mongoQuery.getDetails(OTPS, pipeline)
  if (insertResult.length == 0) throw { status: false, msg: "Invalid OTP" }
  const updateObj = { status: 1 }
  await mongoQuery.updateOne(OTPS, whr, updateObj)
  return { status: true, msg: "OTP verified Successfully" }
 } catch (error) {
  throw error
 }
}

const checkUsername = async (username) => {
 try {
  const result = await mongoQuery.getDetails(USERS, [{ $match: { username } }])
  return result
 } catch (error) {
  throw error
 }
}

const checkEmail = async (email) => {
 try {
  const result = await mongoQuery.getDetails(USERS, [{ $match: { email } }])
  return result
 } catch (error) {
  throw error
 }
}

const otpSender = async (requestBody) => {
 try {
  const data = { username: requestBody["username"] || "", mail: requestBody["email"] }
  const result = await otp.sendOTPEmail(data)
  otpJson[data["mail"]] = result["otp"]
  return { status: true, data: result }
 } catch (error) {
  return { status: false, data: error }
 }
}