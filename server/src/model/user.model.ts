import type { ObjectId } from "mongodb";

export interface SessionInfo {
    accessTokenHash: string;
    accessTokenExpiresAt: Date;
    refreshTokenHash: string;
    refreshTokenExpiresAt: Date;
    createdAt?: Date;
}

export interface UserDoc {
    _id?: ObjectId;
    name: string;
    email: string;
    password?: string;
    isVerified?: boolean;
    sessions?: SessionInfo[];
    otpHash?: string | null;
    otpExpiresAt?: Date | null;
    resetPasswordTokenHash?: string | null;
    resetPasswordExpiresAt?: Date | null;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface UserRegistrationInput {
    name: string;
    email: string;
    password: string;
}

export interface UserLoginInput {
    email: string;
    password: string;
}

export interface UserProfileResponse {
    _id?: ObjectId | string;
    name: string;
    email: string;
    isVerified?: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}
