"use client";

import { LoadingSpinner } from "@web/components/ui/LoadingSpinner";
import { useRequireAuth } from "@web/hooks/use-require-auth";
import { CalendarRange, LayoutDashboard, MapPin, Swords, Users } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const LINKS = [
  { href: "/admin", label: "Visão geral", icon: LayoutDashboard, exact: true },
  { href: "/admin/events", label: "Eventos", icon: CalendarRange, exact: false },
  { href: "/admin/teams", label: "Times", icon: Users, exact: false },
  { href: "/admin/venues", label: "Sedes", icon: MapPin, exact: false },
  { href: "/admin/matches", label: "Partidas", icon: Swords, exact: false },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { allowed, isLoading } = useRequireAuth({ admin: true });
  const pathname = usePathname();

  if (isLoading || !allowed) {
    return <LoadingSpinner message="Verificando permissões..." />;
  }

  return (
    <div className="grid gap-8 md:grid-cols-[15rem_1fr]">
      <aside className="md:sticky md:top-20 h-fit">
        <p className="px-4 mb-2 text-xs font-semibold text-gray-400 uppercase tracking-wide">
          Administração
        </p>
        <nav className="flex md:flex-col gap-1 rounded-2xl border border-gray-100 bg-white p-2 overflow-x-auto">
          {LINKS.map(({ href, label, icon: Icon, exact }) => {
            const active = exact ? pathname === href : pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-colors ${
                  active ? "bg-brand-50 text-brand-600" : "text-gray-600 hover:bg-gray-50"
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
