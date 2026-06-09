import { CalendarDays } from "lucide-react";
import Image from "next/image";
import type { Match as BaseMatch } from "../../types/api-types";

export interface Match extends BaseMatch {
  homeScore?: number;
  awayScore?: number;
}

interface MatchCardProps {
  match: Match;
}

export function MatchCard({ match }: MatchCardProps) {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "agendado":
        return (
          <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-xs font-bold uppercase">
            Em Breve
          </span>
        );
      case "em_andamento":
        return (
          <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold uppercase animate-pulse">
            Em Andamento
          </span>
        );
      case "encerrado":
        return (
          <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-bold uppercase">
            Encerrado
          </span>
        );
      default:
        return null;
    }
  };

  const showScore = match.status === "encerrado" || match.status === "em_andamento";

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-center mb-6 border-b border-gray-50 pb-4">
        <div className="flex items-center text-gray-500 text-sm gap-2">
          <CalendarDays className="w-4 h-4" />
          {/* Utilizando a data já formatada vinda da API */}
          {match.formattedDate}
        </div>
        {getStatusBadge(match.status)}
      </div>

      <div className="flex items-center justify-between gap-4">
        {/* Time da Casa */}
        <div className="flex flex-col items-center flex-1">
          {match.homeTeam?.flagUrl ? (
            <div className="w-16 h-16 mb-2 rounded-full overflow-hidden shadow-sm border border-gray-100">
              <Image
                src={match.homeTeam.flagUrl}
                alt={match.homeTeam.name}
                width={64}
                height={64}
                className="w-full h-full object-cover"
              />
            </div>
          ) : (
            <div className="w-16 h-16 bg-gray-100 rounded-full mb-2" />
          )}
          <span className="font-bold text-gray-800 text-center line-clamp-1">
            {match.homeTeam?.name || "Time Desconhecido"}
          </span>
        </div>

        {/* Placar ou VS */}
        <div className="flex items-center gap-3">
          {showScore ? (
            <>
              <span className="text-3xl font-black text-gray-900">{match.homeScore ?? 0}</span>
              <span className="text-gray-400 font-medium text-lg">x</span>
              <span className="text-3xl font-black text-gray-900">{match.awayScore ?? 0}</span>
            </>
          ) : (
            <span className="text-2xl font-black text-gray-300">X</span>
          )}
        </div>

        {/* Time Visitante */}
        <div className="flex flex-col items-center flex-1">
          {match.awayTeam?.flagUrl ? (
            <div className="w-16 h-16 mb-2 rounded-full overflow-hidden shadow-sm border border-gray-100">
              <Image
                src={match.awayTeam.flagUrl}
                alt={match.awayTeam.name}
                width={64}
                height={64}
                className="w-full h-full object-cover"
              />
            </div>
          ) : (
            <div className="w-16 h-16 bg-gray-100 rounded-full mb-2" />
          )}
          <span className="font-bold text-gray-800 text-center line-clamp-1">
            {match.awayTeam?.name || "Time Desconhecido"}
          </span>
        </div>
      </div>
    </div>
  );
}
