import crypto from "node:crypto";

export function generateOTP(): string {
    return crypto.randomInt(100000, 999999).toString();
}

export default generateOTP;
