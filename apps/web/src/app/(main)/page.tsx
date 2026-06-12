"use client";

import { EventFeedItem } from "@web/components/events/EventFeedItem";
import { EmptyState } from "@web/components/ui/EmptyState";
import { ErrorMessage } from "@web/components/ui/ErrorMessage";
import { LoadingSpinner } from "@web/components/ui/LoadingSpinner";
import { useEvents } from "@web/hooks/use-event";
import { CalendarRange } from "lucide-react";

export default function Home() {
  const { data: events, isLoading, isError, error } = useEvents();

  return (
    <div className="flex flex-col gap-8">
      <header className="text-center md:text-left">
        <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight">
          Eventos esportivos
        </h1>
        <p className="mt-2 text-gray-500">
          Acompanhe os torneios globais, classificações e os próximos confrontos.
        </p>
      </header>

      {isLoading && <LoadingSpinner message="Carregando eventos..." />}

      {isError && <ErrorMessage message={error?.message} />}

      {!isLoading && !isError && (!events || events.length === 0) && (
        <EmptyState
          title="Nenhum evento disponível"
          message="Ainda não há eventos cadastrados. Volte em breve."
          icon={<CalendarRange className="w-16 h-16 opacity-50" />}
        />
      )}

      {!isLoading && !isError && events && events.length > 0 && (
        <div className="flex flex-col divide-y divide-gray-200">
          {events.map((event) => (
            <EventFeedItem key={event.id} event={event} />
          ))}
        </div>
      )}
    </div>
  );
}
