'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileSpreadsheet, FileCode, Globe } from 'lucide-react';
import { TabExcel } from './TabExcel';
import { TabHtml } from './TabHtml';
import { TabUrl } from './TabUrl';
import { cn } from '@/lib/utils';

type Tab = 'excel' | 'html' | 'url';

export function ConversionCard() {
  const [activeTab, setActiveTab] = useState<Tab>('excel');

  const tabs = [
    { id: 'excel', label: 'Excel', icon: FileSpreadsheet, color: 'text-emerald-400', gradientFrom: 'from-emerald-500', gradientTo: 'to-green-600' },
    { id: 'html', label: 'HTML', icon: FileCode, color: 'text-orange-400', gradientFrom: 'from-orange-500', gradientTo: 'to-red-600' },
    { id: 'url', label: 'URL', icon: Globe, color: 'text-blue-400', gradientFrom: 'from-blue-500', gradientTo: 'to-cyan-600' },
  ] as const;

  return (
    <div className="w-full max-w-3xl mx-auto">
      {/* Tab Navigation with Enhanced Motion */}
      <motion.div 
        className="flex justify-center mb-10"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.5 }}
      >
        <div className="flex p-1.5 glass rounded-2xl shadow-xl" role="tablist" aria-label="Conversion types">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <motion.button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                role="tab"
                aria-selected={isActive}
                aria-controls={`panel-${tab.id}`}
                className={cn(
                  "relative flex items-center gap-2.5 px-8 py-3 rounded-xl text-sm font-semibold transition-all duration-300 focus-ring",
                  isActive ? "text-white" : "text-gray-400 hover:text-gray-200"
                )}
                whileHover={{ scale: isActive ? 1 : 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeTabBackground"
                    className={cn(
                      "absolute inset-0 rounded-xl shadow-lg",
                      "bg-gradient-to-br",
                      tab.gradientFrom,
                      tab.gradientTo
                    )}
                    initial={false}
                    transition={{ 
                      type: "spring", 
                      bounce: 0.2, 
                      duration: 0.6 
                    }}
                  />
                )}
                <tab.icon 
                  className={cn(
                    "w-4 h-4 z-10 transition-all duration-300",
                    isActive ? "scale-110" : ""
                  )} 
                />
                <span className="z-10">{tab.label}</span>
                
                {isActive && (
                  <motion.div
                    className="absolute -inset-1 bg-gradient-to-br opacity-20 rounded-xl blur-md -z-10"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.2 }}
                    exit={{ opacity: 0 }}
                  >
                    <div className={cn("w-full h-full bg-gradient-to-br", tab.gradientFrom, tab.gradientTo)} />
                  </motion.div>
                )}
              </motion.button>
            );
          })}
        </div>
      </motion.div>

      {/* Main Card with Premium Glassmorphism */}
      <motion.div 
        className="relative group"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9, duration: 0.6 }}
      >
        {/* Ambient Glow */}
        <motion.div 
          className={cn(
            "absolute -inset-0.5 rounded-3xl opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500",
            "bg-gradient-to-r",
            tabs.find(t => t.id === activeTab)?.gradientFrom,
            tabs.find(t => t.id === activeTab)?.gradientTo
          )}
          animate={{
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        
        {/* Card Container */}
        <div className="relative card-elevated rounded-3xl overflow-hidden backdrop-blur-xl">
          <div className="p-1.5">
            <div className="bg-[#0f0f0f] rounded-2xl p-8 sm:p-10 min-h-[500px]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  id={`panel-${activeTab}`}
                  role="tabpanel"
                  aria-labelledby={`tab-${activeTab}`}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                >
                  {activeTab === 'excel' && <TabExcel />}
                  {activeTab === 'html' && <TabHtml />}
                  {activeTab === 'url' && <TabUrl />}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}