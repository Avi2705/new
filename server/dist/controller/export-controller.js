import axios from "axios";
import ApiHandler from "../utils/error-handler.js";
const getCronBaseUrl = () => process.env.CRON_SERVICE_URL || "http://localhost:8001";
export async function exportVendorProductsController(req, res) {
    try {
        const { vendorId } = req.body;
        if (!vendorId) {
            throw new ApiHandler(400, "vendorId is required");
        }
        const cronResponse = await axios.post(`${getCronBaseUrl()}/api/v1/cron/export`, {
            vendorId
        }, {
            timeout: 10000
        });
        const data = cronResponse.data;
        const jobId = data?.job?.jobId;
        return res.status(cronResponse.status || 202).json({
            success: true,
            message: "Export job queued successfully. The background worker is starting the export cycle.",
            job: {
                jobId,
                vendorId: data?.job?.vendorId || vendorId,
                status: data?.job?.status || "queued",
                operation: data?.job?.operation,
                checkStatusUrl: `/api/v1/export/status/${jobId}`,
                downloadUrl: `/api/v1/export/download/${jobId}`,
                createdAt: data?.job?.createdAt
            }
        });
    }
    catch (err) {
        if (err.response) {
            return res.status(err.response.status).json(err.response.data);
        }
        return res.status(err.statusCode || 500).json({
            message: err.message || "Failed to trigger export in cron service"
        });
    }
}
export async function getExportJobStatusController(req, res) {
    try {
        const { jobId } = req.params;
        if (!jobId) {
            throw new ApiHandler(400, "jobId is required");
        }
        const cronResponse = await axios.get(`${getCronBaseUrl()}/api/v1/cron/status/${jobId}`, {
            timeout: 10000
        });
        const data = cronResponse.data;
        if (data?.job) {
            data.job.checkStatusUrl = `/api/v1/export/status/${jobId}`;
            data.job.downloadUrl = `/api/v1/export/download/${jobId}`;
        }
        return res.status(cronResponse.status || 200).json(data);
    }
    catch (err) {
        if (err.response) {
            return res.status(err.response.status).json(err.response.data);
        }
        return res.status(err.statusCode || 500).json({
            message: err.message || "Failed to fetch export job status"
        });
    }
}
export async function getJobs(_req, res) {
    try {
        const jobs = await axios.get(`${getCronBaseUrl()}/api/v1/cron/jobs`);
        return res.status(200).json(jobs?.data);
    }
    catch {
        return res.status(400).json({ message: "No Jobs Found" });
    }
}
export async function downloadExportZipController(req, res) {
    try {
        const { jobId } = req.params;
        if (!jobId) {
            throw new ApiHandler(400, "jobId is required");
        }
        const cronResponse = await axios.get(`${getCronBaseUrl()}/api/v1/cron/download/${jobId}`, {
            responseType: "stream",
            timeout: 30000
        });
        if (cronResponse.headers["content-disposition"]) {
            res.setHeader("Content-Disposition", cronResponse.headers["content-disposition"]);
        }
        if (cronResponse.headers["content-type"]) {
            res.setHeader("Content-Type", String(cronResponse.headers["content-type"]));
        }
        return cronResponse.data.pipe(res);
    }
    catch (err) {
        if (err.response) {
            return res.status(err.response.status).json({ message: "Download failed or file not ready" });
        }
        return res.status(err.statusCode || 500).json({
            message: err.message || "Failed to stream download from cron service"
        });
    }
}
//# sourceMappingURL=export-controller.js.map