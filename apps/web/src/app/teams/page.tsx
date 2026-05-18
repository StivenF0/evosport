'use client';

import { useTeams } from '../../hooks/use-team';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { ErrorMessage } from '../../components/ui/ErrorMessage';
import { Shield } from 'lucide-react';

export default function TeamsPage() {
  const { data: teams, isLoading, isError } = useTeams();

  if (isLoading) {
    return <LoadingSpinner message="Carregando os times participantes..." />;
  }

  if (isError) {
    return <ErrorMessage message="Não foi possível carregar a lista de times. Tente novamente mais tarde." />;
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

      {/* Grid de Times */}
      {teams && teams.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {teams.map((team) => (
            <div
              key={team.id}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col items-center text-center hover:shadow-md hover:border-blue-100 transition-all cursor-default group"
            >
              {team.flagUrl ? (
                <div className="w-24 h-24 mb-4 rounded-full overflow-hidden shadow-sm border-2 border-gray-50 group-hover:border-blue-100 transition-colors">
                  <img
                    src={team.flagUrl}
                    alt={`Escudo do ${team.name}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className="w-24 h-24 mb-4 rounded-full bg-linear-to-tr from-gray-100 to-gray-50 text-gray-400 flex items-center justify-center shadow-inner border border-gray-100 group-hover:text-blue-500 group-hover:from-blue-50 group-hover:to-white transition-colors">
                  <Shield className="w-10 h-10" />
                </div>
              )}

              <h3 className="text-lg font-bold text-gray-800 line-clamp-2">
                {team.name}
              </h3>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-gray-100 border-dashed p-12 text-center text-gray-500">
          <p className="text-lg font-medium">Nenhum time cadastrado no momento.</p>
        </div>
      )}
    </div>
  );
}
