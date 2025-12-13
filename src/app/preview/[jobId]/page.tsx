'use client';

import { useEffect, useState, use } from 'react';
import { motion } from 'framer-motion';
import { Download, ExternalLink, ArrowLeft, Loader2, AlertCircle, FileText, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

interface JobStatus {
  id: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  resultUrl?: string;
  error?: string;
}

export default function PreviewPage({ params }: { params: Promise<{ jobId: string }> }) {
  const { jobId } = use(params);
  const [job, setJob] = useState<JobStatus | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    const checkStatus = async () => {
      try {
        const res = await fetch(`/api/convert/status/${jobId}`);
        if (!res.ok) throw new Error('Failed to fetch status');
        
        const data = await res.json();
        setJob(data);

        if (data.status === 'completed' || data.status === 'failed') {
          clearInterval(intervalId);
        }
      } catch (err) {
        console.error('Error polling status:', err);
        setError('Failed to check conversion status');
      }
    };

    // Initial check
    checkStatus();

    // Poll every 2 seconds
    intervalId = setInterval(checkStatus, 2000);

    return () => clearInterval(intervalId);
  }, [jobId]);

  if (error || job?.status === 'failed') {
    return (
      <main className="min-h-screen bg-[#0a0a0a] text-white flex items-center justify-center p-4">
        <div className="max-w-md w-full text-center space-y-6">
          <div className="w-20 h-20 rounded-full bg-red-500/10 flex items-center justify-center mx-auto">
            <AlertCircle className="w-10 h-10 text-red-500" />
          </div>
          <h1 className="text-2xl font-bold">Conversion Failed</h1>
          <p className="text-gray-400">
            {job?.error || error || 'Something went wrong during the conversion process.'}
          </p>
          <Link 
            href="/"
            className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
        </div>
      </main>
    );
  }

  if (!job || job.status === 'pending' || job.status === 'processing') {
    return (
      <main className="min-h-screen bg-[#0a0a0a] text-white flex items-center justify-center p-4 relative overflow-hidden">
        {/* Background Gradients */}
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-purple-600/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />

        <div className="z-10 text-center space-y-8">
          <div className="relative w-24 h-24 mx-auto">
            <motion.div
              className="absolute inset-0 rounded-full border-t-2 border-r-2 border-purple-500"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            />
            <motion.div
              className="absolute inset-2 rounded-full border-t-2 border-l-2 border-blue-500"
              animate={{ rotate: -360 }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <FileText className="w-8 h-8 text-white/50" />
            </div>
          </div>
          
          <div className="space-y-2">
            <h2 className="text-2xl font-bold">Converting your file...</h2>
            <p className="text-gray-400">This usually takes a few seconds.</p>
          </div>
        </div>
      </main>
    );
  }

  const downloadUrl = `/api/convert/download/${jobId}`;

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white flex flex-col p-4 md:p-8 h-screen">
      <header className="flex items-center justify-between mb-6 shrink-0">
        <Link 
          href="/"
          className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors group"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span>Back to Converter</span>
        </Link>
        
        <div className="flex gap-3">
          <a
            href={downloadUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-sm font-medium transition-colors"
          >
            <ExternalLink className="w-4 h-4" />
            <span className="hidden md:inline">Open in New Tab</span>
          </a>
          <a
            href={downloadUrl}
            download
            className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-400 hover:to-emerald-400 text-white rounded-lg text-sm font-medium shadow-lg shadow-green-500/20 transition-all hover:scale-[1.02]"
          >
            <Download className="w-4 h-4" />
            <span>Download PDF</span>
          </a>
        </div>
      </header>

      <div className="flex-1 bg-[#161616] rounded-2xl border border-white/10 overflow-hidden relative shadow-2xl">
        <iframe
          src={downloadUrl}
          className="w-full h-full border-none bg-white"
          title="PDF Preview"
        />
      </div>
    </main>
  );
}
