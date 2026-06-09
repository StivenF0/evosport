"use client";

import { Trophy } from "lucide-react";
import { ErrorMessage } from "../../components/ui/ErrorMessage";
import { LoadingSpinner } from "../../components/ui/LoadingSpinner";
import { RankingTable } from "../../components/ui/RankingTable";
import { useRanking } from "../../hooks/use-ranking";

export default function RankingPage() {
  const { data: ranking, isLoading, isError, error } = useRanking();

  if (isLoading) {
    return <LoadingSpinner message="Calculando a tabela de classificação..." />;
  }

  if (isError) {
    return (
      <ErrorMessage
        message={
          error?.message || "Não foi possível carregar a classificação. Tente novamente mais tarde."
        }
      />
    );
  }

  return (
    <div className="flex flex-col gap-8 animate-in fade-in duration-500">
      <section className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight">
            Classificação
          </h1>
          <p className="text-gray-500 mt-2 text-lg">
            Acompanhe o desempenho e a pontuação das equipes no torneio.
          </p>
        </div>
        <div className="bg-yellow-50 text-yellow-700 px-4 py-2 rounded-full font-semibold text-sm border border-yellow-100 shadow-sm flex items-center gap-2">
          <Trophy className="w-5 h-5 text-yellow-500" />
          Ranking Oficial
        </div>
      </section>

      <RankingTable ranking={ranking || []} />
    </div>
  );
}
