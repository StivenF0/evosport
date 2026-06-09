import { Trophy } from "lucide-react";
import Image from "next/image";
import type { TeamStats } from "../../types/api-types";
import { EmptyState } from "./EmptyState";

interface RankingTableProps {
  ranking: TeamStats[];
}

export function RankingTable({ ranking }: RankingTableProps) {
  if (!ranking || ranking.length === 0) {
    return (
      <EmptyState
        title="Tabela Vazia"
        message="Ainda não há dados de classificação. As partidas precisam ser encerradas para gerar o ranking."
        icon={<Trophy className="w-16 h-16 opacity-50" />}
      />
    );
  }

  return (
    <div className="w-full overflow-x-auto bg-white rounded-2xl shadow-sm border border-gray-100">
      <table className="w-full text-xs sm:text-sm text-left whitespace-nowrap">
        <thead className="bg-gray-50 text-gray-500 font-semibold border-b border-gray-100">
          <tr>
            <th className="px-2 sm:px-4 py-3 sm:py-4 text-center w-10 sm:w-12">#</th>
            <th className="px-2 sm:px-4 py-3 sm:py-4">Time</th>
            <th
              className="px-1 sm:px-3 py-3 sm:py-4 text-center font-extrabold text-gray-900"
              title="Pontos"
            >
              PTS
            </th>
            <th className="px-1 sm:px-3 py-3 sm:py-4 text-center" title="Jogos">
              J
            </th>
            <th className="px-1 sm:px-3 py-3 sm:py-4 text-center" title="Vitórias">
              V
            </th>
            <th className="px-1 sm:px-3 py-3 sm:py-4 text-center" title="Empates">
              E
            </th>
            <th
              className="px-1 sm:px-3 py-3 sm:py-4 text-center hidden sm:table-cell"
              title="Derrotas"
            >
              D
            </th>
            <th
              className="px-1 sm:px-3 py-3 sm:py-4 text-center hidden sm:table-cell"
              title="Gols Pró"
            >
              GP
            </th>
            <th
              className="px-1 sm:px-3 py-3 sm:py-4 text-center hidden sm:table-cell"
              title="Gols Contra"
            >
              GC
            </th>
            <th className="px-1 sm:px-3 py-3 sm:py-4 text-center" title="Saldo de Gols">
              SG
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {ranking.map((entry, index) => (
            <tr key={entry.id} className="hover:bg-gray-50/50 transition-colors group">
              <td className="px-2 sm:px-4 py-2.5 sm:py-3 text-center font-bold text-gray-400 group-hover:text-gray-600">
                {index + 1}
              </td>
              <td className="px-2 sm:px-4 py-2.5 sm:py-3">
                <div className="flex items-center gap-2 sm:gap-3">
                  {entry.flagUrl ? (
                    <Image
                      src={entry.flagUrl}
                      alt={entry.name}
                      width={28}
                      height={28}
                      className="w-6 h-6 sm:w-7 sm:h-7 rounded-full object-cover border border-gray-100 shadow-sm"
                    />
                  ) : (
                    <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-gray-50 border border-gray-100 flex items-center justify-center text-[10px] font-bold text-gray-400">
                      {entry.name.charAt(0)}
                    </div>
                  )}
                  <span className="font-bold text-gray-800 text-xs sm:text-sm">{entry.name}</span>
                </div>
              </td>
              <td className="px-1 sm:px-3 py-2.5 sm:py-3 text-center font-black text-blue-600 text-sm sm:text-base">
                {entry.points}
              </td>
              <td className="px-1 sm:px-3 py-2.5 sm:py-3 text-center text-gray-600 font-medium">
                {entry.played}
              </td>
              <td className="px-1 sm:px-3 py-2.5 sm:py-3 text-center text-gray-600 font-medium">
                {entry.wins}
              </td>
              <td className="px-1 sm:px-3 py-2.5 sm:py-3 text-center text-gray-600 font-medium">
                {entry.draws}
              </td>
              <td className="px-1 sm:px-3 py-2.5 sm:py-3 text-center text-gray-600 font-medium hidden sm:table-cell">
                {entry.losses}
              </td>
              <td className="px-1 sm:px-3 py-2.5 sm:py-3 text-center text-gray-400 hidden sm:table-cell">
                {entry.goalsFor}
              </td>
              <td className="px-1 sm:px-3 py-2.5 sm:py-3 text-center text-gray-400 hidden sm:table-cell">
                {entry.goalsAgainst}
              </td>
              <td className="px-1 sm:px-3 py-2.5 sm:py-3 text-center font-bold text-gray-700">
                {entry.goalDifference}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
