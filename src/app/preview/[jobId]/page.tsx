"use client";

import { useEffect, useState, use } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Download,
  ExternalLink,
  ArrowLeft,
  Loader2,
  AlertCircle,
  FileText,
  CheckCircle2,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface JobStatus {
  id: string;
  status: "pending" | "processing" | "completed" | "failed";
  resultUrl?: string;
  error?: string;
  progress?: number;
}

export default function PreviewPage({
  params,
}: {
  params: Promise<{ jobId: string }>;
}) {
  const { jobId } = use(params);
  const [job, setJob] = useState<JobStatus | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check client-side store first
    import("@/lib/job-store").then(({ JobStore }) => {
      const storedJob = JobStore.get(jobId);
      if (storedJob) {
        setJob({
          id: storedJob.id,
          status: "completed",
          progress: 100,
          resultUrl: storedJob.blobUrl,
        });
        return;
      }

      // Fallback to polling (for legacy/shared links)
      let intervalId: NodeJS.Timeout;

      const checkStatus = async () => {
        try {
          const res = await fetch(`/api/convert/status/${jobId}`);
          if (!res.ok) throw new Error("Failed to fetch status");

          const data = await res.json();
          setJob(data);

          if (data.status === "completed" || data.status === "failed") {
            clearInterval(intervalId);
          }
        } catch (err) {
          console.error("Error polling status:", err);
          setError("Failed to check conversion status");
        }
      };

      checkStatus();
      intervalId = setInterval(checkStatus, 2000);

      return () => clearInterval(intervalId);
    });
  }, [jobId]);

  if (error || job?.status === "failed") {
    return (
      <main className="min-h-screen bg-[#0a0a0a] text-white flex items-center justify-center p-4 relative overflow-hidden">
        <motion.div
          className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-red-600/10 rounded-full blur-[140px] pointer-events-none"
          animate={{ scale: [1, 1.1, 1], opacity: [0.1, 0.15, 0.1] }}
          transition={{ duration: 5, repeat: Infinity }}
        />

        <motion.div
          className="max-w-md w-full text-center space-y-6 z-10"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div
            className="w-24 h-24 rounded-3xl bg-red-500/10 border-2 border-red-500/20 flex items-center justify-center mx-auto"
            animate={{ rotate: [0, -5, 5, -5, 0] }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <AlertCircle className="w-12 h-12 text-red-500" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h1 className="text-3xl font-bold mb-3">Conversion Failed</h1>
            <p className="text-gray-400 leading-relaxed">
              {job?.error ||
                error ||
                "Something went wrong during the conversion process."}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Link
              href="/convert"
              className="inline-flex items-center gap-2 px-6 py-3 bg-white/5 hover:bg-white/10 rounded-xl border border-white/10 text-gray-300 hover:text-white transition-all group"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              Back to Home
            </Link>
          </motion.div>
        </motion.div>
      </main>
    );
  }

  if (!job || job.status === "pending" || job.status === "processing") {
    const progress = job?.progress || 0;

    return (
      <main className="min-h-screen bg-[#0a0a0a] text-white flex items-center justify-center p-4 relative overflow-hidden">
        {/* Animated Background */}
        <motion.div
          className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-purple-600/10 rounded-full blur-[140px] pointer-events-none"
          animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.2, 0.1] }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-blue-600/10 rounded-full blur-[140px] pointer-events-none"
          animate={{ scale: [1.2, 1, 1.2], opacity: [0.1, 0.2, 0.1] }}
          transition={{ duration: 8, repeat: Infinity, delay: 1 }}
        />

        <div className="z-10 text-center space-y-10 max-w-md">
          {/* Animated Spinner */}
          <motion.div
            className="relative w-32 h-32 mx-auto"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <motion.div
              className="absolute inset-0 rounded-full border-t-4 border-r-4 border-purple-500/30"
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            />
            <motion.div
              className="absolute inset-4 rounded-full border-t-4 border-l-4 border-blue-500/50"
              animate={{ rotate: -360 }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            />
            <motion.div
              className="absolute inset-8 rounded-full border-t-4 border-r-4 border-purple-500/70"
              animate={{ rotate: 360 }}
              transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <FileText className="w-10 h-10 text-white/50" />
            </div>
          </motion.div>

          {/* Status Text */}
          <motion.div
            className="space-y-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="space-y-2">
              <h2 className="text-3xl font-bold">Converting your file...</h2>
              <p className="text-gray-400 text-lg">
                This usually takes a few seconds
              </p>
            </div>

            {/* Progress Bar */}
            <div className="w-full max-w-xs mx-auto">
              <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-purple-500 to-blue-500"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
              <p className="text-xs text-gray-500 mt-2 text-center">
                {progress}% complete
              </p>
            </div>
          </motion.div>
        </div>
      </main>
    );
  }

  const downloadUrl = job?.resultUrl || `/api/convert/download/${jobId}`;

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white flex flex-col p-4 md:p-8 h-screen">
      {/* Header with Enhanced Design */}
      <motion.header
        className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4 shrink-0"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Link
          href="/convert"
          className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors group"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span className="font-medium">Back to Converter</span>
        </Link>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <motion.a
            href={downloadUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2.5 glass rounded-xl text-sm font-medium hover:bg-white/10 transition-all focus-ring"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <ExternalLink className="w-4 h-4" />
            <span className="hidden sm:inline">Open in New Tab</span>
          </motion.a>
          <motion.a
            href={downloadUrl}
            download
            className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-400 hover:to-emerald-500 text-white rounded-xl text-sm font-semibold shadow-lg shadow-green-500/20 transition-all focus-ring"
            whileHover={{
              scale: 1.02,
              boxShadow: "0 20px 40px rgba(16, 185, 129, 0.3)",
            }}
            whileTap={{ scale: 0.98 }}
          >
            <Download className="w-4 h-4" />
            <span>Download PDF</span>
          </motion.a>
        </div>
      </motion.header>

      {/* Success Badge */}
      <motion.div
        className="flex items-center justify-center gap-2 mb-6"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
      >
        <motion.div
          className="flex items-center gap-2 px-4 py-2 glass rounded-full border border-green-500/20"
          initial={{ y: -10 }}
          animate={{ y: 0 }}
          transition={{ type: "spring", stiffness: 200, damping: 10 }}
        >
          <CheckCircle2 className="w-5 h-5 text-green-400" />
          <span className="text-sm font-medium text-green-400">
            Conversion Complete
          </span>
          <Sparkles className="w-4 h-4 text-green-400" />
        </motion.div>
      </motion.div>

      {/* PDF Preview with Enhanced Frame */}
      <motion.div
        className="flex-1 relative group"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.6 }}
      >
        <div className="absolute -inset-1 bg-gradient-to-br from-green-500/20 to-emerald-600/20 rounded-3xl blur-xl opacity-50 group-hover:opacity-75 transition-opacity" />

        <div className="relative h-full card-elevated rounded-3xl overflow-hidden backdrop-blur-xl">
          <div className="absolute top-4 left-4 right-4 z-10 flex items-center justify-between">
            {/* <div className="glass px-4 py-2 rounded-xl">
              <p className="text-xs text-gray-400 font-medium">PDF Preview</p>
            </div> */}
          </div>

          <iframe
            src={downloadUrl}
            className="w-full h-full border-none bg-white"
            title="PDF Preview"
          />
        </div>
      </motion.div>
    </main>
  );
}
