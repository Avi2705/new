import { ObjectId, type WithId, type Document } from "mongodb";
import { getCronDb } from "../config/db.js";
import { JOB_STATUS } from "../schemas/cron-job-schema.js";

function db() {
    return getCronDb();
}

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

export async function createExportJob(vendorId: string | ObjectId): Promise<WithId<CronJobDoc>> {
    const _vendorId = typeof vendorId === "string" ? new ObjectId(vendorId) : vendorId;
    const doc: CronJobDoc = {
        vendorId: _vendorId,
        zipPath: null,
        status: JOB_STATUS.QUEUED,
        progress: 0,
        totalProducts: 0,
        processedProducts: 0,
        error: null,
        claimedAt: null,
        finishedAt: null,
        createdAt: new Date(),
        updatedAt: new Date()
    };
    const result = await db().collection<CronJobDoc>("cron_jobs").insertOne(doc);
    return { _id: result.insertedId, ...doc };
}

export async function claimNextQueuedJob(): Promise<WithId<CronJobDoc> | null> {
    const now = new Date();
    const staleDate = new Date(now.getTime() - 15 * 60 * 1000);

    const filter = {
        $or: [
            { status: JOB_STATUS.QUEUED },
            {
                status: JOB_STATUS.RUNNING,
                claimedAt: { $lt: staleDate }
            }
        ]
    };

    const update = {
        $set: {
            status: JOB_STATUS.RUNNING,
            claimedAt: now,
            updatedAt: now
        }
    };

    const result = await db().collection<CronJobDoc>("cron_jobs").findOneAndUpdate(
        filter,
        update,
        {
            sort: { createdAt: 1 },
            returnDocument: "after"
        }
    );

    return result as WithId<CronJobDoc> | null;
}

export async function findJobById(jobId: string | ObjectId): Promise<WithId<CronJobDoc> | null> {
    if (!jobId) return null;
    if (typeof jobId === "string" && !ObjectId.isValid(jobId)) return null;
    const _id = typeof jobId === "string" ? new ObjectId(jobId) : jobId;
    return await db().collection<CronJobDoc>("cron_jobs").findOne({ _id });
}

export async function listAllJobs(): Promise<WithId<CronJobDoc>[]> {
    return await db().collection<CronJobDoc>("cron_jobs").find().toArray();
}

export async function updateJobProgress(jobId: string | ObjectId, processedProducts: number, totalProducts: number) {
    const _id = typeof jobId === "string" ? new ObjectId(jobId) : jobId;
    const progress = totalProducts > 0 ? Math.round((processedProducts / totalProducts) * 100) : 0;
    return await db().collection<CronJobDoc>("cron_jobs").updateOne(
        { _id },
        {
            $set: {
                progress,
                processedProducts,
                totalProducts,
                updatedAt: new Date()
            }
        }
    );
}

export async function markJobFinished(jobId: string | ObjectId, zipPath: string, totalProducts: number) {
    const _id = typeof jobId === "string" ? new ObjectId(jobId) : jobId;
    return await db().collection<CronJobDoc>("cron_jobs").updateOne(
        { _id },
        {
            $set: {
                status: JOB_STATUS.FINISHED,
                progress: 100,
                processedProducts: totalProducts,
                totalProducts,
                zipPath,
                finishedAt: new Date(),
                updatedAt: new Date()
            }
        }
    );
}

export async function markJobCancelledDueToError(jobId: string | ObjectId, errorMessage: string) {
    const _id = typeof jobId === "string" ? new ObjectId(jobId) : jobId;
    return await db().collection<CronJobDoc>("cron_jobs").updateOne(
        { _id },
        {
            $set: {
                status: JOB_STATUS.CANCELLED,
                error: errorMessage,
                finishedAt: new Date(),
                updatedAt: new Date()
            }
        }
    );
}
