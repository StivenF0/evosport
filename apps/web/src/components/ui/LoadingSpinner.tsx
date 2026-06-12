export function LoadingSpinner({ message = "Carregando..." }: { message?: string }) {
  return (
    <div className="flex flex-col items-center justify-center p-8 min-h-[40vh] space-y-4">
      <div className="w-12 h-12 border-4 border-brand-100 border-t-brand-600 rounded-full animate-spin"></div>
      <p className="text-gray-500 font-medium animate-pulse">{message}</p>
    </div>
  );
}
