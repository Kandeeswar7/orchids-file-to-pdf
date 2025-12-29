// import { Briefcase } from "lucide-react";

// export default function CareersPage() {
//   return (
//     <main className="min-h-screen bg-[#0a0a0a] text-white pt-24 pb-12 px-6">
//       <div className="max-w-4xl mx-auto space-y-12">
//         <section className="space-y-6 text-center">
//           <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-emerald-500">
//             Join Our Team
//           </h1>
//           <p className="text-xl text-gray-400 max-w-2xl mx-auto">
//             Help us build the next generation of productivity tools.
//           </p>
//         </section>

//         <div className="p-12 rounded-3xl bg-white/5 border border-white/10 text-center space-y-6">
//           <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto">
//             <Briefcase className="w-8 h-8 text-gray-400" />
//           </div>
//           <h2 className="text-2xl font-bold">No Open Positions</h2>
//           <p className="text-gray-400">
//             We're currently scaling our core team and don't have any open roles
//             at the moment. Check back later as we continue to grow!
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
import { Briefcase, Heart, Rocket, Code2, ArrowRight } from "lucide-react";

export default function CareersPage() {
  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white selection:bg-emerald-500/30">
      {/* Ambient Background Glow - Green/Emerald Theme */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[20%] w-[500px] h-[500px] bg-emerald-900/10 rounded-full blur-[128px]" />
        <div className="absolute bottom-[-10%] right-[10%] w-[500px] h-[500px] bg-green-900/10 rounded-full blur-[128px]" />
      </div>

      <div className="relative max-w-5xl mx-auto pt-32 pb-20 px-6 space-y-20">
        
        {/* Hero Section */}
        <section className="text-center space-y-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/5 text-sm text-emerald-400">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>We are growing</span>
          </div>

          <h1 className="text-5xl md:text-6xl font-bold tracking-tight">
            Shape the future of <br className="hidden md:block" />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-cyan-500">
              Document Productivity.
            </span>
          </h1>
          
          <p className="text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
            Converty is built by a small team obsessed with speed, security, and simplicity. We are looking for builders who care about the details.
          </p>
        </section>

        {/* Culture / Values Grid */}
        <section className="grid md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-[#0F0F0F] border border-white/10">
            <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center mb-4 text-emerald-400">
              <Rocket size={20} />
            </div>
            <h3 className="text-lg font-semibold mb-2">High Ownership</h3>
            <p className="text-sm text-gray-400 leading-relaxed">
              We don't micromanage. We hire smart people and give them the autonomy to ship features that matter.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[#0F0F0F] border border-white/10">
            <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center mb-4 text-emerald-400">
              <Code2 size={20} />
            </div>
            <h3 className="text-lg font-semibold mb-2">Craftsmanship</h3>
            <p className="text-sm text-gray-400 leading-relaxed">
              Code quality and UX details aren't optional. We take pride in building software that feels solid and responsive.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[#0F0F0F] border border-white/10">
            <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center mb-4 text-emerald-400">
              <Heart size={20} />
            </div>
            <h3 className="text-lg font-semibold mb-2">User-Centric</h3>
            <p className="text-sm text-gray-400 leading-relaxed">
              We don't build features for the sake of it. Every line of code is written to solve a real problem for our users.
            </p>
          </div>
        </section>

        {/* Current Hiring Status - Improved "Empty State" */}
        <div className="relative p-1 rounded-3xl bg-gradient-to-b from-white/10 to-transparent">
          <div className="relative bg-[#0F0F0F] rounded-[22px] p-12 text-center space-y-6 overflow-hidden">
            {/* Background pattern for visual interest */}
            <div className="absolute top-0 right-0 p-12 opacity-5">
              <Briefcase size={120} />
            </div>

            <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto border border-white/10">
              <Briefcase className="w-7 h-7 text-gray-400" />
            </div>
            
            <div className="space-y-2">
              <h2 className="text-2xl font-bold">No Open Positions</h2>
              <p className="text-gray-400 max-w-lg mx-auto">
                We are currently fully staffed and focused on our product roadmap. 
                However, things move fast in SaaS.
              </p>
            </div>

            {/* Call to action (Passive) */}
            <div className="pt-4 flex justify-center">
              <button 
                disabled
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white/5 text-gray-500 text-sm font-medium border border-white/10 cursor-not-allowed hover:bg-white/5"
              >
                Check back Q4 2025
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* Footer Note */}
        <section className="pt-12 border-t border-white/5 text-center">
          <p className="text-sm text-gray-500">
            Converty is an equal opportunity workplace.
          </p>
        </section>
      </div>
    </main>
  );
}
