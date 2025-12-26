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
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

type SubTab = "file" | "code";

export function TabHtml() {
  const [subTab, setSubTab] = useState<SubTab>("file");
  const [file, setFile] = useState<File | null>(null);
  const [code, setCode] = useState("");
  const [isConverting, setIsConverting] = useState(false);
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleConvert = async () => {
    try {
      setIsConverting(true);

      let response;
      let filename = "document.pdf";

      if (subTab === "file" && file) {
        const text = await file.text();
        filename = `converted-${file.name}.pdf`;
        response = await fetch("/api/convert", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            html: text,
            source: "file",
            filename: file.name,
          }),
        });
      } else if (subTab === "code" && code) {
        response = await fetch("/api/convert", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            html: code,
            source: "code",
          }),
        });
      }

      if (response && !response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Conversion failed");
      }

      if (response) {
        // 1. Get Job ID
        const { jobId } = await response.json();

        // 2. Poll for Status
        const checkStatus = async () => {
          const statusRes = await fetch(`/api/convert/status/${jobId}`);
          const statusData = await statusRes.json();

          if (statusData.state === "completed") {
            // 3. Download
            const downloadUrl = `/api/convert/download/${jobId}`;

            const fileRes = await fetch(downloadUrl);
            const blob = await fileRes.blob();
            const blobUrl = URL.createObjectURL(blob);

            const { JobStore } = await import("@/lib/job-store");
            JobStore.set(jobId, blobUrl, filename);

            router.push(`/preview/${jobId}`);
            return;
          } else if (statusData.state === "failed") {
            throw new Error("Conversion failed in worker");
          } else {
            setTimeout(checkStatus, 1000);
          }
        };

        await checkStatus();
      }
    } catch (error: any) {
      console.error("Error converting HTML:", error);
      alert(`Conversion failed: ${error.message || "Please try again."}`);
    } finally {
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
              onClick={() => fileInputRef.current?.click()}
              className={cn(
                "border-2 border-dashed rounded-2xl p-12 flex flex-col items-center justify-center cursor-pointer transition-all duration-300 group",
                file
                  ? "border-orange-500/50 bg-orange-500/10"
                  : "border-white/10 hover:border-white/20 hover:bg-white/5"
              )}
              whileHover={{ scale: file ? 1 : 1.01 }}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".html,.htm"
                onChange={handleFileChange}
                className="hidden"
                aria-label="Upload HTML file"
              />

              {file ? (
                <motion.div
                  className="text-center"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                >
                  <div className="w-16 h-16 rounded-2xl bg-orange-500/20 flex items-center justify-center mb-4 mx-auto">
                    <FileCode className="w-8 h-8 text-orange-400" />
                  </div>
                  <p className="font-semibold text-lg text-white mb-1">
                    {file.name}
                  </p>
                  <p className="text-sm text-orange-400 font-medium">
                    {(file.size / 1024).toFixed(1)} KB • Ready to convert
                  </p>
                </motion.div>
              ) : (
                <>
                  <motion.div
                    className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mb-4 group-hover:bg-white/10 transition-colors"
                    whileHover={{ rotate: [0, -10, 10, -10, 0] }}
                    transition={{ duration: 0.5 }}
                  >
                    <Upload className="w-8 h-8 text-gray-400 group-hover:text-white transition-colors" />
                  </motion.div>
                  <p className="text-white font-semibold text-lg mb-1">
                    Click to upload HTML file
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
            (subTab === "file" && !file) ||
            (subTab === "code" && !code)
          }
          className={cn(
            "w-full py-4 rounded-xl font-bold text-base flex items-center justify-center gap-2.5 transition-all duration-300 focus-ring",
            (subTab === "file" && !file) || (subTab === "code" && !code)
              ? "bg-white/5 text-gray-500 cursor-not-allowed"
              : "bg-gradient-to-r from-orange-500 to-red-600 text-white shadow-lg shadow-orange-900/30"
          )}
          whileHover={
            (subTab === "file" && file) || (subTab === "code" && code)
              ? {
                  scale: 1.02,
                  boxShadow: "0 20px 40px rgba(249, 115, 22, 0.4)",
                }
              : {}
          }
          whileTap={
            (subTab === "file" && file) || (subTab === "code" && code)
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
    </div>
  );
}
