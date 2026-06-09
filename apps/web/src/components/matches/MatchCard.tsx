import { CalendarDays } from "lucide-react";
import Image from "next/image";
import type { Match } from "../../types/api-types";

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
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-6 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-center mb-4 sm:mb-6 border-b border-gray-50 pb-3 sm:pb-4">
        <div className="flex items-center text-gray-500 text-xs sm:text-sm gap-1 sm:gap-2">
          <CalendarDays className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          {match.formattedDate}
        </div>
        {getStatusBadge(match.status)}
      </div>

      <div className="flex items-center justify-between gap-2 sm:gap-4">
        {/* Time da Casa */}
        <div className="flex flex-col items-center flex-1 min-w-0">
          {match.homeTeam?.flagUrl ? (
            <div className="w-12 h-12 sm:w-16 sm:h-16 mb-1 sm:mb-2 rounded-full overflow-hidden shadow-sm border border-gray-100">
              <Image
                src={match.homeTeam.flagUrl}
                alt={match.homeTeam.name}
                width={64}
                height={64}
                className="w-full h-full object-cover"
              />
            </div>
          ) : (
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gray-100 rounded-full mb-1 sm:mb-2" />
          )}
          <span className="text-xs sm:text-sm font-bold text-gray-800 text-center line-clamp-2 leading-tight">
            {match.homeTeam?.name || "Time Desconhecido"}
          </span>
        </div>

        {/* Placar ou VS */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {showScore ? (
            <>
              <span className="text-2xl sm:text-3xl font-black text-gray-900">
                {match.homeScore ?? 0}
              </span>
              <span className="text-gray-400 font-medium text-base sm:text-lg">x</span>
              <span className="text-2xl sm:text-3xl font-black text-gray-900">
                {match.awayScore ?? 0}
              </span>
            </>
          ) : (
            <span className="text-xl sm:text-2xl font-black text-gray-300">X</span>
          )}
        </div>

        {/* Time Visitante */}
        <div className="flex flex-col items-center flex-1 min-w-0">
          {match.awayTeam?.flagUrl ? (
            <div className="w-12 h-12 sm:w-16 sm:h-16 mb-1 sm:mb-2 rounded-full overflow-hidden shadow-sm border border-gray-100">
              <Image
                src={match.awayTeam.flagUrl}
                alt={match.awayTeam.name}
                width={64}
                height={64}
                className="w-full h-full object-cover"
              />
            </div>
          ) : (
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gray-100 rounded-full mb-1 sm:mb-2" />
          )}
          <span className="text-xs sm:text-sm font-bold text-gray-800 text-center line-clamp-2 leading-tight">
            {match.awayTeam?.name || "Time Desconhecido"}
          </span>
        </div>
      </div>
    </div>
  );
}
