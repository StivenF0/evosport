import { afterEach, describe, expect, it, mock, spyOn } from "bun:test";
import { authRoutes } from "@api/routes/auth-routes";
import { authService } from "@api/services/auth-service";
import { Elysia } from "elysia";

const app = new Elysia().use(authRoutes);
const req = (p: string, o?: RequestInit) => app.handle(new Request(`http://localhost/auth${p}`, o));

const publicUser = {
  id: 1,
  name: "Maria",
  email: "maria@test.com",
  role: "user" as const,
  createdAt: new Date("2026-01-01"),
};

const json = (body: unknown): RequestInit => ({
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(body),
});

describe("AuthRoutes", () => {
  afterEach(() => mock.restore());

  it("POST /register", async () => {
    spyOn(authService, "register").mockResolvedValue(publicUser);
    const res = await req(
      "/register",
      json({ name: "Maria", email: "maria@test.com", password: "senha123" }),
    );
    expect(res.status).toBe(200);
  });

  it("POST /login sets the auth cookie", async () => {
    spyOn(authService, "login").mockResolvedValue(publicUser);
    const res = await req("/login", json({ email: "maria@test.com", password: "senha123" }));
    expect(res.status).toBe(200);
    expect(res.headers.get("set-cookie")).toContain("auth=");
  });

  it("GET /me returns 401 without authentication", async () => {
    const res = await req("/me");
    expect(res.status).toBe(401);
  });

  it("GET /me returns the user when authenticated", async () => {
    spyOn(authService, "login").mockResolvedValue(publicUser);
    spyOn(authService, "getProfile").mockResolvedValue(publicUser);

    const loginRes = await req("/login", json({ email: "maria@test.com", password: "senha123" }));
    const cookie = loginRes.headers.get("set-cookie") ?? "";

    const res = await req("/me", { headers: { cookie } });
    expect(res.status).toBe(200);
  });

  it("POST /logout", async () => {
    expect((await req("/logout", { method: "POST" })).status).toBe(200);
  });
});
