'use client';

import { usePrimaryEvent } from '@web/hooks/use-event';
import { Calendar, AlertCircle, Loader2 } from 'lucide-react';

export default function Home() {
  const { data: event, isLoading, isError } = usePrimaryEvent();

  // ESTADO 1: CARREGAMENTO (LOADING)
  if (isLoading) {
    return (
      <div className="bg-white/60 backdrop-blur-sm rounded-3xl border border-gray-100 border-dashed p-12 md:p-20 flex flex-col items-center justify-center min-h-75">
        <div className="relative">
          <div className="absolute -inset-4 bg-blue-100 rounded-full blur-xl opacity-50 animate-pulse"></div>
          <Loader2 className="w-12 h-12 text-blue-600 animate-spin relative z-10" />
        </div>
        <p className="mt-6 text-gray-500 font-medium text-lg animate-pulse">
          Carregando informações do evento...
        </p>
      </div>
    );
  }

  // ESTADO 2: ERRO (OFFLINE/FALHA NA API)
  if (isError || !event) {
    return (
      <div className="bg-red-50 rounded-3xl border border-red-100 p-12 md:p-20 flex flex-col items-center justify-center min-h-75 text-center">
        <div className="bg-red-100 p-4 rounded-full mb-6">
          <AlertCircle className="w-10 h-10 text-red-600" />
        </div>
        <h2 className="text-xl font-bold text-red-900 mb-2">Ops! Algo deu errado.</h2>
        <p className="text-red-700 max-w-md">
          Não foi possível carregar os dados do evento. Verifique se a API está online ou tente atualizar a página.
        </p>
      </div>
    );
  }

  const formatDate = (isoString: string | Date) => {
    if (!isoString) return '';
    const date = new Date(isoString);
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      timeZone: 'UTC'
    }).format(date);
  };

  // ESTADO 3: SUCESSO
  return (
    <div className="flex flex-col gap-10">
      <section className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 md:p-16 flex flex-col items-center text-center transition-all duration-500 ease-out">

        {/* Logo do Evento ou Fallback */}
        {event.logoUrl ? (
          <div className="w-28 h-28 md:w-36 md:h-36 mb-6 md:mb-8 rounded-2xl overflow-hidden shadow-sm border border-gray-100 bg-white p-2">
            <img
              src={event.logoUrl}
              alt={`Logo do evento ${event.name}`}
              className="w-full h-full object-cover rounded-xl"
            />
          </div>
        ) : (
          <div className="w-28 h-28 md:w-36 md:h-36 mb-6 md:mb-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center text-5xl md:text-6xl font-extrabold shadow-inner">
            {event.name.charAt(0).toUpperCase()}
          </div>
        )}

        {/* Nome do Evento */}
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 tracking-tight mb-6">
          {event.name}
        </h1>

        {/* Período do Evento (Pílula/Badge) */}
        <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-5 py-2.5 rounded-full font-semibold text-sm md:text-base border border-blue-100/50 shadow-sm">
          <Calendar className="w-5 h-5 text-blue-500" />
          <span>
            {formatDate(event.startDate)} <span className="mx-1 text-blue-400 font-normal">até</span> {formatDate(event.endDate)}
          </span>
        </div>
      </section>

      {/* A futura Tabela de Classificação ficará renderizada aqui */}
    </div>
  );
}
