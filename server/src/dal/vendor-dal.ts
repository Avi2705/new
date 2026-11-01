import { ObjectId, type WithId } from "mongodb";
import { createSession } from "../schemas/session-schema.js";
import { getDatabase } from "../config/db.js";
import type { VendorDoc } from "../model/vendor.model.js";

function db() {
    return getDatabase();
}

async function findUserByEmail(email: string): Promise<WithId<VendorDoc> | null> {
    return await db().collection<VendorDoc>("vendor").findOne({ email }) as WithId<VendorDoc> | null;
}

async function findVendorById(vendorId: string | ObjectId): Promise<WithId<VendorDoc> | null> {
    const _id = typeof vendorId === "string" ? new ObjectId(vendorId) : vendorId;
    return await db().collection<VendorDoc>("vendor").findOne(
        { _id },
        { projection: { password: 0, sessions: 0, resetPasswordTokenHash: 0, resetPasswordExpiresAt: 0, otpHash: 0, otpExpiresAt: 0 } }
    ) as WithId<VendorDoc> | null;
}

async function registerUser(userData: VendorDoc) {
    return await db().collection<VendorDoc>("vendor").insertOne(userData);
}

async function verifyVendorOtp(vendorId: string | ObjectId) {
    const _id = typeof vendorId === "string" ? new ObjectId(vendorId) : vendorId;
    return await db().collection<VendorDoc>("vendor").updateOne(
        { _id },
        {
            $set: { isVerified: true, updatedAt: new Date() },
            $unset: { otpHash: "", otpExpiresAt: "" }
        }
    );
}

async function updateVendor(vendorId: string | ObjectId, name: string) {
    const _id = typeof vendorId === "string" ? new ObjectId(vendorId) : vendorId;
    return await db().collection<VendorDoc>("vendor").updateOne(
        { _id },
        { $set: { name, updatedAt: new Date() } }
    );
}

async function addSession(userId: string | ObjectId, accessTokenHash: string, accessTokenExpiresAt: Date, refreshTokenHash: string, refreshTokenExpiresAt: Date) {
    const session = createSession(accessTokenHash, accessTokenExpiresAt, refreshTokenHash, refreshTokenExpiresAt);
    const _id = typeof userId === "string" ? new ObjectId(userId) : userId;
    return await db().collection<VendorDoc>("vendor").updateOne(
        { _id },
        { $push: { sessions: session }, $set: { updatedAt: new Date() } }
    );
}

async function savePasswordResetToken(userId: string | ObjectId, resetPasswordTokenHash: string, resetPasswordExpiresAt: Date) {
    const _id = typeof userId === "string" ? new ObjectId(userId) : userId;
    return await db().collection<VendorDoc>("vendor").updateOne(
        { _id },
        { $set: { resetPasswordTokenHash, resetPasswordExpiresAt, updatedAt: new Date() } }
    );
}

async function findUserByResetToken(resetPasswordTokenHash: string): Promise<WithId<VendorDoc> | null> {
    return await db().collection<VendorDoc>("vendor").findOne({
        resetPasswordTokenHash,
        resetPasswordExpiresAt: { $gt: new Date() }
    }) as WithId<VendorDoc> | null;
}

async function resetUserPassword(userId: string | ObjectId, resetPasswordTokenHash: string, newPasswordHash: string) {
    const _id = typeof userId === "string" ? new ObjectId(userId) : userId;
    return await db().collection<VendorDoc>("vendor").updateOne(
        { _id, resetPasswordTokenHash, resetPasswordExpiresAt: { $gt: new Date() } },
        {
            $set: { password: newPasswordHash, sessions: [], updatedAt: new Date() },
            $unset: { resetPasswordTokenHash: "", resetPasswordExpiresAt: "" }
        }
    );
}

async function removeSession(userId: string | ObjectId, tokenHash: string) {
    const _id = typeof userId === "string" ? new ObjectId(userId) : userId;
    return await db().collection<VendorDoc>("vendor").updateOne(
        { _id },
        {
            $pull: { sessions: { refreshTokenHash: tokenHash } } as any,
            $set: { updatedAt: new Date() }
        }
    );
}

async function updateUnverifiedVendor(vendorId: string | ObjectId, updateData: Partial<VendorDoc>) {
    const _id = typeof vendorId === "string" ? new ObjectId(vendorId) : vendorId;
    return await db().collection<VendorDoc>("vendor").updateOne(
        { _id },
        { $set: { ...updateData, updatedAt: new Date() } }
    );
}

export {
    findUserByEmail,
    findVendorById,
    registerUser,
    updateUnverifiedVendor,
    verifyVendorOtp,
    updateVendor,
    addSession,
    savePasswordResetToken,
    findUserByResetToken,
    resetUserPassword,
    removeSession
};
