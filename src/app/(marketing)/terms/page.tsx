export default function TermsPage() {
  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white pt-24 pb-12 px-6">
      <div className="max-w-3xl mx-auto space-y-8">
        <section className="space-y-4">
          <h1 className="text-4xl font-bold text-white">Terms of Service</h1>
          <p className="text-sm text-gray-500">
            Last updated: December 28, 2025
          </p>
        </section>

        <div className="prose prose-invert prose-p:text-gray-300 prose-headings:text-white max-w-none">
          <h3>1. Acceptance of Terms</h3>
          <p>
            By accessing and using Converty, you accept and agree to be bound by
            the terms and provision of this agreement.
          </p>

          <h3>2. Use License</h3>
          <p>
            Permission is granted to temporarily use the materials (software) on
            Converty's website for personal, non-commercial (unless Premium)
            transitory viewing only.
          </p>

          <h3>3. Disclaimer</h3>
          <p>
            The materials on Converty's website are provided "as is". Converty
            makes no warranties, expressed or implied, and hereby disclaims and
            negates all other warranties.
          </p>

          <h3>4. Limitations</h3>
          <p>
            In no event shall Converty or its suppliers be liable for any
            damages (including, without limitation, damages for loss of data or
            profit) arising out of the use or inability to use the materials on
            Converty's site.
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
