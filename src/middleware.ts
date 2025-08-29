import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export default withAuth(
  function middleware(req) {
    const { pathname } = req.nextUrl;
    const token = req.nextauth.token;

    // Proteger la API de registro - solo administradores
    if (pathname === '/api/register') {
      if (!token || (token.role !== 'ADMIN' && token.role !== 'SUPERADMIN')) {
        return NextResponse.json(
          { error: 'Acceso denegado. Solo administradores pueden registrar usuarios.' },
          { status: 403 }
        );
      }
    }

    // Proteger rutas del dashboard - solo usuarios autenticados
    if (pathname.startsWith('/dashboard')) {
      if (!token) {
        return NextResponse.redirect(new URL('/login', req.url));
      }
    }

    // Proteger rutas de admin - solo administradores
    if (pathname.startsWith('/api/admin') || pathname.startsWith('/dashboard/admin')) {
      if (!token || (token.role !== 'ADMIN' && token.role !== 'SUPERADMIN')) {
        return NextResponse.json(
          { error: 'Permisos insuficientes' },
          { status: 403 }
        );
      }
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        // Para rutas que requieren autenticación básica
        if (req.nextUrl.pathname.startsWith('/dashboard') || 
            req.nextUrl.pathname.startsWith('/api/admin') ||
            req.nextUrl.pathname === '/api/register') {
          return !!token;
        }
        return true;
      },
    },
  }
);

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/api/admin/:path*',
    '/api/register',
    '/api/images',
    '/api/categories',
    '/api/products'
  ]
}; 