
import { ConversionCard } from '@/components/ConversionCard';

export default function Home() {
  return (
    <main className="min-h-screen w-full bg-[#0a0a0a] text-white flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Background Gradients */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-purple-600/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-blue-600/20 rounded-full blur-[120px] pointer-events-none" />
      
      <div className="z-10 w-full max-w-4xl flex flex-col items-center gap-8">
        <div className="text-center space-y-2">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
            File to PDF
          </h1>
          <p className="text-gray-400 text-lg max-w-lg mx-auto">
            Offline-first intelligent converter for your documents and websites.
          </p>
        </div>

        <ConversionCard />
      </div>
    </main>
  );
}
