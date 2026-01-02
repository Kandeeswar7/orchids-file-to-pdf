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
  ChevronDown,
  FileCode,
  FileSpreadsheet,
} from "lucide-react";
import { useState } from "react";

export function Navbar() {
  const pathname = usePathname();
  const { user, signOut, plan, loading } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isAuthPage =
    pathname?.startsWith("/login") || pathname?.startsWith("/signup");
  if (isAuthPage) return null;

  // Prevent flicker
  if (loading) return null;

  return (
    <nav className="fixed top-0 w-full z-50 border-b border-white/5 bg-[#030014]/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2 font-bold text-xl tracking-tight"
        >
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center">
            <span className="text-white text-lg">C</span>
          </div>
          <span className="text-white">Converty</span>
          {plan === "premium" && (
            <span className="hidden sm:inline-block px-1.5 py-0.5 rounded-md bg-gradient-to-r from-amber-500 to-orange-500 text-[10px] font-bold text-white uppercase tracking-wider ml-1">
              PRO
            </span>
          )}
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-6">
          {/* Products Dropdown */}
          <div className="relative group">
            <button className="flex items-center gap-1.5 text-sm font-medium text-gray-400 group-hover:text-white transition-colors py-4 focus:outline-none">
              Products
              <ChevronDown className="w-4 h-4 transition-transform group-hover:rotate-180" />
            </button>

            {/* Dropdown Panel */}
            <div className="absolute left-0 top-full w-[400px] p-2 rounded-2xl bg-[#0b0b12] border border-white/10 shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all transform origin-top-left duration-200 z-50 translate-y-2 group-hover:translate-y-0">
              <div className="grid gap-1">
                <Link
                  href="/convert?tab=word"
                  className="flex items-start gap-4 p-4 rounded-xl hover:bg-white/5 transition-colors group/item"
                >
                  <div className="p-2.5 rounded-lg bg-indigo-500/10 text-indigo-400 group-hover/item:bg-indigo-500/20 transition-colors">
                    <FileText className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-white group-hover/item:text-indigo-400 transition-colors">
                      Word to PDF
                    </h4>
                    <p className="text-xs text-gray-400 mt-1 leading-relaxed">
                      Convert Word documents to high-quality PDFs.
                    </p>
                  </div>
                </Link>

                <Link
                  href="/convert?tab=excel"
                  className="flex items-start gap-4 p-4 rounded-xl hover:bg-white/5 transition-colors group/item"
                >
                  <div className="p-2.5 rounded-lg bg-emerald-500/10 text-emerald-400 group-hover/item:bg-emerald-500/20 transition-colors">
                    <FileSpreadsheet className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-white group-hover/item:text-emerald-400 transition-colors">
                      Excel to PDF
                    </h4>
                    <p className="text-xs text-gray-400 mt-1 leading-relaxed">
                      Transform spreadsheets while preserving formulas.
                    </p>
                  </div>
                </Link>
                <Link
                  href="/convert?tab=html"
                  className="flex items-start gap-4 p-4 rounded-xl hover:bg-white/5 transition-colors group/item"
                >
                  <div className="p-2.5 rounded-lg bg-sky-500/10 text-sky-400 group-hover/item:bg-sky-500/20 transition-colors">
                    <FileCode className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-white group-hover/item:text-sky-400 transition-colors">
                      HTML to PDF
                    </h4>
                    <p className="text-xs text-gray-400 mt-1 leading-relaxed">
                      Convert web pages and code to PDF.
                    </p>
                  </div>
                </Link>
              </div>
            </div>
          </div>

          {user && (
            <Link
              href="/dashboard"
              className={`text-sm font-medium transition-colors hover:text-white ${
                pathname === "/history" ? "text-white" : "text-gray-400"
              }`}
            >
              History
            </Link>
          )}

          <Link
            href="/premium"
            className={`text-sm font-medium transition-colors hover:text-white ${
              pathname === "/premium" ? "text-white" : "text-gray-400"
            }`}
          >
            Pricing
          </Link>

          <div className="h-4 w-px bg-white/10 mx-2" />

          {user ? (
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
                  <Link
                    href="/history"
                    className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
                  >
                    <FileText className="w-4 h-4" /> History
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
        <div className="md:hidden border-t border-white/5 bg-[#030014] p-4 space-y-4 max-h-[calc(100vh-4rem)] overflow-y-auto">
          {/* Mobile Products Section */}
          <div className="space-y-1 pb-4 border-b border-white/5">
            <p className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
              Products
            </p>
            {[
              {
                label: "Word to PDF",
                href: "/convert?tab=word",
                icon: FileText,
              },
              {
                label: "Excel to PDF",
                href: "/convert?tab=excel",
                icon: FileSpreadsheet,
              },
              {
                label: "HTML to PDF",
                href: "/convert?tab=html",
                icon: FileCode,
              },
            ].map((product) => (
              <Link
                key={product.href}
                href={product.href}
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 px-3 py-2 text-gray-300 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
              >
                <product.icon className="w-4 h-4 text-purple-400" />
                {product.label}
              </Link>
            ))}
          </div>

          {user ? (
            <>
              <Link
                href="/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 text-gray-300 hover:text-white hover:bg-white/5 rounded-lg"
              >
                History
              </Link>
              <Link
                href="/premium"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 text-gray-300 hover:text-white hover:bg-white/5 rounded-lg"
              >
                Pricing
              </Link>
              <Link
                href="/settings"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 text-gray-300 hover:text-white hover:bg-white/5 rounded-lg"
              >
                Settings
              </Link>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  signOut();
                }}
                className="block w-full text-left px-3 py-2 text-red-400 hover:bg-red-500/10 rounded-lg"
              >
                Sign Out
              </button>
            </>
          ) : (
            <>
              <Link
                href="/premium"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 text-gray-300 hover:text-white hover:bg-white/5 rounded-lg"
              >
                Pricing
              </Link>
              <div className="pt-4 border-t border-white/5 flex flex-col gap-2">
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block w-full text-center py-2 text-gray-300 hover:text-white"
                >
                  Log In
                </Link>
                <Link
                  href="/signup"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block w-full text-center py-2 bg-white text-black font-medium rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Sign Up
                </Link>
              </div>
            </>
          )}
        </div>
      )}
    </nav>
  );
}
