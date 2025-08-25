'use client';

import { useState } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { MyMelodyIcon } from '@/components/auth/MyMelodyIcon';

interface AdminNavbarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

export default function AdminNavbar({ sidebarOpen, setSidebarOpen }: AdminNavbarProps) {
  const { data: session } = useSession();
  const pathname = usePathname();
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  // Función para obtener el título de la página actual
  const getPageTitle = () => {
    if (pathname === '/dashboard') return 'Dashboard';
    if (pathname.startsWith('/dashboard/products/create')) return 'Crear Producto';
    if (pathname.startsWith('/dashboard/products')) return 'Gestión de Productos';
    if (pathname.startsWith('/dashboard/users')) return 'Gestión de Usuarios';
    if (pathname.startsWith('/dashboard/analytics')) return 'Analíticas';
    if (pathname.startsWith('/dashboard/settings')) return 'Configuración';
    return 'Dashboard';
  };

  // Función para obtener el breadcrumb
  const getBreadcrumb = () => {
    const segments = pathname.split('/').filter(Boolean);
    if (segments.length <= 1) return null;

    const breadcrumbMap: { [key: string]: string } = {
      'dashboard': 'Dashboard',
      'products': 'Productos',
      'create': 'Crear',
      'users': 'Usuarios',
      'analytics': 'Analíticas',
      'settings': 'Configuración'
    };

    return segments.map((segment, index) => {
      const href = '/' + segments.slice(0, index + 1).join('/');
      const label = breadcrumbMap[segment] || segment;
      const isLast = index === segments.length - 1;

      return (
        <span key={href} className="flex items-center">
          {index > 0 && (
                         <svg className="w-3 h-3 mx-2 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
            </svg>
          )}
          {isLast ? (
                         <span className="text-gray-900 font-medium">{label}</span>
          ) : (
            <Link href={href} className="text-pink-600 hover:text-pink-700 font-medium">
              {label}
            </Link>
          )}
        </span>
      );
    });
  };

  return (
    <header className="bg-white border-b border-pink-100 shadow-sm sticky top-0 z-40">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Left section */}
          <div className="flex items-center space-x-4">
            {/* Mobile menu button */}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
                             className="lg:hidden p-2 text-gray-600 hover:text-pink-600 hover:bg-pink-50 rounded-md transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>

            {/* Logo and title - only show on mobile when sidebar is closed */}
            <div className="lg:hidden flex items-center space-x-3">
              <MyMelodyIcon size="sm" />
                             <span className="font-semibold text-gray-900">Admin</span>
            </div>

            {/* Page title and breadcrumb - desktop */}
            <div className="hidden lg:block">
              {getBreadcrumb() && (
                <nav className="flex items-center text-sm text-gray-900 mb-1">
                  {getBreadcrumb()}
                </nav>
              )}
              <h1 className="text-xl font-semibold text-gray-900">
                {getPageTitle()}
              </h1>
            </div>
          </div>

          {/* Right section */}
          <div className="flex items-center space-x-4">
            {/* Notifications */}
            {/* <button className="p-2 text-gray-900 hover:text-pink-600 hover:bg-pink-50 rounded-md transition-colors relative">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM10.07 2.82l-.9.45a2 2 0 00-1.09 1.79l0 .01c0 .67-.21 1.32-.6 1.86l-.18.24a2 2 0 00-.18 2.08l.05.11a2 2 0 001.8 1.13h.02a2 2 0 001.8-1.13l.05-.11a2 2 0 00-.18-2.08l-.18-.24c-.39-.54-.6-1.19-.6-1.86v-.01a2 2 0 00-1.09-1.79l-.9-.45z"/>
              </svg>
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
            </button> */}

            {/* Quick actions */}
            <Link
              href="/dashboard/products/create"
              className="hidden sm:flex items-center space-x-2 bg-pink-500 hover:bg-pink-600 text-white px-3 py-2 rounded-md text-sm font-medium transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              <span>Producto</span>
            </Link>

            {/* User menu */}
            <div className="relative">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center space-x-3 p-2 rounded-md text-gray-900 hover:bg-pink-50 hover:text-pink-600 transition-colors"
              >
                <div className="w-8 h-8 bg-pink-100 rounded-full flex items-center justify-center">
                  <span className="text-sm font-medium text-pink-600">
                    {session?.user?.name?.charAt(0).toUpperCase() || 'A'}
                  </span>
                </div>
                <div className="hidden md:block text-left">
                  <div className="text-sm font-medium">{session?.user?.name}</div>
                  <div className="text-xs text-gray-900">
                    {(session?.user as any)?.role || 'Admin'}
                  </div>
                </div>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* User dropdown menu */}
              {userMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 py-1 z-50">
                  <Link
                    href="/dashboard"
                    className="block px-4 py-2 text-sm text-gray-900 hover:bg-pink-50 hover:text-pink-600"
                    onClick={() => setUserMenuOpen(false)}
                  >
                    <div className="flex items-center space-x-2">
                      <span>🏠</span>
                      <span>Dashboard</span>
                    </div>
                  </Link>
                  <Link
                    href="/dashboard/settings"
                    className="block px-4 py-2 text-sm text-gray-900 hover:bg-pink-50 hover:text-pink-600"
                    onClick={() => setUserMenuOpen(false)}
                  >
                    <div className="flex items-center space-x-2">
                      <span>⚙️</span>
                      <span>Configuración</span>
                    </div>
                  </Link>
                  <Link
                    href="/"
                    className="block px-4 py-2 text-sm text-gray-900 hover:bg-pink-50 hover:text-pink-600"
                    onClick={() => setUserMenuOpen(false)}
                  >
                    <div className="flex items-center space-x-2">
                      <span>🌐</span>
                      <span>Ver sitio</span>
                    </div>
                  </Link>
                  <div className="border-t border-gray-100 my-1"></div>
                  <button
                    onClick={() => {
                      setUserMenuOpen(false);
                      signOut({ callbackUrl: '/' });
                    }}
                    className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                  >
                    <div className="flex items-center space-x-2">
                      <span>🚪</span>
                      <span>Cerrar sesión</span>
                    </div>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile page title */}
        <div className="lg:hidden pb-4">
          {getBreadcrumb() && (
            <nav className="flex items-center text-sm text-gray-900 mb-1">
              {getBreadcrumb()}
            </nav>
          )}
          <h1 className="text-xl font-semibold text-gray-900">
            {getPageTitle()}
          </h1>
        </div>
      </div>

      {/* Overlay for user menu */}
      {userMenuOpen && (
        <div
          className="fixed inset-0 z-30"
          onClick={() => setUserMenuOpen(false)}
        />
      )}
    </header>
  );
} 