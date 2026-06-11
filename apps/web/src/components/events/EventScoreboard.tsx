"use client";

import { useEventHighlight } from "@web/hooks/use-event";
import type { Match } from "@web/types/api-types";
import { CalendarDays } from "lucide-react";
import Image from "next/image";

interface EventScoreboardProps {
  eventId: number;
}

function StatusBadge({ status }: { status: Match["status"] }) {
  if (status === "em_andamento") {
    return (
      <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold uppercase animate-pulse">
        Ao vivo
      </span>
    );
  }
  if (status === "encerrado") {
    return (
      <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-bold uppercase">
        Encerrado
      </span>
    );
  }
  return (
    <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-xs font-bold uppercase">
      Próximo jogo
    </span>
  );
}

function TeamSide({ name, flagUrl }: { name: string; flagUrl: string | null }) {
  return (
    <div className="flex flex-col items-center flex-1 min-w-0 gap-2">
      {flagUrl ? (
        <div className="w-12 h-12 rounded-full overflow-hidden border border-gray-100 shadow-sm">
          <Image
            src={flagUrl}
            alt={name}
            width={48}
            height={48}
            className="w-full h-full object-cover"
          />
        </div>
      ) : (
        <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-sm font-bold text-gray-400">
          {name.charAt(0)}
        </div>
      )}
      <span className="text-xs font-bold text-gray-800 text-center line-clamp-2 leading-tight">
        {name}
      </span>
    </div>
  );
}

export function EventScoreboard({ eventId }: EventScoreboardProps) {
  const { data: match, isLoading } = useEventHighlight(eventId);

  if (isLoading) {
    return <div className="h-32 rounded-2xl bg-gray-50 border border-gray-100 animate-pulse" />;
  }

  if (!match) {
    return (
      <div className="rounded-2xl border border-dashed border-gray-200 bg-white p-6 text-center text-sm text-gray-500">
        Nenhuma partida programada no momento.
      </div>
    );
  }

  const showScore = match.status === "encerrado" || match.status === "em_andamento";

  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <span className="inline-flex items-center gap-1.5 text-xs text-gray-500">
          <CalendarDays className="w-3.5 h-3.5" />
          {match.formattedDate}
        </span>
        <StatusBadge status={match.status} />
      </div>
      <div className="flex items-center justify-between gap-3">
        <TeamSide name={match.homeTeam?.name ?? "—"} flagUrl={match.homeTeam?.flagUrl ?? null} />
        <div className="flex items-center gap-2 shrink-0">
          {showScore ? (
            <>
              <span className="text-2xl font-black text-gray-900">{match.homeScore ?? 0}</span>
              <span className="text-gray-400 text-sm">x</span>
              <span className="text-2xl font-black text-gray-900">{match.awayScore ?? 0}</span>
            </>
          ) : (
            <span className="text-xl font-black text-gray-300">VS</span>
          )}
        </div>
        <TeamSide name={match.awayTeam?.name ?? "—"} flagUrl={match.awayTeam?.flagUrl ?? null} />
      </div>
      {match.stadium?.name && (
        <p className="mt-4 text-center text-xs text-gray-400">{match.stadium.name}</p>
      )}
    </div>
  );
}
