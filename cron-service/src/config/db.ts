import { MongoClient, type Db } from "mongodb";

let cronClient: MongoClient | null = null;
let cronDb: Db | null = null;
let ecommerceClient: MongoClient | null = null;
let ecommerceDb: Db | null = null;

export async function connectDbs(): Promise<{ cronDb: Db; ecommerceDb: Db }> {
    if (!cronDb) {
        const cronUri = process.env.CRON_MONGOURI || "mongodb://localhost:27017";
        const cronDbName = process.env.CRON_DB_NAME || "cron_service_db";
        cronClient = new MongoClient(cronUri);
        await cronClient.connect();
        cronDb = cronClient.db(cronDbName);
        console.log(`[Cron Service] connected to Cron DB : ${cronDbName}`);
    }

    if (!ecommerceDb) {
        const ecommerceUri = process.env.ECOMMERCE_MONGOURI || "mongodb://localhost:27017";
        const ecommerceDbName = process.env.ECOMMERCE_DB_NAME || "ecommmerce";
        ecommerceClient = new MongoClient(ecommerceUri);
        await ecommerceClient.connect();
        ecommerceDb = ecommerceClient.db(ecommerceDbName);
        console.log(`[Cron Service] connected to ecommerce Db directly ${ecommerceDbName}`);
    }

    return {
        cronDb,
        ecommerceDb
    };
}

export function getCronDb(): Db {
    if (!cronDb) {
        throw new Error("Cron DB is not connected. Call connectDbs() first.");
    }
    return cronDb;
}

export function getEcommerceDb(): Db {
    if (!ecommerceDb) {
        throw new Error("Ecommerce DB is not connected. Call connectDbs() first.");
    }
    return ecommerceDb;
}

export async function closeDbs(): Promise<void> {
    if (cronClient) {
        await cronClient.close();
        cronClient = null;
        cronDb = null;
    }
    if (ecommerceClient) {
        await ecommerceClient.close();
        ecommerceClient = null;
        ecommerceDb = null;
    }
}
