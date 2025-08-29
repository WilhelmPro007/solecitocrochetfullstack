import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { PrismaUserRepository } from '../../../infrastructure/prisma/PrismaUserRepository';
import { RegisterUser } from '../../../application/usecases/RegisterUser';
import { RegisterUserDTO } from '../../../application/dtos/RegisterUserDTO';

export async function POST(request: Request) {
  try {
    // Verificar sesión y rol del usuario
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'No autorizado. Debe iniciar sesión.' },
        { status: 401 }
      );
    }

    // Verificar que el usuario sea administrador
    if (session.user.role !== 'ADMIN' && session.user.role !== 'SUPERADMIN') {
      return NextResponse.json(
        { error: 'Acceso denegado. Solo los administradores pueden registrar usuarios.' },
        { status: 403 }
      );
    }

    const usecase = new RegisterUser(new PrismaUserRepository());
    const data: RegisterUserDTO = await request.json();
    
    // Validar que se proporcionen los datos requeridos
    if (!data.email || !data.password || !data.name) {
      return NextResponse.json(
        { error: 'Email, contraseña y nombre son requeridos' },
        { status: 400 }
      );
    }

    const user = await usecase.execute(data);
    
    return NextResponse.json(
      { 
        message: 'Usuario registrado exitosamente', 
        user: { 
          id: user.id,
          email: user.email, 
          name: user.name,
          role: user.role 
        } 
      },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}
