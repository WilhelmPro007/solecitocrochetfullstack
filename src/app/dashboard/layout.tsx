'use client';

import { useSession } from 'next-auth/react';
import AdminSidebar from '@/components/admin/AdminSidebar';
import { useSidebarContext } from '@/contexts/SidebarContext';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session } = useSession();
  const { sidebarOpen, setSidebarOpen, closeSidebar } = useSidebarContext();
  const userRole = (session?.user as any)?.role;
  const isAdmin = userRole === 'ADMIN' || userRole === 'SUPERADMIN';

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-rose-50 to-pink-100">
      {isAdmin ? (
        <>
          {/* Admin Sidebar */}
          <AdminSidebar 
            isOpen={sidebarOpen} 
            onClose={closeSidebar} 
          />

          {/* Main layout with content */}
          <div className="lg:ml-64">
            {/* Main content */}
            <main className="p-4 lg:p-6">
              <div className="max-w-7xl mx-auto">
                {children}
              </div>
            </main>
          </div>

          {/* Mobile sidebar overlay */}
          {sidebarOpen && (
            <div 
              className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
              onClick={closeSidebar}
            />
          )}
        </>
      ) : (
        // Non-admin users get the basic layout
        <div className="pt-4 lg:pt-6 min-h-screen p-4 lg:p-6">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </div>
      )}
    </div>
  );
} 