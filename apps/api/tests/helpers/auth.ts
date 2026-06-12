import { spyOn } from "bun:test";
import { authRoutes } from "@api/routes/auth-routes";
import { authService } from "@api/services/auth-service";
import { Elysia } from "elysia";

/** Usuário admin fictício usado nos testes de rotas protegidas. */
export const adminUser = {
  id: 1,
  name: "Admin",
  email: "admin@test.com",
  role: "admin" as const,
  createdAt: new Date("2026-01-01"),
};

/**
 * Faz login (com `authService.login` mockado) e devolve o cookie `auth`
 * com um JWT realmente assinado, válido para qualquer rota que use o authPlugin.
 */
export async function getAdminCookie(): Promise<string> {
  const loginSpy = spyOn(authService, "login").mockResolvedValue(adminUser);
  const app = new Elysia().use(authRoutes);
  const res = await app.handle(
    new Request("http://localhost/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: adminUser.email, password: "qualquer" }),
    }),
  );
  const cookie = res.headers.get("set-cookie") ?? "";
  loginSpy.mockRestore();
  return cookie;
}
