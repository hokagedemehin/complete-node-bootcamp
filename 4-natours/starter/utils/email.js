const nodemailer = require("nodemailer");

const sendEmail = async (options) => {
  // 1) create a transporter
  // let transporter = nodemailer.createTransport({
  //   service: "Gmail",
  //   auth: {
  //     user: process.env.EMAIL_USERNAME,
  //     pass: process.env.EMAIL_PASSWORD,
  //   },
  //   //Activate in gmail "less secure app" option
  // });
  let transporter = nodemailer.createTransport({
    host: process.env.MAILTRAP_HOST,
    port: process.env.MAILTRAP_PORT,
    auth: {
      user: process.env.MAILTRAP_USERNAME,
      pass: process.env.MAILTRAP_PASSWORD,
    },
  });
  // 2) define the email options
  const mailOptions = {
    from: "Demehin Ibukun <ibk2k7@gmail.com>",
    to: options.email,
    subject: options.subject,
    text: options.message,
  };
  // 3) actually send the email
  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
