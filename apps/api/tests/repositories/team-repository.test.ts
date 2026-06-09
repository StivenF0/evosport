import { beforeEach, describe, expect, it, spyOn } from "bun:test";
import { db } from "@api/db";
import { teamRepository } from "@api/repositories/team-repository";

describe("TeamRepository - Create", () => {
  beforeEach(() => spyOn(db, "insert").mockRestore());

  it("should create a new team", async () => {
    spyOn(db, "insert").mockReturnValue({
      values: () => ({ returning: () => Promise.resolve([{ id: 1, name: "Brasil" }]) }),
      // biome-ignore lint/suspicious/noExplicitAny: mock de Drizzle em teste
    } as any);
    expect((await teamRepository.create({ name: "Brasil" }))?.id).toBe(1);
  });

  it("should throw an error if creation fails", async () => {
    spyOn(db, "insert").mockReturnValue({
      values: () => ({ returning: () => Promise.resolve([]) }),
      // biome-ignore lint/suspicious/noExplicitAny: mock de Drizzle em teste
    } as any);
    expect(teamRepository.create({ name: "Brasil" })).rejects.toThrow("Falha ao criar o time.");
  });
});

describe("TeamRepository - Find All", () => {
  beforeEach(() => spyOn(db, "select").mockRestore());

  it("should return all teams", async () => {
    spyOn(db, "select").mockReturnValue({
      from: () => Promise.resolve([{ id: 1, name: "Brasil" }]),
      // biome-ignore lint/suspicious/noExplicitAny: mock de Drizzle em teste
    } as any);
    expect(await teamRepository.findAll()).toBeArrayOfSize(1);
  });
});

describe("TeamRepository - Find By Id", () => {
  beforeEach(() => spyOn(db, "select").mockRestore());

  it("should return a team by ID", async () => {
    spyOn(db, "select").mockReturnValue({
      from: () => ({ where: () => ({ limit: () => Promise.resolve([{ id: 1 }]) }) }),
      // biome-ignore lint/suspicious/noExplicitAny: mock de Drizzle em teste
    } as any);
    expect((await teamRepository.findById(1))?.id).toBe(1);
  });

  it("should throw an error if not found", async () => {
    spyOn(db, "select").mockReturnValue({
      from: () => ({ where: () => ({ limit: () => Promise.resolve([]) }) }),
      // biome-ignore lint/suspicious/noExplicitAny: mock de Drizzle em teste
    } as any);
    expect(teamRepository.findById(99)).rejects.toThrow("Time não encontrado.");
  });
});

describe("TeamRepository - Update", () => {
  beforeEach(() => spyOn(db, "update").mockRestore());

  it("should update a team", async () => {
    spyOn(db, "update").mockReturnValue({
      set: () => ({ where: () => ({ returning: () => Promise.resolve([{ id: 1 }]) }) }),
      // biome-ignore lint/suspicious/noExplicitAny: mock de Drizzle em teste
    } as any);
    expect((await teamRepository.update(1, { name: "BR" }))?.id).toBe(1);
  });

  it("should throw an error if update fails", async () => {
    spyOn(db, "update").mockReturnValue({
      set: () => ({ where: () => ({ returning: () => Promise.resolve([]) }) }),
      // biome-ignore lint/suspicious/noExplicitAny: mock de Drizzle em teste
    } as any);
    expect(teamRepository.update(99, { name: "BR" })).rejects.toThrow(
      "Time não encontrado para atualização.",
    );
  });
});

describe("TeamRepository - Delete", () => {
  beforeEach(() => spyOn(db, "delete").mockRestore());

  it("should delete a team", async () => {
    spyOn(db, "delete").mockReturnValue({
      where: () => ({ returning: () => Promise.resolve([{ id: 1 }]) }),
      // biome-ignore lint/suspicious/noExplicitAny: mock de Drizzle em teste
    } as any);
    expect((await teamRepository.delete(1))?.id).toBe(1);
  });

  it("should throw an error if deletion fails", async () => {
    spyOn(db, "delete").mockReturnValue({
      where: () => ({ returning: () => Promise.resolve([]) }),
      // biome-ignore lint/suspicious/noExplicitAny: mock de Drizzle em teste
    } as any);
    expect(teamRepository.delete(99)).rejects.toThrow("Time não encontrado para exclusão.");
  });
});
