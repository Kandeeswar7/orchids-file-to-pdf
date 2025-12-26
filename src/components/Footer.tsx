import Link from "next/link";
import { Twitter, Github, Linkedin } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-white/5 py-12 bg-[#020010] text-gray-400">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="space-y-4">
          <div className="flex items-center gap-2 font-bold text-xl text-white">
            <div className="w-6 h-6 rounded bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center text-xs">
              C
            </div>
            Converty
          </div>
          <p className="text-sm leading-relaxed">
            The secure, offline-first document conversion platform for
            enterprise professionals.
          </p>
          <div className="flex gap-4">
            <Twitter className="w-5 h-5 hover:text-white cursor-pointer transition-colors" />
            <Github className="w-5 h-5 hover:text-white cursor-pointer transition-colors" />
            <Linkedin className="w-5 h-5 hover:text-white cursor-pointer transition-colors" />
          </div>
        </div>

        <div>
          <h4 className="font-semibold text-white mb-4">Product</h4>
          <ul className="space-y-2 text-sm">
            <li>
              <Link
                href="/convert"
                className="hover:text-purple-400 transition-colors"
              >
                Convert Word to PDF
              </Link>
            </li>
            <li>
              <Link
                href="/convert"
                className="hover:text-purple-400 transition-colors"
              >
                Convert Excel to PDF
              </Link>
            </li>
            <li>
              <Link
                href="/premium"
                className="hover:text-purple-400 transition-colors"
              >
                Pricing
              </Link>
            </li>
            <li>
              <Link
                href="/dashboard"
                className="hover:text-purple-400 transition-colors"
              >
                Changelog
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold text-white mb-4">Company</h4>
          <ul className="space-y-2 text-sm">
            <li>
              <Link
                href="#"
                className="hover:text-purple-400 transition-colors"
              >
                About Us
              </Link>
            </li>
            <li>
              <Link
                href="#"
                className="hover:text-purple-400 transition-colors"
              >
                Careers
              </Link>
            </li>
            <li>
              <Link
                href="#"
                className="hover:text-purple-400 transition-colors"
              >
                Blog
              </Link>
            </li>
            <li>
              <Link
                href="#"
                className="hover:text-purple-400 transition-colors"
              >
                Contact
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold text-white mb-4">Legal</h4>
          <ul className="space-y-2 text-sm">
            <li>
              <Link
                href="#"
                className="hover:text-purple-400 transition-colors"
              >
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link
                href="#"
                className="hover:text-purple-400 transition-colors"
              >
                Terms of Service
              </Link>
            </li>
            <li>
              <Link
                href="#"
                className="hover:text-purple-400 transition-colors"
              >
                Cookie Policy
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 mt-12 pt-8 border-t border-white/5 text-center text-xs text-gray-600">
        © 2025 Converty Inc. All rights reserved.
      </div>
    </footer>
  );
}
