'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { MyMelodyIcon } from '@/components/auth/MyMelodyIcon';

// Enum de roles para TypeScript
export enum UserRole {
  CLIENTE = 'CLIENTE',
  ADMIN = 'ADMIN',
  SUPERADMIN = 'SUPERADMIN'
}

interface NavigationItem {
  name: string;
  href: string;
  icon: string;
  description?: string;
  children?: NavigationItem[];
}

const adminNavigation: NavigationItem[] = [
  {
    name: 'Dashboard',
    href: '/dashboard',
    icon: '🏠',
    description: 'Vista general'
  },
  {
    name: 'Productos',
    href: '/dashboard/products',
    icon: '🛍️',
    description: 'Gestión de productos',
    children: [
      {
        name: 'Ver Todos',
        href: '/dashboard/products',
        icon: '📋'
      },
      {
        name: 'Crear Producto',
        href: '/dashboard/products/create',
        icon: '➕'
      },
      {
        name: 'Categorías',
        href: '/dashboard/categories',
        icon: '🏷️'
      }
    ]
  },
  {
    name: 'Analíticas',
    href: '/dashboard/analytics',
    icon: '📊',
    description: 'Reportes y estadísticas',
    children: [
      {
        name: 'Productos Populares',
        href: '/dashboard/analytics/popular',
        icon: '⭐'
      },
      {
        name: 'Clicks por Producto',
        href: '/dashboard/analytics/clicks',
        icon: '👆'
      },
      {
        name: 'Reportes Mensuales',
        href: '/dashboard/analytics/reports',
        icon: '📈'
      }
    ]
  },
  {
    name: 'Usuarios',
    href: '/dashboard/users',
    icon: '👥',
    description: 'Gestión de usuarios'
  },
  {
    name: 'Configuración',
    href: '/dashboard/settings',
    icon: '⚙️',
    description: 'Configuración de la tienda',
    children: [
      {
        name: 'General',
        href: '/dashboard/settings/general',
        icon: '🔧'
      },
      {
        name: 'WhatsApp',
        href: '/dashboard/settings/whatsapp',
        icon: '📱'
      },
      {
        name: 'SEO',
        href: '/dashboard/settings/seo',
        icon: '🔍'
      }
    ]
  }
];

interface AdminSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AdminSidebar({ isOpen, onClose }: AdminSidebarProps) {
  const pathname = usePathname();
  const [expandedItems, setExpandedItems] = useState<string[]>([]);

  const toggleExpanded = (itemName: string) => {
    setExpandedItems(prev => 
      prev.includes(itemName) 
        ? prev.filter(name => name !== itemName)
        : [...prev, itemName]
    );
  };

  const isActiveLink = (href: string) => {
    if (href === '/dashboard') {
      return pathname === '/dashboard';
    }
    return pathname.startsWith(href);
  };

  const isParentActive = (item: NavigationItem) => {
    if (isActiveLink(item.href)) return true;
    return item.children?.some(child => isActiveLink(child.href)) || false;
  };

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-35 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed top-0 left-0 h-full w-64 bg-white border-r border-pink-100 shadow-lg z-40 transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0
      `}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-pink-100">
          <div className="flex items-center space-x-3">
            <MyMelodyIcon size="sm" />
            <span className="font-semibold text-gray-900">Admin Panel</span>
          </div>
          <button 
            onClick={onClose}
            className="lg:hidden p-1 text-gray-900 hover:text-gray-900"
          >
            ✕
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-4">
          <div className="space-y-2">
            {adminNavigation.map((item) => (
              <div key={item.name}>
                {/* Main item */}
                <div className="flex items-center">
                  <Link
                    href={item.href}
                    className={`flex-1 flex items-center space-x-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      isParentActive(item)
                        ? 'bg-pink-50 text-pink-700 border border-pink-200'
                        : 'text-gray-900 hover:bg-pink-50 hover:text-pink-600'
                    }`}
                    onClick={() => {
                      if (window.innerWidth < 1024) {
                        onClose();
                      }
                    }}
                  >
                    <span className="text-lg">{item.icon}</span>
                    <div className="flex-1">
                      <div className="font-medium">{item.name}</div>
                      {item.description && (
                        <div className="text-xs text-gray-900">{item.description}</div>
                      )}
                    </div>
                  </Link>
                  
                  {/* Expand button for items with children */}
                  {item.children && (
                    <button
                      onClick={() => toggleExpanded(item.name)}
                      className="p-2 text-gray-900 hover:text-gray-900"
                    >
                      <span className={`transform transition-transform duration-200 ${
                        expandedItems.includes(item.name) ? 'rotate-90' : ''
                      }`}>
                        ▶
                      </span>
                    </button>
                  )}
                </div>

                {/* Children items */}
                {item.children && expandedItems.includes(item.name) && (
                  <div className="ml-6 mt-2 space-y-1">
                    {item.children.map((child) => (
                      <Link
                        key={child.name}
                        href={child.href}
                        className={`flex items-center space-x-3 px-3 py-2 rounded-md text-sm transition-colors ${
                          isActiveLink(child.href)
                            ? 'bg-pink-100 text-pink-700'
                            : 'text-gray-900 hover:bg-pink-50 hover:text-pink-600'
                        }`}
                        onClick={() => {
                          if (window.innerWidth < 1024) {
                            onClose();
                          }
                        }}
                      >
                        <span>{child.icon}</span>
                        <span>{child.name}</span>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-pink-100">
          <div className="text-xs text-gray-900 text-center">
            <div>Solecito Crochet</div>
            <div>Panel de Administración</div>
          </div>
        </div>
      </div>
    </>
  );
} 