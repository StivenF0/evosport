import { beforeEach, describe, expect, it, spyOn } from "bun:test";
import { eventRepository } from "@api/repositories/event-repository";
import { eventService } from "@api/services/event-service";

// Tests
describe("EventService - Create Event", () => {
  beforeEach(() => {
    spyOn(eventRepository, "create").mockRestore();
  });

  it("should create a new event.", async () => {
    spyOn(eventRepository, "create").mockResolvedValue({
      id: 1,
      name: "Brasileirão",
      startDate: new Date("2026-06-15"),
      endDate: new Date("2026-08-15"),
      logoUrl: "some-link.link",
    });

    const event = await eventService.createEvent({
      name: "Brasileirão",
      startDate: new Date("2026-06-15"),
      endDate: new Date("2026-08-15"),
      logoUrl: "some-link.link",
    });

    expect(event).not.toBeNull();
    expect(event?.name).toBe("Brasileirão");
  });

  it("should throw an error if event failed to be created.", async () => {
    spyOn(eventRepository, "create").mockRejectedValue(
      Error("Falha ao criar o evento."),
    );

    const event = eventService.createEvent({
      name: "Champions",
      startDate: new Date("2026-06-15"),
      endDate: new Date("2026-08-15"),
      logoUrl: "wrong info",
    });

    expect(event).rejects.toThrow("Erro ao criar o evento.");
  });
});

describe("EventService - Find By Id", () => {
  beforeEach(() => {
    spyOn(eventRepository, "findById").mockRestore();
  });

  it("should return an event by ID.", async () => {
    spyOn(eventRepository, "findById").mockResolvedValue({
      id: 1,
      name: "Brasileirão",
      startDate: new Date("2026-06-15"),
      endDate: new Date("2026-08-15"),
      logoUrl: "some-link.link",
    });

    const event = await eventService.getEventById(1);

    expect(event).not.toBeNull();
    expect(event?.name).toBe("Brasileirão");
  });

  it("should throw an error if no event was found by ID.", async () => {
    spyOn(eventRepository, "findById").mockRejectedValue(
      new Error("Evento não encontrado."),
    );

    const event = eventService.getEventById(2);

    expect(event).rejects.toThrow("Erro ao buscar o evento específico.");
  });
});

describe("EventService - Find All", () => {
  beforeEach(() => {
    spyOn(eventRepository, "findAll").mockRestore();
  });

  it("should return all events.", async () => {
    spyOn(eventRepository, "findAll").mockResolvedValue([
      {
        id: 1,
        name: "Brasileirão",
        startDate: new Date("2026-06-15"),
        endDate: new Date("2026-08-15"),
        logoUrl: "some-link.link",
      },
      {
        id: 2,
        name: "Champions",
        startDate: new Date("2026-09-15"),
        endDate: new Date("2026-11-15"),
        logoUrl: "some-link-again.link",
      },
    ]);

    const events = await eventService.getAllEvents();

    expect(events).not.toBeArrayOfSize(0);
    expect(events[0]?.name).toBe("Brasileirão");
    expect(events[1]?.name).toBe("Champions");
  });

  it("should throw an error if no event was found.", async () => {
    spyOn(eventRepository, "findAll").mockRejectedValue(
      new Error("Falha ao encontrar o evento."),
    );

    const events = eventService.getAllEvents();

    expect(events).rejects.toThrow("Erro ao buscar os eventos.");
  });
});

describe("EventService - Update Event", () => {
  beforeEach(() => {
    spyOn(eventRepository, "update").mockRestore();
  });

  it("should update an event.", async () => {
    spyOn(eventRepository, "update").mockResolvedValue({
      id: 1,
      name: "Brasileirão - Série A",
      startDate: new Date("2026-06-15"),
      endDate: new Date("2026-08-15"),
      logoUrl: "some-link.link",
    });

    const event = await eventService.updateEvent(1, {
      name: "Brasileirão - Série A",
    });

    expect(event).not.toBeNull();
    expect(event?.name).toBe("Brasileirão - Série A");
  });

  it("should throw an error if no event was found for update.", async () => {
    spyOn(eventRepository, "update").mockRejectedValue(
      new Error("Evento não encontrado para atualização."),
    );

    const event = eventService.updateEvent(2, {
      name: "Brasileirão - Série A",
    });

    expect(event).rejects.toThrow("Erro ao atualizar o evento.");
  });
});

describe("EventService - Delete Event", () => {
  beforeEach(() => {
    spyOn(eventRepository, "delete").mockRestore();
  });

  it("should delete an event.", async () => {
    spyOn(eventRepository, "delete").mockResolvedValue({
      id: 1,
      name: "Brasileirão",
      startDate: new Date("2026-06-15"),
      endDate: new Date("2026-08-15"),
      logoUrl: "some-link.link",
    });

    const event = await eventService.deleteEvent(1);

    expect(event).not.toBeNull();
    expect(event?.name).toBe("Brasileirão");
  });

  it("should throw an error if no event was found for delete.", async () => {
    spyOn(eventRepository, "delete").mockRejectedValue(
      new Error("Evento não encontrado para exclusão."),
    );

    const event = eventService.deleteEvent(2);

    expect(event).rejects.toThrow("Erro ao excluir o evento.");
  });
});
