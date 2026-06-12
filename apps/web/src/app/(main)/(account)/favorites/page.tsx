"use client";

import { FavoriteButton } from "@web/components/events/FavoriteButton";
import { EmptyState } from "@web/components/ui/EmptyState";
import { ErrorMessage } from "@web/components/ui/ErrorMessage";
import { LoadingSpinner } from "@web/components/ui/LoadingSpinner";
import { useFavorites } from "@web/hooks/use-favorite";
import { Bookmark } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function FavoritesPage() {
  const { data: events, isLoading, isError, error } = useFavorites();

  return (
    <div className="flex flex-col gap-6">
      <header>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Favoritos</h1>
        <p className="mt-1 text-gray-500 text-sm">Os eventos que você salvou para acompanhar.</p>
      </header>

      {isLoading && <LoadingSpinner message="Carregando favoritos..." />}
      {isError && <ErrorMessage message={error?.message} />}

      {!isLoading && !isError && (!events || events.length === 0) && (
        <EmptyState
          title="Nenhum favorito ainda"
          message="Explore os eventos e toque em Favoritar para salvá-los aqui."
          icon={<Bookmark className="w-16 h-16 opacity-50" />}
        />
      )}

      {!isLoading && !isError && events && events.length > 0 && (
        <div className="flex flex-col gap-4">
          {events.map((event) => (
            <article
              key={event.id}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex items-start gap-4"
            >
              {event.logoUrl ? (
                <div className="w-14 h-14 shrink-0 rounded-xl overflow-hidden border border-gray-100 bg-white p-1">
                  <Image
                    src={event.logoUrl}
                    alt={`Logo do evento ${event.name}`}
                    width={56}
                    height={56}
                    className="w-full h-full object-cover rounded-lg"
                  />
                </div>
              ) : (
                <div className="w-14 h-14 shrink-0 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center">
                  <Bookmark className="w-6 h-6" />
                </div>
              )}

              <div className="min-w-0 flex-1">
                <Link
                  href={`/events/${event.id}`}
                  className="text-lg font-bold text-gray-900 hover:text-brand-600 transition-colors"
                >
                  {event.name}
                </Link>
                {event.description && (
                  <p className="mt-1 text-sm text-gray-600 line-clamp-2">{event.description}</p>
                )}
              </div>

              <FavoriteButton eventId={event.id} />
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
