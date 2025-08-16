'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import AdminSidebar from '@/components/admin/AdminSidebar';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session } = useSession();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const userRole = (session?.user as any)?.role;
  const isAdmin = userRole === 'ADMIN' || userRole === 'SUPERADMIN';

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-rose-50 to-pink-100">
      {isAdmin && (
        <>
          {/* Mobile menu button */}
          <div className="lg:hidden fixed top-4 left-4 z-60">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 bg-white rounded-md shadow-md border border-pink-200 text-gray-700 hover:text-pink-600"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>

          {/* Admin Sidebar */}
          <AdminSidebar 
            isOpen={sidebarOpen} 
            onClose={() => setSidebarOpen(false)} 
          />
        </>
      )}

      {/* Main content */}
      <div className={isAdmin ? 'lg:ml-64' : ''}>
        {children}
      </div>
    </div>
  );
} 