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
    { id: 'excel', label: 'Excel', icon: FileSpreadsheet, color: 'text-green-400' },
    { id: 'html', label: 'HTML', icon: FileCode, color: 'text-orange-400' },
    { id: 'url', label: 'URL', icon: Globe, color: 'text-blue-400' },
  ] as const;

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Tab Navigation */}
      <div className="flex justify-center mb-8">
        <div className="flex p-1 bg-white/5 backdrop-blur-xl border border-white/10 rounded-full">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "relative flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-300",
                  isActive ? "text-white" : "text-gray-400 hover:text-white"
                )}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 bg-white/10 rounded-full shadow-[0_0_20px_rgba(255,255,255,0.1)]"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
                <tab.icon className={cn("w-4 h-4 z-10", isActive ? tab.color : "")} />
                <span className="z-10">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Card */}
      <div className="relative group">
        <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-blue-600 rounded-3xl opacity-20 group-hover:opacity-30 blur transition duration-500" />
        
        <div className="relative bg-[#111111] border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
          <div className="p-1">
            <div className="bg-[#161616] rounded-xl p-6 min-h-[400px]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                >
                  {activeTab === 'excel' && <TabExcel />}
                  {activeTab === 'html' && <TabHtml />}
                  {activeTab === 'url' && <TabUrl />}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
