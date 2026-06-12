import { Footer } from "@web/components/Footer";
import { Header } from "@web/components/Header";

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Header />
      <main className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 min-h-[calc(100vh-4rem)]">
        {children}
      </main>
      <Footer />
    </>
  );
}
