import { Briefcase } from "lucide-react";

export default function CareersPage() {
  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white pt-24 pb-12 px-6">
      <div className="max-w-4xl mx-auto space-y-12">
        <section className="space-y-6 text-center">
          <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-emerald-500">
            Join Our Team
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Help us build the next generation of productivity tools.
          </p>
        </section>

        <div className="p-12 rounded-3xl bg-white/5 border border-white/10 text-center space-y-6">
          <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto">
            <Briefcase className="w-8 h-8 text-gray-400" />
          </div>
          <h2 className="text-2xl font-bold">No Open Positions</h2>
          <p className="text-gray-400">
            We're currently scaling our core team and don't have any open roles
            at the moment. Check back later as we continue to grow!
          </p>
        </div>

        <section className="pt-12 border-t border-white/10 text-center">
          <p className="text-sm text-gray-500 italic">
            (Content is placeholder and can be updated later)
          </p>
        </section>
      </div>
    </main>
  );
}
