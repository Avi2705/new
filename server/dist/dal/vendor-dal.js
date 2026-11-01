import { ObjectId } from "mongodb";
import { createSession } from "../schemas/session-schema.js";
import { getDatabase } from "../config/db.js";
function db() {
    return getDatabase();
}
async function findUserByEmail(email) {
    return await db().collection("vendor").findOne({ email });
}
async function findVendorById(vendorId) {
    const _id = typeof vendorId === "string" ? new ObjectId(vendorId) : vendorId;
    return await db().collection("vendor").findOne({ _id }, { projection: { password: 0, sessions: 0, resetPasswordTokenHash: 0, resetPasswordExpiresAt: 0, otpHash: 0, otpExpiresAt: 0 } });
}
async function registerUser(userData) {
    return await db().collection("vendor").insertOne(userData);
}
async function verifyVendorOtp(vendorId) {
    const _id = typeof vendorId === "string" ? new ObjectId(vendorId) : vendorId;
    return await db().collection("vendor").updateOne({ _id }, {
        $set: { isVerified: true, updatedAt: new Date() },
        $unset: { otpHash: "", otpExpiresAt: "" }
    });
}
async function updateVendor(vendorId, name) {
    const _id = typeof vendorId === "string" ? new ObjectId(vendorId) : vendorId;
    return await db().collection("vendor").updateOne({ _id }, { $set: { name, updatedAt: new Date() } });
}
async function addSession(userId, accessTokenHash, accessTokenExpiresAt, refreshTokenHash, refreshTokenExpiresAt) {
    const session = createSession(accessTokenHash, accessTokenExpiresAt, refreshTokenHash, refreshTokenExpiresAt);
    const _id = typeof userId === "string" ? new ObjectId(userId) : userId;
    return await db().collection("vendor").updateOne({ _id }, { $push: { sessions: session }, $set: { updatedAt: new Date() } });
}
async function savePasswordResetToken(userId, resetPasswordTokenHash, resetPasswordExpiresAt) {
    const _id = typeof userId === "string" ? new ObjectId(userId) : userId;
    return await db().collection("vendor").updateOne({ _id }, { $set: { resetPasswordTokenHash, resetPasswordExpiresAt, updatedAt: new Date() } });
}
async function findUserByResetToken(resetPasswordTokenHash) {
    return await db().collection("vendor").findOne({
        resetPasswordTokenHash,
        resetPasswordExpiresAt: { $gt: new Date() }
    });
}
async function resetUserPassword(userId, resetPasswordTokenHash, newPasswordHash) {
    const _id = typeof userId === "string" ? new ObjectId(userId) : userId;
    return await db().collection("vendor").updateOne({ _id, resetPasswordTokenHash, resetPasswordExpiresAt: { $gt: new Date() } }, {
        $set: { password: newPasswordHash, sessions: [], updatedAt: new Date() },
        $unset: { resetPasswordTokenHash: "", resetPasswordExpiresAt: "" }
    });
}
async function removeSession(userId, tokenHash) {
    const _id = typeof userId === "string" ? new ObjectId(userId) : userId;
    return await db().collection("vendor").updateOne({ _id }, {
        $pull: { sessions: { refreshTokenHash: tokenHash } },
        $set: { updatedAt: new Date() }
    });
}
async function updateUnverifiedVendor(vendorId, updateData) {
    const _id = typeof vendorId === "string" ? new ObjectId(vendorId) : vendorId;
    return await db().collection("vendor").updateOne({ _id }, { $set: { ...updateData, updatedAt: new Date() } });
}
export { findUserByEmail, findVendorById, registerUser, updateUnverifiedVendor, verifyVendorOtp, updateVendor, addSession, savePasswordResetToken, findUserByResetToken, resetUserPassword, removeSession };
//# sourceMappingURL=vendor-dal.js.map