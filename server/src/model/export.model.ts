export interface ExportJobRequest {
    vendorId: string;
}

export interface ExportJobResponse {
    success: boolean;
    message: string;
    job: {
        jobId: string;
        vendorId: string;
        status: string;
        operation?: string;
        checkStatusUrl: string;
        downloadUrl: string;
        createdAt?: Date | string;
    };
}
