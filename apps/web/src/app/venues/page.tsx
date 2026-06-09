"use client";

import { Map as MapIcon } from "lucide-react";
import { DynamicMap } from "../../components/ui/DynamicMap";
import { ErrorMessage } from "../../components/ui/ErrorMessage";
import { LoadingSpinner } from "../../components/ui/LoadingSpinner";
import { useVenues } from "../../hooks/use-venue";

export default function MapPage() {
  const { data: venues, isLoading, isError } = useVenues();

  if (isLoading) {
    return <LoadingSpinner message="Carregando o mapa interativo..." />;
  }

  if (isError) {
    return (
      <ErrorMessage message="Não foi possível carregar as informações do mapa. Tente novamente mais tarde." />
    );
  }

  return (
    // O container ocupa toda a altura disponível descontando o header (h-16) e o padding do layout (py-8)
    <div className="flex flex-col min-h-[calc(100dvh-8rem)] gap-6 animate-in fade-in duration-500">
      {/* Header Responsivo */}
      <section className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 flex flex-col sm:flex-row items-center justify-between gap-4 shrink-0">
        <div className="text-center sm:text-left">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
            Mapa Interativo
          </h1>
          <p className="text-gray-500 mt-1 text-sm sm:text-base">
            Navegue pelo mapa para encontrar todas as sedes do torneio.
          </p>
        </div>
        <div className="bg-blue-50 text-blue-700 px-4 py-2 rounded-full font-semibold text-sm border border-blue-100 shadow-sm flex items-center gap-2">
          <MapIcon className="w-5 h-5 text-blue-500" />
          {venues?.length || 0} sedes encontradas
        </div>
      </section>

      {/* Container do Mapa - flex-grow faz ele ocupar todo o espaço restante */}
      <div className="grow w-full relative z-0 rounded-3xl overflow-hidden shadow-sm border border-gray-100 bg-gray-50">
        <DynamicMap venues={venues || []} />
      </div>
    </div>
  );
}
