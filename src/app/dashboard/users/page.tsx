'use client';

import { useUserRole, UserRole } from '@/hooks/useUserRole';

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
          <p className="text-gray-600">Cargando...</p>
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
          <p className="text-gray-600">
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
      color: 'green',
      description: 'Usuario estándar',
      permissions: [
        'Ver catálogo de productos',
        'Agregar productos a favoritos',
        'Contactar por WhatsApp',
        'Ver detalles de productos'
      ]
    },
    {
      name: 'ADMIN',
      icon: '⚡',
      color: 'blue',
      description: 'Administrador',
      permissions: [
        'Todos los permisos de CLIENTE',
        'Crear y editar productos',
        'Ver analíticas y reportes',
        'Gestionar inventario',
        'Acceso al dashboard de administración'
      ]
    },
    {
      name: 'SUPERADMIN',
      icon: '👑',
      color: 'purple',
      description: 'Super Administrador',
      permissions: [
        'Todos los permisos de ADMIN',
        'Gestionar usuarios y roles',
        'Configuración del sistema',
        'Acceso completo a la base de datos',
        'Configurar integraciones'
      ]
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Gestión de Usuarios 👥
        </h1>
        <p className="text-gray-600">
          Información sobre roles y permisos en Solecito Crochet
        </p>
      </div>

      {/* Current User Info */}
      <div className="bg-gradient-to-r from-pink-50 to-rose-50 border border-pink-200 rounded-lg p-6 mb-8">
        <div className="flex items-center space-x-3 mb-4">
          <span className="text-2xl">
            {userRole === UserRole.SUPERADMIN ? '👑' : userRole === UserRole.ADMIN ? '⚡' : '👤'}
          </span>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Tu Rol Actual</h3>
            <p className="text-sm text-gray-600">
              Rol: <span className="font-medium text-pink-600">{userRole}</span>
            </p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className="flex items-center space-x-2">
            <span className={hasAdminAccess ? 'text-green-600' : 'text-gray-400'}>
              {hasAdminAccess ? '✅' : '❌'}
            </span>
            <span>Acceso de Administrador</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className={isSuperAdmin ? 'text-green-600' : 'text-gray-400'}>
              {isSuperAdmin ? '✅' : '❌'}
            </span>
            <span>Acceso de Super Admin</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-green-600">✅</span>
            <span>Autenticado</span>
          </div>
        </div>
      </div>

      {/* Roles Information */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {roles.map((role) => (
          <div 
            key={role.name}
            className={`bg-white rounded-lg border shadow-lg overflow-hidden ${
              userRole === role.name ? 'border-pink-300 ring-2 ring-pink-200' : 'border-gray-200'
            }`}
          >
            {/* Header */}
            <div className={`p-4 ${
              role.color === 'green' ? 'bg-green-50' :
              role.color === 'blue' ? 'bg-blue-50' :
              'bg-purple-50'
            }`}>
              <div className="flex items-center space-x-3">
                <span className="text-2xl">{role.icon}</span>
                <div>
                  <h3 className={`text-lg font-semibold ${
                    role.color === 'green' ? 'text-green-900' :
                    role.color === 'blue' ? 'text-blue-900' :
                    'text-purple-900'
                  }`}>
                    {role.name}
                  </h3>
                  <p className={`text-sm ${
                    role.color === 'green' ? 'text-green-700' :
                    role.color === 'blue' ? 'text-blue-700' :
                    'text-purple-700'
                  }`}>
                    {role.description}
                  </p>
                </div>
              </div>
              {userRole === role.name && (
                <div className="mt-2">
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-pink-100 text-pink-800">
                    Tu rol actual
                  </span>
                </div>
              )}
            </div>

            {/* Permissions */}
            <div className="p-4">
              <h4 className="font-medium text-gray-900 mb-3">Permisos:</h4>
              <ul className="space-y-2">
                {role.permissions.map((permission, index) => (
                  <li key={index} className="flex items-start space-x-2 text-sm">
                    <span className={`mt-1 ${
                      role.color === 'green' ? 'text-green-500' :
                      role.color === 'blue' ? 'text-blue-500' :
                      'text-purple-500'
                    }`}>
                      •
                    </span>
                    <span className="text-gray-700">{permission}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>

      {/* Admin Tools */}
      {isSuperAdmin && (
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-lg p-6">
          <div className="flex items-center space-x-3 mb-4">
            <span className="text-2xl">👑</span>
            <h3 className="text-lg font-semibold text-gray-900">Herramientas de Super Admin</h3>
          </div>
          <p className="text-gray-600 mb-4">
            Como Super Administrador, tienes acceso a herramientas avanzadas de gestión
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <button className="flex items-center space-x-3 p-4 bg-white border border-purple-200 rounded-lg hover:bg-purple-50 transition-colors">
              <span className="text-xl">👥</span>
              <span className="font-medium text-gray-700">Gestionar Roles</span>
            </button>
            <button className="flex items-center space-x-3 p-4 bg-white border border-purple-200 rounded-lg hover:bg-purple-50 transition-colors">
              <span className="text-xl">⚙️</span>
              <span className="font-medium text-gray-700">Configuración Sistema</span>
            </button>
            <button className="flex items-center space-x-3 p-4 bg-white border border-purple-200 rounded-lg hover:bg-purple-50 transition-colors">
              <span className="text-xl">📊</span>
              <span className="font-medium text-gray-700">Analíticas Avanzadas</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
} 