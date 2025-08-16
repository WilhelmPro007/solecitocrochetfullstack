'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { usePathname } from 'next/navigation';
import { MyMelodyIcon } from '@/components/auth/MyMelodyIcon';

export default function MyMelodyNavbar() {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const isLoading = status === 'loading';
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Don't show navbar on auth pages (they have their own design)
  if (pathname === '/login' || pathname === '/register') {
    return null;
  }

  const navigation = [
    { name: 'Inicio', href: '/', icon: '🏠' },
    { name: 'Catálogo', href: '/products', icon: '🛍️' },
    { name: 'Favoritos', href: '/favorites', icon: '💖' },
  ];

  const isActiveLink = (href: string) => {
    if (href === '/') {
      return pathname === '/';
    }
    return pathname.startsWith(href);
  };

  return (
    <header className="bg-white border-b border-pink-100 shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 hover:opacity-80 transition-opacity">
            <MyMelodyIcon size="sm" />
            <span className="font-semibold text-lg text-gray-900">Solecito Crochet</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActiveLink(item.href)
                    ? 'bg-pink-50 text-pink-600 border border-pink-200'
                    : 'text-gray-700 hover:text-pink-600 hover:bg-pink-50'
                }`}
              >
                <span>{item.icon}</span>
                <span>{item.name}</span>
              </Link>
            ))}
          </nav>

          {/* Right side actions */}
          <div className="flex items-center space-x-4">
            {/* Cart button (always visible) */}
            <Link
              href="/cart"
              className="relative p-2 text-gray-700 hover:text-pink-600 hover:bg-pink-50 rounded-md transition-colors"
              title="Carrito"
            >
              <span className="text-xl">🛒</span>
              {/* Cart count badge - you can make this dynamic */}
              <span className="absolute -top-1 -right-1 bg-pink-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                0
              </span>
            </Link>

            {/* Authentication */}
            {!session && !isLoading && (
              <div className="hidden md:flex items-center space-x-3">
                <Link
                  href="/login"
                  className="text-sm font-medium text-gray-700 hover:text-pink-600 transition-colors"
                >
                  Iniciar Sesión
                </Link>
                <Link
                  href="/register"
                  className="bg-pink-400 hover:bg-pink-500 text-white text-sm font-medium px-4 py-2 rounded-md transition-colors"
                >
                  Registrarse
                </Link>
              </div>
            )}

            {session && (
              <div className="hidden md:flex items-center space-x-3">
                <Link
                  href="/dashboard"
                  className="flex items-center space-x-2 text-sm font-medium text-gray-700 hover:text-pink-600 transition-colors"
                >
                  <span>👤</span>
                  <span>Mi Cuenta</span>
                </Link>
                <button
                  onClick={() => signOut({ callbackUrl: '/' })}
                  className="text-sm font-medium text-gray-700 hover:text-pink-600 transition-colors"
                >
                  Salir
                </button>
              </div>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 text-gray-700 hover:text-pink-600 hover:bg-pink-50 rounded-md transition-colors"
              aria-label="Abrir menú"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isMobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-pink-100 py-4">
            <div className="flex flex-col space-y-3">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center space-x-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActiveLink(item.href)
                      ? 'bg-pink-50 text-pink-600 border border-pink-200'
                      : 'text-gray-700 hover:text-pink-600 hover:bg-pink-50'
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <span>{item.icon}</span>
                  <span>{item.name}</span>
                </Link>
              ))}

              <div className="border-t border-pink-100 pt-3 mt-3">
                {!session && !isLoading && (
                  <div className="flex flex-col space-y-3">
                    <Link
                      href="/login"
                      className="flex items-center space-x-3 px-3 py-2 text-sm font-medium text-gray-700 hover:text-pink-600 hover:bg-pink-50 rounded-md transition-colors"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <span>🔐</span>
                      <span>Iniciar Sesión</span>
                    </Link>
                    <Link
                      href="/register"
                      className="flex items-center space-x-3 px-3 py-2 bg-pink-400 hover:bg-pink-500 text-white text-sm font-medium rounded-md transition-colors"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <span>📝</span>
                      <span>Registrarse</span>
                    </Link>
                  </div>
                )}

                {session && (
                  <div className="flex flex-col space-y-3">
                    <Link
                      href="/dashboard"
                      className="flex items-center space-x-3 px-3 py-2 text-sm font-medium text-gray-700 hover:text-pink-600 hover:bg-pink-50 rounded-md transition-colors"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <span>👤</span>
                      <span>Mi Cuenta</span>
                    </Link>
                    <button
                      onClick={() => {
                        signOut({ callbackUrl: '/' });
                        setIsMobileMenuOpen(false);
                      }}
                      className="flex items-center space-x-3 px-3 py-2 text-sm font-medium text-gray-700 hover:text-pink-600 hover:bg-pink-50 rounded-md transition-colors text-left"
                    >
                      <span>🚪</span>
                      <span>Salir</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
} 