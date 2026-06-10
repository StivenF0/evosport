import { beforeEach, describe, expect, it, spyOn } from "bun:test";
import { db } from "@api/db";
import { userRepository } from "@api/repositories/user-repository";

const newUser = { name: "Maria", email: "maria@test.com", passwordHash: "hash" };

describe("UserRepository - Create", () => {
  beforeEach(() => spyOn(db, "insert").mockRestore());

  it("should create a new user", async () => {
    spyOn(db, "insert").mockReturnValue({
      values: () => ({ returning: () => Promise.resolve([{ id: 1, ...newUser }]) }),
      // biome-ignore lint/suspicious/noExplicitAny: mock de Drizzle em teste
    } as any);
    expect((await userRepository.create(newUser))?.id).toBe(1);
  });

  it("should throw an error if creation fails", async () => {
    spyOn(db, "insert").mockReturnValue({
      values: () => ({ returning: () => Promise.resolve([]) }),
      // biome-ignore lint/suspicious/noExplicitAny: mock de Drizzle em teste
    } as any);
    expect(userRepository.create(newUser)).rejects.toThrow("Falha ao criar o usuário.");
  });
});

describe("UserRepository - Find By Email", () => {
  beforeEach(() => spyOn(db, "select").mockRestore());

  it("should return a user by email", async () => {
    spyOn(db, "select").mockReturnValue({
      from: () => ({ where: () => ({ limit: () => Promise.resolve([{ id: 1 }]) }) }),
      // biome-ignore lint/suspicious/noExplicitAny: mock de Drizzle em teste
    } as any);
    expect((await userRepository.findByEmail("maria@test.com"))?.id).toBe(1);
  });

  it("should return null when no user is found", async () => {
    spyOn(db, "select").mockReturnValue({
      from: () => ({ where: () => ({ limit: () => Promise.resolve([]) }) }),
      // biome-ignore lint/suspicious/noExplicitAny: mock de Drizzle em teste
    } as any);
    expect(await userRepository.findByEmail("naoexiste@test.com")).toBeNull();
  });
});

describe("UserRepository - Find By Id", () => {
  beforeEach(() => spyOn(db, "select").mockRestore());

  it("should return a user by ID", async () => {
    spyOn(db, "select").mockReturnValue({
      from: () => ({ where: () => ({ limit: () => Promise.resolve([{ id: 1 }]) }) }),
      // biome-ignore lint/suspicious/noExplicitAny: mock de Drizzle em teste
    } as any);
    expect((await userRepository.findById(1))?.id).toBe(1);
  });

  it("should throw an error if not found", async () => {
    spyOn(db, "select").mockReturnValue({
      from: () => ({ where: () => ({ limit: () => Promise.resolve([]) }) }),
      // biome-ignore lint/suspicious/noExplicitAny: mock de Drizzle em teste
    } as any);
    expect(userRepository.findById(99)).rejects.toThrow("Usuário não encontrado.");
  });
});

describe("UserRepository - Update", () => {
  beforeEach(() => spyOn(db, "update").mockRestore());

  it("should update a user name", async () => {
    spyOn(db, "update").mockReturnValue({
      set: () => ({
        where: () => ({ returning: () => Promise.resolve([{ id: 1, name: "Nova" }]) }),
      }),
      // biome-ignore lint/suspicious/noExplicitAny: mock de Drizzle em teste
    } as any);
    expect((await userRepository.update(1, { name: "Nova" }))?.name).toBe("Nova");
  });

  it("should throw an error if update fails", async () => {
    spyOn(db, "update").mockReturnValue({
      set: () => ({ where: () => ({ returning: () => Promise.resolve([]) }) }),
      // biome-ignore lint/suspicious/noExplicitAny: mock de Drizzle em teste
    } as any);
    expect(userRepository.update(99, { name: "Nova" })).rejects.toThrow(
      "Usuário não encontrado para atualização.",
    );
  });
});
