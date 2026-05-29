import { Navbar } from "@/components/shared/navbar";
import { Footer } from "@/components/shared/footer";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      {/* Main Content */}
      <main className="flex-1">{children}</main>
      <div className="hidden md:block">
        <Footer />
      </div>
    </div>
  );
}
