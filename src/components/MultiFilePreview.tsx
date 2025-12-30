"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  Download,
  CheckCircle2,
  X,
  ExternalLink,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Job {
  id: string;
  filename: string;
  blobUrl: string; // Must be a Blob URL for iframe support
}

interface MultiFilePreviewProps {
  jobs: Job[];
  onFinish: () => void;
}

export function MultiFilePreview({ jobs, onFinish }: MultiFilePreviewProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const currentJob = jobs[currentIndex];

  if (!currentJob) return null;

  const handleNext = () => {
    if (currentIndex < jobs.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed inset-0 z-50 flex flex-col bg-[#0a0a0a]/95 backdrop-blur-md"
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-white/10 bg-[#0a0a0a]">
        <div className="flex items-center gap-4">
          <div className="flex flex-col">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-green-400" />
              Conversion Complete
            </h3>
            <p className="text-sm text-gray-400">
              Reviewing file {currentIndex + 1} of {jobs.length}:{" "}
              <span className="text-white font-medium">
                {currentJob.filename}
              </span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <motion.a
            href={currentJob.blobUrl}
            download={currentJob.filename.replace(/\.[^/.]+$/, "") + ".pdf"}
            className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-sm font-medium transition-colors"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">Download</span>
          </motion.a>

          <motion.button
            onClick={onFinish}
            className="flex items-center gap-2 px-6 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm font-bold shadow-lg shadow-blue-500/20 transition-all"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Finish & View History
          </motion.button>
        </div>
      </div>

      {/* Main Preview Area */}
      <div className="flex-1 relative flex overflow-hidden">
        {/* Previous Button */}
        <button
          onClick={handlePrevious}
          disabled={currentIndex === 0}
          aria-label="Previous file"
          title="Previous file"
          className={cn(
            "absolute left-4 top-1/2 -translate-y-1/2 z-10 p-3 rounded-full bg-black/50 hover:bg-black/70 border border-white/10 text-white transition-all",
            currentIndex === 0 && "opacity-0 pointer-events-none"
          )}
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        {/* Next Button */}
        <button
          onClick={handleNext}
          disabled={currentIndex === jobs.length - 1}
          aria-label="Next file"
          title="Next file"
          className={cn(
            "absolute right-4 top-1/2 -translate-y-1/2 z-10 p-3 rounded-full bg-black/50 hover:bg-black/70 border border-white/10 text-white transition-all",
            currentIndex === jobs.length - 1 && "opacity-0 pointer-events-none"
          )}
        >
          <ChevronRight className="w-6 h-6" />
        </button>

        {/* PDF Iframe */}
        <div className="flex-1 p-4 md:p-8 flex items-center justify-center">
          <div className="w-full h-full max-w-5xl bg-white rounded-xl shadow-2xl overflow-hidden relative">
            <iframe
              key={currentJob.id} // Re-mount on change
              src={currentJob.blobUrl}
              className="w-full h-full border-none"
              title={`Preview ${currentJob.filename}`}
            />
          </div>
        </div>
      </div>

      {/* Footer Navigation Indicators */}
      <div className="p-4 border-t border-white/10 bg-[#0a0a0a] flex justify-center gap-2">
        {jobs.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentIndex(idx)}
            aria-label={`Go to file ${idx + 1}`}
            className={cn(
              "w-2.5 h-2.5 rounded-full transition-all",
              idx === currentIndex
                ? "bg-blue-500 scale-125"
                : "bg-white/20 hover:bg-white/40"
            )}
          />
        ))}
      </div>
    </motion.div>
  );
}
