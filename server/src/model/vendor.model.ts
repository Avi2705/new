import type { ObjectId } from "mongodb";
import type { SessionInfo } from "./user.model.js";

export interface LatestExportInfo {
    jobId: string;
    zipPath: string;
    status: string;
    totalProducts: number;
    finishedAt: Date;
    updatedAt?: Date;
}

export interface VendorDoc {
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
    latestExport?: LatestExportInfo;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface VendorRegistrationInput {
    name: string;
    email: string;
    password: string;
}

export interface VendorLoginInput {
    email: string;
    password: string;
}

export interface VendorProfileResponse {
    _id?: ObjectId | string;
    name: string;
    email: string;
    isVerified?: boolean;
    latestExport?: LatestExportInfo;
    createdAt?: Date;
    updatedAt?: Date;
}
