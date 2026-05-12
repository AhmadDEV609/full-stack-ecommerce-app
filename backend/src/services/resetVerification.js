import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASS,
    },
});


export const sendResetPasswordEmail = async (email, token) => {
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${token}`;

    const mailOptions = {
        from: process.env.EMAIL,
        to: email,
        subject: "Password Reset",
        html: `
      <h1>Password Reset</h1>
      <p>Click below to reset your password:</p>
      <a href="${resetUrl}" 
         style="padding:10px 20px;background-color:green;color:white;text-decoration:none;">
         Reset Password
      </a>
    `,
    };

    await transporter.sendMail(mailOptions);
};