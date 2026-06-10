import { t } from "elysia";

export const RegisterBody = t.Object({
  name: t.String({
    minLength: 2,
    description: "Nome do usuário",
    examples: ["Maria Silva"],
  }),
  email: t.String({
    format: "email",
    description: "Email do usuário",
    examples: ["maria@example.com"],
  }),
  password: t.String({
    minLength: 6,
    description: "Senha (mínimo 6 caracteres)",
  }),
});

export const LoginBody = t.Object({
  email: t.String({ format: "email", description: "Email do usuário" }),
  password: t.String({ description: "Senha do usuário" }),
});

export const UpdateProfileBody = t.Object({
  name: t.String({ minLength: 2, description: "Novo nome do usuário" }),
});

export const UserResponse = t.Object({
  id: t.Number({ description: "ID único do usuário" }),
  name: t.String({ description: "Nome do usuário" }),
  email: t.String({ description: "Email do usuário" }),
  role: t.Union([t.Literal("user"), t.Literal("admin")], {
    description: "Papel do usuário",
  }),
  createdAt: t.Date({ description: "Data de criação da conta" }),
});

export const MessageResponse = t.Object({
  message: t.String({ description: "Mensagem informativa" }),
});
