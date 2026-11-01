import express, {} from "express";
import { cronController } from "../controller/cron-controller.js";
import { validateRequest } from "../middleware/validation-middleware.js";
import { exportJobSchema } from "../schemas/cron-job-schema.js";
const router = express.Router();
router.post("/export", validateRequest(exportJobSchema), cronController.createExportJobController);
router.get("/jobs", cronController.getAllJobsController);
router.get("/status/:jobId", cronController.getJobStatusController);
router.get("/download/:jobId", cronController.downloadZipController);
export default router;
//# sourceMappingURL=cron-routes.js.map