import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 animate-in fade-in duration-500">
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-12 md:p-16 flex flex-col items-center text-center max-w-lg">
        <div className="bg-gray-50 p-4 rounded-full mb-6">
          <svg
            className="w-12 h-12 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <title>Página não encontrada</title>
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>

        <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight mb-4">
          Página não encontrada
        </h1>

        <p className="text-gray-500 text-lg mb-8">
          A página que você está procurando não existe ou foi removida.
        </p>

        <Link
          href="/"
          className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-full font-semibold hover:bg-blue-700 transition-colors shadow-sm"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <title>Voltar</title>
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          Voltar para Home
        </Link>
      </div>
    </div>
  );
}
