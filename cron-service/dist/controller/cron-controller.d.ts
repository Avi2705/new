import type { Request, Response } from "express";
export declare function createExportJobController(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
export declare function getAllJobsController(_req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
export declare function getJobStatusController(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
export declare function downloadZipController(req: Request, res: Response): Promise<void | Response<any, Record<string, any>>>;
export declare const cronController: {
    createExportJobController: typeof createExportJobController;
    getAllJobsController: typeof getAllJobsController;
    getJobStatusController: typeof getJobStatusController;
    downloadZipController: typeof downloadZipController;
};
//# sourceMappingURL=cron-controller.d.ts.map