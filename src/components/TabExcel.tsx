'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Upload, FileSpreadsheet, Settings, Check, ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';

export function TabExcel() {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const [options, setOptions] = useState({
    orientation: 'portrait',
    pageSize: 'A4',
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
      // Convert file to base64
      const reader = new FileReader();
      reader.onload = async (e) => {
        const base64 = e.target?.result?.toString().split(',')[1];
        
        const res = await fetch('/api/convert/excel', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            fileData: base64,
            options,
          }),
        });

        const data = await res.json();
        if (data.jobId) {
          router.push(`/preview/${data.jobId}`);
        }
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error('Conversion failed:', error);
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* File Upload Area */}
      <div
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        className={cn(
          "relative border-2 border-dashed rounded-xl p-8 transition-all duration-300 flex flex-col items-center justify-center text-center cursor-pointer group",
          isDragging ? "border-green-500 bg-green-500/10" : "border-white/10 hover:border-white/20 hover:bg-white/5",
          file ? "border-green-500/50 bg-green-500/5" : ""
        )}
      >
        <input
          type="file"
          accept=".xlsx,.xls,.csv"
          onChange={(e) => e.target.files?.[0] && setFile(e.target.files[0])}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
        
        <div className="bg-white/5 p-4 rounded-full mb-4 group-hover:scale-110 transition-transform duration-300">
          {file ? <FileSpreadsheet className="w-8 h-8 text-green-400" /> : <Upload className="w-8 h-8 text-gray-400" />}
        </div>
        
        {file ? (
          <div>
            <p className="text-white font-medium">{file.name}</p>
            <p className="text-sm text-gray-400">{(file.size / 1024).toFixed(1)} KB</p>
          </div>
        ) : (
          <div>
            <p className="text-white font-medium mb-1">Drop Excel file here</p>
            <p className="text-sm text-gray-400">or click to browse</p>
          </div>
        )}
      </div>

      {/* Options */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-xs font-medium text-gray-400 uppercase tracking-wider">Orientation</label>
          <div className="flex gap-2 bg-white/5 p-1 rounded-lg">
            {['portrait', 'landscape'].map((o) => (
              <button
                key={o}
                onClick={() => setOptions({ ...options, orientation: o })}
                className={cn(
                  "flex-1 py-1.5 text-xs font-medium rounded-md transition-all",
                  options.orientation === o ? "bg-white/10 text-white shadow-sm" : "text-gray-400 hover:text-white"
                )}
              >
                {o.charAt(0).toUpperCase() + o.slice(1)}
              </button>
            ))}
          </div>
        </div>
        
        <div className="space-y-2">
          <label className="text-xs font-medium text-gray-400 uppercase tracking-wider">Page Size</label>
          <div className="flex gap-2 bg-white/5 p-1 rounded-lg">
            {['A4', 'Letter'].map((s) => (
              <button
                key={s}
                onClick={() => setOptions({ ...options, pageSize: s })}
                className={cn(
                  "flex-1 py-1.5 text-xs font-medium rounded-md transition-all",
                  options.pageSize === s ? "bg-white/10 text-white shadow-sm" : "text-gray-400 hover:text-white"
                )}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Gridlines Toggle */}
      <button
        onClick={() => setOptions({ ...options, gridlines: !options.gridlines })}
        className="flex items-center gap-3 w-full p-3 rounded-lg hover:bg-white/5 transition-colors group"
      >
        <div className={cn(
          "w-5 h-5 rounded border flex items-center justify-center transition-colors",
          options.gridlines ? "bg-green-500 border-green-500" : "border-gray-500 group-hover:border-gray-400"
        )}>
          {options.gridlines && <Check className="w-3.5 h-3.5 text-black" />}
        </div>
        <span className="text-sm text-gray-300 group-hover:text-white">Include Gridlines</span>
      </button>

      {/* Convert Button */}
      <button
        disabled={!file || loading}
        onClick={handleConvert}
        className={cn(
          "w-full py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition-all duration-300 shadow-lg shadow-green-900/20",
          file && !loading
            ? "bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-400 hover:to-emerald-500 text-white hover:scale-[1.02]"
            : "bg-white/5 text-gray-500 cursor-not-allowed"
        )}
      >
        {loading ? (
          <>
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            <span>Processing...</span>
          </>
        ) : (
          <>
            <span>Convert to PDF</span>
            <ArrowRight className="w-5 h-5" />
          </>
        )}
      </button>
    </div>
  );
}
