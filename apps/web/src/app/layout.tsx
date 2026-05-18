import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";
import { Header } from "@web/components/Header";
import { Footer } from "@web/components/Footer";

export const metadata: Metadata = {
  title: 'Evosport',
  description: 'Sistema de Gestão de Eventos Esportivos',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`min-h-screen antialiased`}
      >
        <Providers>
          <Header />
          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 min-h-[calc(100vh-4rem)]">
            {children}
          </main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
