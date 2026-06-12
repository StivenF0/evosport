"use client";

import { DynamicMap } from "@web/components/ui/DynamicMap";
import { ErrorMessage } from "@web/components/ui/ErrorMessage";
import { LoadingSpinner } from "@web/components/ui/LoadingSpinner";
import { useVenues } from "@web/hooks/use-venue";
import { Map as MapIcon } from "lucide-react";

export default function MapPage() {
  const { data: venues, isLoading, isError, error } = useVenues();

  if (isLoading) {
    return <LoadingSpinner message="Carregando o mapa interativo..." />;
  }

  if (isError) {
    return (
      <ErrorMessage
        message={
          error?.message ||
          "Não foi possível carregar as informações do mapa. Tente novamente mais tarde."
        }
      />
    );
  }

  return (
    // O container ocupa toda a altura disponível descontando o header (h-16) e o padding do layout (py-8)
    <div className="flex flex-col min-h-[calc(100dvh-8rem)] gap-6 animate-in fade-in duration-500">
      <div className="flex flex-wrap items-center justify-between gap-4 shrink-0">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
          Mapa Interativo
        </h1>
        <div className="bg-brand-50 text-brand-700 px-4 py-2 rounded-full font-semibold text-sm border border-brand-100 shadow-sm flex items-center gap-2">
          <MapIcon className="w-5 h-5 text-brand-500" />
          {venues?.length || 0} sedes encontradas
        </div>
      </div>

      {/* Container do Mapa - flex-grow faz ele ocupar todo o espaço restante */}
      <div className="grow w-full aspect-4/3 relative z-0 rounded-3xl overflow-hidden shadow-sm border border-gray-100 bg-gray-50">
        <DynamicMap venues={venues || []} />
      </div>
    </div>
  );
}
