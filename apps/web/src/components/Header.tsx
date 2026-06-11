"use client";

import Link from "next/link";
import { useState } from "react";
import { UserMenu } from "./auth/UserMenu";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/matches", label: "Jogos" },
  { href: "/venues", label: "Sedes" },
];

export function Header() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="bg-white border-b border-gray-100 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="shrink-0 flex items-center">
              <span className="font-bold text-xl text-blue-600">Evosport</span>
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden sm:flex sm:items-center sm:space-x-6">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-gray-700 hover:text-blue-600 px-2 py-2 rounded-md text-sm font-medium transition-colors"
              >
                {link.label}
              </Link>
            ))}
            <UserMenu />
          </div>

          {/* Mobile: dropdown do usuário + hambúrguer */}
          <div className="flex items-center gap-2 sm:hidden">
            <UserMenu />
            <button
              type="button"
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none"
              aria-expanded={isOpen}
            >
              <span className="sr-only">Abrir menu principal</span>
              <svg
                className={`${isOpen ? "hidden" : "block"} h-6 w-6`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <title>Abrir menu</title>
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
              <svg
                className={`${isOpen ? "block" : "hidden"} h-6 w-6`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <title>Fechar menu</title>
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`${isOpen ? "block" : "hidden"} sm:hidden`}>
        <div className="pt-2 pb-3 space-y-1 bg-white border-t border-gray-100">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setIsOpen(false)}
              className="block px-4 py-2 text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50"
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </header>
  );
}
