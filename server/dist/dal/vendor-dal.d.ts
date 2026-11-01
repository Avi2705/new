import { ObjectId, type WithId } from "mongodb";
import type { VendorDoc } from "../model/vendor.model.js";
declare function findUserByEmail(email: string): Promise<WithId<VendorDoc> | null>;
declare function findVendorById(vendorId: string | ObjectId): Promise<WithId<VendorDoc> | null>;
declare function registerUser(userData: VendorDoc): Promise<import("mongodb").InsertOneResult<VendorDoc>>;
declare function verifyVendorOtp(vendorId: string | ObjectId): Promise<import("mongodb").UpdateResult<VendorDoc>>;
declare function updateVendor(vendorId: string | ObjectId, name: string): Promise<import("mongodb").UpdateResult<VendorDoc>>;
declare function addSession(userId: string | ObjectId, accessTokenHash: string, accessTokenExpiresAt: Date, refreshTokenHash: string, refreshTokenExpiresAt: Date): Promise<import("mongodb").UpdateResult<VendorDoc>>;
declare function savePasswordResetToken(userId: string | ObjectId, resetPasswordTokenHash: string, resetPasswordExpiresAt: Date): Promise<import("mongodb").UpdateResult<VendorDoc>>;
declare function findUserByResetToken(resetPasswordTokenHash: string): Promise<WithId<VendorDoc> | null>;
declare function resetUserPassword(userId: string | ObjectId, resetPasswordTokenHash: string, newPasswordHash: string): Promise<import("mongodb").UpdateResult<VendorDoc>>;
declare function removeSession(userId: string | ObjectId, tokenHash: string): Promise<import("mongodb").UpdateResult<VendorDoc>>;
declare function updateUnverifiedVendor(vendorId: string | ObjectId, updateData: Partial<VendorDoc>): Promise<import("mongodb").UpdateResult<VendorDoc>>;
export { findUserByEmail, findVendorById, registerUser, updateUnverifiedVendor, verifyVendorOtp, updateVendor, addSession, savePasswordResetToken, findUserByResetToken, resetUserPassword, removeSession };
//# sourceMappingURL=vendor-dal.d.ts.map