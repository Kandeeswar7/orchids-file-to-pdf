export default function ReleaseNotesPage() {
  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white pt-24 pb-12 px-6">
      <div className="max-w-3xl mx-auto space-y-12">
        <section className="space-y-6">
          <h1 className="text-4xl font-bold text-white">Release Notes</h1>
          <p className="text-xl text-gray-400">
            Stay up to date with the latest improvements.
          </p>
        </section>

        <div className="space-y-12 relative border-l border-white/10 pl-8 ml-4">
          <div className="relative">
            <div className="absolute -left-10 top-1 w-4 h-4 rounded-full bg-purple-500 border-4 border-[#0a0a0a]"></div>
            <div className="mb-2 flex items-center gap-3">
              <span className="text-sm font-mono text-purple-400 bg-purple-500/10 px-2 py-1 rounded">
                v1.2.0
              </span>
              <span className="text-gray-500 text-sm">Dec 28, 2025</span>
            </div>
            <h3 className="text-xl font-bold mb-3">
              Premium Workflow Enhancements
            </h3>
            <ul className="list-disc list-inside text-gray-400 space-y-2">
              <li>Added multi-file upload support for Word and Excel</li>
              <li>Introduced "History" tab for past conversions</li>
              <li>Fixed redirection issues for free users</li>
              <li>Improved mobile responsiveness on landing page</li>
            </ul>
          </div>

          <div className="relative">
            <div className="absolute -left-10 top-1 w-4 h-4 rounded-full bg-gray-700 border-4 border-[#0a0a0a]"></div>
            <div className="mb-2 flex items-center gap-3">
              <span className="text-sm font-mono text-gray-400 bg-white/5 px-2 py-1 rounded">
                v1.1.0
              </span>
              <span className="text-gray-500 text-sm">Dec 15, 2025</span>
            </div>
            <h3 className="text-xl font-bold mb-3">Core Stability</h3>
            <ul className="list-disc list-inside text-gray-400 space-y-2">
              <li>Major performance improvements to conversion engine</li>
              <li>Added support for .xlsx and .docx specific features</li>
              <li>Enhanced error handling and status polling</li>
            </ul>
          </div>
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
