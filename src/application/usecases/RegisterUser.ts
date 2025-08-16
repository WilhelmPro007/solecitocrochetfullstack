import { IUserRepository } from "../../domain/interfaces/IUserRepository";
import { User } from "../../domain/entities/User";
import { hashPassword } from "../../domain/utils/hashPassword";
import { RegisterUserDTO } from "../dtos/RegisterUserDTO";

export class RegisterUser {
  constructor(private userRepo: IUserRepository) {}



async execute({ name, email, password, confirmPassword, role }: RegisterUserDTO){
    if (!email || !password || !role) throw new Error("Email, password y role son requeridos.");
    if (password !== confirmPassword) throw new Error("Las contraseñas no coinciden.");
    if (role !== "CLIENTE") throw new Error("El rol solo puede ser cliente.");
    const existing = await this.userRepo.findByEmail(email);
    if (existing) throw new Error("El usuario ya existe.");
    const hashed = await hashPassword(password);
    const user = new User(name, email, hashed, role);
    return this.userRepo.create(user);
  }
}
