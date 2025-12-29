import { Calendar, User } from "lucide-react";

export default function BlogPage() {
  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white pt-24 pb-12 px-6">
      <div className="max-w-4xl mx-auto space-y-12">
        <section className="space-y-6 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white">
            The Converty Blog
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Insights, updates, and tips on document management.
          </p>
        </section>

        <div className="grid gap-8">
          <article className="p-8 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors cursor-pointer group">
            <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
              <span className="flex items-center gap-1">
                <Calendar className="w-4 h-4" /> Dec 28, 2025
              </span>
              <span className="flex items-center gap-1">
                <User className="w-4 h-4" /> Converty Team
              </span>
            </div>
            <h2 className="text-2xl font-bold mb-3 group-hover:text-purple-400 transition-colors">
              Introducing Multi-File Conversion
            </h2>
            <p className="text-gray-400 leading-relaxed">
              We just shipped a major update for Premium users: you can now
              convert up to 10 files simultaneously! Learn how this feature can
              save you hours of manual work every week.
            </p>
            <div className="mt-4 text-purple-400 font-medium text-sm">
              Read more →
            </div>
          </article>

          <article className="p-8 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors cursor-pointer group">
            <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
              <span className="flex items-center gap-1">
                <Calendar className="w-4 h-4" /> Dec 10, 2025
              </span>
              <span className="flex items-center gap-1">
                <User className="w-4 h-4" /> Security Team
              </span>
            </div>
            <h2 className="text-2xl font-bold mb-3 group-hover:text-purple-400 transition-colors">
              Why Local Conversion Matters
            </h2>
            <p className="text-gray-400 leading-relaxed">
              Most online converters upload your sensitive data to unknown
              servers. Discover how Converty's hybrid architecture keeps your
              most critical documents safe.
            </p>
            <div className="mt-4 text-purple-400 font-medium text-sm">
              Read more →
            </div>
          </article>
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
