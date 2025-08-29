import { PrismaClient, UserRole } from "@prisma/client";
import { IUserRepository, UserWithId } from "../../domain/interfaces/IUserRepository";
import { User } from "../../domain/entities/User";

const prisma = new PrismaClient();

export class PrismaUserRepository implements IUserRepository {
  async findByEmail(email: string) {
    const user = await prisma.user.findUnique({ where: { email } });
    return user
      ? new User(
          user.name ?? "",
          user.email ?? "",
          user.password ?? "",
          user.role ?? "cliente"
        )
      : null;
  }
  
  async create(user: User): Promise<UserWithId> {
    const created = await prisma.user.create({
      data: {
        name: user.name,
        email: user.email,
        password: user.password,
        role: user.role as UserRole,
      },
    });
    
    // Devolver el usuario completo con id desde la base de datos
    return {
      id: created.id,
      name: created.name,
      email: created.email,
      password: created.password,
      role: created.role,
      createdAt: created.createdAt,
      updatedAt: created.updatedAt
    };
  }
}
