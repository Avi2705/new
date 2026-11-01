import { ObjectId } from "mongodb";
import type { UserRegistrationInput, UserLoginInput, UserDoc } from "../model/user.model.js";
declare function registerUserService(userData: UserRegistrationInput): Promise<{
    message: string;
}>;
declare function verifyOtpService(email: string, otpInput: string | number): Promise<{
    message: string;
}>;
declare function loginUserService(userData: UserLoginInput): Promise<{
    user: {
        id: ObjectId;
        name: string;
        email: string;
    };
    accessToken: string;
    refreshToken: string;
}>;
declare function forgotPasswordService(email: string): Promise<void>;
declare function resetPasswordService(token: string, newPassword: string): Promise<boolean>;
declare function logoutUserService(refreshToken?: string | null, accessToken?: string | null): Promise<void>;
declare function getUserProfileService(userId: string | ObjectId): Promise<import("mongodb").WithId<UserDoc>>;
declare function updateProfileService(userId: string | ObjectId, name: string): Promise<{
    _id: ObjectId;
    email: string;
    password?: string;
    isVerified?: boolean;
    sessions?: import("../model/user.model.js").SessionInfo[];
    otpHash?: string | null;
    otpExpiresAt?: Date | null;
    resetPasswordTokenHash?: string | null;
    resetPasswordExpiresAt?: Date | null;
    createdAt?: Date;
    updatedAt?: Date;
    name: string;
}>;
declare function getUsersByIds(userIds: (string | ObjectId)[]): Promise<import("mongodb").WithId<UserDoc>[]>;
export { getUsersByIds, registerUserService, verifyOtpService, loginUserService, forgotPasswordService, resetPasswordService, logoutUserService, getUserProfileService, updateProfileService };
//# sourceMappingURL=user-service.d.ts.map