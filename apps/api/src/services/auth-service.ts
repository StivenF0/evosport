import type { NewUser, User, UserRole } from "@packages/types";
import { userRepository } from "../repositories/user-repository";

type UserRow = {
  id: number;
  name: string;
  email: string;
  passwordHash: string;
  role: UserRole;
  createdAt: Date;
};

// Remove o hash de senha antes de devolver o usuário para fora da aplicação
function toPublicUser(user: UserRow): User {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    createdAt: user.createdAt,
  };
}

export const authService = {
  // Registro de novo usuário
  async register(data: NewUser): Promise<User> {
    const existing = await userRepository.findByEmail(data.email);
    if (existing) {
      throw new Error("Já existe uma conta com este email.");
    }

    const passwordHash = await Bun.password.hash(data.password);
    const created = await userRepository.create({
      name: data.name,
      email: data.email,
      passwordHash,
    });

    return toPublicUser(created);
  },

  // Login: valida credenciais e devolve o usuário público
  async login(email: string, password: string): Promise<User> {
    const user = await userRepository.findByEmail(email);
    if (!user) {
      throw new Error("Email ou senha inválidos.");
    }

    const valid = await Bun.password.verify(password, user.passwordHash);
    if (!valid) {
      throw new Error("Email ou senha inválidos.");
    }

    return toPublicUser(user);
  },

  // Perfil do usuário autenticado
  async getProfile(id: number): Promise<User> {
    const user = await userRepository.findById(id);
    return toPublicUser(user);
  },

  // Atualização do nome do perfil
  async updateName(id: number, name: string): Promise<User> {
    const updated = await userRepository.update(id, { name });
    return toPublicUser(updated);
  },
};
