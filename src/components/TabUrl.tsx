'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Globe, ArrowRight, Loader2, AlertTriangle, Check, Wifi, Sparkles } from 'lucide-react';
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
        body: JSON.stringify({ url }),
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
          Website to PDF
        </h2>
        <p className="text-sm text-gray-400">Convert any public website URL into a PDF document</p>
      </motion.div>

      {/* URL Input Section */}
      <div className="space-y-4">
        <div className="relative group">
          <motion.div 
            className="absolute inset-y-0 left-5 flex items-center pointer-events-none"
            animate={{ scale: url ? 1.1 : 1 }}
            transition={{ type: "spring", stiffness: 400, damping: 20 }}
          >
            <Globe className={cn(
              "w-5 h-5 transition-colors duration-300",
              url ? "text-blue-400" : "text-gray-500 group-focus-within:text-blue-400"
            )} />
          </motion.div>
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://example.com"
            className="w-full bg-black/40 border-2 border-white/10 rounded-2xl py-4 pl-14 pr-6 text-white placeholder:text-gray-600 focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all"
            aria-label="Website URL input"
          />
          {url && (
            <motion.div
              className="absolute right-5 top-1/2 -translate-y-1/2"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: "spring", stiffness: 500, damping: 25 }}
            >
              <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
            </motion.div>
          )}
        </div>

        {/* Internet Required Warning Banner */}
        <motion.div
          className="flex items-start gap-3 p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Wifi className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-blue-200">
            <p className="font-medium mb-1">Internet Connection Required</p>
            <p className="text-blue-300/80 text-xs">This feature needs to fetch website content online. Your privacy is protected.</p>
          </div>
        </motion.div>

        {/* Confirmation Modal */}
        <AnimatePresence>
          {showConfirmation && (
            <motion.div
              initial={{ opacity: 0, height: 0, marginTop: 0 }}
              animate={{ opacity: 1, height: 'auto', marginTop: '1rem' }}
              exit={{ opacity: 0, height: 0, marginTop: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="bg-yellow-500/10 border-2 border-yellow-500/30 rounded-2xl p-6">
                <div className="flex gap-4">
                  <motion.div 
                    className="flex-shrink-0"
                    animate={{ rotate: [0, -10, 10, -10, 0] }}
                    transition={{ duration: 0.5 }}
                  >
                    <div className="w-12 h-12 rounded-xl bg-yellow-500/20 flex items-center justify-center">
                      <AlertTriangle className="w-6 h-6 text-yellow-400" />
                    </div>
                  </motion.div>
                  <div className="space-y-4 flex-1">
                    <div>
                      <p className="font-semibold text-yellow-100 mb-2">
                        Confirm Internet Access
                      </p>
                      <p className="text-sm text-yellow-200/80">
                        This action requires internet access to fetch the website content. 
                        Do you want to proceed with the conversion?
                      </p>
                    </div>
                    <div className="flex gap-3">
                      <motion.button
                        onClick={confirmConversion}
                        disabled={isConverting}
                        className="bg-yellow-400 hover:bg-yellow-300 text-black px-6 py-2.5 rounded-xl text-sm font-semibold transition-colors flex items-center gap-2 focus-ring disabled:opacity-50"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        {isConverting ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            <span>Converting...</span>
                          </>
                        ) : (
                          <>
                            <Check className="w-4 h-4" />
                            <span>Allow & Convert</span>
                          </>
                        )}
                      </motion.button>
                      <motion.button
                        onClick={() => setShowConfirmation(false)}
                        disabled={isConverting}
                        className="text-yellow-400 hover:text-yellow-300 px-4 py-2.5 text-sm font-semibold transition-colors focus-ring disabled:opacity-50"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        Cancel
                      </motion.button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Continue Button */}
        {!showConfirmation && (
          <motion.div 
            className="pt-4"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <motion.button
              onClick={handleConvertClick}
              disabled={isConverting || !url}
              className={cn(
                "w-full py-4 rounded-xl font-bold text-base flex items-center justify-center gap-2.5 transition-all duration-300 focus-ring",
                !url
                  ? "bg-white/5 text-gray-500 cursor-not-allowed"
                  : "bg-gradient-to-r from-blue-500 to-cyan-600 text-white shadow-lg shadow-blue-900/30"
              )}
              whileHover={url ? { scale: 1.02, boxShadow: "0 20px 40px rgba(59, 130, 246, 0.4)" } : {}}
              whileTap={url ? { scale: 0.98 } : {}}
            >
              <span>Continue</span>
              <ArrowRight className="w-5 h-5" />
            </motion.button>
          </motion.div>
        )}
      </div>
    </div>
  );
}
