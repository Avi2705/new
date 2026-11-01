import { ObjectId } from "mongodb";
import type { VendorRegistrationInput, VendorLoginInput, VendorDoc } from "../model/vendor.model.js";
declare function registerVendorService(vendorData: VendorRegistrationInput): Promise<{
    message: string;
}>;
declare function verifyVendorOtpService(email: string, otpInput: string | number): Promise<{
    message: string;
}>;
declare function loginVendorService(vendorData: VendorLoginInput): Promise<{
    vendor: {
        id: ObjectId;
        name: string;
        email: string;
    };
    accessToken: string;
    refreshToken: string;
}>;
declare function forgotPasswordVendorService(email: string): Promise<void>;
declare function resetPasswordVendorService(token: string, newPassword: string): Promise<boolean>;
declare function logoutVendorService(refreshToken?: string | null, accessToken?: string | null): Promise<void>;
declare function getVendorProfileService(vendorId: string | ObjectId): Promise<import("mongodb").WithId<VendorDoc>>;
declare function updateVendorProfileService(vendorId: string | ObjectId, name: string): Promise<{
    _id: ObjectId;
    email: string;
    password?: string;
    isVerified?: boolean;
    sessions?: import("../model/user.model.js").SessionInfo[];
    otpHash?: string | null;
    otpExpiresAt?: Date | null;
    resetPasswordTokenHash?: string | null;
    resetPasswordExpiresAt?: Date | null;
    latestExport?: import("../model/vendor.model.js").LatestExportInfo;
    createdAt?: Date;
    updatedAt?: Date;
    name: string;
}>;
export { registerVendorService, verifyVendorOtpService, loginVendorService, forgotPasswordVendorService, resetPasswordVendorService, logoutVendorService, getVendorProfileService, updateVendorProfileService };
//# sourceMappingURL=vendor-service.d.ts.map