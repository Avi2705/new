import express, { type Router } from "express";
import {
    exportVendorProductsController,
    getExportJobStatusController,
    downloadExportZipController,
    getJobs
} from "../controller/export-controller.js";

const exportRouter: Router = express.Router();

exportRouter.post("/", exportVendorProductsController);

exportRouter.get("/jobs", getJobs);

exportRouter.get("/status/:jobId", getExportJobStatusController);

exportRouter.get("/download/:jobId", downloadExportZipController);

export default exportRouter;
