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
} from "lucide-react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

export function TabExcel() {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const [options, setOptions] = useState({
    orientation: "portrait",
    pageSize: "A4",
    gridlines: true,
  });

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile?.name.match(/\.(xlsx|xls|csv)$/)) {
      setFile(droppedFile);
    }
  };

  const handleConvert = async () => {
    if (!file) return;
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("orientation", options.orientation);
      formData.append("gridlines", options.gridlines.toString());

      const res = await fetch("/api/convert/excel", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Conversion failed");
      }

      // Check for PDF content type
      const contentType = res.headers.get("content-type");
      if (!contentType || !contentType.includes("application/pdf")) {
        throw new Error("Invalid response format");
      }

      const blob = await res.blob();
      const blobUrl = URL.createObjectURL(blob);
      const jobId = res.headers.get("X-Job-Id") || crypto.randomUUID();

      // Store result in client-side store
      const { JobStore } = await import("@/lib/job-store");
      JobStore.set(jobId, blobUrl, `converted-${file.name}.pdf`);

      router.push(`/preview/${jobId}`);
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
          <Sparkles className="w-5 h-5 text-emerald-400" />
          Excel to PDF
        </h2>
        <p className="text-sm text-gray-400">
          Transform spreadsheets into beautiful PDFs with custom formatting
        </p>
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
          file && !isDragging && "border-emerald-500/50 bg-emerald-500/5",
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
          accept=".xlsx,.xls,.csv"
          onChange={(e) => e.target.files?.[0] && setFile(e.target.files[0])}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
          aria-label="Upload Excel file"
        />

        <div className="p-12 flex flex-col items-center justify-center text-center">
          <motion.div
            className={cn(
              "p-4 rounded-2xl mb-4 transition-all duration-300",
              file ? "bg-emerald-500/20" : "bg-white/5 group-hover:bg-white/10"
            )}
            animate={isDragging ? { scale: [1, 1.1, 1] } : {}}
            transition={{ duration: 0.5, repeat: isDragging ? Infinity : 0 }}
          >
            {file ? (
              <FileSpreadsheet className="w-10 h-10 text-emerald-400" />
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
              <p className="text-sm text-emerald-400 font-medium">
                {(file.size / 1024).toFixed(1)} KB • Ready to convert
              </p>
            </motion.div>
          ) : (
            <div>
              <p className="text-white font-semibold text-lg mb-1">
                Drop Excel file here
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
            {["A4", "Letter"].map((s) => (
              <motion.button
                key={s}
                onClick={() => setOptions({ ...options, pageSize: s })}
                className={cn(
                  "flex-1 py-2.5 text-sm font-medium rounded-lg transition-all focus-ring",
                  options.pageSize === s
                    ? "bg-gradient-to-br from-emerald-500 to-green-600 text-white shadow-lg"
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
        disabled={!file || loading}
        onClick={handleConvert}
        className={cn(
          "w-full py-4 rounded-xl font-bold text-base flex items-center justify-center gap-2.5 transition-all duration-300 focus-ring",
          file && !loading
            ? "bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-400 hover:to-green-500 text-white shadow-lg shadow-emerald-900/30"
            : "bg-white/5 text-gray-500 cursor-not-allowed"
        )}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        whileHover={
          file && !loading
            ? { scale: 1.02, boxShadow: "0 20px 40px rgba(16, 185, 129, 0.4)" }
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
