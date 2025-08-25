import 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      role?: 'CLIENTE' | 'ADMIN' | 'SUPERADMIN';
    };
  }

  interface User {
    id: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
    role?: 'CLIENTE' | 'ADMIN' | 'SUPERADMIN';
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    role?: 'CLIENTE' | 'ADMIN' | 'SUPERADMIN';
  }
} 