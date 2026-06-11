import type { Event } from "@web/types/api-types";
import { Link2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { EventScoreboard } from "./EventScoreboard";

interface EventFeedItemProps {
  event: Event;
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(value));
}

export function EventFeedItem({ event }: EventFeedItemProps) {
  return (
    <article className="py-8 first:pt-0">
      <div className="grid gap-6 md:grid-cols-[1fr_20rem]">
        {/* Conteúdo principal */}
        <div className="flex gap-4">
          {event.logoUrl ? (
            <div className="w-16 h-16 shrink-0 rounded-2xl overflow-hidden border border-gray-100 bg-white p-1">
              <Image
                src={event.logoUrl}
                alt={`Logo do evento ${event.name}`}
                width={64}
                height={64}
                className="w-full h-full object-cover rounded-xl"
              />
            </div>
          ) : (
            <div className="w-16 h-16 shrink-0 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center text-2xl font-extrabold">
              {event.name.charAt(0).toUpperCase()}
            </div>
          )}

          <div className="min-w-0">
            <Link
              href={`/events/${event.id}`}
              className="group inline-flex items-center gap-2 text-gray-900 hover:text-blue-600 transition-colors"
            >
              <h2 className="text-xl md:text-2xl font-bold tracking-tight">{event.name}</h2>
              <Link2 className="w-4 h-4 text-gray-300 group-hover:text-blue-500" />
            </Link>
            <p className="mt-1 text-xs text-gray-400">
              {formatDate(event.startDate)} até {formatDate(event.endDate)}
            </p>
            {event.description && (
              <p className="mt-3 text-sm text-gray-600 leading-relaxed line-clamp-3">
                {event.description}
              </p>
            )}
            <Link
              href={`/events/${event.id}`}
              className="mt-4 inline-block text-sm font-semibold text-blue-600 hover:underline"
            >
              Ver evento &rarr;
            </Link>
          </div>
        </div>

        {/* Placar dinâmico */}
        <EventScoreboard eventId={event.id} />
      </div>
    </article>
  );
}
