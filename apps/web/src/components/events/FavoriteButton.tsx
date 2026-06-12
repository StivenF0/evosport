"use client";

import { useAuth } from "@web/hooks/use-auth";
import { useAddFavorite, useFavorites, useRemoveFavorite } from "@web/hooks/use-favorite";
import { Bookmark } from "lucide-react";
import Link from "next/link";

interface FavoriteButtonProps {
  eventId: number;
}

export function FavoriteButton({ eventId }: FavoriteButtonProps) {
  const { isAuthenticated } = useAuth();
  const { data: favorites } = useFavorites();
  const addFavorite = useAddFavorite();
  const removeFavorite = useRemoveFavorite();

  // Visitante não autenticado: convida a entrar
  if (!isAuthenticated) {
    return (
      <Link
        href="/login"
        className="inline-flex items-center gap-2 rounded-full border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-600 hover:border-blue-200 hover:text-blue-600 transition-colors"
      >
        <Bookmark className="w-4 h-4" />
        Favoritar
      </Link>
    );
  }

  const isFavorited = favorites?.some((event) => event.id === eventId) ?? false;
  const isPending = addFavorite.isPending || removeFavorite.isPending;

  const toggle = () => {
    if (isFavorited) {
      removeFavorite.mutate(eventId);
    } else {
      addFavorite.mutate(eventId);
    }
  };

  return (
    <button
      type="button"
      onClick={toggle}
      disabled={isPending}
      className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition-colors disabled:opacity-60 ${
        isFavorited
          ? "bg-red-50 text-red-600 border border-red-100 hover:bg-red-100"
          : "border border-gray-200 text-gray-600 hover:border-red-200 hover:text-red-600"
      }`}
    >
      <Bookmark className={`w-4 h-4 ${isFavorited ? "fill-current" : ""}`} />
      {isFavorited ? "Favoritado" : "Favoritar"}
    </button>
  );
}
