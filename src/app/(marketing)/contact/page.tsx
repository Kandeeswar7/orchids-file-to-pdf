import { Mail, MessageSquare } from "lucide-react";

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white pt-24 pb-12 px-6">
      <div className="max-w-4xl mx-auto space-y-12">
        <section className="space-y-6 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white">
            Contact Us
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            We'd love to hear from you. Here's how you can reach us.
          </p>
        </section>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="p-8 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-purple-500/20 rounded-lg text-purple-400">
                <Mail className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold">Email Support</h3>
            </div>
            <p className="text-gray-400 mb-4">
              For general inquiries, partnership opportunities, and customer
              support.
            </p>
            <a
              href="mailto:support@converty.io"
              className="text-purple-400 hover:text-purple-300 font-medium"
            >
              support@converty.io
            </a>
          </div>

          <div className="p-8 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-blue-500/20 rounded-lg text-blue-400">
                <MessageSquare className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold">Enterprise Sales</h3>
            </div>
            <p className="text-gray-400 mb-4">
              Interested in high-volume processing or on-premise solutions?
            </p>
            <a
              href="mailto:sales@converty.io"
              className="text-blue-400 hover:text-blue-300 font-medium"
            >
              sales@converty.io
            </a>
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
