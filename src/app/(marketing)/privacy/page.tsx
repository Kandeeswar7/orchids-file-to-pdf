// export default function PrivacyPage() {
//   return (
//     <main className="min-h-screen bg-[#0a0a0a] text-white pt-24 pb-12 px-6">
//       <div className="max-w-3xl mx-auto space-y-8">
//         <section className="space-y-4">
//           <h1 className="text-4xl font-bold text-white">Privacy Policy</h1>
//           <p className="text-sm text-gray-500">
//             Last updated: December 28, 2025
//           </p>
//         </section>

//         <div className="prose prose-invert prose-p:text-gray-300 prose-headings:text-white max-w-none">
//           <p>
//             At Converty, your privacy is our priority. This Privacy Policy
//             explains how we handle your data.
//           </p>

//           <h3>1. Data We Collect</h3>
//           <p>We minimize data collection. We only collect:</p>
//           <ul>
//             <li>Account information (email, name) for authentication.</li>
//             <li>
//               Usage metrics (number of conversions) to enforce plan limits.
//             </li>
//             <li>Temporary file data required for the conversion process.</li>
//           </ul>

//           <h3>2. File Retention</h3>
//           <p>
//             <strong>We do not store your files permanently.</strong>
//           </p>
//           <ul>
//             <li>
//               Input files are deleted immediately after conversion processing
//               starts.
//             </li>
//             <li>
//               Output files are stored temporarily for 24 hours to allow you to
//               download them, after which they are automatically purged.
//             </li>
//           </ul>

//           <h3>3. Data Sharing</h3>
//           <p>
//             We do not sell, trade, or rent your personal identification
//             information to others. We may use third-party service providers
//             (like Google Analytics or payment processors) strictly for
//             operational purposes.
//           </p>

//           <h3>4. Contact Us</h3>
//           <p>
//             If you have any questions about this Privacy Policy, please contact
//             us at support@converty.io.
//           </p>
//         </div>

//         <section className="pt-12 border-t border-white/10 text-center">
//           <p className="text-sm text-gray-500 italic">
//             (Content is placeholder and can be updated later)
//           </p>
//         </section>
//       </div>
//     </main>
//   );
// }



