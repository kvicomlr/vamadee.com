import nodemailer from "nodemailer";

const sendEmail = async (option) => {
  //CREATE A TRANSPORTER

  const transporter = nodemailer.createTransport({
    host: process.env.HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.USER,
      pass: process.env.PSWD,
    },
  });

  //DEFIN EMAIL OPTIONS
  const emailOptions = {
    from: "Kueentair support<support@kueentair.com>",
    to: option.email,
    subject: option.subject,
    text: option.message,
  };

  await transporter.sendMail(emailOptions);
};

export default sendEmail;
