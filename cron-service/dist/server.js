import dotenv from "dotenv";
import express from "express";
import cron from "node-cron";
import { connectDbs } from "./config/db.js";
import cronRoutes from "./routes/cron-routes.js";
import { processNextQueuedJob } from "./service/export-service.js";
dotenv.config();
const app = express();
const PORT = Number(process.env.PORT) || 8001;
const CRON_INTERVAL = process.env.CRON_INTERVAL || "*/10 * * * * *";
app.use(express.json());
app.get("/health", (req, res) => {
    res.status(200).json({
        service: "cron-service",
        status: "up",
        cronDb: process.env.CRON_DB_NAME || "cron_service_db",
        ecommerceBaseUrl: process.env.ECOMMERCE_BASE_URL || "http://localhost:8000",
        cronInterval: CRON_INTERVAL
    });
});
app.use("/api/v1/cron", cronRoutes);
let isCronRunning = false;
async function runCronCycle() {
    if (isCronRunning) {
        return;
    }
    isCronRunning = true;
    try {
        let jobResult = await processNextQueuedJob();
        while (jobResult) {
            jobResult = await processNextQueuedJob();
        }
    }
    catch (err) {
        console.error("[Cron Scheduler Error]", err);
    }
    finally {
        isCronRunning = false;
    }
}
async function startCronService() {
    try {
        await connectDbs();
        const task = cron.schedule(CRON_INTERVAL, async () => {
            await runCronCycle();
        });
        app.listen(PORT, () => {
            console.log(`[Cron Service] Listening on port ${PORT}`);
            console.log(`[Cron Service] Ecommerce Base URL: ${process.env.ECOMMERCE_BASE_URL || "http://localhost:8000"}`);
            console.log(`[Cron Service] Cron DB: ${process.env.CRON_DB_NAME || "cron_service_db"}`);
            console.log(`[Cron Service] Background scheduler interval: ${CRON_INTERVAL}`);
        });
        process.on("SIGINT", () => {
            task.stop();
            process.exit(0);
        });
    }
    catch (err) {
        console.error("[Cron Service Startup Error]:", err);
        process.exit(1);
    }
}
startCronService();
//# sourceMappingURL=server.js.map