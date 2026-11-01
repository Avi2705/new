import { ObjectId, type WithId, type Document } from "mongodb";
import { createSession } from "../schemas/session-schema.js";
import { getDatabase } from "../config/db.js";
import type { UserDoc } from "../model/user.model.js";

function db() {
    return getDatabase();
}

async function findUserByEmail(email: string): Promise<WithId<UserDoc> | null> {
    return await db().collection<UserDoc>("users").findOne({ email }) as WithId<UserDoc> | null;
}

async function registerUser(userData: UserDoc) {
    return await db().collection<UserDoc>("users").insertOne(userData);
}

async function addSession(userId: string | ObjectId, accessTokenHash: string, accessTokenExpiresAt: Date, refreshTokenHash: string, refreshTokenExpiresAt: Date) {
    const session = createSession(accessTokenHash, accessTokenExpiresAt, refreshTokenHash, refreshTokenExpiresAt);
    const _id = typeof userId === "string" ? new ObjectId(userId) : userId;
    return await db().collection<UserDoc>("users").updateOne(
        { _id },
        { $push: { sessions: session }, $set: { updatedAt: new Date() } }
    );
}

async function savePasswordResetToken(userId: string | ObjectId, resetPasswordTokenHash: string, resetPasswordExpiresAt: Date) {
    const _id = typeof userId === "string" ? new ObjectId(userId) : userId;
    return await db().collection<UserDoc>("users").updateOne(
        { _id },
        { $set: { resetPasswordTokenHash, resetPasswordExpiresAt, updatedAt: new Date() } }
    );
}

async function findUserByResetToken(resetPasswordTokenHash: string): Promise<WithId<UserDoc> | null> {
    return await db().collection<UserDoc>("users").findOne({
        resetPasswordTokenHash,
        resetPasswordExpiresAt: { $gt: new Date() }
    }) as WithId<UserDoc> | null;
}

async function resetUserPassword(userId: string | ObjectId, resetPasswordTokenHash: string, newPasswordHash: string) {
    const _id = typeof userId === "string" ? new ObjectId(userId) : userId;
    return await db().collection<UserDoc>("users").updateOne(
        { _id, resetPasswordTokenHash, resetPasswordExpiresAt: { $gt: new Date() } },
        {
            $set: { password: newPasswordHash, sessions: [], updatedAt: new Date() },
            $unset: { resetPasswordTokenHash: "", resetPasswordExpiresAt: "" }
        }
    );
}

async function removeSession(userId: string | ObjectId, tokenHash: string) {
    const _id = typeof userId === "string" ? new ObjectId(userId) : userId;
    return await db().collection<UserDoc>("users").updateOne(
        { _id },
        {
            $pull: { sessions: { refreshTokenHash: tokenHash } } as any,
            $set: { updatedAt: new Date() }
        }
    );
}

async function findUserById(userId: string | ObjectId): Promise<WithId<UserDoc> | null> {
    const _id = typeof userId === "string" ? new ObjectId(userId) : userId;
    return await db().collection<UserDoc>("users").findOne(
        { _id },
        { projection: { password: 0, sessions: 0, resetPasswordTokenHash: 0, resetPasswordExpiresAt: 0, otpHash: 0, otpExpiresAt: 0 } }
    ) as WithId<UserDoc> | null;
}

async function verifyUserOtp(userId: string | ObjectId) {
    const _id = typeof userId === "string" ? new ObjectId(userId) : userId;
    return await db().collection<UserDoc>("users").updateOne(
        { _id },
        {
            $set: { isVerified: true, updatedAt: new Date() },
            $unset: { otpHash: "", otpExpiresAt: "" }
        }
    );
}

async function updateUser(userId: string | ObjectId, name: string) {
    const _id = typeof userId === "string" ? new ObjectId(userId) : userId;
    return await db().collection<UserDoc>("users").updateOne(
        { _id },
        { $set: { name, updatedAt: new Date() } }
    );
}

async function updateUnverifiedUser(userId: string | ObjectId, updateData: Partial<UserDoc>) {
    const _id = typeof userId === "string" ? new ObjectId(userId) : userId;
    return await db().collection<UserDoc>("users").updateOne(
        { _id },
        { $set: { ...updateData, updatedAt: new Date() } }
    );
}

async function findUsersByIds(userIds: (string | ObjectId)[]): Promise<WithId<UserDoc>[]> {
    const validObjectIds = userIds
        .filter(id => id && ObjectId.isValid(id))
        .map(id => typeof id === "string" ? new ObjectId(id) : id);
    return await db().collection<UserDoc>("users").find({
        _id: { $in: validObjectIds }
    }).toArray() as WithId<UserDoc>[];
}

export {
    findUsersByIds,
    findUserByEmail,
    findUserById,
    registerUser,
    updateUnverifiedUser,
    addSession,
    updateUser,
    verifyUserOtp,
    savePasswordResetToken,
    findUserByResetToken,
    resetUserPassword,
    removeSession
};
