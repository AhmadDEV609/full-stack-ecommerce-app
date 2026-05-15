import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

const sendVerificationEmail = async (email, token) => {

    try {

        const link = `${process.env.FRONTEND_URL}/Email-Verification/${token}`;

        const info = await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: email,
            subject: "Email Verification",
            html: `
                <h1>Email Verification</h1>

                <p>Click below to verify your account:</p>

                <a href="${link}"
                    style="
                        padding:10px 20px;
                        background:green;
                        color:white;
                        text-decoration:none;
                        border-radius:5px;
                        display:inline-block;
                    ">
                    Verify Account
                </a>
            `,
        });

        console.log("EMAIL SENT:", info.response);

    } catch (error) {

        console.log("EMAIL ERROR:", error);

    }
};

export default sendVerificationEmail;