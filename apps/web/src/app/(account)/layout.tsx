"use client";

import { LoadingSpinner } from "@web/components/ui/LoadingSpinner";
import { useRequireAuth } from "@web/hooks/use-require-auth";
import { Heart, User } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const LINKS = [
  { href: "/profile", label: "Meu perfil", icon: User },
  { href: "/favorites", label: "Favoritos", icon: Heart },
];

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  const { allowed, isLoading } = useRequireAuth();
  const pathname = usePathname();

  // Enquanto verifica a sessão (ou redireciona visitantes), mostra carregamento
  if (isLoading || !allowed) {
    return <LoadingSpinner message="Carregando sua conta..." />;
  }

  return (
    <div className="grid gap-8 md:grid-cols-[14rem_1fr]">
      <aside className="md:sticky md:top-20 h-fit">
        <nav className="flex md:flex-col gap-1 rounded-2xl border border-gray-100 bg-white p-2">
          {LINKS.map(({ href, label, icon: Icon }) => {
            const active = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                  active ? "bg-blue-50 text-blue-600" : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                <Icon className="w-4 h-4" />
                {label}
              </Link>
            );
          })}
        </nav>
      </aside>

      <div className="min-w-0">{children}</div>
    </div>
  );
}
