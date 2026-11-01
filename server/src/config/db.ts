import { MongoClient, type Db } from "mongodb";
import "dotenv/config";

let client: MongoClient | null = null;
let db: Db | null = null;

async function connectDb(): Promise<Db> {
  const url = process.env.MONGOURI || "mongodb://localhost:27017";
  const dbName = process.env.DB_NAME || "ecommmerce";

  client = new MongoClient(url);

  try {
    await client.connect();
    db = client.db(dbName);

    console.log("MongoDB connected successfully");
    return db;
  } catch (err) {
    await client.close().catch(() => {});
    client = null;

    if (err instanceof Error) {
      console.error("MongoDB connection failed:", err.message);
    }

    throw err;
  }
}

function getDatabase(): Db {
  if (!db) {
    throw new Error("Database is not connected. Call connectDb() first.");
  }

  return db;
}


export default connectDb;
export { getDatabase };