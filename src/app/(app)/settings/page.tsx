"use client";

import { useAuth } from "@/context/AuthContext";
import { User, Shield, Key } from "lucide-react";

export default function SettingsPage() {
  const { user } = useAuth();

  return (
    <div className="max-w-4xl mx-auto p-6 md:p-12 space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Settings</h1>
        <p className="text-gray-400">
          Manage your account preferences and security.
        </p>
      </div>

      <div className="grid gap-6">
        {/* Profile Card */}
        <div className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-white/20 transition-colors">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 rounded-full bg-purple-600 flex items-center justify-center text-xl font-bold text-white">
              {user?.email?.[0]?.toUpperCase() || "U"}
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">
                {user?.displayName || "User"}
              </h3>
              <p className="text-gray-400 text-sm">
                {user?.email || "No email"}
              </p>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-xs text-gray-500 uppercase tracking-wider">
                Plan
              </label>
              <div className="px-4 py-2 rounded-lg bg-black/20 border border-white/10 text-white flex justify-between items-center">
                <span>Free Plan</span>
                <span className="text-xs px-2 py-0.5 rounded bg-green-500/20 text-green-400">
                  Active
                </span>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-xs text-gray-500 uppercase tracking-wider">
                User ID
              </label>
              <div className="px-4 py-2 rounded-lg bg-black/20 border border-white/10 text-gray-400 font-mono text-xs truncate">
                {user?.uid}
              </div>
            </div>
          </div>
        </div>

        {/* Mock Settings Sections */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
            <div className="flex items-center gap-3 mb-4 text-white font-semibold">
              <Shield className="w-5 h-5 text-purple-400" />
              Security
            </div>
            <p className="text-sm text-gray-400 mb-4">
              Two-factor authentication is currently disabled.
            </p>
            <button className="px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-white text-sm border border-white/10 transition-colors">
              Enable 2FA
            </button>
          </div>

          <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
            <div className="flex items-center gap-3 mb-4 text-white font-semibold">
              <Key className="w-5 h-5 text-purple-400" />
              Password
            </div>
            <p className="text-sm text-gray-400 mb-4">
              Last changed 30 days ago.
            </p>
            <button className="px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-white text-sm border border-white/10 transition-colors">
              Change Password
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
