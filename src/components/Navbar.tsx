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

              <div className="relative group">
                <button className="flex items-center gap-3 py-2 focus:outline-none">
                  <div className="text-right hidden lg:block">
                    <p className="text-sm font-medium text-white">
                      {user.displayName || "User"}
                    </p>
                  </div>
                  <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-purple-500 to-indigo-500 overflow-hidden border border-white/10 ring-2 ring-white/5 group-hover:ring-purple-500/50 transition-all">
                    {user.photoURL ? (
                      <img
                        src={user.photoURL}
                        alt="User"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-sm font-bold text-white uppercase">
                        {user.email?.[0] || "U"}
                      </div>
                    )}
                  </div>
                </button>

                {/* Dropdown Menu */}
                <div className="absolute right-0 top-full mt-2 w-56 rounded-xl bg-[#0b0b12] border border-white/10 shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all transform origin-top-right duration-200 z-50 overflow-hidden">
                  <div className="p-4 border-b border-white/5 bg-white/5">
                    <p className="text-xs text-gray-400 font-medium uppercase tracking-wider mb-1">
                      Signed in as
                    </p>
                    <p className="text-sm text-white font-medium truncate">
                      {user.email}
                    </p>
                  </div>
                  <div className="p-2">
                    <Link
                      href="/settings"
                      className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
                    >
                      <Settings className="w-4 h-4" /> Settings
                    </Link>
                    <button
                      onClick={() => signOut()}
                      className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors text-left"
                    >
                      <LogOut className="w-4 h-4" /> Sign Out
                    </button>
                  </div>
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
            aria-label="Toggle mobile menu"
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
