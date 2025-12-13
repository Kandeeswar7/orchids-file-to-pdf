'use client';

import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, FileCode, Code, ArrowRight, Loader2, FileType } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';

type SubTab = 'file' | 'code';

export function TabHtml() {
  const [subTab, setSubTab] = useState<SubTab>('file');
  const [file, setFile] = useState<File | null>(null);
  const [code, setCode] = useState('');
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
      
      if (subTab === 'file' && file) {
        // Read file as text
        const text = await file.text();
        response = await fetch('/api/convert/html', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            html: text,
            source: 'file',
            filename: file.name
          }),
        });
      } else if (subTab === 'code' && code) {
        response = await fetch('/api/convert/html', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            html: code,
            source: 'code'
          }),
        });
      }

      if (response?.ok) {
        const { jobId } = await response.json();
        router.push(`/preview/${jobId}`);
      } else {
        console.error('Conversion failed');
      }
    } catch (error) {
      console.error('Error converting HTML:', error);
    } finally {
      setIsConverting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col items-center justify-center space-y-2 text-center mb-6">
        <h2 className="text-xl font-semibold text-white">HTML to PDF</h2>
        <p className="text-sm text-gray-400">Convert HTML files or raw code into professional PDFs</p>
      </div>

      {/* Sub-tabs */}
      <div className="flex justify-center mb-6">
        <div className="flex p-1 bg-white/5 rounded-lg border border-white/10">
          <button
            onClick={() => setSubTab('file')}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all",
              subTab === 'file' ? "bg-white/10 text-white shadow-sm" : "text-gray-400 hover:text-white"
            )}
          >
            <FileType className="w-4 h-4" />
            Upload File
          </button>
          <button
            onClick={() => setSubTab('code')}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all",
              subTab === 'code' ? "bg-white/10 text-white shadow-sm" : "text-gray-400 hover:text-white"
            )}
          >
            <Code className="w-4 h-4" />
            Paste Code
          </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {subTab === 'file' ? (
          <motion.div
            key="file"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            className="space-y-4"
          >
            <div
              onClick={() => fileInputRef.current?.click()}
              className={cn(
                "border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center cursor-pointer transition-all duration-300",
                file 
                  ? "border-green-500/50 bg-green-500/10" 
                  : "border-white/10 hover:border-white/20 hover:bg-white/5"
              )}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".html,.htm"
                onChange={handleFileChange}
                className="hidden"
              />
              
              {file ? (
                <>
                  <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center mb-3">
                    <FileCode className="w-6 h-6 text-green-400" />
                  </div>
                  <p className="font-medium text-green-400">{file.name}</p>
                  <p className="text-sm text-green-500/60 mt-1">{(file.size / 1024).toFixed(1)} KB</p>
                </>
              ) : (
                <>
                  <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mb-3 group-hover:bg-white/10 transition-colors">
                    <Upload className="w-6 h-6 text-gray-400 group-hover:text-white" />
                  </div>
                  <p className="text-gray-300 font-medium">Click to upload HTML file</p>
                  <p className="text-sm text-gray-500 mt-1">or drag and drop</p>
                </>
              )}
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="code"
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            className="space-y-4"
          >
            <div className="relative">
              <textarea
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="<!DOCTYPE html><html><body><h1>Hello World</h1></body></html>"
                className="w-full h-48 bg-black/40 border border-white/10 rounded-xl p-4 font-mono text-sm text-gray-300 placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-orange-500/50 resize-none"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="pt-4">
        <button
          onClick={handleConvert}
          disabled={isConverting || (subTab === 'file' && !file) || (subTab === 'code' && !code)}
          className={cn(
            "w-full py-4 rounded-xl font-medium flex items-center justify-center gap-2 transition-all duration-300",
            (subTab === 'file' && !file) || (subTab === 'code' && !code)
              ? "bg-white/5 text-gray-500 cursor-not-allowed"
              : "bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg shadow-orange-500/20 hover:shadow-orange-500/30 hover:scale-[1.02]"
          )}
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
        </button>
      </div>
    </div>
  );
}
