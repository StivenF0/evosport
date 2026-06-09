"use client";

import { CalendarDays } from "lucide-react";
import { MatchCard } from "../../components/matches/MatchCard";
import { EmptyState } from "../../components/ui/EmptyState";
import { ErrorMessage } from "../../components/ui/ErrorMessage";
import { LoadingSpinner } from "../../components/ui/LoadingSpinner";
import { useMatches } from "../../hooks/use-match";

export default function MatchesPage() {
  const { data: matches, isLoading, isError } = useMatches();

  if (isLoading) {
    return <LoadingSpinner message="Carregando o calendário de partidas..." />;
  }

  if (isError) {
    return <ErrorMessage message="Não foi possível carregar as partidas. Tente novamente." />;
  }

  return (
    <div className="flex flex-col gap-8 animate-in fade-in duration-500">
      <section className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight">
            Calendário de Jogos
          </h1>
          <p className="text-gray-500 mt-2 text-lg">
            Acompanhe as partidas, resultados e status do torneio.
          </p>
        </div>
      </section>

      {matches && matches.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {matches.map((match) => (
            <MatchCard key={match.id} match={match} />
          ))}
        </div>
      ) : (
        <EmptyState
          title="Nenhum jogo agendado"
          message="A organização ainda não definiu as partidas do torneio."
          icon={<CalendarDays className="w-16 h-16 opacity-50" />}
        />
      )}
    </div>
  );
}
