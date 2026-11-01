import { ObjectId, type WithId } from "mongodb";
export interface CronJobDoc {
    _id?: ObjectId;
    vendorId: ObjectId;
    zipPath: string | null;
    status: string;
    progress: number;
    totalProducts: number;
    processedProducts: number;
    error: string | null;
    claimedAt: Date | null;
    finishedAt: Date | null;
    createdAt: Date;
    updatedAt: Date;
}
export declare function createExportJob(vendorId: string | ObjectId): Promise<WithId<CronJobDoc>>;
export declare function claimNextQueuedJob(): Promise<WithId<CronJobDoc> | null>;
export declare function findJobById(jobId: string | ObjectId): Promise<WithId<CronJobDoc> | null>;
export declare function listAllJobs(): Promise<WithId<CronJobDoc>[]>;
export declare function updateJobProgress(jobId: string | ObjectId, processedProducts: number, totalProducts: number): Promise<import("mongodb").UpdateResult<CronJobDoc>>;
export declare function markJobFinished(jobId: string | ObjectId, zipPath: string, totalProducts: number): Promise<import("mongodb").UpdateResult<CronJobDoc>>;
export declare function markJobCancelledDueToError(jobId: string | ObjectId, errorMessage: string): Promise<import("mongodb").UpdateResult<CronJobDoc>>;
//# sourceMappingURL=cron-job-dal.d.ts.map