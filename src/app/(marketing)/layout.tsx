import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />
      <div className="pt-0 min-h-screen flex flex-col">
        <main className="flex-grow">{children}</main>
        <Footer />
      </div>
    </>
  );
}
