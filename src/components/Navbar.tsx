"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { motion } from "framer-motion";
import {
  Settings,
  LogOut,
  LayoutDashboard,
  FileText,
  Sparkles,
} from "lucide-react";
import { useState } from "react";

export function Navbar() {
  const pathname = usePathname();
  const { user, signOut } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isAuthPage =
    pathname?.startsWith("/login") || pathname?.startsWith("/signup");
  if (isAuthPage) return null;

  return (
    <nav className="fixed top-0 w-full z-50 border-b border-white/5 bg-[#030014]/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link
          href={user ? "/convert" : "/"}
          className="flex items-center gap-2 font-bold text-xl tracking-tight"
        >
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center">
            <span className="text-white text-lg">C</span>
          </div>
          <span className="text-white">Converty</span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-6">
          {user ? (
            <>
              <Link
                href="/convert"
                className={`text-sm font-medium transition-colors hover:text-white ${
                  pathname === "/convert" ? "text-white" : "text-gray-400"
                }`}
              >
                Convert
              </Link>
              <Link
                href="/dashboard"
                className={`text-sm font-medium transition-colors hover:text-white ${
                  pathname === "/dashboard" ? "text-white" : "text-gray-400"
                }`}
              >
                History
              </Link>
              <Link
                href="/premium"
                className={`text-sm font-medium transition-colors hover:text-white ${
                  pathname === "/premium" ? "text-white" : "text-gray-400"
                }`}
              >
                Pricing
              </Link>

              <div className="h-4 w-px bg-white/10 mx-2" />

              <div className="flex items-center gap-4">
                <Link href="/settings">
                  <Settings className="w-5 h-5 text-gray-400 hover:text-white transition-colors" />
                </Link>
                <button onClick={() => signOut()} title="Sign Out">
                  <LogOut className="w-5 h-5 text-gray-400 hover:text-red-400 transition-colors" />
                </button>
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-500 to-indigo-500 overflow-hidden border border-white/10">
                  {user.photoURL ? (
                    <img
                      src={user.photoURL}
                      alt="User"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-xs font-bold text-white uppercase">
                      {user.email?.[0] || "U"}
                    </div>
                  )}
                </div>
              </div>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="text-sm font-medium text-gray-400 hover:text-white transition-colors"
              >
                Log in
              </Link>
              <Link
                href="/signup"
                className="text-sm font-medium bg-white text-black px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Toggle (Simplified) */}
        <div className="md:hidden">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-gray-400"
          >
            <div className="w-6 h-0.5 bg-current mb-1.5" />
            <div className="w-6 h-0.5 bg-current mb-1.5" />
            <div className="w-6 h-0.5 bg-current" />
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-white/5 bg-[#030014] p-4 space-y-4">
          {user ? (
            <>
              <Link href="/convert" className="block text-gray-300 py-2">
                Convert
              </Link>
              <Link href="/dashboard" className="block text-gray-300 py-2">
                History
              </Link>
              <Link href="/premium" className="block text-gray-300 py-2">
                Pricing
              </Link>
              <Link href="/settings" className="block text-gray-300 py-2">
                Settings
              </Link>
              <button
                onClick={() => signOut()}
                className="block w-full text-left text-red-400 py-2"
              >
                Sign Out
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="block text-gray-300 py-2">
                Log In
              </Link>
              <Link href="/signup" className="block text-purple-400 py-2">
                Sign Up
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}
