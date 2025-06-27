const mongoQuery = require("@cs7player/login-lib").mongoQuery
const pbkdf = require("@cs7player/login-lib").pbkdf
const otp = require("@cs7player/login-lib").otp
const jwt = require("@cs7player/login-lib").jwt
const otpJson = require("../../utils/otp.json")

exports.signUp = async (reqParams) => {
 try {
  let { username, email, gender_id, gender_name, password } = reqParams
  const usernameDetails = await checkUsername(username)
  if (usernameDetails.length > 0) return { "status": DUPLICATE_ENTRY_CODE, "msg": "Username already taken" }
  const emailDetails = await checkEmail(email)
  if (emailDetails.length > 0) return { "status": DUPLICATE_ENTRY_CODE, "msg": "Email already taken" }
  password = await pbkdf.hashPassword(password)
  created_at = new Date()
  is_verified = 0
  const result = await mongoQuery.insertOne(USERS, { username, email, gender_id, gender_name, password, is_verified, created_at })
  const friends = await mongoQuery.insertOne(FRIENDS, { user_id: result["insertedId"], friends: [] })
  // const otpResult = await otpSender({ username, email })
  // if(otpResult["status"]){
  // }else{
  //  return { "status": SERVICE_UNAVAILABLE_CODE, "msg": SERVICE_UNAVAILABLE_MESSAGE}
  // }
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
  if (tokenRes) return { "msg": "Login successful.", "data": userObj, "token": tokenRes }
  else return { "msg": tokenRes["msg"], "status": tokenRes["status_code"] }
 } catch (error) {
  throw error
 }
}

exports.verify = async (requestBody) => {
 try {
  const otp = requestBody["otp"]
  const mail = requestBody["mail"]
  if (otp == otpJson[mail]) {
   delete otpJson[mail]
   return { status: true, msg: "Email verified successfully." }
  } else return { status: true, msg: "Invalid OTP. Please check and try again." }
 } catch (error) {
  return { status: false, data: error }
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