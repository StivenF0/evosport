import { beforeEach, describe, expect, it, spyOn } from "bun:test";
import { db } from "@api/db";
import { venueRepository } from "@api/repositories/venue-repository";

describe("VenueRepository - Create", () => {
  beforeEach(() => spyOn(db, "insert").mockRestore());

  it("should create a new venue", async () => {
    spyOn(db, "insert").mockReturnValue({
      values: () => ({ returning: () => Promise.resolve([{ id: 1, name: "Maracanã" }]) }),
      // biome-ignore lint/suspicious/noExplicitAny: mock de Drizzle em teste
    } as any);
    expect((await venueRepository.create({ name: "Maracanã", city: "Rio" }))?.id).toBe(1);
  });

  it("should throw an error if creation fails", async () => {
    spyOn(db, "insert").mockReturnValue({
      values: () => ({ returning: () => Promise.resolve([]) }),
      // biome-ignore lint/suspicious/noExplicitAny: mock de Drizzle em teste
    } as any);
    expect(venueRepository.create({ name: "Maracanã", city: "Rio" })).rejects.toThrow(
      "Falha ao criar a sede.",
    );
  });
});

describe("VenueRepository - Find All", () => {
  beforeEach(() => spyOn(db, "select").mockRestore());

  it("should return all venues", async () => {
    spyOn(db, "select").mockReturnValue({
      from: () => Promise.resolve([{ id: 1, name: "Maracanã" }]),
      // biome-ignore lint/suspicious/noExplicitAny: mock de Drizzle em teste
    } as any);
    expect(await venueRepository.findAll()).toBeArrayOfSize(1);
  });
});

describe("VenueRepository - Find By Id", () => {
  beforeEach(() => spyOn(db, "select").mockRestore());

  it("should return a venue by ID", async () => {
    spyOn(db, "select").mockReturnValue({
      from: () => ({ where: () => ({ limit: () => Promise.resolve([{ id: 1 }]) }) }),
      // biome-ignore lint/suspicious/noExplicitAny: mock de Drizzle em teste
    } as any);
    expect((await venueRepository.findById(1))?.id).toBe(1);
  });

  it("should throw an error if not found", async () => {
    spyOn(db, "select").mockReturnValue({
      from: () => ({ where: () => ({ limit: () => Promise.resolve([]) }) }),
      // biome-ignore lint/suspicious/noExplicitAny: mock de Drizzle em teste
    } as any);
    expect(venueRepository.findById(99)).rejects.toThrow("Sede não encontrada.");
  });
});

describe("VenueRepository - Update", () => {
  beforeEach(() => spyOn(db, "update").mockRestore());

  it("should update a venue", async () => {
    spyOn(db, "update").mockReturnValue({
      set: () => ({ where: () => ({ returning: () => Promise.resolve([{ id: 1 }]) }) }),
      // biome-ignore lint/suspicious/noExplicitAny: mock de Drizzle em teste
    } as any);
    expect((await venueRepository.update(1, { name: "Allianz" }))?.id).toBe(1);
  });

  it("should throw an error if update fails", async () => {
    spyOn(db, "update").mockReturnValue({
      set: () => ({ where: () => ({ returning: () => Promise.resolve([]) }) }),
      // biome-ignore lint/suspicious/noExplicitAny: mock de Drizzle em teste
    } as any);
    expect(venueRepository.update(99, { name: "Allianz" })).rejects.toThrow(
      "Sede não encontrada para atualização.",
    );
  });
});

describe("VenueRepository - Delete", () => {
  beforeEach(() => spyOn(db, "delete").mockRestore());

  it("should delete a venue", async () => {
    spyOn(db, "delete").mockReturnValue({
      where: () => ({ returning: () => Promise.resolve([{ id: 1 }]) }),
      // biome-ignore lint/suspicious/noExplicitAny: mock de Drizzle em teste
    } as any);
    expect((await venueRepository.delete(1))?.id).toBe(1);
  });

  it("should throw an error if deletion fails", async () => {
    spyOn(db, "delete").mockReturnValue({
      where: () => ({ returning: () => Promise.resolve([]) }),
      // biome-ignore lint/suspicious/noExplicitAny: mock de Drizzle em teste
    } as any);
    expect(venueRepository.delete(99)).rejects.toThrow("Sede não encontrada para eliminação.");
  });
});
