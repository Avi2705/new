import { MongoClient } from "mongodb";
import "dotenv/config";
let client = null;
let db = null;
async function connectDb() {
    const url = process.env.MONGOURI || "mongodb://localhost:27017";
    const dbName = process.env.DB_NAME || "ecommmerce";
    client = new MongoClient(url);
    try {
        await client.connect();
        db = client.db(dbName);
        console.log("MongoDB connected successfully");
        return db;
    }
    catch (err) {
        await client.close().catch(() => { });
        client = null;
        if (err instanceof Error) {
            console.error("MongoDB connection failed:", err.message);
        }
        throw err;
    }
}
function getDatabase() {
    if (!db) {
        throw new Error("Database is not connected. Call connectDb() first.");
    }
    return db;
}
export default connectDb;
export { getDatabase };
//# sourceMappingURL=db.js.map