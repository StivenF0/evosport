export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-gray-200 mt-auto">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="text-gray-500 text-sm">
            &copy; {currentYear} <span className="font-semibold text-blue-600">Evosport</span>.
            Todos os direitos reservados.
          </div>
        </div>
      </div>
    </footer>
  );
}
