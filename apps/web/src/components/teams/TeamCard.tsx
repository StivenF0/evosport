import { Shield } from "lucide-react";
import Image from "next/image";
import type { Team } from "../../types/api-types";

interface TeamCardProps {
  team: Team;
}

export function TeamCard({ team }: TeamCardProps) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-6 flex flex-col items-center text-center hover:shadow-md hover:border-blue-100 transition-all cursor-default group">
      {team.flagUrl ? (
        <div className="w-20 h-20 sm:w-24 sm:h-24 mb-3 sm:mb-4 rounded-full overflow-hidden shadow-sm border-2 border-gray-50 group-hover:border-blue-100 transition-colors">
          <Image
            src={team.flagUrl}
            alt={`Escudo do ${team.name}`}
            width={96}
            height={96}
            className="w-full h-full object-cover"
          />
        </div>
      ) : (
        <div className="w-20 h-20 sm:w-24 sm:h-24 mb-3 sm:mb-4 rounded-full bg-linear-to-tr from-gray-100 to-gray-50 text-gray-400 flex items-center justify-center shadow-inner border border-gray-100 group-hover:text-blue-500 group-hover:from-blue-50 group-hover:to-white transition-colors">
          <Shield className="w-8 h-8 sm:w-10 sm:h-10" />
        </div>
      )}

      <h3 className="text-sm sm:text-lg font-bold text-gray-800 line-clamp-2">{team.name}</h3>
    </div>
  );
}
