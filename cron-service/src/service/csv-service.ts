import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { stringify } from "csv-stringify";
import type { CsvProductRow, ProductDataPayload } from "../model/export.js";

function sanitizeFileName(name: string): string {
    return name
        .replace(/[<>:"/\\|?*\x00-\x1f]/g, "")
        .replace(/\s+/g, "_")
        .replace(/_{2,}/g, "_")
        .replace(/^_+|_+$/g, "")
        .substring(0, 100);
}

export async function generateProductCsv(productData: ProductDataPayload, outputDir: string, vendorId: string): Promise<string> {
    const { product, comments = [], orders = [] } = productData;

    await fs.promises.mkdir(outputDir, { recursive: true });

    const productId = product._id.toString();
    const rawName = product.productName || product.name || productId;
    const safeName = sanitizeFileName(rawName) || productId;
    const uniqueId = crypto.randomBytes(4).toString("hex");
    const fileName = `${safeName}-${uniqueId}.csv`;
    const filePath = path.join(outputDir, fileName);

    const maxRows = Math.max(comments.length, orders.length, 1);
    const rows: CsvProductRow[] = [];

    for (let i = 0; i < maxRows; i++) {
        const comment = comments[i] || null;

        rows.push({
            productId,
            productName: product.productName ?? "",
            commentId: comment?._id?.toString() ?? "",
            commenterUserId: comment?.userId?.toString() ?? "",
            commenterName: comment?.user?.name ?? "",
            commenterEmail: comment?.user?.email ?? "",
            commentText: comment?.comment ?? comment?.text ?? "",
            commentRating: comment?.rating ?? "",
            commentCreatedAt: comment?.createdAt ? new Date(comment.createdAt).toISOString() : ""
        });
    }

    const csv = await new Promise<string>((resolve, reject) => {
        stringify(
            rows,
            {
                header: true,
                columns: [
                    "productId",
                    "productName",
                    "commentId",
                    "commenterUserId",
                    "commenterName",
                    "commenterEmail",
                    "commentText",
                    "commentRating",
                    "commentCreatedAt"
                ]
            },
            (error, output) => {
                if (error) return reject(error);
                resolve(output);
            }
        );
    });

    await fs.promises.writeFile(filePath, csv, "utf8");

    return filePath;
}

export default generateProductCsv;
