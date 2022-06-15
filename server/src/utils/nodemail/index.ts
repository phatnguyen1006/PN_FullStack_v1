import nodemailer from "nodemailer";
import "dotenv/config";

// async..await is not allowed in global scope, must use a wrapper
export const sendEmail = async (to: string, html: string) => {
  // Generate test SMTP service account from ethereal.email
  // let testAccount = await nodemailer.createTestAccount();
  // console.log(testAccount);

  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.NODEMAIL_USER, // generated ethereal user
      pass: process.env.NODEMAIL_PASSWORD, // generated ethereal password
    },
    tls: {
      rejectUnauthorized: false, // avoid NodeJS self signed certificate error
    },
  });

  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: '"Phat Nguyen" <phatnguyen@gmail.com>', // sender address
    to, // list of receivers
    subject: "Change Password", // Subject line
    // text: "Hello world?", // plain text body
    html, // html body
  });

  console.log("Message sent: %s", info.messageId);
  // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

  // Preview only available when sending through an Ethereal account
  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
  // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
};
