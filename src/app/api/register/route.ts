import { NextResponse } from 'next/server';
import { PrismaUserRepository } from '../../../infrastructure/prisma/PrismaUserRepository';
import { RegisterUser } from '../../../application/usecases/RegisterUser';
import { RegisterUserDTO } from '../../../application/dtos/RegisterUserDTO';

export async function POST(request: Request) {
  try {
    const usecase = new RegisterUser(new PrismaUserRepository());
    const data: RegisterUserDTO = await request.json();
    const user = await usecase.execute(data);
    return NextResponse.json(
      { message: 'Usuario registrado exitosamente', user: { email: user.email, role: user.role } },
      { status: 201 }
    );
      } catch (error) {
        if (error instanceof Error) {
        return NextResponse.json({ error: error.message }, { status: 400 });
        }
        return NextResponse.json({ error: "Unknown error" }, { status: 400 });
    }
}
