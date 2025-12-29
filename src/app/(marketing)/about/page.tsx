// export default function AboutPage() {
//   return (
//     <main className="min-h-screen bg-[#0a0a0a] text-white pt-24 pb-12 px-6">
//       <div className="max-w-4xl mx-auto space-y-12">
//         <section className="space-y-6 text-center">
//           <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-500">
//             About Converty
//           </h1>
//           <p className="text-xl text-gray-400 max-w-2xl mx-auto">
//           Reliable and secure document conversion for modern workflows.
//           </p>
//         </section>

//         <section className="space-y-6">
//           <h2 className="text-2xl font-bold">Our Mission</h2>
//           <p className="text-gray-400 leading-relaxed">
//             At Converty, we believe that document management should be seamless,
//             private, and efficient. In an era where data privacy is paramount,
//             we built a conversion engine that respects your data by processing
//             files locally whenever possible and ensuring strict security
//             protocols for cloud operations.
//           </p>
//         </section>

//         <section className="grid md:grid-cols-2 gap-8">
//           <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
//             <h3 className="text-xl font-bold mb-3">Privacy First</h3>
//             <p className="text-gray-400">
//               We don't mine your data. Our business model is simple: we sell
//               excellent software, not user information.
//             </p>
//           </div>
//           <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
//             <h3 className="text-xl font-bold mb-3">Enterprise Grade</h3>
//             <p className="text-gray-400">
//               Built on robust architecture used by thousands of businesses to
//               process critical documents reliably.
//             </p>
//           </div>
//         </section>

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
import { Shield, Zap, FileCheck, Lock } from 'lucide-react';

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white selection:bg-purple-500/30">
      {/* Ambient Background Glow - Adds depth without performance cost */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[128px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[128px]" />
      </div>

      <div className="relative max-w-5xl mx-auto pt-32 pb-20 px-6 space-y-24">
        
        {/* Hero Section */}
        <section className="text-center space-y-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/5 text-sm text-gray-400">
            <span className="w-2 h-2 rounded-full bg-purple-500 animate-pulse" />
            <span>Our Philosophy</span>
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight">
            Built for Precision. <br className="hidden md:block" />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-500">
              Designed for Security.
            </span>
          </h1>
          
          <p className="text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
            Converty is the secure document engine for professionals who refuse to compromise on data privacy or layout fidelity.
          </p>
        </section>

        {/* Mission Statement */}
        <section className="relative p-8 md:p-12 rounded-3xl bg-white/5 border border-white/10 overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-b from-white/5 to-transparent blur-3xl" />
          
          <div className="relative z-10 grid md:grid-cols-3 gap-12">
            <div className="md:col-span-1 space-y-4">
              <h2 className="text-2xl font-bold text-white">Our Mission</h2>
              <div className="h-1 w-12 bg-purple-500 rounded-full" />
            </div>
            <div className="md:col-span-2 space-y-6 text-gray-300 leading-relaxed">
              <p>
                In an era where data is the new currency, standard conversion tools often treat user privacy as an afterthought. We built Converty to change that standard.
              </p>
              <p>
                We believe document management should be frictionless and strictly confidential. We utilize <strong className="text-white">ephemeral processing containers</strong> and industry-standard encryption, ensuring your files are processed securely and deleted immediately upon completion.
              </p>
            </div>
          </div>
        </section>

        {/* Core Pillars / Why Converty */}
        <section className="space-y-12">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight">Why professionals choose Converty</h2>
            <p className="text-gray-400 mt-4">No bloatware. No hidden data mining. Just conversion.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {/* Card 1 */}
            <div className="group p-6 rounded-2xl bg-[#0F0F0F] border border-white/10 hover:border-purple-500/30 transition-colors duration-300">
              <div className="w-12 h-12 rounded-lg bg-purple-500/10 flex items-center justify-center mb-4 text-purple-400 group-hover:text-purple-300">
                <Shield size={24} />
              </div>
              <h3 className="text-lg font-semibold mb-2">Ephemeral Processing</h3>
              <p className="text-sm text-gray-400 leading-relaxed">
                We operate on a strict "process and purge" policy. Your files are isolated during conversion and permanently deleted the moment the task is done.
              </p>
            </div>

            {/* Card 2 */}
            <div className="group p-6 rounded-2xl bg-[#0F0F0F] border border-white/10 hover:border-blue-500/30 transition-colors duration-300">
              <div className="w-12 h-12 rounded-lg bg-blue-500/10 flex items-center justify-center mb-4 text-blue-400 group-hover:text-blue-300">
                <FileCheck size={24} />
              </div>
              <h3 className="text-lg font-semibold mb-2">High-Fidelity Rendering</h3>
              <p className="text-sm text-gray-400 leading-relaxed">
                Don't lose your formatting. Our engine preserves complex layouts, tables, and fonts, ensuring your PDF looks exactly like the source file.
              </p>
            </div>

            {/* Card 3 */}
            <div className="group p-6 rounded-2xl bg-[#0F0F0F] border border-white/10 hover:border-green-500/30 transition-colors duration-300">
              <div className="w-12 h-12 rounded-lg bg-green-500/10 flex items-center justify-center mb-4 text-green-400 group-hover:text-green-300">
                <Zap size={24} />
              </div>
              <h3 className="text-lg font-semibold mb-2">Zero Friction</h3>
              <p className="text-sm text-gray-400 leading-relaxed">
                No software installation required. Access powerful conversion tools directly from your browser, optimized for speed and reliability.
              </p>
            </div>
          </div>
        </section>

        {/* Footer Note */}
        <section className="pt-12 border-t border-white/5 text-center">
          <p className="text-sm text-gray-500">
            Securely processing documents for the modern web.
          </p>
        </section>
      </div>
    </main>
  );
}
