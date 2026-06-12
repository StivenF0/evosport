import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { authService } from "../services/auth-service";
import type { LoginPayload, RegisterPayload, User } from "../types/api-types";

export const authKeys = {
  me: ["auth", "me"] as const,
};

/**
 * Busca o usuário autenticado. Quando não há sessão (401) ou a API está
 * indisponível, resolve para `null` em vez de entrar em estado de erro —
 * assim o app simplesmente trata o visitante como deslogado.
 */
async function fetchMe(): Promise<User | null> {
  try {
    return await authService.me();
  } catch {
    return null;
  }
}

export function useAuth() {
  const queryClient = useQueryClient();

  const { data: user, isLoading } = useQuery({
    queryKey: authKeys.me,
    queryFn: fetchMe,
    staleTime: 5 * 60 * 1000,
    retry: false,
  });

  const invalidate = () => queryClient.invalidateQueries({ queryKey: authKeys.me });

  const loginMutation = useMutation({
    mutationFn: (data: LoginPayload) => authService.login(data),
    onSuccess: (loggedUser) => {
      queryClient.setQueryData(authKeys.me, loggedUser);
    },
  });

  const registerMutation = useMutation({
    mutationFn: (data: RegisterPayload) => authService.register(data),
  });

  const logoutMutation = useMutation({
    mutationFn: () => authService.logout(),
    onSuccess: () => {
      queryClient.setQueryData(authKeys.me, null);
      invalidate();
    },
  });

  const updateProfileMutation = useMutation({
    mutationFn: (name: string) => authService.updateProfile(name),
    onSuccess: (updated) => {
      queryClient.setQueryData(authKeys.me, updated);
    },
  });

  return {
    user: user ?? null,
    isLoading,
    isAuthenticated: !!user,
    isAdmin: user?.role === "admin",
    login: loginMutation,
    register: registerMutation,
    logout: logoutMutation,
    updateProfile: updateProfileMutation,
  };
}
