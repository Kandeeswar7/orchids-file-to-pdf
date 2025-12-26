import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <div className="pt-16 min-h-screen flex flex-col bg-[#0a0a0a]">
        <main className="flex-grow">{children}</main>
        <Footer />
      </div>
    </>
  );
}
