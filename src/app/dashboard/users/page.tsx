'use client';

import { useUserRole, UserRole } from '@/hooks/useUserRole';
import UserRegistrationForm from '@/components/admin/UserRegistrationForm';

export default function UsersManagementPage() {
  const { isLoading, hasAdminAccess, userRole, isSuperAdmin } = useUserRole();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-rose-50 to-pink-100 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-pink-200 rounded-full mb-4">
            <svg className="animate-spin h-8 w-8 text-pink-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
          <p className="text-gray-900">Cargando...</p>
        </div>
      </div>
    );
  }

  if (!hasAdminAccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-rose-50 to-pink-100 flex items-center justify-center p-4">
        <div className="w-full max-w-md text-center">
          <span className="text-6xl mb-4 block">🔒</span>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Acceso Denegado
          </h3>
          <p className="text-gray-900">
            Solo los administradores pueden acceder a esta página
          </p>
        </div>
      </div>
    );
  }

  const roles = [
    {
      name: 'CLIENTE',
      icon: '👤',
      description: 'Usuarios estándar que pueden ver productos y hacer pedidos',
      permissions: ['Ver productos', 'Hacer pedidos', 'Gestionar perfil'],
      color: 'bg-blue-100 text-blue-800'
    },
    {
      name: 'ADMIN',
      icon: '👨‍💼',
      description: 'Administradores con acceso completo al dashboard',
      permissions: ['CRUD de productos', 'Gestión de categorías', 'Métricas y estadísticas', 'Gestión de usuarios'],
      color: 'bg-green-100 text-green-800'
    },
    {
      name: 'SUPERADMIN',
      icon: '👑',
      description: 'Super administradores con acceso total al sistema',
      permissions: ['Todo lo de ADMIN', 'Configuración del sistema', 'Gestión de roles', 'Backups y mantenimiento'],
      color: 'bg-purple-100 text-purple-800'
    }
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Gestión de Usuarios
        </h1>
        <p className="text-gray-600">
          Administra roles y permisos de los usuarios del sistema
        </p>
      </div>

      {/* Formulario de Registro */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Registrar Nuevo Usuario
        </h2>
        <UserRegistrationForm />
      </div>

      {/* Información de Roles */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">
          Roles y Permisos del Sistema
        </h2>
        
        <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-3">
          {roles.map((role) => (
            <div key={role.name} className="border border-gray-200 rounded-lg p-6">
              <div className="flex items-center mb-4">
                <span className="text-3xl mr-3">{role.icon}</span>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {role.name}
                  </h3>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${role.color}`}>
                    {role.name}
                  </span>
                </div>
              </div>
              
              <p className="text-gray-600 mb-4">
                {role.description}
              </p>
              
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-2">
                  Permisos:
                </h4>
                <ul className="space-y-1">
                  {role.permissions.map((permission, index) => (
                    <li key={index} className="flex items-center text-sm text-gray-600">
                      <span className="text-green-500 mr-2">✓</span>
                      {permission}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Estadísticas de Usuarios */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Estadísticas de Usuarios
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <span className="text-2xl">👤</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-blue-600">Total Clientes</p>
                <p className="text-2xl font-bold text-blue-900">--</p>
              </div>
            </div>
          </div>
          
          <div className="bg-green-50 p-4 rounded-lg">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <span className="text-2xl">👨‍💼</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-green-600">Administradores</p>
                <p className="text-2xl font-bold text-green-900">--</p>
              </div>
            </div>
          </div>
          
          <div className="bg-purple-50 p-4 rounded-lg">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <span className="text-2xl">👑</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-purple-600">Super Admins</p>
                <p className="text-2xl font-bold text-purple-900">--</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Notas de Seguridad */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <span className="text-2xl">⚠️</span>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-yellow-800">
              Notas de Seguridad
            </h3>
            <div className="mt-2 text-sm text-yellow-700">
              <ul className="list-disc pl-5 space-y-1">
                <li>Solo los administradores pueden registrar nuevos usuarios</li>
                <li>Los roles ADMIN y SUPERADMIN tienen acceso completo al sistema</li>
                <li>Se recomienda cambiar contraseñas regularmente</li>
                <li>Monitorea los accesos y actividades sospechosas</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 