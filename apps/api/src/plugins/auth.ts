import jwt from "@elysiajs/jwt";
import { Elysia } from "elysia";
import { authService } from "../services/auth-service";

const JWT_SECRET = process.env.JWT_SECRET ?? "evosport-dev-secret";

/**
 * Plugin de autenticação.
 * - Expõe `jwt` para assinar/verificar tokens.
 * - Deriva `currentUser` a partir do cookie httpOnly `auth` (ou null).
 */
export const authPlugin = new Elysia({ name: "auth-plugin" })
  .use(jwt({ name: "jwt", secret: JWT_SECRET, exp: "7d" }))
  .derive({ as: "scoped" }, async ({ jwt, cookie: { auth } }) => {
    const token = auth?.value;
    if (!token) return { currentUser: null };

    const payload = await jwt.verify(token);
    if (!payload || !payload.sub) return { currentUser: null };

    try {
      const user = await authService.getProfile(Number(payload.sub));
      return { currentUser: user };
    } catch {
      return { currentUser: null };
    }
  });

/** Guarda de rota: exige usuário autenticado. */
// biome-ignore lint/suspicious/noExplicitAny: contexto dinâmico do Elysia no beforeHandle
export function requireAuth({ currentUser, status }: any) {
  if (!currentUser) {
    return status(401, { message: "Não autenticado. Faça login para continuar." });
  }
}

/** Guarda de rota: exige usuário com papel admin. */
// biome-ignore lint/suspicious/noExplicitAny: contexto dinâmico do Elysia no beforeHandle
export function requireAdmin({ currentUser, status }: any) {
  if (!currentUser) {
    return status(401, { message: "Não autenticado. Faça login para continuar." });
  }
  if (currentUser.role !== "admin") {
    return status(403, { message: "Acesso restrito a administradores." });
  }
}
