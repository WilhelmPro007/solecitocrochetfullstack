import { PrismaClient } from "@prisma/client";
import { IUserRepository } from "../../domain/interfaces/IUserRepository";
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
  async create(user: User) {
    const created = await prisma.user.create({
      data: {
        name: user.name,
        email: user.email,
        password: user.password,
        role: user.role,
      },
    });
    return new User(
      created.name ?? "",
      created.email ?? "",
      created.password ?? "",
      created.role ?? "cliente"
    );
  }
}
