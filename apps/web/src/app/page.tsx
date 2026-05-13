'use client';

import { useEvent } from '@web/hooks/useApi';

export default function Home() {
  const { data: event, isLoading, isError } = useEvent();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <p className="text-gray-500 text-lg animate-pulse">Carregando informações do evento...</p>
      </div>
    );
  }

  if (isError || !event) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <p className="text-red-500 font-medium">Erro ao carregar os dados do evento.</p>
      </div>
    );
  }

  const formatDate = (dateString: string | Date) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  return (
    <div className="flex flex-col gap-10">
      {/* Hero Section (UC01) */}
      <section className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 md:p-16 flex flex-col items-center text-center">
        {event.logoUrl ? (
          <img
            src={event.logoUrl}
            alt={`Logo ${event.name}`}
            className="w-32 h-32 md:w-40 md:h-40 object-contain mb-6 drop-shadow-md"
          />
        ) : (
          <div className="w-32 h-32 md:w-40 md:h-40 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-6">
            <span className="text-5xl font-bold">{event.name.charAt(0)}</span>
          </div>
        )}

        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight mb-4">
          {event.name}
        </h1>

        <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-50 text-blue-700 rounded-full font-medium text-sm md:text-base">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <span>
            {formatDate(event.startDate)} até {formatDate(event.endDate)}
          </span>
        </div>
      </section>

      {/* Tabela de Classificação virá aqui nas próximas tasks */}
    </div>
  );
}
