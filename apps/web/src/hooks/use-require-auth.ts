import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuth } from "./use-auth";

interface RequireAuthOptions {
  /** Quando true, exige que o usuário seja administrador. */
  admin?: boolean;
  /** Rota de redirecionamento quando o acesso é negado. */
  redirectTo?: string;
}

/**
 * Protege páginas restritas: redireciona visitantes não autenticados
 * (ou não-admins, quando `admin` é true) para a página de login.
 */
export function useRequireAuth({ admin = false, redirectTo = "/login" }: RequireAuthOptions = {}) {
  const router = useRouter();
  const { user, isLoading, isAuthenticated, isAdmin } = useAuth();

  useEffect(() => {
    if (isLoading) return;
    if (!isAuthenticated) {
      router.replace(redirectTo);
      return;
    }
    if (admin && !isAdmin) {
      router.replace("/");
    }
  }, [isLoading, isAuthenticated, isAdmin, admin, redirectTo, router]);

  const allowed = isAuthenticated && (!admin || isAdmin);
  return { user, isLoading, allowed };
}
