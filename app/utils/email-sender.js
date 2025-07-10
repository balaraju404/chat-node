const sgMail = require('@sendgrid/mail')
sgMail.setApiKey(process.env.SENDGRID_API_KEY)
// sgMail.setDataResidency('eu'); 

exports.sendEmail = async (toMail, subject, content, htmlContent = "") => {
 try {
  const msg = {
   to: toMail,
   from: SENDGRID_SINGLE_SENDER_MAIL,
   subject: subject,
   text: content
  }
  if (htmlContent.length) msg["html"] = htmlContent
  const res = await sgMail.send(msg)
  console.log(res);
  if (res[0].statusCode == 202) {
   return { status: true, msg: "Email sent successfully" }
  } else {
   return { status: false, msg: "Failed to send email" }
  }
 } catch (error) {
  console.log(error);
  throw error
 }
}