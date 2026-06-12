"use client";

import { MatchCard } from "@web/components/matches/MatchCard";
import { EmptyState } from "@web/components/ui/EmptyState";
import { ErrorMessage } from "@web/components/ui/ErrorMessage";
import { LoadingSpinner } from "@web/components/ui/LoadingSpinner";
import { useEvents } from "@web/hooks/use-event";
import { useMatches } from "@web/hooks/use-match";
import type { MatchStatus } from "@web/types/api-types";
import { CalendarDays } from "lucide-react";
import { useState } from "react";

const selectClass =
  "rounded-xl border border-gray-200 px-3 py-2 text-sm text-gray-700 bg-white focus:border-brand-500 focus:ring-2 focus:ring-brand-100 outline-none transition";

export default function MatchesPage() {
  const [eventId, setEventId] = useState<number | undefined>(undefined);
  const [status, setStatus] = useState<MatchStatus | undefined>(undefined);
  const [sort, setSort] = useState<"asc" | "desc">("asc");

  const { data: events } = useEvents();
  const { data: matches, isLoading, isError, error } = useMatches({ eventId, status, sort });

  return (
    <div className="flex flex-col gap-8">
      <header>
        <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight">
          Calendário de Jogos
        </h1>
        <p className="text-gray-500 mt-2">
          Acompanhe as partidas, resultados e status — filtre por evento e situação.
        </p>
      </header>

      {/* Filtros e ordenação */}
      <div className="flex flex-wrap items-center gap-3">
        <select
          aria-label="Filtrar por evento"
          className={selectClass}
          value={eventId ?? ""}
          onChange={(e) => setEventId(e.target.value ? Number(e.target.value) : undefined)}
        >
          <option value="">Todos os eventos</option>
          {events?.map((event) => (
            <option key={event.id} value={event.id}>
              {event.name}
            </option>
          ))}
        </select>

        <select
          aria-label="Filtrar por status"
          className={selectClass}
          value={status ?? ""}
          onChange={(e) => setStatus((e.target.value || undefined) as MatchStatus | undefined)}
        >
          <option value="">Todos os status</option>
          <option value="agendado">Agendado</option>
          <option value="em_andamento">Em andamento</option>
          <option value="encerrado">Encerrado</option>
        </select>

        <select
          aria-label="Ordenar por data"
          className={selectClass}
          value={sort}
          onChange={(e) => setSort(e.target.value as "asc" | "desc")}
        >
          <option value="asc">Data: mais antigas primeiro</option>
          <option value="desc">Data: mais recentes primeiro</option>
        </select>
      </div>

      {isLoading && <LoadingSpinner message="Carregando o calendário de partidas..." />}
      {isError && (
        <ErrorMessage
          message={error?.message || "Não foi possível carregar as partidas. Tente novamente."}
        />
      )}

      {!isLoading && !isError && matches && matches.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {matches.map((match) => (
            <MatchCard key={match.id} match={match} />
          ))}
        </div>
      )}

      {!isLoading && !isError && (!matches || matches.length === 0) && (
        <EmptyState
          title="Nenhum jogo encontrado"
          message="Nenhuma partida corresponde aos filtros selecionados."
          icon={<CalendarDays className="w-16 h-16 opacity-50" />}
        />
      )}
    </div>
  );
}
