import { useSession } from 'next-auth/react';

export enum UserRole {
  CLIENTE = 'CLIENTE',
  ADMIN = 'ADMIN',
  SUPERADMIN = 'SUPERADMIN'
}

export function useUserRole() {
  const { data: session, status } = useSession();
  const userRole = (session?.user as any)?.role as UserRole;

  const isLoading = status === 'loading';
  const isAuthenticated = !!session?.user;
  
  const isCliente = userRole === UserRole.CLIENTE;
  const isAdmin = userRole === UserRole.ADMIN;
  const isSuperAdmin = userRole === UserRole.SUPERADMIN;
  
  // Helpers para verificar permisos
  const hasAdminAccess = isAdmin || isSuperAdmin;
  const hasSuperAdminAccess = isSuperAdmin;
  
  // Función para verificar si tiene un rol específico
  const hasRole = (role: UserRole): boolean => {
    return userRole === role;
  };

  // Función para verificar si tiene al menos cierto nivel de permisos
  const hasMinimumRole = (minimumRole: UserRole): boolean => {
    const roleHierarchy = {
      [UserRole.CLIENTE]: 1,
      [UserRole.ADMIN]: 2,
      [UserRole.SUPERADMIN]: 3
    };

    const userLevel = roleHierarchy[userRole] || 0;
    const requiredLevel = roleHierarchy[minimumRole] || 0;
    
    return userLevel >= requiredLevel;
  };

  return {
    // Estado básico
    session,
    userRole,
    isLoading,
    isAuthenticated,
    
    // Verificaciones específicas de rol
    isCliente,
    isAdmin,
    isSuperAdmin,
    
    // Verificaciones de permisos
    hasAdminAccess,
    hasSuperAdminAccess,
    
    // Funciones de utilidad
    hasRole,
    hasMinimumRole,
    
    // Información del usuario
    user: session?.user
  };
} 