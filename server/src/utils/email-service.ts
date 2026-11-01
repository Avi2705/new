import nodemailer from "nodemailer";
import "dotenv/config";
interface sendPasswordResponse{
    from: string;
    to:string;
   subject: string;
   text: string
}
const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: process.env.SMTP_SECURE === "true",
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
    }
});

async function sendPasswordResetEmail(email:string, resetUrl:string):Promise<void> {
    await transporter.sendMail({
        from: process.env.SMTP_USER,
        to: email,
        subject: "Reset your password",
        text: "Reset your password using this link: " + resetUrl
    });
}

async function sendVerificationOtp(email: string, otp: string | number): Promise<void> {
    await transporter.sendMail({
        from: process.env.SMTP_USER,
        to: email,
        subject: "Email Verification OTP",
        text: "Your OTP is: " + otp + ". It is valid for 10 minutes."
    });
}

export { sendPasswordResetEmail, sendVerificationOtp };
