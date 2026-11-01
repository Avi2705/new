import { ObjectId } from "mongodb";
import type { JobListItem, JobStatusResponse, ProcessJobResponse, VendorExportResponse } from "../model/export.js";
export declare function requestVendorExport(vendorId: string | ObjectId): Promise<VendorExportResponse>;
export declare function getJobStatus(jobId: string | ObjectId): Promise<JobStatusResponse>;
export declare function getAllJobs(): Promise<JobListItem[]>;
export declare function getZipDownloadPath(jobId: string | ObjectId): Promise<string>;
export declare function processJob(jobId: string | ObjectId): Promise<ProcessJobResponse>;
export declare function processNextQueuedJob(): Promise<ProcessJobResponse | null>;
//# sourceMappingURL=export-service.d.ts.map