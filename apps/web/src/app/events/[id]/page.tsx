"use client";

import { EventScoreboard } from "@web/components/events/EventScoreboard";
import { FavoriteButton } from "@web/components/events/FavoriteButton";
import { MatchCard } from "@web/components/matches/MatchCard";
import { TeamCard } from "@web/components/teams/TeamCard";
import { DynamicMap } from "@web/components/ui/DynamicMap";
import { EmptyState } from "@web/components/ui/EmptyState";
import { ErrorMessage } from "@web/components/ui/ErrorMessage";
import { LoadingSpinner } from "@web/components/ui/LoadingSpinner";
import { RankingTable } from "@web/components/ui/RankingTable";
import {
  useEvent,
  useEventMatches,
  useEventRanking,
  useEventTeams,
  useEventVenues,
} from "@web/hooks/use-event";
import { CalendarDays, ChevronRight, Info, Shield, Swords, Trophy, Users } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";

type Tab = "sobre" | "classificacao" | "times" | "jogos";

const TABS: { id: Tab; label: string; icon: typeof Info }[] = [
  { id: "sobre", label: "Sobre", icon: Info },
  { id: "jogos", label: "Jogos", icon: Swords },
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
  const { data: matches } = useEventMatches(id);

  if (isLoading) return <LoadingSpinner message="Carregando evento..." />;
  if (isError || !event) return <ErrorMessage message={error?.message} />;

  const mappableVenues = venues?.filter((v) => v.latitude && v.longitude) ?? [];

  const upcoming = (matches ?? [])
    .filter((m) => m.status === "agendado")
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 4);

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
        <div className="flex gap-2 border-b border-gray-100 mb-6 overflow-x-auto overflow-y-hidden">
          {TABS.map(({ id: tabId, label, icon: Icon }) => (
            <button
              key={tabId}
              type="button"
              onClick={() => setTab(tabId)}
              className={`inline-flex items-center gap-2 px-4 py-3 text-sm font-semibold border-b-2 -mb-px whitespace-nowrap transition-colors ${
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
          <section className="flex flex-col gap-6">
            <p className="text-gray-600 leading-relaxed">
              {event.description ?? "Este evento ainda não possui uma descrição."}
            </p>
            <div>
              <h3 className="text-sm font-semibold text-gray-500 mb-3 uppercase tracking-wide">
                Sedes
              </h3>
              {mappableVenues.length > 0 ? (
                <div className="w-full aspect-4/3">
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

        {tab === "jogos" && (
          <section>
            {matches && matches.length > 0 ? (
              <div className="grid gap-4 sm:grid-cols-2">
                {matches.map((match) => (
                  <MatchCard key={match.id} match={match} />
                ))}
              </div>
            ) : (
              <EmptyState
                title="Nenhuma partida"
                message="Este evento ainda não tem partidas programadas."
                icon={<CalendarDays className="w-16 h-16 opacity-50" />}
              />
            )}
          </section>
        )}

        {tab === "classificacao" && <RankingTable ranking={ranking ?? []} />}

        {tab === "times" && (
          <section>
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

        <div className="rounded-2xl border border-gray-100 bg-white p-4">
          <h3 className="text-xs font-semibold text-gray-400 mb-3 uppercase tracking-wide">
            Próximas partidas
          </h3>
          {upcoming.length > 0 ? (
            <ul className="flex flex-col divide-y divide-gray-50">
              {upcoming.map((match) => (
                <li key={match.id} className="py-2.5 first:pt-0 last:pb-0">
                  <p className="text-sm font-medium text-gray-800 truncate">
                    {match.homeTeam?.name} <span className="text-gray-400">x</span>{" "}
                    {match.awayTeam?.name}
                  </p>
                  <span className="inline-flex items-center gap-1 text-xs text-gray-400 mt-0.5">
                    <CalendarDays className="w-3 h-3" />
                    {match.formattedDate}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-gray-400">Sem partidas agendadas.</p>
          )}
        </div>
      </aside>
    </div>
  );
}
