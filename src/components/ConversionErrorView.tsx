"use client";

import { motion } from "framer-motion";
import {
  AlertCircle,
  FileWarning,
  RotateCcw,
  Upload,
  Wrench,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface ConversionErrorViewProps {
  fileName?: string;
  fileType: "word" | "excel" | "html";
  onRetry: () => void;
  onUploadAnother: () => void;
  errorType?: "timeout" | "generic";
}

export function ConversionErrorView({
  fileName,
  fileType,
  onRetry,
  onUploadAnother,
  errorType = "generic",
}: ConversionErrorViewProps) {
  const getAccentColor = () => {
    switch (fileType) {
      case "word":
        return "blue";
      case "excel":
        return "emerald";
      case "html":
        return "orange";
      default:
        return "blue";
    }
  };

  const color = getAccentColor();
  const isTimeout = errorType === "timeout";

  return (
    <div className="w-full flex flex-col items-center justify-center p-8 bg-[#0a0a0a] rounded-3xl min-h-[500px] border border-white/5 relative overflow-hidden">
      {/* Ambient Background */}
      <div
        className={cn(
          "absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-red-500/50 to-transparent opacity-50"
        )}
      />
      <div
        className={cn(
          "absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-red-500/20 to-transparent opacity-20"
        )}
      />
      <div className="absolute inset-0 bg-red-500/5 blur-3xl pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="z-10 flex flex-col items-center text-center max-w-lg mx-auto"
      >
        {/* Icon */}
        <div className="w-20 h-20 bg-red-500/10 rounded-3xl flex items-center justify-center mb-8 border border-red-500/20 shadow-2xl shadow-red-500/10">
          <FileWarning className="w-10 h-10 text-red-400" />
        </div>

        {/* Title */}
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 tracking-tight">
          {isTimeout
            ? "Taking longer than expected..."
            : "Oh no! We couldn’t process your file."}
        </h2>

        {/* Subtitle */}
        <p className="text-gray-400 text-lg mb-8 leading-relaxed">
          {fileName ? (
            <span className="block mb-2 font-medium text-gray-300">
              "{fileName}"
            </span>
          ) : null}
          {isTimeout
            ? "The server is busy or the file is complex. Please try again."
            : "This file could not be converted because it may be damaged or contains unsupported content."}
        </p>

        {/* Explanation Block */}
        <div className="w-full bg-white/5 border border-white/10 rounded-xl p-6 mb-8 text-left">
          <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wider mb-4 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-400" />
            Possible Reasons
          </h3>
          <ul className="space-y-3 text-sm text-gray-400">
            <li className="flex items-start gap-3">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500/50 mt-1.5 shrink-0" />
              Damaged or corrupted file structure
            </li>
            <li className="flex items-start gap-3">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500/50 mt-1.5 shrink-0" />
              File opens in other software but is unreadable by our converter
            </li>
            <li className="flex items-start gap-3">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500/50 mt-1.5 shrink-0" />
              Contains password protection or complex embedded objects
            </li>
          </ul>
        </div>

        {/* Actions */}
        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 w-full">
          <button
            onClick={onRetry}
            className={cn(
              "flex-1 py-3.5 px-6 rounded-xl font-bold text-white shadow-lg transition-all focus-ring flex items-center justify-center gap-2",
              fileType === "word" &&
                "bg-blue-600 hover:bg-blue-500 shadow-blue-900/20",
              fileType === "excel" &&
                "bg-emerald-600 hover:bg-emerald-500 shadow-emerald-900/20",
              fileType === "html" &&
                "bg-orange-600 hover:bg-orange-500 shadow-orange-900/20"
            )}
          >
            <RotateCcw className="w-4 h-4" />
            Retry {fileType.charAt(0).toUpperCase() + fileType.slice(1)} to PDF
          </button>

          <button
            onClick={onUploadAnother}
            className="flex-1 py-3.5 px-6 rounded-xl font-semibold text-gray-300 bg-white/5 border border-white/10 hover:bg-white/10 hover:text-white transition-all focus-ring flex items-center justify-center gap-2"
          >
            <Upload className="w-4 h-4" />
            Upload another file
          </button>
        </div>

        {/* Repair Steps */}
        {(fileType === "word" || fileType === "excel") && (
          <div className="w-full mt-8 bg-white/5 border border-white/10 rounded-xl p-6 text-left">
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
              <Wrench className="w-4 h-4 text-gray-400" />
              How to fix this file
            </h3>

            <div className="space-y-4">
              <ol className="list-decimal list-inside space-y-2 text-sm text-gray-300">
                <li>
                  Open the file in{" "}
                  <strong className="text-white">
                    {fileType === "word" ? "Microsoft Word" : "Microsoft Excel"}
                  </strong>
                </li>
                <li>
                  Click <span className="text-white">File</span> →{" "}
                  <span className="text-white">Save As</span>
                </li>
                <li>
                  Save again as a{" "}
                  <strong className="text-white">
                    {fileType === "word"
                      ? "Word Document (.docx)"
                      : "Excel Workbook (.xlsx)"}
                  </strong>
                </li>
                <li>Upload the newly saved file and try again</li>
              </ol>

              <div className="bg-black/20 rounded-lg p-3 text-sm text-gray-400 leading-relaxed">
                <p className="mb-2">
                  <span className="text-gray-300 font-medium">
                    {fileType === "word" ? "Microsoft Word" : "Microsoft Excel"}
                  </span>{" "}
                  automatically repairs many document issues when re-saving.
                  This fixes most conversion problems.
                </p>
                <div className="flex flex-col gap-1 mt-2 pt-2 border-t border-white/5">
                  <span className="text-xs font-semibold text-gray-500 uppercase">
                    Optional tips
                  </span>
                  <ul className="list-disc list-inside text-xs text-gray-400 space-y-1">
                    <li>Remove tracked changes or comments</li>
                    <li>Reduce very large embedded images</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}
