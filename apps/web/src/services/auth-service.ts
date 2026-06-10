import { apiClient } from "../lib/api-client";
import type { LoginPayload, MessageResponse, RegisterPayload, User } from "../types/api-types";

export const authService = {
  /** Cria uma nova conta e já retorna o usuário público. */
  register: (data: RegisterPayload) => apiClient.post<User>("/auth/register", data),

  /** Autentica o usuário; o backend grava o cookie httpOnly de sessão. */
  login: (data: LoginPayload) => apiClient.post<User>("/auth/login", data),

  /** Encerra a sessão atual (remove o cookie). */
  logout: () => apiClient.post<MessageResponse>("/auth/logout", {}),

  /** Retorna o usuário autenticado a partir do cookie de sessão. */
  me: () => apiClient.get<User>("/auth/me"),

  /** Atualiza o nome do perfil do usuário logado. */
  updateProfile: (name: string) => apiClient.put<User>("/auth/me", { name }),
};
