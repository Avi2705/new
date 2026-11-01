import { ObjectId, type WithId, type Document } from "mongodb";
export interface VendorExportDetails {
    jobId: string;
    zipPath: string;
    status: string;
    totalProducts: number;
    finishedAt: Date;
}
export declare function findVendorProducts(vendorId: string | ObjectId): Promise<WithId<Document>[]>;
export declare function findActivePriceByProductId(productId: string | ObjectId): Promise<WithId<Document> | null>;
export declare function findReviewsByProductId(productId: string | ObjectId): Promise<WithId<Document>[]>;
export declare function findOrdersByProductId(productId: string | ObjectId): Promise<WithId<Document>[]>;
export declare function findUsersByIds(userIds: (string | ObjectId)[]): Promise<any[]>;
export declare function updateVendorLatestExport(vendorId: string | ObjectId, exportDetails: VendorExportDetails): Promise<import("mongodb").UpdateResult<Document>>;
export declare function findVendorById(vendorId: string | ObjectId): Promise<WithId<Document> | null>;
//# sourceMappingURL=ecommerce-dal.d.ts.map