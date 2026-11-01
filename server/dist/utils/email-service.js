import nodemailer from "nodemailer";
import "dotenv/config";
const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: process.env.SMTP_SECURE === "true",
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
    }
});
async function sendPasswordResetEmail(email, resetUrl) {
    await transporter.sendMail({
        from: process.env.SMTP_USER,
        to: email,
        subject: "Reset your password",
        text: "Reset your password using this link: " + resetUrl
    });
}
async function sendVerificationOtp(email, otp) {
    await transporter.sendMail({
        from: process.env.SMTP_USER,
        to: email,
        subject: "Email Verification OTP",
        text: "Your OTP is: " + otp + ". It is valid for 10 minutes."
    });
}
export { sendPasswordResetEmail, sendVerificationOtp };
//# sourceMappingURL=email-service.js.map