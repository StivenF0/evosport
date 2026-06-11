"use client";

import { EventScoreboard } from "@web/components/events/EventScoreboard";
import { FavoriteButton } from "@web/components/events/FavoriteButton";
import { TeamCard } from "@web/components/teams/TeamCard";
import { DynamicMap } from "@web/components/ui/DynamicMap";
import { EmptyState } from "@web/components/ui/EmptyState";
import { ErrorMessage } from "@web/components/ui/ErrorMessage";
import { LoadingSpinner } from "@web/components/ui/LoadingSpinner";
import { RankingTable } from "@web/components/ui/RankingTable";
import { useEvent, useEventRanking, useEventTeams, useEventVenues } from "@web/hooks/use-event";
import { ChevronRight, Info, Shield, Trophy, Users } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";

type Tab = "sobre" | "classificacao" | "times";

const TABS: { id: Tab; label: string; icon: typeof Info }[] = [
  { id: "sobre", label: "Sobre", icon: Info },
  { id: "classificacao", label: "Classificação", icon: Trophy },
  { id: "times", label: "Times", icon: Users },
];

export default function EventPage() {
  const params = useParams();
  const id = Number(params.id);
  const [tab, setTab] = useState<Tab>("sobre");

  const { data: event, isLoading, isError, error } = useEvent(id);
  const { data: venues } = useEventVenues(id);
  const { data: ranking } = useEventRanking(id);
  const { data: teams } = useEventTeams(id);

  if (isLoading) return <LoadingSpinner message="Carregando evento..." />;
  if (isError || !event) return <ErrorMessage message={error?.message} />;

  const mappableVenues = venues?.filter((v) => v.latitude && v.longitude) ?? [];

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_22rem]">
      {/* Coluna principal */}
      <div className="min-w-0">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-1 text-sm text-gray-500 mb-4">
          <Link href="/" className="hover:text-blue-600">
            Home
          </Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-gray-800 font-medium truncate">{event.name}</span>
        </nav>

        <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight">
            {event.name}
          </h1>
          <FavoriteButton eventId={id} />
        </div>

        {/* Abas */}
        <div className="flex gap-2 border-b border-gray-100 mb-6">
          {TABS.map(({ id: tabId, label, icon: Icon }) => (
            <button
              key={tabId}
              type="button"
              onClick={() => setTab(tabId)}
              className={`inline-flex items-center gap-2 px-4 py-3 text-sm font-semibold border-b-2 -mb-px transition-colors ${
                tab === tabId
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-800"
              }`}
            >
              <Icon className="w-4 h-4" />
              {label}
            </button>
          ))}
        </div>

        {/* Conteúdo das abas */}
        {tab === "sobre" && (
          <section id="sobre" className="flex flex-col gap-6">
            <p className="text-gray-600 leading-relaxed">
              {event.description ?? "Este evento ainda não possui uma descrição."}
            </p>
            <div>
              <h3 className="text-sm font-semibold text-gray-500 mb-3 uppercase tracking-wide">
                Sedes
              </h3>
              {mappableVenues.length > 0 ? (
                <div className="h-80">
                  <DynamicMap venues={mappableVenues} />
                </div>
              ) : (
                <EmptyState
                  title="Sem sedes no mapa"
                  message="Este evento ainda não tem sedes com localização cadastrada."
                  icon={<Shield className="w-16 h-16 opacity-50" />}
                />
              )}
            </div>
          </section>
        )}

        {tab === "classificacao" && (
          <section id="classificacao">
            <RankingTable ranking={ranking ?? []} />
          </section>
        )}

        {tab === "times" && (
          <section id="times">
            {teams && teams.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {teams.map((team) => (
                  <TeamCard key={team.id} team={team} />
                ))}
              </div>
            ) : (
              <EmptyState
                title="Nenhum time"
                message="Este evento ainda não tem times vinculados."
                icon={<Users className="w-16 h-16 opacity-50" />}
              />
            )}
          </section>
        )}
      </div>

      {/* Painel de contexto (fixo no desktop) */}
      <aside className="lg:sticky lg:top-20 h-fit flex flex-col gap-6">
        <div>
          <h3 className="text-sm font-semibold text-gray-500 mb-3 uppercase tracking-wide">
            Partida em destaque
          </h3>
          <EventScoreboard eventId={id} />
        </div>

        <nav className="rounded-2xl border border-gray-100 bg-white p-4">
          <h3 className="text-xs font-semibold text-gray-400 mb-2 uppercase tracking-wide">
            Nesta página
          </h3>
          <ul className="flex flex-col gap-1">
            {TABS.map(({ id: tabId, label }) => (
              <li key={tabId}>
                <button
                  type="button"
                  onClick={() => setTab(tabId)}
                  className={`text-sm text-left w-full px-2 py-1.5 rounded-lg transition-colors ${
                    tab === tabId
                      ? "bg-blue-50 text-blue-600 font-semibold"
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  {label}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </aside>
    </div>
  );
}
