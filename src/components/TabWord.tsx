"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Upload,
  FileText,
  Check,
  ArrowRight,
  Loader2,
  Sparkles,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

export function TabWord() {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const [options, setOptions] = useState({
    orientation: "portrait",
    pageSize: "A4",
  });

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    // Allow docx (and doc, but mammoth might fail / we might warn)
    if (droppedFile?.name.match(/\.(docx|doc)$/)) {
      setFile(droppedFile);
    }
  };

  const handleConvert = async () => {
    if (!file) return;
    setLoading(true);

    try {
      const { useAuth } = await import("@/context/AuthContext"); // Dynamic import to avoid SSR issues if used directly
      // Or just get token if we had hook available.
      // Ideally pass token in header. For now, guest mode is default if no header.

      // 1. Submit Job
      const formData = new FormData();
      formData.append("file", file);
      formData.append("orientation", options.orientation);
      formData.append("pageSize", options.pageSize);

      const res = await fetch("/api/convert", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Conversion failed");
      }

      const { jobId } = await res.json();

      // 2. Poll for Status
      const checkStatus = async () => {
        const statusRes = await fetch(`/api/convert/status/${jobId}`);
        const statusData = await statusRes.json();

        if (statusData.state === "completed") {
          // 3. Download
          // We use the download API we just made
          // Or use the 'result' from job if it contains url (it does in our worker: downloadUrl)
          const downloadUrl =
            statusData.result?.downloadUrl || `/api/convert/download/${jobId}`;

          // Fetch as blob to trigger download or use router push to preview page?
          // Existing flow used router.push(`/preview/${jobId}`)
          // We should keep that flow if possible.
          // But we need the BLOB URL for the preview page to work offline-ish?
          // Actually, the preview page needs to load the PDF.
          // If we push to /preview/jobId, that page needs to know how to load the PDF.
          // Let's download the blob here to be safe and store in JobStore,
          // OR update Preview Page to fetch from download API.
          // Updating Preview Page is cleaner for "Refresh" but JobStore is "Offline" style.
          // Let's stick to JobStore for now to minimize changes to Preview Page.

          const fileRes = await fetch(downloadUrl);
          const blob = await fileRes.blob();
          const blobUrl = URL.createObjectURL(blob);

          const { JobStore } = await import("@/lib/job-store");
          JobStore.set(jobId, blobUrl, `converted-${file.name}.pdf`);

          router.push(`/preview/${jobId}`);
          setLoading(false);
          return;
        } else if (statusData.state === "failed") {
          throw new Error("Conversion failed in worker");
        } else {
          setTimeout(checkStatus, 1000);
        }
      };

      await checkStatus();
    } catch (error: any) {
      console.error("Conversion failed:", error);
      alert(`Conversion failed: ${error.message || "Please try again."}`);
      setLoading(false);
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
          <Sparkles className="w-5 h-5 text-blue-400" />
          Word to PDF
        </h2>
        <p className="text-sm text-gray-400">
          Transform Word documents into professional PDFs
        </p>
      </motion.div>

      {/* File Upload Area */}
      <motion.div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        className={cn(
          "relative border-2 border-dashed rounded-2xl transition-all duration-300 cursor-pointer group overflow-hidden",
          isDragging && "border-blue-400 bg-blue-500/10 scale-[1.02]",
          file && !isDragging && "border-blue-500/50 bg-blue-500/5",
          !file &&
            !isDragging &&
            "border-white/10 hover:border-white/20 hover:bg-white/5"
        )}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        whileHover={{ scale: file ? 1 : 1.01 }}
      >
        <input
          type="file"
          accept=".docx,.doc"
          onChange={(e) => e.target.files?.[0] && setFile(e.target.files[0])}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
          aria-label="Upload Word file"
        />

        <div className="p-12 flex flex-col items-center justify-center text-center">
          <motion.div
            className={cn(
              "p-4 rounded-2xl mb-4 transition-all duration-300",
              file ? "bg-blue-500/20" : "bg-white/5 group-hover:bg-white/10"
            )}
            animate={isDragging ? { scale: [1, 1.1, 1] } : {}}
            transition={{ duration: 0.5, repeat: isDragging ? Infinity : 0 }}
          >
            {file ? (
              <FileText className="w-10 h-10 text-blue-400" />
            ) : (
              <Upload className="w-10 h-10 text-gray-400 group-hover:text-white transition-colors" />
            )}
          </motion.div>

          {file ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <p className="text-white font-semibold text-lg mb-1">
                {file.name}
              </p>
              <p className="text-sm text-blue-400 font-medium">
                {(file.size / 1024).toFixed(1)} KB • Ready to convert
              </p>
            </motion.div>
          ) : (
            <div>
              <p className="text-white font-semibold text-lg mb-1">
                Drop Word file here
              </p>
              <p className="text-sm text-gray-400">
                or click to browse • DOCX, DOC supported
              </p>
            </div>
          )}
        </div>

        {/* Animated Border Gradient on Drag */}
        {isDragging && (
          <motion.div
            className="absolute inset-0 rounded-2xl border-2 border-blue-400"
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
                    ? "bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-lg"
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
            {["A4", "Letter"].map((s) => (
              <motion.button
                key={s}
                onClick={() => setOptions({ ...options, pageSize: s })}
                className={cn(
                  "flex-1 py-2.5 text-sm font-medium rounded-lg transition-all focus-ring",
                  options.pageSize === s
                    ? "bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-lg"
                    : "text-gray-400 hover:text-white hover:bg-white/5"
                )}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {s}
              </motion.button>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Convert Button */}
      <motion.button
        disabled={!file || loading}
        onClick={handleConvert}
        className={cn(
          "w-full py-4 rounded-xl font-bold text-base flex items-center justify-center gap-2.5 transition-all duration-300 focus-ring",
          file && !loading
            ? "bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-400 hover:to-indigo-500 text-white shadow-lg shadow-blue-900/30"
            : "bg-white/5 text-gray-500 cursor-not-allowed"
        )}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        whileHover={
          file && !loading
            ? { scale: 1.02, boxShadow: "0 20px 40px rgba(59, 130, 246, 0.4)" }
            : {}
        }
        whileTap={file && !loading ? { scale: 0.98 } : {}}
      >
        {loading ? (
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
    </div>
  );
}
