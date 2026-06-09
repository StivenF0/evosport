import { Inbox } from "lucide-react";
import type { ReactNode } from "react";

interface EmptyStateProps {
  title: string;
  message: string;
  icon?: ReactNode;
}

export function EmptyState({ title, message, icon }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center bg-white border-2 border-gray-100 border-dashed rounded-3xl min-h-[40vh] animate-in fade-in duration-500">
      <div className="mb-4 text-gray-400">{icon || <Inbox className="w-16 h-16 opacity-50" />}</div>
      <h3 className="text-xl font-bold text-gray-800">{title}</h3>
      <p className="mt-2 max-w-md text-gray-500">{message}</p>
    </div>
  );
}
