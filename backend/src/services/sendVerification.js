import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

const sendVerificationEmail = async (email, token) => {
    try {
        const link = `${process.env.FRONTEND_URL}/Email-Verification/${token}`;

        const data = await resend.emails.send({
            from: process.env.EMAIL_FROM,
            to: email,
            subject: 'Email Verification',
            html: `
                <h1>Email Verification</h1>
                <p>Click below to verify your account:</p>
                <a href="${link}"
                   style="padding:10px 20px;background:green;color:white;text-decoration:none;">
                   Verify Account
                </a>
            `
        });

        console.log("EMAIL SENT:", data);

    } catch (error) {
        console.log("RESEND ERROR:", error);
    }
};

export default sendVerificationEmail;