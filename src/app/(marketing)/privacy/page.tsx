export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white pt-24 pb-12 px-6">
      <div className="max-w-3xl mx-auto space-y-8">
        <section className="space-y-4">
          <h1 className="text-4xl font-bold text-white">Privacy Policy</h1>
          <p className="text-sm text-gray-500">
            Last updated: December 28, 2025
          </p>
        </section>

        <div className="prose prose-invert prose-p:text-gray-300 prose-headings:text-white max-w-none">
          <p>
            At Converty, your privacy is our priority. This Privacy Policy
            explains how we handle your data.
          </p>

          <h3>1. Data We Collect</h3>
          <p>We minimize data collection. We only collect:</p>
          <ul>
            <li>Account information (email, name) for authentication.</li>
            <li>
              Usage metrics (number of conversions) to enforce plan limits.
            </li>
            <li>Temporary file data required for the conversion process.</li>
          </ul>

          <h3>2. File Retention</h3>
          <p>
            <strong>We do not store your files permanently.</strong>
          </p>
          <ul>
            <li>
              Input files are deleted immediately after conversion processing
              starts.
            </li>
            <li>
              Output files are stored temporarily for 24 hours to allow you to
              download them, after which they are automatically purged.
            </li>
          </ul>

          <h3>3. Data Sharing</h3>
          <p>
            We do not sell, trade, or rent your personal identification
            information to others. We may use third-party service providers
            (like Google Analytics or payment processors) strictly for
            operational purposes.
          </p>

          <h3>4. Contact Us</h3>
          <p>
            If you have any questions about this Privacy Policy, please contact
            us at support@converty.io.
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
