import nodemailer from "nodemailer";

export const sendMail = async (options) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.SMTP_MAIL,
        pass: process.env.SMTP_PASSWORD,
      },
    });
    console.log("line 12 in send mail", options.email);
    const emailOptions = {
      from: process.env.SMTP_MAIL,
      to: options.email,
      subject: options.subject,
      text: options.message,
    };

    await transporter.sendMail(emailOptions);
  } catch (error) {
    console.log(error);
  }
};
