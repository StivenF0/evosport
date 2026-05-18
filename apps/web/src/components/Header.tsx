'use client';

import { useState } from 'react';
import Link from 'next/link';

export function Header() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="shrink-0 flex items-center">
              <span className="font-bold text-xl text-blue-600">Evosport</span>
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden sm:ml-6 sm:flex sm:items-center sm:space-x-8">
            <Link href="/" className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium">Home</Link>
            <Link href="/teams" className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium">Times</Link>
            <Link href="/matches" className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium">Jogos</Link>
            <Link href="/venues" className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium">Sedes</Link>
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center sm:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none"
              aria-expanded={isOpen}
            >
              <span className="sr-only">Abrir menu principal</span>
              {/* Ícone de Hambúrguer (Fechado) */}
              <svg className={`${isOpen ? 'hidden' : 'block'} h-6 w-6`} xmlns="[http://www.w3.org/2000/svg](http://www.w3.org/2000/svg)" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
              {/* Ícone de Fechar (Aberto) */}
              <svg className={`${isOpen ? 'block' : 'hidden'} h-6 w-6`} xmlns="[http://www.w3.org/2000/svg](http://www.w3.org/2000/svg)" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`${isOpen ? 'block' : 'hidden'} sm:hidden`}>
        <div className="pt-2 pb-3 space-y-1 bg-white border-t border-gray-200">
          <Link href="/" onClick={() => setIsOpen(false)} className="block px-4 py-2 text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50">Home</Link>
          <Link href="/teams" onClick={() => setIsOpen(false)} className="block px-4 py-2 text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50">Times</Link>
          <Link href="/matches" onClick={() => setIsOpen(false)} className="block px-4 py-2 text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50">Jogos</Link>
          <Link href="/venues" onClick={() => setIsOpen(false)} className="block px-4 py-2 text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50">Sedes</Link>
        </div>
      </div>
    </header>
  );
}
