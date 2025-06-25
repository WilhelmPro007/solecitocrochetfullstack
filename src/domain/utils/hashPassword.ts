import bcrypt from "bcryptjs";

export const hashPassword = (password: string) => bcrypt.hash(password, 10);
