import { ObjectId, type WithId } from "mongodb";
import type { PriceDoc } from "../model/price.model.js";
export declare function insertPrice(priceDoc: PriceDoc): Promise<import("mongodb").InsertOneResult<PriceDoc>>;
export declare function deactivateActivePrices(productId: string | ObjectId): Promise<import("mongodb").UpdateResult<PriceDoc>>;
export declare function findActivePrice(productId: string | ObjectId): Promise<WithId<PriceDoc> | null>;
//# sourceMappingURL=price-dal.d.ts.map