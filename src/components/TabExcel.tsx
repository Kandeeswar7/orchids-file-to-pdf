"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Upload,
  FileSpreadsheet,
  Check,
  ArrowRight,
  Loader2,
  Sparkles,
  X,
  FileSpreadsheet as FileIcon,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";
import { PLAN_LIMITS } from "@/config/plans";
import { LimitModal } from "./LimitModal";
import { GoogleDrivePicker } from "./GoogleDrivePicker";

export function TabExcel() {
  const router = useRouter();
  const { user, plan, dailyUsage, recordConversion } = useAuth();
  const [files, setFiles] = useState<File[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showLimitModal, setShowLimitModal] = useState(false);
  const [limitMessage, setLimitMessage] = useState("");
  const [options, setOptions] = useState({
    orientation: "portrait",
    pageSize: "A4",
    gridlines: true,
  });

  const handleFilesAdded = (newFiles: File[]) => {
    // Filter for valid types
    const validFiles = newFiles.filter((f) =>
      f.name.match(/\.(xlsx|xls|csv)$/i)
    );
    if (validFiles.length < newFiles.length) {
      alert(
        "Some files were rejected. Only Excel files (.xlsx, .xls, .csv) are allowed."
      );
    }

    // Check limits based on plan
    const limits = PLAN_LIMITS[plan] || PLAN_LIMITS.free;
    const maxFiles = plan === "premium" ? 10 : 1;

    if (files.length + validFiles.length > maxFiles) {
      setLimitMessage(
        plan === "free"
          ? "Free users can only convert 1 file at a time. Upgrade to Premium for multi-file upload!"
          : `You can only upload up to ${maxFiles} files at once.`
      );
      setShowLimitModal(true);
      return;
    }

    setFiles((prev) => [...prev, ...validFiles]);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFiles = Array.from(e.dataTransfer.files);
    handleFilesAdded(droppedFiles);
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleConvert = async () => {
    if (files.length === 0) return;

    // 1. LIMIT CHECKS GLOBAL
    const limits = PLAN_LIMITS[plan] || PLAN_LIMITS.free;

    // Daily Limit Check
    if (dailyUsage + files.length > limits.maxDailyConversions) {
      setLimitMessage(
        `Daily limit reached. You can only convert ${
          limits.maxDailyConversions - dailyUsage
        } more files today.`
      );
      setShowLimitModal(true);
      return;
    }

    setLoading(true);

    try {
      // Sequential Conversion Loop
      let lastJobId = "";
      for (const file of files) {
        // Size Check per file
        const sizeMB = file.size / (1024 * 1024);
        if (sizeMB > limits.maxFileSizeMB) {
          throw new Error(
            `File ${file.name} is too large (${sizeMB.toFixed(
              1
            )}MB). Limit is ${limits.maxFileSizeMB}MB.`
          );
        }

        // 2. Submit Job
        const formData = new FormData();
        formData.append("file", file);
        formData.append("orientation", options.orientation);
        formData.append("gridlines", options.gridlines.toString());

        const res = await fetch("/api/convert", {
          method: "POST",
          body: formData,
        });

        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.error || `Failed to convert ${file.name}`);
        }

        const { jobId } = await res.json();
        lastJobId = jobId;

        // 3. Poll for Status
        await new Promise<void>((resolve, reject) => {
          const checkStatus = async () => {
            try {
              const statusRes = await fetch(`/api/convert/status/${jobId}`);
              const statusData = await statusRes.json();

              if (statusData.state === "completed") {
                // 4. Download & Record
                const downloadUrl = `/api/convert/download/${jobId}`;

                // Pre-fetch blob to store in JobStore for preview
                const fileRes = await fetch(downloadUrl);
                const blob = await fileRes.blob();
                const blobUrl = URL.createObjectURL(blob);

                const { JobStore } = await import("@/lib/job-store");
                JobStore.set(jobId, blobUrl, `converted-${file.name}.pdf`);

                // Global Record
                await recordConversion({
                  jobId,
                  fileName: file.name,
                  fileType: "excel",
                  fileSize: file.size,
                });
                resolve();
              } else if (statusData.state === "failed") {
                reject(new Error(`Conversion failed for ${file.name}`));
              } else {
                setTimeout(checkStatus, 1000);
              }
            } catch (e) {
              reject(e);
            }
          };
          checkStatus();
        });
      }

      // All Done
      if (files.length > 1) {
        router.push("/history");
      } else if (lastJobId) {
        router.push(`/preview/${lastJobId}`);
      }
    } catch (error: any) {
      console.error("Conversion failed:", error);
      alert(`${error.message || "Please try again."}`);
    } finally {
      setLoading(false);
      setFiles([]);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        className="space-y-2 flex justify-between items-end"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-emerald-400" />
            Excel to PDF
          </h2>
          <p className="text-sm text-gray-400">
            Transform spreadsheets into beautiful PDFs with custom formatting
          </p>
        </div>
        <GoogleDrivePicker
          allowedExtensions={["xlsx", "xls", "csv"]}
          onPick={(newFile) => handleFilesAdded([newFile])}
        />
      </motion.div>

      {/* File Upload Area with Enhanced Animation */}
      <motion.div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        className={cn(
          "relative border-2 border-dashed rounded-2xl transition-all duration-300 cursor-pointer group overflow-hidden",
          isDragging && "border-emerald-400 bg-emerald-500/10 scale-[1.02]",
          files.length > 0 &&
            !isDragging &&
            "border-emerald-500/50 bg-emerald-500/5",
          files.length === 0 &&
            !isDragging &&
            "border-white/10 hover:border-white/20 hover:bg-white/5"
        )}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        whileHover={{ scale: files.length > 0 ? 1 : 1.01 }}
      >
        <input
          type="file"
          accept=".xlsx,.xls,.csv"
          multiple
          onChange={(e) => {
            if (e.target.files) {
              handleFilesAdded(Array.from(e.target.files));
            }
          }}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
          aria-label="Upload Excel file"
        />

        <div className="p-12 flex flex-col items-center justify-center text-center">
          <motion.div
            className={cn(
              "p-4 rounded-2xl mb-4 transition-all duration-300",
              files.length > 0
                ? "bg-emerald-500/20"
                : "bg-white/5 group-hover:bg-white/10"
            )}
            animate={isDragging ? { scale: [1, 1.1, 1] } : {}}
            transition={{ duration: 0.5, repeat: isDragging ? Infinity : 0 }}
          >
            {files.length > 0 ? (
              <FileSpreadsheet className="w-10 h-10 text-emerald-400" />
            ) : (
              <Upload className="w-10 h-10 text-gray-400 group-hover:text-white transition-colors" />
            )}
          </motion.div>

          {files.length > 0 ? (
            <div className="w-full max-w-sm mx-auto space-y-2 relative z-20">
              {files.map((f, i) => (
                <motion.div
                  key={`${f.name}-${i}`}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
                >
                  <div className="flex items-center gap-3 overflow-hidden">
                    <FileIcon className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                    <div className="text-left overflow-hidden">
                      <p className="text-sm font-medium text-white truncate max-w-[180px]">
                        {f.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {(f.size / (1024 * 1024)).toFixed(2)} MB
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent opening file chooser
                      e.preventDefault();
                      removeFile(i);
                    }}
                    className="p-1 hover:bg-red-500/20 rounded-full text-gray-400 hover:text-red-400 transition-colors"
                    aria-label="Remove file"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </motion.div>
              ))}

              {plan === "free" && files.length >= 1 && (
                <p className="text-xs text-amber-500 mt-2">
                  Free limit reached.{" "}
                  <span className="font-bold">
                    Upgrade to allow multiple files.
                  </span>
                </p>
              )}
            </div>
          ) : (
            <div>
              <p className="text-white font-semibold text-lg mb-1">
                Drop Excel files here
              </p>
              <p className="text-sm text-gray-400">
                or click to browse • XLSX, XLS, CSV supported
              </p>
            </div>
          )}
        </div>

        {/* Animated Border Gradient on Drag */}
        {isDragging && (
          <motion.div
            className="absolute inset-0 rounded-2xl border-2 border-emerald-400"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          />
        )}
      </motion.div>

      {/* Options Grid */}
      <motion.div
        className="grid grid-cols-2 gap-4"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <div className="space-y-2">
          <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
            Orientation
          </label>
          <div className="flex gap-2 glass p-1 rounded-xl">
            {["portrait", "landscape"].map((o) => (
              <motion.button
                key={o}
                onClick={() => setOptions({ ...options, orientation: o })}
                className={cn(
                  "flex-1 py-2.5 text-sm font-medium rounded-lg transition-all focus-ring",
                  options.orientation === o
                    ? "bg-gradient-to-br from-emerald-500 to-green-600 text-white shadow-lg"
                    : "text-gray-400 hover:text-white hover:bg-white/5"
                )}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {o.charAt(0).toUpperCase() + o.slice(1)}
              </motion.button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
            Page Size
          </label>
          <div className="flex gap-2 glass p-1 rounded-xl">
            <button className="flex-1 py-2.5 text-sm font-medium rounded-lg bg-gradient-to-br from-emerald-500 to-green-600 text-white shadow-lg cursor-default">
              A4 (Standard)
            </button>
          </div>
        </div>
      </motion.div>

      {/* Gridlines Toggle */}
      <motion.button
        onClick={() =>
          setOptions({ ...options, gridlines: !options.gridlines })
        }
        className="flex items-center gap-3 w-full p-4 rounded-xl hover:bg-white/5 transition-all group focus-ring"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
      >
        <motion.div
          className={cn(
            "w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all",
            options.gridlines
              ? "bg-emerald-500 border-emerald-500 shadow-lg shadow-emerald-500/30"
              : "border-gray-500 group-hover:border-gray-400"
          )}
          whileTap={{ scale: 0.9 }}
        >
          {options.gridlines && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 500, damping: 15 }}
            >
              <Check className="w-4 h-4 text-black" />
            </motion.div>
          )}
        </motion.div>
        <span className="text-sm font-medium text-gray-300 group-hover:text-white transition-colors">
          Include Gridlines
        </span>
      </motion.button>

      {/* Convert Button */}
      <motion.button
        disabled={files.length === 0 || loading}
        onClick={handleConvert}
        className={cn(
          "w-full py-4 rounded-xl font-bold text-base flex items-center justify-center gap-2.5 transition-all duration-300 focus-ring",
          files.length > 0 && !loading
            ? "bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-400 hover:to-green-500 text-white shadow-lg shadow-emerald-900/30"
            : "bg-white/5 text-gray-500 cursor-not-allowed"
        )}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        whileHover={
          files.length > 0 && !loading
            ? { scale: 1.02, boxShadow: "0 20px 40px rgba(16, 185, 129, 0.4)" }
            : {}
        }
        whileTap={files.length > 0 && !loading ? { scale: 0.98 } : {}}
      >
        {loading ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            <span>
              Processing {files.length} File{files.length > 1 ? "s" : ""}...
            </span>
          </>
        ) : (
          <>
            <span>
              Convert{" "}
              {files.length > 0
                ? `${files.length} File${files.length > 1 ? "s" : ""}`
                : "to PDF"}
            </span>
            <ArrowRight className="w-5 h-5" />
          </>
        )}
      </motion.button>
      <LimitModal
        isOpen={showLimitModal}
        onClose={() => setShowLimitModal(false)}
        message={limitMessage}
      />
    </div>
  );
}
