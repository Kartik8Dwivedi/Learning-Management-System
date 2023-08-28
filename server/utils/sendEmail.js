import nodemailer from "nodemailer";

const sendEmail = async function (email,subject,message){
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: false, // true for 465, false for other ports
  auth: {
    // TODO: replace `user` and `pass` values from <https://forwardemail.net>
        user: process.env.SMTP_USERNAME,
        pass: process.env.SMTP_PASSWORD
  }
});

let info = await transporter.sendMail({
    from:'"Kartik Dwivedi" <freelance.kartikdwivedi@gmail.com>',
    to: email,
    subject,
    text:message,

})
console.log("Message sent: %s", info.messageId)

}
export default sendEmail;