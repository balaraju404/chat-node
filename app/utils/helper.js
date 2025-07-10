exports.generateOTP = (length = 6) => {
 try {
  const digits = "0123456789"
  let otp = ""
  for (let i = 0; i < length; i++) {
   otp += digits[Math.floor(Math.random() * 10)]
  }
  return otp
 } catch (error) {
  throw error
 }
}