'use client';

import { useEvent } from '@web/hooks/useApi';
import { LoadingSpinner } from '@web/components/ui/LoadingSpinner';
import { ErrorMessage } from '@web/components/ui/ErrorMessage';

export default function Home() {
  const { data: event, isLoading, isError } = useEvent();

  if (isLoading) {
    return <LoadingSpinner message="Carregando informações do evento..." />;
  }

  if (isError || !event) {
    return <ErrorMessage message="Não foi possível carregar os dados do evento. Verifique se a API está online." />;
  }

  const formatDate = (dateString: string | Date) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  return (
    <div className="flex flex-col gap-10">
      <section className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 md:p-16 flex flex-col items-center text-center">
        {event.logoUrl ? (
          <img src={event.logoUrl} alt={`Logo ${event.name}`} className="w-32 h-32 object-contain mb-6" />
        ) : (
          <div className="w-32 h-32 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-6">
            <span className="text-5xl font-bold">{event.name.charAt(0)}</span>
          </div>
        )}
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight mb-4">{event.name}</h1>
        <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-50 text-blue-700 rounded-full font-medium">
          <span>{formatDate(event.startDate)} até {formatDate(event.endDate)}</span>
        </div>
      </section>
    </div>
  );
}
