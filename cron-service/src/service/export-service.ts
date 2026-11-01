import fs from "node:fs";
import path from "node:path";
import { ObjectId, type WithId } from "mongodb";
import {
    createExportJob,
    claimNextQueuedJob,
    findJobById,
    listAllJobs,
    updateJobProgress,
    markJobFinished,
    markJobCancelledDueToError,
    type CronJobDoc
} from "../dal/cron-job-dal.js";
import { JOB_STATUS } from "../schemas/cron-job-schema.js";
import {
    findVendorProducts,
    findActivePriceByProductId,
    findReviewsByProductId,
    findOrdersByProductId,
    findUsersByIds,
    updateVendorLatestExport,
    findVendorById
} from "../dal/ecommerce-dal.js";
import { generateProductCsv } from "./csv-service.js";
import { createZip } from "./zip-service.js";
import type {
    JobListItem,
    JobStatusResponse,
    ProcessJobResponse,
    VendorExportResponse
} from "../model/export.js";

function getStorageBaseDir(): string {
    return path.resolve(process.env.EXPORT_STORAGE_DIR || "./storage/exports");
}

export async function requestVendorExport(vendorId: string | ObjectId): Promise<VendorExportResponse> {
    if (!vendorId || (typeof vendorId === "string" && !ObjectId.isValid(vendorId))) {
        throw new Error("Invalid vendor ID");
    }
    const vendor = await findVendorById(vendorId);
    if (!vendor) {
        throw new Error(`Vendor with ID ${vendorId.toString()} not found in database`);
    }
    const job = await createExportJob(vendorId);
    return {
        jobId: job._id.toString(),
        vendorId: job.vendorId.toString(),
        status: job.status,
        operation: "Fetch all vendor products, active prices, customer comments, and buyer orders directly from ecommerce database, convert each product to <productName>-<uniqueId>.csv, bundle them into a .zip archive, and store in cron database",
        checkStatusUrl: `/api/v1/cron/status/${job._id.toString()}`,
        downloadUrl: `/api/v1/cron/download/${job._id.toString()}`,
        createdAt: job.createdAt
    };
}

export async function getJobStatus(jobId: string | ObjectId): Promise<JobStatusResponse> {
    if (!jobId || (typeof jobId === "string" && !ObjectId.isValid(jobId))) {
        throw new Error("Invalid job ID");
    }
    const job = await findJobById(jobId);
    if (!job) {
        throw new Error("Job not found");
    }
    return {
        jobId: job._id.toString(),
        vendorId: job.vendorId.toString(),
        status: job.status,
        progress: job.progress,
        totalProducts: job.totalProducts,
        processedProducts: job.processedProducts,
        zipPath: job.zipPath,
        error: job.error,
        createdAt: job.createdAt,
        claimedAt: job.claimedAt,
        finishedAt: job.finishedAt
    };
}

export async function getAllJobs(): Promise<JobListItem[]> {
    const jobs = await listAllJobs();
    return jobs.map((j: WithId<CronJobDoc>) => ({
        jobId: j._id.toString(),
        status: j.status,
        progress: j.progress,
        totalProducts: j.totalProducts,
        zipPath: j.zipPath,
        error: j.error,
        createdAt: j.createdAt,
        finishedAt: j.finishedAt
    }));
}

export async function getZipDownloadPath(jobId: string | ObjectId): Promise<string> {
    if (!jobId || (typeof jobId === "string" && !ObjectId.isValid(jobId))) {
        throw new Error("Invalid job ID");
    }
    const job = await findJobById(jobId);
    if (!job) {
        throw new Error("Job not found");
    }

    if (job.status !== JOB_STATUS.FINISHED) {
        throw new Error(`Job is not finished yet. Current status: ${job.status}`);
    }

    let targetZipPath: string | null = null;
    const vendor = await findVendorById(job.vendorId);
    if (vendor?.latestExport?.zipPath && fs.existsSync(vendor.latestExport.zipPath)) {
        targetZipPath = vendor.latestExport.zipPath;
    } else if (job.zipPath && fs.existsSync(job.zipPath)) {
        targetZipPath = job.zipPath;
    }

    if (!targetZipPath) {
        throw new Error("ZIP archive file not found on disk");
    }

    return targetZipPath;
}

export async function processJob(jobId: string | ObjectId): Promise<ProcessJobResponse> {
    const job = await findJobById(jobId);
    if (!job) {
        throw new Error("Job not found");
    }

    const vendorId = job.vendorId;
    const baseDir = getStorageBaseDir();
    const jobDir = path.join(baseDir, jobId.toString());
    const csvDir = path.join(jobDir, "csv");
    const zipPath = path.join(jobDir, `vendor-${vendorId.toString()}-export-${jobId.toString()}.zip`);

    try {
        await fs.promises.mkdir(csvDir, { recursive: true });

        const products = await findVendorProducts(vendorId);
        const totalProducts = products.length;

        await updateJobProgress(jobId, 0, totalProducts);

        if (totalProducts === 0) {
            throw new Error(`Vendor ${vendorId.toString()} has 0 products to export`);
        }

        const csvPaths: string[] = [];
        let processedCount = 0;

        for (const product of products) {
            const productId = product._id;

            const [activePrice, comments, orders] = await Promise.all([
                findActivePriceByProductId(productId),
                findReviewsByProductId(productId),
                findOrdersByProductId(productId)
            ]);

            const allUserIds = [
                ...new Set([
                    ...comments.map((c: any) => c.userId?.toString()).filter(Boolean),
                    ...orders.map((o: any) => o.userId?.toString()).filter(Boolean)
                ])
            ];

            const users = allUserIds.length > 0 ? await findUsersByIds(allUserIds) : [];
            const userMap = new Map(users.map((u: any) => [u._id.toString(), u]));

            const productData = {
                product,
                activePrice,
                comments: comments.map((comment: any) => ({
                    ...comment,
                    user: userMap.get(comment.userId?.toString()) ?? null
                })),
                orders: orders.map((order: any) => ({
                    ...order,
                    buyer: userMap.get(order.userId?.toString()) ?? null
                }))
            };

            const csvFilePath = await generateProductCsv(productData, csvDir, vendorId.toString());
            csvPaths.push(csvFilePath);

            processedCount++;
            if (processedCount % 5 === 0 || processedCount === totalProducts) {
                await updateJobProgress(jobId, processedCount, totalProducts);
            }
        }

        await createZip(csvPaths, zipPath);

        try {
            await fs.promises.rm(csvDir, { recursive: true, force: true });
        } catch {
        }

        await markJobFinished(jobId, zipPath, totalProducts);

        try {
            await updateVendorLatestExport(vendorId, {
                jobId: jobId.toString(),
                zipPath,
                status: JOB_STATUS.FINISHED,
                totalProducts,
                finishedAt: new Date()
            });
        } catch {
        }

        return {
            jobId: jobId.toString(),
            status: JOB_STATUS.FINISHED,
            totalProducts
        };
    } catch (err: any) {
        const message = err?.message || "Operation failed";
        await markJobCancelledDueToError(jobId, message);
        try {
            if (fs.existsSync(jobDir)) {
                await fs.promises.rm(jobDir, { recursive: true, force: true });
            }
        } catch {
        }
        throw err;
    }
}

export async function processNextQueuedJob(): Promise<ProcessJobResponse | null> {
    const claimedJob = await claimNextQueuedJob();
    if (!claimedJob) {
        return null;
    }
    return await processJob(claimedJob._id);
}
