"use client";

import { useAuth } from "@/context/AuthContext";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  collection,
  query,
  where,
  orderBy,
  getDocs,
  limit,
  Timestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase/client";
import { motion } from "framer-motion";
import { FileText, Download, Clock, ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";

interface ConversionLog {
  id: string;
  fileName: string;
  fileType: string;
  createdAt: any;
  downloadUrl: string;
}

export default function HistoryPage() {
  const { user, plan, loading: authLoading } = useAuth();
  const router = useRouter();
  const [history, setHistory] = useState<ConversionLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;

    if (!user) {
      router.push("/login");
      return;
    }

    if (plan !== "premium") {
      router.push("/premium");
      return;
    }

    async function fetchHistory() {
      if (!user || !db) return;
      try {
        // Last 5 days calculated on client
        const fiveDaysAgo = new Date();
        fiveDaysAgo.setDate(fiveDaysAgo.getDate() - 5);

        const q = query(
          collection(db, "conversions"),
          where("uid", "==", user.uid),
          where("createdAt", ">=", Timestamp.fromDate(fiveDaysAgo)),
          orderBy("createdAt", "desc"),
          limit(20)
        );
        const snapshot = await getDocs(q);
        const logs = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as ConversionLog[];
        setHistory(logs);
      } catch (e) {
        console.error("Error fetching history:", e);
      } finally {
        setLoading(false);
      }
    }

    fetchHistory();
  }, [user, plan, authLoading, router]);

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center text-white">
        <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white pt-20 pb-12 px-4">
      <div className="max-w-4xl mx-auto space-y-8">
        <header className="flex items-center justify-between">
          <Link
            href="/dashboard"
            className="inline-flex items-center text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Dashboard
          </Link>
          <h1 className="text-2xl font-bold">Conversion History</h1>
        </header>

        <div className="space-y-4">
          {history.length === 0 ? (
            <div className="text-center py-16 bg-white/5 rounded-2xl border border-white/10">
              <Clock className="w-12 h-12 text-gray-500 mx-auto mb-4" />
              <p className="text-gray-400 text-lg">
                No conversion history found.
              </p>
              <p className="text-gray-600 text-sm">
                Your recent conversions will appear here.
              </p>
            </div>
          ) : (
            history.map((item, i) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-medium text-white">{item.fileName}</p>
                    <p className="text-xs text-gray-500">
                      {item.createdAt?.seconds
                        ? new Date(
                            item.createdAt.seconds * 1000
                          ).toLocaleString()
                        : "Just now"}
                    </p>
                  </div>
                </div>

                <a
                  href={item.downloadUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                  title="Download"
                >
                  <Download className="w-5 h-5" />
                </a>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </main>
  );
}
