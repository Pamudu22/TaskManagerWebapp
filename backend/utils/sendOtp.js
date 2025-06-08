import nodemailer from 'nodemailer';

export const sendOtpEmail = async (to, otp) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject: 'Your OTP Code',
    text: `Your verification code is ${otp}. It expires in 5 minutes.`,
  };

  await transporter.sendMail(mailOptions);
};
