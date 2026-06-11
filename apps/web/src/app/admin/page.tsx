"use client";

import { useEvents } from "@web/hooks/use-event";
import { useMatches } from "@web/hooks/use-match";
import { useTeams } from "@web/hooks/use-team";
import { useVenues } from "@web/hooks/use-venue";
import { CalendarRange, MapPin, Swords, Users } from "lucide-react";
import Link from "next/link";

export default function AdminDashboard() {
  const { data: events } = useEvents();
  const { data: teams } = useTeams();
  const { data: venues } = useVenues();
  const { data: matches } = useMatches();

  const cards = [
    { href: "/admin/events", label: "Eventos", count: events?.length, icon: CalendarRange },
    { href: "/admin/teams", label: "Times", count: teams?.length, icon: Users },
    { href: "/admin/venues", label: "Sedes", count: venues?.length, icon: MapPin },
    { href: "/admin/matches", label: "Partidas", count: matches?.length, icon: Swords },
  ];

  return (
    <div className="flex flex-col gap-6">
      <header>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Painel administrativo</h1>
        <p className="mt-1 text-gray-500 text-sm">Gerencie os dados do Evosport.</p>
      </header>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map(({ href, label, count, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 hover:border-blue-200 hover:shadow-md transition-all"
          >
            <div className="flex items-center justify-between">
              <span className="text-3xl font-black text-gray-900">{count ?? "—"}</span>
              <Icon className="w-6 h-6 text-blue-500" />
            </div>
            <p className="mt-2 text-sm font-medium text-gray-600">{label}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
