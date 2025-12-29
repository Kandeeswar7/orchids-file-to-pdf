"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Upload,
  FileCode,
  Code,
  ArrowRight,
  Loader2,
  FileType,
  Sparkles,
  Lock,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { PLAN_LIMITS } from "@/config/plans";
import { LimitModal } from "./LimitModal";

type SubTab = "file" | "code";

export function TabHtml() {
  const { user, plan, dailyUsage, recordConversion } = useAuth();
  const [subTab, setSubTab] = useState<SubTab>("file");
  const [files, setFiles] = useState<File[]>([]); // CHANGED: Single file -> Array
  const [code, setCode] = useState("");
  const [isConverting, setIsConverting] = useState(false);
  const [showLimitModal, setShowLimitModal] = useState(false);
  const [limitMessage, setLimitMessage] = useState("");
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      // Enforce limits
      const targetFiles = Array.from(e.target.files);
      const maxFiles =
        plan === "premium"
          ? PLAN_LIMITS.premium.maxBatchSize
          : PLAN_LIMITS.free.maxBatchSize;

      // Validation 1: Max Files
      if (targetFiles.length > maxFiles) {
        alert(
          plan === "free"
            ? "Free users can only convert 1 file at a time. Upgrade for batch processing!"
            : `You can only convert up to ${maxFiles} files at once.`
        );
        return;
      }

      // Validation 2: File Types
      const invalidFiles = targetFiles.filter(
        (f) => !f.name.match(/\.(html|htm)$/i)
      );
      if (invalidFiles.length > 0) {
        alert("Invalid file type. Please upload HTML files (.html, .htm).");
        return;
      }

      setFiles(targetFiles);
    }
  };

  const handleConvert = async () => {
    // 1. LIMIT CHECKS
    const limits = PLAN_LIMITS[plan] || PLAN_LIMITS.free;

    if (subTab === "file" && files.length === 0) return;
    if (subTab === "code" && !code) return;

    // Daily Limit Check
    const count = subTab === "file" ? files.length : 1;
    if (dailyUsage + count > limits.maxDailyConversions) {
      setLimitMessage(
        `Daily limit reached. You can only convert ${
          limits.maxDailyConversions - dailyUsage
        } more files today.`
      );
      setShowLimitModal(true);
      return;
    }

    setIsConverting(true); // FIX A: Explicit State
    let successCount = 0;
    const errors: string[] = [];
    let lastJobId = "";

    try {
      if (subTab === "file") {
        // Sequential Loop (FIX B: Multi-File Support)
        for (const file of files) {
          try {
            // Check File Size
            const sizeMB = file.size / (1024 * 1024);
            if (sizeMB > limits.maxFileSizeMB) {
              throw new Error(
                `File too large (${sizeMB.toFixed(1)}MB). Limit is ${
                  limits.maxFileSizeMB
                }MB.`
              );
            }

            const text = await file.text();
            const fileSize = file.size;
            const filename = `converted-${file.name}.pdf`;

            const response = await fetch("/api/convert", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                type: "html",
                html: text,
                source: "file",
                filename: file.name,
              }),
            });

            if (!response.ok) {
              const data = await response.json();
              throw new Error(data.error || "Conversion failed");
            }

            const { jobId } = await response.json();
            lastJobId = jobId;

            // Poll for Status (FIX A: Await Promise correctly)
            await new Promise<void>((resolve, reject) => {
              const checkStatus = async () => {
                try {
                  const statusRes = await fetch(`/api/convert/status/${jobId}`);
                  const statusData = await statusRes.json();

                  if (statusData.state === "completed") {
                    const downloadUrl = `/api/convert/download/${jobId}`;

                    // Store Result
                    const { JobStore } = await import("@/lib/job-store");
                    // Persist if Premium
                    const persistenceUid =
                      plan === "premium" && user ? user.uid : undefined;
                    JobStore.set(jobId, downloadUrl, filename, persistenceUid, {
                      // We don't have blob here yet unless we fetch it, but URL is enough for history
                      fileType: "html",
                      fileSize: fileSize,
                      downloadUrl,
                    });

                    // Record
                    await recordConversion({
                      jobId,
                      fileName: file.name,
                      fileType: "html",
                      fileSize: fileSize,
                    });
                    resolve();
                  } else if (statusData.state === "failed") {
                    reject(new Error("Conversion failed in worker"));
                  } else {
                    setTimeout(checkStatus, 1000);
                  }
                } catch (e) {
                  reject(e);
                }
              };
              checkStatus();
            });

            successCount++;
          } catch (e: any) {
            console.error(`Failed to convert ${file.name}`, e);
            errors.push(`${file.name}: ${e.message}`);
          }
        }
      } else {
        // CODE MODE (Single)
        const sizeMB = code.length / (1024 * 1024);
        if (sizeMB > limits.maxFileSizeMB) {
          setLimitMessage(
            `Code content too large. Limit is ${limits.maxFileSizeMB}MB.`
          );
          setShowLimitModal(true);
          setIsConverting(false); // Reset here as we return early
          return;
        }

        const response = await fetch("/api/convert", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            type: "html",
            html: code,
            source: "code",
          }),
        });

        if (!response.ok) throw new Error("Conversion failed");
        const { jobId } = await response.json();
        lastJobId = jobId;

        // Poll for Status
        await new Promise<void>((resolve, reject) => {
          const checkStatus = async () => {
            try {
              const statusRes = await fetch(`/api/convert/status/${jobId}`);
              const statusData = await statusRes.json();

              if (statusData.state === "completed") {
                const downloadUrl = `/api/convert/download/${jobId}`;
                const { JobStore } = await import("@/lib/job-store");
                const persistenceUid =
                  plan === "premium" && user ? user.uid : undefined;

                JobStore.set(
                  jobId,
                  downloadUrl,
                  "document.pdf",
                  persistenceUid,
                  {
                    fileType: "html",
                    fileSize: code.length,
                    downloadUrl,
                  }
                );

                await recordConversion({
                  jobId,
                  fileName: "html-code-snippet",
                  fileType: "html",
                  fileSize: code.length,
                });
                resolve();
              } else if (statusData.state === "failed") {
                reject(new Error("Worker failed"));
              } else {
                setTimeout(checkStatus, 1000);
              }
            } catch (e) {
              reject(e);
            }
          };
          checkStatus();
        });
        successCount++;
      }

      // Report Errors
      if (errors.length > 0) {
        alert(
          `Conversion Report:\n\nSuccessful: ${successCount}\nFailed: ${
            errors.length
          }\n\nErrors:\n${errors.join("\n")}`
        );
      }

      // Navigation (FIX C: Redirect logic)
      if (successCount > 0) {
        if (successCount > 1 || (subTab === "file" && files.length > 1)) {
          router.push("/history");
        } else if (lastJobId) {
          router.push(`/preview/${lastJobId}`);
        }
      } else {
        // Failed all
        setIsConverting(false); // Only reset if we are NOT navigating away
      }
    } catch (error: any) {
      console.error("Error converting HTML:", error);
      alert(`${error.message || "Conversion failed. Please try again."}`);
      setIsConverting(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        className="space-y-2"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-orange-400" />
          HTML to PDF
        </h2>
        <p className="text-sm text-gray-400">
          Convert HTML files or raw code into professional PDFs
        </p>
      </motion.div>

      {/* Sub-tabs with Enhanced Animation */}
      <motion.div
        className="flex justify-center"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className="flex p-1 glass rounded-xl border border-white/10">
          <motion.button
            onClick={() => setSubTab("file")}
            className={cn(
              "flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-semibold transition-all focus-ring",
              subTab === "file"
                ? "text-white"
                : "text-gray-400 hover:text-white"
            )}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {subTab === "file" && (
              <motion.div
                layoutId="activeSubTab"
                className="absolute inset-0 bg-gradient-to-br from-orange-500 to-red-600 rounded-lg shadow-lg"
                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
              />
            )}
            <FileType className="w-4 h-4 z-10" />
            <span className="z-10">Upload File</span>
          </motion.button>
          <motion.button
            onClick={() => setSubTab("code")}
            className={cn(
              "flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-semibold transition-all focus-ring",
              subTab === "code"
                ? "text-white"
                : "text-gray-400 hover:text-white"
            )}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {subTab === "code" && (
              <motion.div
                layoutId="activeSubTab"
                className="absolute inset-0 bg-gradient-to-br from-orange-500 to-red-600 rounded-lg shadow-lg"
                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
              />
            )}
            <Code className="w-4 h-4 z-10" />
            <span className="z-10">Paste Code</span>
          </motion.button>
        </div>
      </motion.div>

      <AnimatePresence mode="wait">
        {subTab === "file" ? (
          <motion.div
            key="file"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3 }}
            className="space-y-4"
          >
            <motion.div
              onClick={() => !isConverting && fileInputRef.current?.click()}
              className={cn(
                "border-2 border-dashed rounded-2xl p-12 flex flex-col items-center justify-center cursor-pointer transition-all duration-300 group",
                files.length > 0
                  ? "border-orange-500/50 bg-orange-500/10"
                  : "border-white/10 hover:border-white/20 hover:bg-white/5",
                isConverting && "cursor-not-allowed opacity-50"
              )}
              whileHover={{ scale: files.length > 0 ? 1 : 1.01 }}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".html,.htm"
                multiple={plan === "premium"} // FIX B: Multi-File
                onChange={handleFileChange}
                className="hidden"
                disabled={isConverting}
                aria-label="Upload HTML file"
              />

              {files.length > 0 ? (
                <motion.div
                  className="text-center"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                >
                  <div className="w-16 h-16 rounded-2xl bg-orange-500/20 flex items-center justify-center mb-4 mx-auto">
                    <FileCode className="w-8 h-8 text-orange-400" />
                  </div>
                  <p className="font-semibold text-lg text-white mb-1">
                    {files.length === 1
                      ? files[0].name
                      : `${files.length} files selected`}
                  </p>
                  <div className="flex items-center justify-center gap-2">
                    <p className="text-sm text-orange-400 font-medium">
                      {files.length === 1 &&
                        (files[0].size / 1024).toFixed(1) + " KB"}
                    </p>
                  </div>
                </motion.div>
              ) : (
                <>
                  <motion.div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mb-4 group-hover:bg-white/10 transition-colors">
                    <Upload className="w-8 h-8 text-gray-400 group-hover:text-white transition-colors" />
                  </motion.div>
                  <p className="text-white font-semibold text-lg mb-1">
                    Click to upload HTML file{plan === "premium" ? "s" : ""}
                  </p>
                  <p className="text-sm text-gray-400">
                    or drag and drop • .html, .htm supported
                  </p>
                </>
              )}
            </motion.div>
          </motion.div>
        ) : (
          <motion.div
            key="code"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-4"
          >
            <div className="relative group">
              <textarea
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="<!DOCTYPE html>&#10;<html>&#10;  <head>&#10;    <title>My Document</title>&#10;  </head>&#10;  <body>&#10;    <h1>Hello World</h1>&#10;  </body>&#10;</html>"
                className="w-full h-64 bg-black/40 border-2 border-white/10 rounded-2xl p-6 font-mono text-sm text-gray-300 placeholder:text-gray-600 focus:outline-none focus:border-orange-500/50 focus:ring-2 focus:ring-orange-500/20 resize-none transition-all"
                disabled={isConverting}
                aria-label="HTML code input"
              />
              {code && (
                <motion.div
                  className="absolute top-4 right-4 px-3 py-1 bg-orange-500/20 border border-orange-500/30 rounded-lg text-xs text-orange-400 font-medium"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                >
                  {code.length} characters
                </motion.div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Convert Button */}
      <motion.div
        className="pt-4"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <motion.button
          onClick={handleConvert}
          disabled={
            isConverting ||
            (subTab === "file" && files.length === 0) ||
            (subTab === "code" && !code)
          }
          className={cn(
            "w-full py-4 rounded-xl font-bold text-base flex items-center justify-center gap-2.5 transition-all duration-300 focus-ring",
            (subTab === "file" && files.length === 0) ||
              (subTab === "code" && !code) ||
              isConverting
              ? "bg-white/5 text-gray-500 cursor-not-allowed"
              : "bg-gradient-to-r from-orange-500 to-red-600 text-white shadow-lg shadow-orange-900/30"
          )}
          whileHover={
            !isConverting &&
            ((subTab === "file" && files.length > 0) ||
              (subTab === "code" && code))
              ? {
                  scale: 1.02,
                  boxShadow: "0 20px 40px rgba(249, 115, 22, 0.4)",
                }
              : {}
          }
          whileTap={
            !isConverting &&
            ((subTab === "file" && files.length > 0) ||
              (subTab === "code" && code))
              ? { scale: 0.98 }
              : {}
          }
        >
          {isConverting ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Processing...</span>
            </>
          ) : (
            <>
              <span>Convert to PDF</span>
              <ArrowRight className="w-5 h-5" />
            </>
          )}
        </motion.button>
      </motion.div>
      <LimitModal
        isOpen={showLimitModal}
        onClose={() => setShowLimitModal(false)}
        message={limitMessage}
      />
    </div>
  );
}
