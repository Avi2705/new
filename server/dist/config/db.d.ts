import { type Db } from "mongodb";
import "dotenv/config";
declare function connectDb(): Promise<Db>;
declare function getDatabase(): Db;
export default connectDb;
export { getDatabase };
//# sourceMappingURL=db.d.ts.map