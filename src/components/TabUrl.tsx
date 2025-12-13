'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Globe, ArrowRight, Loader2, AlertTriangle, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';

export function TabUrl() {
  const [url, setUrl] = useState('');
  const [isConverting, setIsConverting] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const router = useRouter();

  const handleConvertClick = () => {
    if (url) {
      setShowConfirmation(true);
    }
  };

  const confirmConversion = async () => {
    try {
      setIsConverting(true);
      
      const response = await fetch('/api/convert/url', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          url
        }),
      });

      if (response.ok) {
        const { jobId } = await response.json();
        router.push(`/preview/${jobId}`);
      } else {
        console.error('Conversion failed');
      }
    } catch (error) {
      console.error('Error converting URL:', error);
    } finally {
      setIsConverting(false);
      setShowConfirmation(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col items-center justify-center space-y-2 text-center mb-6">
        <h2 className="text-xl font-semibold text-white">Website to PDF</h2>
        <p className="text-sm text-gray-400">Convert any public website URL into a PDF</p>
      </div>

      <div className="space-y-4">
        <div className="relative group">
          <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
            <Globe className="w-5 h-5 text-gray-500 group-focus-within:text-blue-400 transition-colors" />
          </div>
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://example.com"
            className="w-full bg-black/40 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
          />
        </div>

        <AnimatePresence>
          {showConfirmation && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-4 flex gap-4">
                <div className="flex-shrink-0">
                  <AlertTriangle className="w-5 h-5 text-yellow-500" />
                </div>
                <div className="space-y-3">
                  <p className="text-sm text-yellow-200">
                    This action requires internet access to fetch the website content. 
                    Do you want to proceed?
                  </p>
                  <div className="flex gap-3">
                    <button
                      onClick={confirmConversion}
                      disabled={isConverting}
                      className="bg-yellow-500 hover:bg-yellow-400 text-black px-4 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
                    >
                      {isConverting ? <Loader2 className="w-3 h-3 animate-spin" /> : <Check className="w-3 h-3" />}
                      Allow & Convert
                    </button>
                    <button
                      onClick={() => setShowConfirmation(false)}
                      disabled={isConverting}
                      className="text-yellow-500 hover:text-yellow-400 text-sm font-medium transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {!showConfirmation && (
          <div className="pt-4">
            <button
              onClick={handleConvertClick}
              disabled={isConverting || !url}
              className={cn(
                "w-full py-4 rounded-xl font-medium flex items-center justify-center gap-2 transition-all duration-300",
                !url
                  ? "bg-white/5 text-gray-500 cursor-not-allowed"
                  : "bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30 hover:scale-[1.02]"
              )}
            >
              <span>Continue</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
