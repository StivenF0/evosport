import { beforeEach, describe, expect, it, spyOn } from "bun:test";
import { userRepository } from "@api/repositories/user-repository";
import { authService } from "@api/services/auth-service";

const userRow = {
  id: 1,
  name: "Maria",
  email: "maria@test.com",
  passwordHash: "",
  role: "user" as const,
  createdAt: new Date("2026-01-01"),
};

describe("AuthService - Register", () => {
  beforeEach(() => {
    spyOn(userRepository, "findByEmail").mockRestore();
    spyOn(userRepository, "create").mockRestore();
  });

  it("should register a new user and not expose the password hash.", async () => {
    spyOn(userRepository, "findByEmail").mockResolvedValue(null);
    spyOn(userRepository, "create").mockResolvedValue({ ...userRow, passwordHash: "hashed" });

    const user = await authService.register({
      name: "Maria",
      email: "maria@test.com",
      password: "senha123",
    });

    expect(user.id).toBe(1);
    expect(user.email).toBe("maria@test.com");
    expect(user).not.toHaveProperty("passwordHash");
  });

  it("should throw if the email is already registered.", async () => {
    spyOn(userRepository, "findByEmail").mockResolvedValue({ ...userRow, passwordHash: "x" });

    const promise = authService.register({
      name: "Maria",
      email: "maria@test.com",
      password: "senha123",
    });

    expect(promise).rejects.toThrow("Já existe uma conta com este email.");
  });
});

describe("AuthService - Login", () => {
  beforeEach(() => {
    spyOn(userRepository, "findByEmail").mockRestore();
  });

  it("should return the public user when credentials are valid.", async () => {
    const passwordHash = await Bun.password.hash("senha123");
    spyOn(userRepository, "findByEmail").mockResolvedValue({ ...userRow, passwordHash });

    const user = await authService.login("maria@test.com", "senha123");

    expect(user.id).toBe(1);
    expect(user).not.toHaveProperty("passwordHash");
  });

  it("should throw when the user does not exist.", async () => {
    spyOn(userRepository, "findByEmail").mockResolvedValue(null);

    const promise = authService.login("naoexiste@test.com", "senha123");

    expect(promise).rejects.toThrow("Email ou senha inválidos.");
  });

  it("should throw when the password is wrong.", async () => {
    const passwordHash = await Bun.password.hash("senha123");
    spyOn(userRepository, "findByEmail").mockResolvedValue({ ...userRow, passwordHash });

    const promise = authService.login("maria@test.com", "errada");

    expect(promise).rejects.toThrow("Email ou senha inválidos.");
  });
});

describe("AuthService - Update Name", () => {
  beforeEach(() => {
    spyOn(userRepository, "update").mockRestore();
  });

  it("should update the user name.", async () => {
    spyOn(userRepository, "update").mockResolvedValue({
      ...userRow,
      name: "Maria Atualizada",
      passwordHash: "x",
    });

    const user = await authService.updateName(1, "Maria Atualizada");

    expect(user.name).toBe("Maria Atualizada");
    expect(user).not.toHaveProperty("passwordHash");
  });
});
