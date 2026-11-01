import path from "node:path";
import type { Request, Response } from "express";
import {
    requestVendorExport,
    getJobStatus,
    getAllJobs,
    getZipDownloadPath
} from "../service/export-service.js";

export async function createExportJobController(req: Request, res: Response) {
    try {
        const { vendorId } = req.body;
        if (!vendorId) {
            return res.status(400).json({ error: "vendorId is required in request body" });
        }
        const job = await requestVendorExport(vendorId);
        return res.status(202).json({
            success: true,
            message: "Export job queued successfully. The background worker is starting the export cycle.",
            job
        });
    } catch (err: any) {
        return res.status(400).json({ error: err?.message || "Failed to create export job" });
    }
}

export async function getAllJobsController(_req: Request, res: Response) {
    try {
        const jobs = await getAllJobs();
        return res.status(200).json({ jobs });
    } catch (err: any) {
        return res.status(500).json({ error: err?.message || "Failed to fetch jobs" });
    }
}

export async function getJobStatusController(req: Request, res: Response) {
    try {
        const { jobId } = req.params;
        if (!jobId) {
            return res.status(400).json({ error: "jobId is required" });
        }
        const status = await getJobStatus(jobId);
        return res.status(200).json({ job: status });
    } catch (err: any) {
        return res.status(404).json({ error: err?.message || "Failed to fetch job status" });
    }
}

export async function downloadZipController(req: Request, res: Response) {
    try {
        const { jobId } = req.params;
        if (!jobId) {
            return res.status(400).json({ error: "jobId is required" });
        }
        const zipPath = await getZipDownloadPath(jobId);
        const filename = path.basename(zipPath);

        res.setHeader("Content-Type", "application/zip");
        res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);

        return res.sendFile(path.resolve(zipPath));
    } catch (err: any) {
        return res.status(400).json({ error: err?.message || "Failed to download zip" });
    }
}

export const cronController = {
    createExportJobController,
    getAllJobsController,
    getJobStatusController,
    downloadZipController
};
