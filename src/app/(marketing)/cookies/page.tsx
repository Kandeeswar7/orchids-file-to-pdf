export default function CookiePage() {
  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white pt-24 pb-12 px-6">
      <div className="max-w-3xl mx-auto space-y-8">
        <section className="space-y-4">
          <h1 className="text-4xl font-bold text-white">Cookie Policy</h1>
          <p className="text-sm text-gray-500">
            Last updated: December 28, 2025
          </p>
        </section>

        <div className="prose prose-invert prose-p:text-gray-300 prose-headings:text-white max-w-none">
          <p>
            This policy explains how we use cookies and similar technologies.
          </p>

          <h3>1. What are cookies?</h3>
          <p>
            Cookies are small text files that are stored on your computer or
            mobile device when you visit a website.
          </p>

          <h3>2. How we use cookies</h3>
          <p>We use cookies for the following purposes:</p>
          <ul>
            <li>
              <strong>Essential Cookies:</strong> Required for the website to
              function (e.g., keeping you logged in).
            </li>
            <li>
              <strong>Analytics Cookies:</strong> Help us understand how
              visitors interact with the website (Google Analytics).
            </li>
          </ul>

          <h3>3. Managing cookies</h3>
          <p>
            You can control and/or delete cookies as you wish. You can delete
            all cookies that are already on your computer and you can set most
            browsers to prevent them from being placed.
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
