import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { requestExport, getExportJobs, getExportStatus, getDownloadUrl } from "../../api";
import { useAuth } from "../../hooks/useAuth";
import type { ExportJob } from "../../types";

export default function VendorExportPage() {
  const { user } = useAuth();
  const [jobs, setJobs] = useState<ExportJob[]>([]);
  const [loading, setLoading] = useState(true);
  const [triggering, setTriggering] = useState(false);
  const [activeJobId, setActiveJobId] = useState<string | null>(null);
  const [activeJobStatus, setActiveJobStatus] = useState<any>(null);

  async function loadJobs() {
    setLoading(true);
    try {
      const res = await getExportJobs();
      setJobs(res.jobs || []);
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Failed to load jobs");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadJobs();
  }, []);

  useEffect(() => {
    if (!activeJobId) return;

    const interval = setInterval(async () => {
      try {
        const res = await getExportStatus(activeJobId);
        const job = (res as any).job || res;
        setActiveJobStatus(job);

        const isDone =
          job.status === "finish" ||
          job.status === "finished" ||
          job.status === "failed" ||
          job.status === "cancel";

        if (isDone) {
          clearInterval(interval);
          setActiveJobId(null);
          if (job.status === "finish" || job.status === "finished") {
            toast.success("Export finished! Your ZIP archive is ready for download.");
          } else {
            toast.error("Export job failed or was cancelled.");
          }
          await loadJobs();
        }
      } catch {
        clearInterval(interval);
        setActiveJobId(null);
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [activeJobId]);

  async function handleStartExport() {
    setTriggering(true);
    try {
      const res = await requestExport(user?.id);
      const newId = res.job?.jobId || res.jobId;
      if (newId) {
        setActiveJobId(newId);
        toast.info(`Export queued (Job: ${newId}). Background worker is generating ZIP.`);
      } else {
        toast.success("Export queued successfully.");
      }
      await loadJobs();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Failed to trigger export");
    } finally {
      setTriggering(false);
    }
  }

  async function handleDownloadZip(jobId: string) {
    try {
      toast.info("Downloading ZIP archive...");
      const downloadUrl = getDownloadUrl(jobId);
      const response = await fetch(downloadUrl);
      if (!response.ok) {
        throw new Error("Download request failed or file not ready yet");
      }
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const tempLink = document.createElement("a");
      tempLink.href = blobUrl;
      tempLink.download = `vendor-export-${jobId}.zip`;
      document.body.appendChild(tempLink);
      tempLink.click();
      window.URL.revokeObjectURL(blobUrl);
      document.body.removeChild(tempLink);
      toast.success("ZIP archive downloaded successfully!");
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Failed to download ZIP file");
    }
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-1">Catalog Export Service</h1>
          <p className="text-sm text-gray-500">
            Export all your products, active prices, customer reviews, and buyer orders into individual CSVs bundled into a ZIP archive.
          </p>
        </div>

        <button
          type="button"
          onClick={handleStartExport}
          disabled={triggering || activeJobId !== null}
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-5 py-2.5 rounded-md text-sm transition disabled:opacity-50"
        >
          {triggering ? "Starting..." : activeJobId ? "Worker Running..." : "Start Export Worker"}
        </button>
      </div>

      {activeJobStatus && (
        <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <h3 className="text-sm font-semibold text-yellow-900 mb-2">
            Active Job Status: <span className="uppercase">{activeJobStatus.status}</span>
          </h3>
          <p className="text-xs text-yellow-800 mb-2">
            Progress: {activeJobStatus.processedProducts || 0} / {activeJobStatus.totalProducts || 0} products processed
          </p>
          <div className="w-full bg-yellow-200 rounded-full h-2">
            <div
              className="bg-yellow-600 h-2 rounded-full transition-all duration-300"
              style={{
                width: `${activeJobStatus.totalProducts ? ((activeJobStatus.processedProducts || 0) / activeJobStatus.totalProducts) * 100 : 0}%`,
              }}
            ></div>
          </div>
        </div>
      )}

      <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
        <h2 className="text-base font-semibold text-gray-900 mb-4">Export History & Downloads</h2>

        {loading ? (
          <p className="text-sm text-gray-500">Loading export jobs history...</p>
        ) : jobs.length === 0 ? (
          <p className="text-sm text-gray-500">No export jobs have been run yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm divide-y divide-gray-200">
              <thead className="bg-gray-50 text-xs text-gray-500 uppercase">
                <tr>
                  <th className="px-4 py-2.5">Job ID</th>
                  <th className="px-4 py-2.5">Status</th>
                  <th className="px-4 py-2.5">Products</th>
                  <th className="px-4 py-2.5">Created At</th>
                  <th className="px-4 py-2.5 text-right">Download</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {jobs.map((j) => {
                  const isFinished = j.status === "finish" || j.status === "finished";

                  return (
                    <tr key={j.jobId} className="hover:bg-gray-50">
                      <td className="px-4 py-3 font-mono text-xs text-gray-700">{j.jobId}</td>
                      <td className="px-4 py-3">
                        <span
                          className={`text-xs px-2.5 py-0.5 rounded-full font-semibold capitalize ${
                            isFinished
                              ? "bg-green-100 text-green-800"
                              : j.status === "processing" || j.status === "running"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-gray-100 text-gray-700"
                          }`}
                        >
                          {isFinished ? "Finished" : j.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-xs text-gray-600">
                        {j.totalProducts ?? "-"}
                      </td>
                      <td className="px-4 py-3 text-xs text-gray-500">
                        {new Date(j.createdAt).toLocaleString()}
                      </td>
                      <td className="px-4 py-3 text-right">
                        {isFinished ? (
                          <button
                            type="button"
                            onClick={() => handleDownloadZip(j.jobId)}
                            className="text-xs bg-blue-600 hover:bg-blue-700 text-white font-medium px-3 py-1.5 rounded transition"
                          >
                            Download ZIP
                          </button>
                        ) : (
                          <span className="text-xs text-gray-400">Processing</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
