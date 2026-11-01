import { ObjectId, type WithId } from "mongodb";
import type { UserDoc } from "../model/user.model.js";
declare function findUserByEmail(email: string): Promise<WithId<UserDoc> | null>;
declare function registerUser(userData: UserDoc): Promise<import("mongodb").InsertOneResult<UserDoc>>;
declare function addSession(userId: string | ObjectId, accessTokenHash: string, accessTokenExpiresAt: Date, refreshTokenHash: string, refreshTokenExpiresAt: Date): Promise<import("mongodb").UpdateResult<UserDoc>>;
declare function savePasswordResetToken(userId: string | ObjectId, resetPasswordTokenHash: string, resetPasswordExpiresAt: Date): Promise<import("mongodb").UpdateResult<UserDoc>>;
declare function findUserByResetToken(resetPasswordTokenHash: string): Promise<WithId<UserDoc> | null>;
declare function resetUserPassword(userId: string | ObjectId, resetPasswordTokenHash: string, newPasswordHash: string): Promise<import("mongodb").UpdateResult<UserDoc>>;
declare function removeSession(userId: string | ObjectId, tokenHash: string): Promise<import("mongodb").UpdateResult<UserDoc>>;
declare function findUserById(userId: string | ObjectId): Promise<WithId<UserDoc> | null>;
declare function verifyUserOtp(userId: string | ObjectId): Promise<import("mongodb").UpdateResult<UserDoc>>;
declare function updateUser(userId: string | ObjectId, name: string): Promise<import("mongodb").UpdateResult<UserDoc>>;
declare function updateUnverifiedUser(userId: string | ObjectId, updateData: Partial<UserDoc>): Promise<import("mongodb").UpdateResult<UserDoc>>;
declare function findUsersByIds(userIds: (string | ObjectId)[]): Promise<WithId<UserDoc>[]>;
export { findUsersByIds, findUserByEmail, findUserById, registerUser, updateUnverifiedUser, addSession, updateUser, verifyUserOtp, savePasswordResetToken, findUserByResetToken, resetUserPassword, removeSession };
//# sourceMappingURL=user-dal.d.ts.map