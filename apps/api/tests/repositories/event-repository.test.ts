import { beforeEach, describe, expect, it, spyOn } from "bun:test";
import { db } from "@api/db";
import { eventRepository } from "@api/repositories/event-repository";

describe("EventRepository - Create Event", () => {
  beforeEach(() => {
    spyOn(db, "insert").mockRestore();
  });

  it("should create a new event.", async () => {
    spyOn(db, "insert").mockReturnValue({
      values: () => ({
        returning: () => Promise.resolve([{ id: 1, name: "Copa Evosport" }]),
      }),
    } as any);

    const event = await eventRepository.create({
      name: "Copa Evosport",
      startDate: new Date("2026-06-11"),
      endDate: new Date("2026-07-19"),
    });

    expect(event).not.toBeNull();
    expect(event?.id).toBe(1);
    expect(event?.name).toBe("Copa Evosport");
  });

  it("should throw an error if event failed to be created.", async () => {
    spyOn(db, "insert").mockReturnValue({
      values: () => ({
        returning: () => Promise.resolve([]),
      }),
    } as any);

    const event = eventRepository.create({
      name: "Copa Falha",
      startDate: new Date(),
      endDate: new Date(),
    });

    expect(event).rejects.toThrow("Falha ao criar o evento.");
  });
});

describe("EventRepository - Find All", () => {
  beforeEach(() => {
    spyOn(db, "select").mockRestore();
  });

  it("should return all events.", async () => {
    spyOn(db, "select").mockReturnValue({
      from: () =>
        Promise.resolve([
          { id: 1, name: "Copa Evosport" },
          { id: 2, name: "Brasileirão" },
        ]),
    } as any);

    const events = await eventRepository.findAll();

    expect(events).toBeArrayOfSize(2);
    expect(events[0]?.name).toBe("Copa Evosport");
  });
});

describe("EventRepository - Find By Id", () => {
  beforeEach(() => {
    spyOn(db, "select").mockRestore();
  });

  it("should return an event by ID.", async () => {
    spyOn(db, "select").mockReturnValue({
      from: () => ({
        where: () => ({
          limit: () => Promise.resolve([{ id: 1, name: "Copa Evosport" }]),
        }),
      }),
    } as any);

    const event = await eventRepository.findById(1);

    expect(event).not.toBeNull();
    expect(event?.id).toBe(1);
  });

  it("should throw an error if no event was found by ID.", async () => {
    spyOn(db, "select").mockReturnValue({
      from: () => ({
        where: () => ({
          limit: () => Promise.resolve([]),
        }),
      }),
    } as any);

    const event = eventRepository.findById(99);

    expect(event).rejects.toThrow("Evento não encontrado.");
  });
});

describe("EventRepository - Update Event", () => {
  beforeEach(() => {
    spyOn(db, "update").mockRestore();
  });

  it("should update an event.", async () => {
    spyOn(db, "update").mockReturnValue({
      set: () => ({
        where: () => ({
          returning: () => Promise.resolve([{ id: 1, name: "Copa Evosport 2026" }]),
        }),
      }),
    } as any);

    const event = await eventRepository.update(1, { name: "Copa Evosport 2026" });

    expect(event).not.toBeNull();
    expect(event?.name).toBe("Copa Evosport 2026");
  });

  it("should throw an error if event is not found for update.", async () => {
    spyOn(db, "update").mockReturnValue({
      set: () => ({
        where: () => ({
          returning: () => Promise.resolve([]),
        }),
      }),
    } as any);

    const event = eventRepository.update(99, { name: "Teste" });

    expect(event).rejects.toThrow("Evento não encontrado para atualização.");
  });
});

describe("EventRepository - Delete Event", () => {
  beforeEach(() => {
    spyOn(db, "delete").mockRestore();
  });

  it("should delete an event.", async () => {
    spyOn(db, "delete").mockReturnValue({
      where: () => ({
        returning: () => Promise.resolve([{ id: 1, name: "Copa Evosport" }]),
      }),
    } as any);

    const event = await eventRepository.delete(1);

    expect(event).not.toBeNull();
    expect(event?.id).toBe(1);
  });

  it("should throw an error if event is not found for delete.", async () => {
    spyOn(db, "delete").mockReturnValue({
      where: () => ({
        returning: () => Promise.resolve([]),
      }),
    } as any);

    const event = eventRepository.delete(99);

    expect(event).rejects.toThrow("Evento não encontrado para exclusão.");
  });
});
