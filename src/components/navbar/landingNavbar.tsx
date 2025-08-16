'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSession, signOut } from 'next-auth/react';

export default function LandingNavbar() {
  const { data: session, status } = useSession();
  const isLoading = status === 'loading';

  return (
    <>
      {/* Header */}
      <header className="border-b border-gray-200 dark:border-gray-300 px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Image
            src="/logo.png"
            alt="Crochet Store Logo"
            width={32}
            height={32}
          />
          <span className="font-semibold text-lg">Manos de Lana</span>
        </div>
        <nav className="space-x-6 text-sm font-medium hidden md:flex">
          <Link href="/" className="hover:text-gray-900">Inicio</Link>
          <Link href="/products" className="hover:text-gray-900">Catálogo</Link>
          <Link href="#testimonios" className="hover:text-gray-900">Testimonios</Link>
          <Link href="#contacto" className="hover:text-gray-900">Contacto</Link>
        </nav>
        <div className="flex items-center gap-4">
          {!session && !isLoading && (
            <Link
              href="/login"
              className="text-sm font-medium hover:underline hidden md:inline"
            >
              Iniciar sesión
            </Link>
          )}
          {session && (
            <div className="flex items-center gap-4">
              <Link
                href="/dashboard"
                className="text-sm font-medium hover:underline hidden md:inline"
              >
                Mi cuenta
              </Link>
              <button
                onClick={() => signOut({ callbackUrl: '/' })}
                className="text-sm font-medium hover:underline hidden md:inline"
              >
                Cerrar sesión
              </button>
            </div>
          )}
          <button className="rounded-md bg-pink-600 text-white text-sm font-medium px-4 py-2 hover:bg-pink-700 transition-colors">
            Carrito
          </button>
        </div>
      </header>
    </>
  );
}