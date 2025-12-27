"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push("/login");
      } else {
        // GOOGLE BYPASS RULE:
        // Google users have providerId = 'google.com' in providerData.
        // We always treat them as verified.
        const isGoogle = user.providerData.some(
          (p) => p.providerId === "google.com"
        );

        if (!user.emailVerified && !isGoogle) {
          router.push("/verify-email");
        } else {
          setIsChecking(false);
        }
      }
    }
  }, [user, loading, router]);

  if (loading || isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a] text-white">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
          <p className="text-gray-400 text-sm">Verifying access...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
