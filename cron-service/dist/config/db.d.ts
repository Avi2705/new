import { type Db } from "mongodb";
export declare function connectDbs(): Promise<{
    cronDb: Db;
    ecommerceDb: Db;
}>;
export declare function getCronDb(): Db;
export declare function getEcommerceDb(): Db;
export declare function closeDbs(): Promise<void>;
//# sourceMappingURL=db.d.ts.map