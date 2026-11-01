import { ObjectId } from "mongodb";
import { getCronDb } from "../config/db.js";
import { JOB_STATUS } from "../schemas/cron-job-schema.js";
function db() {
    return getCronDb();
}
export async function createExportJob(vendorId) {
    const _vendorId = typeof vendorId === "string" ? new ObjectId(vendorId) : vendorId;
    const doc = {
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
    const result = await db().collection("cron_jobs").insertOne(doc);
    return { _id: result.insertedId, ...doc };
}
export async function claimNextQueuedJob() {
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
    const result = await db().collection("cron_jobs").findOneAndUpdate(filter, update, {
        sort: { createdAt: 1 },
        returnDocument: "after"
    });
    return result;
}
export async function findJobById(jobId) {
    if (!jobId)
        return null;
    if (typeof jobId === "string" && !ObjectId.isValid(jobId))
        return null;
    const _id = typeof jobId === "string" ? new ObjectId(jobId) : jobId;
    return await db().collection("cron_jobs").findOne({ _id });
}
export async function listAllJobs() {
    return await db().collection("cron_jobs").find().toArray();
}
export async function updateJobProgress(jobId, processedProducts, totalProducts) {
    const _id = typeof jobId === "string" ? new ObjectId(jobId) : jobId;
    const progress = totalProducts > 0 ? Math.round((processedProducts / totalProducts) * 100) : 0;
    return await db().collection("cron_jobs").updateOne({ _id }, {
        $set: {
            progress,
            processedProducts,
            totalProducts,
            updatedAt: new Date()
        }
    });
}
export async function markJobFinished(jobId, zipPath, totalProducts) {
    const _id = typeof jobId === "string" ? new ObjectId(jobId) : jobId;
    return await db().collection("cron_jobs").updateOne({ _id }, {
        $set: {
            status: JOB_STATUS.FINISHED,
            progress: 100,
            processedProducts: totalProducts,
            totalProducts,
            zipPath,
            finishedAt: new Date(),
            updatedAt: new Date()
        }
    });
}
export async function markJobCancelledDueToError(jobId, errorMessage) {
    const _id = typeof jobId === "string" ? new ObjectId(jobId) : jobId;
    return await db().collection("cron_jobs").updateOne({ _id }, {
        $set: {
            status: JOB_STATUS.CANCELLED,
            error: errorMessage,
            finishedAt: new Date(),
            updatedAt: new Date()
        }
    });
}
//# sourceMappingURL=cron-job-dal.js.map