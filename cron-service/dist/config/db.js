import { MongoClient } from "mongodb";
let cronClient = null;
let cronDb = null;
let ecommerceClient = null;
let ecommerceDb = null;
export async function connectDbs() {
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
export function getCronDb() {
    if (!cronDb) {
        throw new Error("Cron DB is not connected. Call connectDbs() first.");
    }
    return cronDb;
}
export function getEcommerceDb() {
    if (!ecommerceDb) {
        throw new Error("Ecommerce DB is not connected. Call connectDbs() first.");
    }
    return ecommerceDb;
}
export async function closeDbs() {
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
//# sourceMappingURL=db.js.map