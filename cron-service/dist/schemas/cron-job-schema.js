import Joi from "joi";
export const JOB_STATUS = Object.freeze({
    QUEUED: "queued",
    RUNNING: "running",
    FINISHED: "finish",
    CANCELLED: "cancel"
});
export const exportJobSchema = Joi.object({
    vendorId: Joi.string().hex().length(24).required()
});
//# sourceMappingURL=cron-job-schema.js.map