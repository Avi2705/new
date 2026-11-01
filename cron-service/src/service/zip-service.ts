import fs from "node:fs";
import path from "node:path";
import * as archiverNamespace from "archiver";

export function createZip(csvPaths: string[], zipPath: string): Promise<{ zipPath: string; size: number }> {
    return new Promise((resolve, reject) => {
        fs.mkdirSync(path.dirname(zipPath), { recursive: true });

        const output = fs.createWriteStream(zipPath);
        const archiverFn: any = (archiverNamespace as any).default || archiverNamespace;
        const archive = typeof archiverFn === "function" ? archiverFn("zip", { zlib: { level: 6 } }) : new (archiverNamespace as any).ZipArchive({ zlib: { level: 6 } });

        output.on("close", () => {
            resolve({
                zipPath,
                size: archive.pointer()
            });
        });

        output.on("error", (err: unknown) => {
            reject(err);
        });

        archive.on("error", (err: unknown) => {
            reject(err);
        });

        archive.on("warning", (err: any) => {
            if (err?.code !== "ENOENT") {
                reject(err);
            }
        });

        archive.pipe(output);

        for (const csvPath of csvPaths) {
            if (fs.existsSync(csvPath)) {
                archive.file(csvPath, { name: path.basename(csvPath) });
            }
        }

        archive.finalize();
    });
}
