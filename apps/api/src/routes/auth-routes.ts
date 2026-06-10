import { Elysia } from "elysia";
import { authPlugin, requireAuth } from "../plugins/auth";
import {
  LoginBody,
  MessageResponse,
  RegisterBody,
  UpdateProfileBody,
  UserResponse,
} from "../schemas/auth-schemas";
import { ErrorResponse } from "../schemas/shared-schemas";
import { authService } from "../services/auth-service";

const COOKIE_MAX_AGE = 60 * 60 * 24 * 7; // 7 dias

export const authRoutes = new Elysia({ prefix: "/auth" })
  .use(authPlugin)
  // REGISTER
  .post(
    "/register",
    async ({ body }) => {
      return await authService.register(body);
    },
    {
      body: RegisterBody,
      response: { 200: UserResponse, 500: ErrorResponse },
      detail: { summary: "Registrar novo usuário", tags: ["Auth"] },
    },
  )
  // LOGIN
  .post(
    "/login",
    async ({ body, jwt, cookie: { auth } }) => {
      const user = await authService.login(body.email, body.password);
      const token = await jwt.sign({ sub: String(user.id), role: user.role });

      auth.set({
        value: token,
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: COOKIE_MAX_AGE,
      });

      return user;
    },
    {
      body: LoginBody,
      response: { 200: UserResponse, 500: ErrorResponse },
      detail: { summary: "Autenticar usuário e emitir cookie de sessão", tags: ["Auth"] },
    },
  )
  // LOGOUT
  .post(
    "/logout",
    ({ cookie: { auth } }) => {
      auth.remove();
      return { message: "Sessão encerrada com sucesso." };
    },
    {
      response: { 200: MessageResponse },
      detail: { summary: "Encerrar sessão", tags: ["Auth"] },
    },
  )
  // ME (perfil do usuário autenticado)
  .get("/me", ({ currentUser }) => currentUser, {
    beforeHandle: requireAuth,
    response: { 200: UserResponse, 401: ErrorResponse },
    detail: { summary: "Retornar o usuário autenticado", tags: ["Auth"] },
  })
  // UPDATE PROFILE (nome)
  .put(
    "/me",
    async ({ body, currentUser }) => {
      return await authService.updateName(currentUser.id, body.name);
    },
    {
      beforeHandle: requireAuth,
      body: UpdateProfileBody,
      response: { 200: UserResponse, 401: ErrorResponse, 500: ErrorResponse },
      detail: { summary: "Atualizar o nome do perfil", tags: ["Auth"] },
    },
  );
