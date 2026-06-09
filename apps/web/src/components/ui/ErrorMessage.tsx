export function ErrorMessage({
  message = "Não foi possível conectar ao servidor. Tente novamente mais tarde.",
}: {
  message?: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center p-8 min-h-[40vh]">
      <div className="bg-red-50 border border-red-100 rounded-2xl p-6 flex flex-col items-center max-w-md text-center space-y-3">
        <svg
          className="w-12 h-12 text-red-500"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <title>Erro</title>
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
        </svg>
        <h3 className="text-lg font-bold text-red-800">Ops! Algo deu errado.</h3>
        <p className="text-red-600 text-sm">{message}</p>
      </div>
    </div>
  );
}
