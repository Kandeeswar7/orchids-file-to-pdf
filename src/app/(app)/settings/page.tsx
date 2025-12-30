"use client";

import { useAuth } from "@/context/AuthContext";
import { User, Shield, Key, Trash2 } from "lucide-react";
import { useState } from "react";
import {
  reauthenticateWithCredential,
  EmailAuthProvider,
  updatePassword,
} from "firebase/auth";

export default function SettingsPage() {
  const { user, plan, deleteProfile } = useAuth();

  const handleDelete = async () => {
    if (
      confirm(
        "Are you sure you want to delete your account? This action cannot be undone."
      )
    ) {
      try {
        await deleteProfile();
      } catch (error: any) {
        if (error.code === "auth/requires-recent-login") {
          alert(
            "Security Check: Please log out and log back in to delete your account."
          );
        } else {
          alert(
            "Failed to delete account: " + (error.message || "Unknown error")
          );
        }
      }
    }
  };

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
                <span>{plan === "premium" ? "Premium Plan" : "Free Plan"}</span>
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

        {/* Functional Settings Sections */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="p-6 rounded-2xl bg-white/5 border border-white/10 h-fit">
            <div className="flex items-center gap-3 mb-4 text-white font-semibold">
              <Shield className="w-5 h-5 text-purple-400" />
              Security
            </div>
            <p className="text-sm text-gray-400 mb-4">
              Two-factor authentication is currently disabled.
            </p>
            <button
              className="px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-white text-sm border border-white/10 transition-colors opacity-50 cursor-not-allowed"
              disabled
            >
              Enable 2FA (Coming Soon)
            </button>
          </div>

          <ChangePasswordSection user={user} />
        </div>

        {/* Danger Zone */}
        <div className="p-6 rounded-2xl bg-red-500/5 border border-red-500/20">
          <div className="flex items-center gap-3 mb-4 text-red-400 font-semibold">
            <Trash2 className="w-5 h-5" />
            Danger Zone
          </div>
          <p className="text-sm text-gray-400 mb-4">
            Permanently delete your account and all associated data.
          </p>
          <button
            onClick={handleDelete}
            className="px-4 py-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 text-sm border border-red-500/20 transition-colors"
          >
            Delete Account
          </button>
        </div>
      </div>
    </div>
  );
}

function ChangePasswordSection({ user }: { user: any }) {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const isGoogleUser = user?.providerData.some(
    (p: any) => p.providerId === "google.com"
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    // Validation
    if (newPassword.length < 6) {
      setMessage({
        type: "error",
        text: "Password must be at least 6 characters.",
      });
      return;
    }
    if (newPassword !== confirmPassword) {
      setMessage({ type: "error", text: "New passwords do not match." });
      return;
    }

    setLoading(true);
    try {
      const credential = EmailAuthProvider.credential(
        user.email,
        currentPassword
      );
      await reauthenticateWithCredential(user, credential);
      await updatePassword(user, newPassword);

      setMessage({ type: "success", text: "Password updated successfully." });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error: any) {
      if (error.code === "auth/wrong-password") {
        setMessage({ type: "error", text: "Current password is incorrect." });
      } else {
        setMessage({
          type: "error",
          text: error.message || "Failed to update password.",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  if (isGoogleUser) {
    return (
      <div className="p-6 rounded-2xl bg-white/5 border border-white/10 h-fit">
        <div className="flex items-center gap-3 mb-4 text-white font-semibold">
          <Key className="w-5 h-5 text-purple-400" />
          Password
        </div>
        <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm">
          Your account is managed by Google. You cannot change your password
          here.
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 rounded-2xl bg-white/5 border border-white/10 h-fit">
      <div className="flex items-center gap-3 mb-4 text-white font-semibold">
        <Key className="w-5 h-5 text-purple-400" />
        Change Password
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="current-password"
            className="block text-xs text-gray-500 uppercase mb-1"
          >
            Current Password
          </label>
          <input
            id="current-password"
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            required
            className="w-full bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-purple-500 transition-colors"
          />
        </div>
        <div>
          <label
            htmlFor="new-password"
            className="block text-xs text-gray-500 uppercase mb-1"
          >
            New Password
          </label>
          <input
            id="new-password"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            minLength={6}
            className="w-full bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-purple-500 transition-colors"
          />
        </div>
        <div>
          <label
            htmlFor="confirm-password"
            className="block text-xs text-gray-500 uppercase mb-1"
          >
            Confirm New Password
          </label>
          <input
            id="confirm-password"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            minLength={6}
            className="w-full bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-purple-500 transition-colors"
          />
        </div>

        {message && (
          <div
            className={`text-sm p-3 rounded-lg ${
              message.type === "success"
                ? "bg-green-500/10 text-green-400"
                : "bg-red-500/10 text-red-400"
            }`}
          >
            {message.text}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Updating..." : "Update Password"}
        </button>
      </form>
    </div>
  );
}
