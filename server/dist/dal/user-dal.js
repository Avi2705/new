import { ObjectId } from "mongodb";
import { createSession } from "../schemas/session-schema.js";
import { getDatabase } from "../config/db.js";
function db() {
    return getDatabase();
}
async function findUserByEmail(email) {
    return await db().collection("users").findOne({ email });
}
async function registerUser(userData) {
    return await db().collection("users").insertOne(userData);
}
async function addSession(userId, accessTokenHash, accessTokenExpiresAt, refreshTokenHash, refreshTokenExpiresAt) {
    const session = createSession(accessTokenHash, accessTokenExpiresAt, refreshTokenHash, refreshTokenExpiresAt);
    const _id = typeof userId === "string" ? new ObjectId(userId) : userId;
    return await db().collection("users").updateOne({ _id }, { $push: { sessions: session }, $set: { updatedAt: new Date() } });
}
async function savePasswordResetToken(userId, resetPasswordTokenHash, resetPasswordExpiresAt) {
    const _id = typeof userId === "string" ? new ObjectId(userId) : userId;
    return await db().collection("users").updateOne({ _id }, { $set: { resetPasswordTokenHash, resetPasswordExpiresAt, updatedAt: new Date() } });
}
async function findUserByResetToken(resetPasswordTokenHash) {
    return await db().collection("users").findOne({
        resetPasswordTokenHash,
        resetPasswordExpiresAt: { $gt: new Date() }
    });
}
async function resetUserPassword(userId, resetPasswordTokenHash, newPasswordHash) {
    const _id = typeof userId === "string" ? new ObjectId(userId) : userId;
    return await db().collection("users").updateOne({ _id, resetPasswordTokenHash, resetPasswordExpiresAt: { $gt: new Date() } }, {
        $set: { password: newPasswordHash, sessions: [], updatedAt: new Date() },
        $unset: { resetPasswordTokenHash: "", resetPasswordExpiresAt: "" }
    });
}
async function removeSession(userId, tokenHash) {
    const _id = typeof userId === "string" ? new ObjectId(userId) : userId;
    return await db().collection("users").updateOne({ _id }, {
        $pull: { sessions: { refreshTokenHash: tokenHash } },
        $set: { updatedAt: new Date() }
    });
}
async function findUserById(userId) {
    const _id = typeof userId === "string" ? new ObjectId(userId) : userId;
    return await db().collection("users").findOne({ _id }, { projection: { password: 0, sessions: 0, resetPasswordTokenHash: 0, resetPasswordExpiresAt: 0, otpHash: 0, otpExpiresAt: 0 } });
}
async function verifyUserOtp(userId) {
    const _id = typeof userId === "string" ? new ObjectId(userId) : userId;
    return await db().collection("users").updateOne({ _id }, {
        $set: { isVerified: true, updatedAt: new Date() },
        $unset: { otpHash: "", otpExpiresAt: "" }
    });
}
async function updateUser(userId, name) {
    const _id = typeof userId === "string" ? new ObjectId(userId) : userId;
    return await db().collection("users").updateOne({ _id }, { $set: { name, updatedAt: new Date() } });
}
async function updateUnverifiedUser(userId, updateData) {
    const _id = typeof userId === "string" ? new ObjectId(userId) : userId;
    return await db().collection("users").updateOne({ _id }, { $set: { ...updateData, updatedAt: new Date() } });
}
async function findUsersByIds(userIds) {
    const validObjectIds = userIds
        .filter(id => id && ObjectId.isValid(id))
        .map(id => typeof id === "string" ? new ObjectId(id) : id);
    return await db().collection("users").find({
        _id: { $in: validObjectIds }
    }).toArray();
}
export { findUsersByIds, findUserByEmail, findUserById, registerUser, updateUnverifiedUser, addSession, updateUser, verifyUserOtp, savePasswordResetToken, findUserByResetToken, resetUserPassword, removeSession };
//# sourceMappingURL=user-dal.js.map