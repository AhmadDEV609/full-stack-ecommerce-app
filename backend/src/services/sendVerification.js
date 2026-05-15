import nodemailer from 'nodemailer';

const sendVerificationEmail = async (email, token) => {
    try {
        const transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 587,
            secure: false,
            auth: {
                user: process.env.EMAIL,
                pass: process.env.EMAIL_PASS
            }
        });

        const Email = `${process.env.FRONTEND_URL}/Email-Verification/${token}`;

        const mailOptions = {
            from: process.env.EMAIL_VERIFICATION,
            to: email,
            subject: 'Email Verification',
            html: `
                <h1>Email Verification</h1>
                <p>Click below to verify your account:</p>
                <a href="${Email}" 
                   style="padding:10px 20px;background-color:green;color:white;text-decoration:none;">Verify Account</a>
            `
        };

        await transporter.sendMail(mailOptions);
        console.log('Verification email sent to', email);

    } catch (error) {
        console.log('Error sending email:', error);
    }
};


export default sendVerificationEmail