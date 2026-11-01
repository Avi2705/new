import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDb from "./config/db.js";
import cookieParser from "cookie-parser";
import errorMiddleware from "./middleware/error-middlware.js";
import userRouter from "./routes/user-routes.js";
import vendorRouter from "./routes/vendor-routes.js";
import productRouter from "./routes/product-routes.js";
import priceRouter from "./routes/price-routes.js";
import orderRouter from "./routes/order-routes.js";
import cartRouter from "./routes/cart-routes.js";
import reviewRouter from "./routes/review-routes.js";
import offerRouter from "./routes/offer-routes.js";
import exportRouter from "./routes/export-routes.js";
dotenv.config();
const app = express();
const PORT = process.env.PORT || 8000;
app.use(cors({
    origin: true,
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use("/uploads", express.static("uploads"));
app.use("/api/v1/user", userRouter);
app.use("/api/v1/vendor", vendorRouter);
app.use("/api/v1/product", productRouter);
app.use("/api/v1/price", priceRouter);
app.use("/api/v1/order", orderRouter);
app.use("/api/v1/cart", cartRouter);
app.use("/api/v1/review", reviewRouter);
app.use("/api/v1/offer", offerRouter);
app.use("/api/v1/export", exportRouter);
app.use(errorMiddleware);
async function startServer() {
    try {
        const database = await connectDb();
        app.locals.database = database;
        app.listen(PORT, () => {
            console.log(`App is listening on port ${PORT}`);
        });
    }
    catch (err) {
        console.error("Server startup failed", err?.message || err);
        process.exitCode = 1;
    }
}
startServer();
export default app;
//# sourceMappingURL=app.js.map