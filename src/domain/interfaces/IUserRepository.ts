import { User } from "../entities/User";

// Tipo para usuario con id (desde base de datos)
export interface UserWithId {
  id: string;
  name: string | null;
  email: string;
  password: string;
  role: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IUserRepository {
  findByEmail(email: string): Promise<User | null>;
  create(user: User): Promise<UserWithId>;
}
