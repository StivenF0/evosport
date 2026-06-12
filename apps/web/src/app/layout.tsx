import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";

export const metadata: Metadata = {
  title: "Evosport",
  description: "Sistema de Gestão de Eventos Esportivos",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className={`min-h-screen antialiased flex flex-col`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