import React from 'react';
import { Shield, Clock, Lock, EyeOff, Server, FileX } from "lucide-react";

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white selection:bg-purple-500/30">
      {/* Ambient Background Glow */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[50%] -translate-x-1/2 w-[800px] h-[500px] bg-purple-900/10 rounded-full blur-[128px]" />
      </div>

      <div className="relative max-w-4xl mx-auto pt-32 pb-20 px-6">
        
        {/* Header Section */}
        <section className="text-center space-y-6 mb-16">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
            Privacy Policy
          </h1>
          <p className="text-gray-400">
            Last updated: <span className="text-white">December 28, 2025</span>
          </p>
          <p className="text-gray-500 max-w-2xl mx-auto text-sm">
            We value clarity over legalese. Here is a transparent breakdown of how Converty handles, secures, and deletes your data.
          </p>
        </section>

        {/* TL;DR Visual Summary */}
        <section className="grid md:grid-cols-3 gap-6 mb-16">
          <div className="p-5 rounded-xl bg-[#0F0F0F] border border-white/10 flex flex-col gap-3">
            <Clock className="w-6 h-6 text-purple-400" />
            <h3 className="font-bold text-sm text-gray-200">Ephemeral Storage</h3>
            <p className="text-xs text-gray-500 leading-relaxed">
              Files are automatically purged from our servers 24 hours after conversion.
            </p>
          </div>
          <div className="p-5 rounded-xl bg-[#0F0F0F] border border-white/10 flex flex-col gap-3">
            <EyeOff className="w-6 h-6 text-blue-400" />
            <h3 className="font-bold text-sm text-gray-200">No Data Mining</h3>
            <p className="text-xs text-gray-500 leading-relaxed">
              We do not scan your document content for advertising or model training.
            </p>
          </div>
          <div className="p-5 rounded-xl bg-[#0F0F0F] border border-white/10 flex flex-col gap-3">
            <Lock className="w-6 h-6 text-green-400" />
            <h3 className="font-bold text-sm text-gray-200">Encrypted Transit</h3>
            <p className="text-xs text-gray-500 leading-relaxed">
              All transfers occur over secure SSL/TLS encrypted connections.
            </p>
          </div>
        </section>

        {/* Main Content Policy */}
        <div className="p-8 md:p-12 rounded-3xl bg-white/5 border border-white/10">
          <div className="prose prose-invert prose-p:text-gray-400 prose-headings:text-white prose-li:text-gray-400 prose-strong:text-white max-w-none">
            
            <section className="mb-10">
              <h2 className="flex items-center gap-3 text-xl font-bold mb-4">
                <Server className="w-5 h-5 text-gray-500" />
                1. Data Collection & Usage
              </h2>
              <p>
                We operate on a principle of <strong>minimal data collection</strong>. We only process information strictly necessary to provide our conversion services:
              </p>
              <ul className="list-disc pl-4 space-y-2 mt-4">
                <li>
                  <strong>Account Data:</strong> If you create an account, we store your email address and authentication credentials to manage your subscription limits.
                </li>
                <li>
                  <strong>Usage Metrics:</strong> We track the number and type of conversions (e.g., "Word to PDF") to monitor system performance and enforce plan quotas.
                </li>
                <li>
                  <strong>Technical Logs:</strong> We collect standard server logs (IP address, browser type) for security auditing and fraud prevention.
                </li>
              </ul>
            </section>

            <div className="w-full h-px bg-white/10 my-8" />

            <section className="mb-10">
              <h2 className="flex items-center gap-3 text-xl font-bold mb-4">
                <FileX className="w-5 h-5 text-gray-500" />
                2. File Handling & Retention
              </h2>
              <p>
                Your documents are the core of our service, and we treat them with the highest level of confidentiality.
              </p>
              <ul className="list-disc pl-4 space-y-2 mt-4">
                <li>
                  <strong>Processing:</strong> Input files are processed in isolated temporary containers.
                </li>
                <li>
                  <strong>Storage Window:</strong> Once converted, the output file is retained for a maximum of <strong>24 hours</strong>. This window exists solely to give you time to download your document.
                </li>
                <li>
                  <strong>Automatic Deletion:</strong> After the 24-hour window, both input and output files are permanently purged from our storage systems. This process is automated and irreversible.
                </li>
              </ul>
            </section>

            <div className="w-full h-px bg-white/10 my-8" />

            <section className="mb-10">
              <h2 className="flex items-center gap-3 text-xl font-bold mb-4">
                <Shield className="w-5 h-5 text-gray-500" />
                3. Third-Party Service Providers
              </h2>
              <p>
                We do not sell, trade, or rent your personal data. We partner with trusted third-party providers strictly for operational needs:
              </p>
              <ul className="list-disc pl-4 space-y-2 mt-4">
                <li>
                  <strong>Cloud Infrastructure:</strong> We use industry-standard cloud providers to host our processing engine.
                </li>
                <li>
                  <strong>Analytics:</strong> We may use anonymous analytics tools to understand website traffic patterns (no personal document data is shared).
                </li>
                <li>
                  <strong>Payment Processing:</strong> All financial transactions are handled by our secure payment processor. We do not store your credit card details on our servers.
                </li>
              </ul>
            </section>

            <div className="w-full h-px bg-white/10 my-8" />

            <section>
              <h2 className="text-xl font-bold mb-4">4. Contact & Concerns</h2>
              <p>
                If you have specific security requirements or questions about this policy, please reach out to our Data Privacy Officer at:
              </p>
              <a href="mailto:support@converty.io" className="text-purple-400 hover:text-purple-300 font-medium no-underline">
                support@converty.io
              </a>
            </section>

          </div>
        </div>

        {/* Footer Note */}
        <section className="pt-12 text-center">
          <p className="text-sm text-gray-600">
            © {new Date().getFullYear()} Converty Inc.
          </p>
        </section>
      </div>
    </main>
  );
}