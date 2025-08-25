'use client';

import { useSession } from 'next-auth/react';
import { usePathname } from 'next/navigation';
import { useUserRole } from '@/hooks/useUserRole';
import { useSidebarContext } from '@/contexts/SidebarContext';
import MyMelodyNavbar from './MyMelodyNavbar';
import AdminNavbar from '../admin/AdminNavbar';

export default function DynamicNavbar() {
  const { data: session, status } = useSession();
  const { userRole, isLoading } = useUserRole();
  const { sidebarOpen, setSidebarOpen } = useSidebarContext();
  const pathname = usePathname();
  
  // Verificar si estamos en una página del dashboard
  const isDashboardPage = pathname?.startsWith('/dashboard');

  // Mostrar loading mientras se determina el rol
  if (isLoading || status === 'loading') {
    return (
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <div className="w-32 h-8 bg-gray-200 rounded animate-pulse"></div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="w-20 h-8 bg-gray-200 rounded animate-pulse"></div>
              <div className="w-20 h-8 bg-gray-200 rounded animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Si el usuario no está autenticado o es CLIENTE, mostrar MyMelodyNavbar
  if (!session || userRole === 'CLIENTE' || !userRole) {
    return <MyMelodyNavbar />;
  }

  // Si el usuario es ADMIN o SUPERADMIN y está en una página del dashboard, mostrar AdminNavbar
  if ((userRole === 'ADMIN' || userRole === 'SUPERADMIN') && isDashboardPage) {
    return <AdminNavbar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />;
  }

  // Por defecto, mostrar MyMelodyNavbar
  return <MyMelodyNavbar />;
} 