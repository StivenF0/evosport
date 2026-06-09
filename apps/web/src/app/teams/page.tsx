"use client";

import { Shield } from "lucide-react";
import { TeamCard } from "../../components/teams/TeamCard";
import { EmptyState } from "../../components/ui/EmptyState";
import { ErrorMessage } from "../../components/ui/ErrorMessage";
import { LoadingSpinner } from "../../components/ui/LoadingSpinner";
import { useTeams } from "../../hooks/use-team";

export default function TeamsPage() {
  const { data: teams, isLoading, isError } = useTeams();

  if (isLoading) {
    return <LoadingSpinner message="Carregando os times participantes..." />;
  }

  if (isError) {
    return (
      <ErrorMessage message="Não foi possível carregar a lista de times. Tente novamente mais tarde." />
    );
  }

  return (
    <div className="flex flex-col gap-8 animate-in fade-in duration-500">
      {/* Header da Página */}
      <section className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight">
            Times Participantes
          </h1>
          <p className="text-gray-500 mt-2 text-lg">
            Conheça as equipes que estão competindo no torneio.
          </p>
        </div>
        <div className="bg-blue-50 text-blue-700 px-4 py-2 rounded-full font-semibold text-sm border border-blue-100 shadow-sm flex items-center gap-2">
          <Shield className="w-5 h-5 text-blue-500" />
          {teams?.length || 0} times registrados
        </div>
      </section>

      {/* Grid de Times ou Empty State */}
      {teams && teams.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {teams.map((team) => (
            <TeamCard key={team.id} team={team} />
          ))}
        </div>
      ) : (
        <EmptyState
          title="Nenhum time encontrado"
          message="Ainda não há times cadastrados neste evento. Tente novamente mais tarde."
        />
      )}
    </div>
  );
}
