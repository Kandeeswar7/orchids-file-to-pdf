export default function AboutPage() {
  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white pt-24 pb-12 px-6">
      <div className="max-w-4xl mx-auto space-y-12">
        <section className="space-y-6 text-center">
          <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-500">
            About Converty
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Empowering professionals with secure, offline-first document
            conversion tools.
          </p>
        </section>

        <section className="space-y-6">
          <h2 className="text-2xl font-bold">Our Mission</h2>
          <p className="text-gray-400 leading-relaxed">
            At Converty, we believe that document management should be seamless,
            private, and efficient. In an era where data privacy is paramount,
            we built a conversion engine that respects your data by processing
            files locally whenever possible and ensuring strict security
            protocols for cloud operations.
          </p>
        </section>

        <section className="grid md:grid-cols-2 gap-8">
          <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
            <h3 className="text-xl font-bold mb-3">Privacy First</h3>
            <p className="text-gray-400">
              We don't mine your data. Our business model is simple: we sell
              excellent software, not user information.
            </p>
          </div>
          <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
            <h3 className="text-xl font-bold mb-3">Enterprise Grade</h3>
            <p className="text-gray-400">
              Built on robust architecture used by thousands of businesses to
              process critical documents reliably.
            </p>
          </div>
        </section>

        <section className="pt-12 border-t border-white/10 text-center">
          <p className="text-sm text-gray-500 italic">
            (Content is placeholder and can be updated later)
          </p>
        </section>
      </div>
    </main>
  );
}
