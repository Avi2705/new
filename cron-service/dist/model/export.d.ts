export interface BaseJob {
    jobId: string;
    status: string;
}
export interface JobProgressInfo {
    progress: number;
    totalProducts: number;
    processedProducts?: number;
}
export interface JobExecutionDetails {
    zipPath?: string | null;
    error?: string | null;
    createdAt?: Date;
    claimedAt?: Date | null;
    finishedAt?: Date | null;
}
export interface VendorExportResponse extends BaseJob {
    vendorId: string;
    operation: string;
    checkStatusUrl: string;
    downloadUrl?: string;
    createdAt: Date;
}
export interface JobStatusResponse extends BaseJob, JobProgressInfo, JobExecutionDetails {
    vendorId: string;
    createdAt: Date;
    processedProducts: number;
}
export interface JobListItem extends BaseJob, JobProgressInfo, JobExecutionDetails {
    createdAt: Date;
}
export interface ProcessJobResponse extends BaseJob {
    totalProducts: number;
}
export interface CsvProductRow {
    productId: string;
    productName: string;
    commentId: string;
    commenterUserId: string;
    commenterName: string;
    commenterEmail: string;
    commentText: string;
    commentRating: string | number;
    commentCreatedAt: string;
}
export interface ProductDataPayload {
    product: any;
    activePrice?: any;
    comments?: any[];
    orders?: any[];
}
//# sourceMappingURL=export.d.ts.map