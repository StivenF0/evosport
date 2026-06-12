import { afterEach, describe, expect, it, mock, spyOn } from "bun:test";
import { eventRepository } from "@api/repositories/event-repository";
import { favoriteRepository } from "@api/repositories/favorite-repository";
import { favoriteService } from "@api/services/favorite-service";

const event = {
  id: 10,
  name: "Copa Evosport",
  description: null,
  startDate: new Date("2026-06-11"),
  endDate: new Date("2026-07-19"),
  logoUrl: null,
};

const favoriteRow = { id: 1, userId: 1, eventId: 10, createdAt: new Date("2026-01-01") };

describe("FavoriteService", () => {
  afterEach(() => mock.restore());

  it("getUserFavorites retorna apenas os eventos favoritados", async () => {
    spyOn(favoriteRepository, "findByUser").mockResolvedValue([
      // biome-ignore lint/suspicious/noExplicitAny: mock de relação do Drizzle em teste
      { ...favoriteRow, event } as any,
    ]);
    const result = await favoriteService.getUserFavorites(1);
    expect(result).toEqual([event]);
  });

  it("addFavorite valida o evento e adiciona quando ainda não existe", async () => {
    // biome-ignore lint/suspicious/noExplicitAny: mock de Drizzle em teste
    spyOn(eventRepository, "findById").mockResolvedValue(event as any);
    spyOn(favoriteRepository, "exists").mockResolvedValue(null);
    spyOn(favoriteRepository, "add").mockResolvedValue(favoriteRow);

    const result = await favoriteService.addFavorite(1, 10);
    expect(result).toEqual(favoriteRow);
    expect(favoriteRepository.add).toHaveBeenCalledTimes(1);
  });

  it("addFavorite é idempotente: não duplica favorito existente", async () => {
    // biome-ignore lint/suspicious/noExplicitAny: mock de Drizzle em teste
    spyOn(eventRepository, "findById").mockResolvedValue(event as any);
    spyOn(favoriteRepository, "exists").mockResolvedValue(favoriteRow);
    const addSpy = spyOn(favoriteRepository, "add");

    const result = await favoriteService.addFavorite(1, 10);
    expect(result).toEqual(favoriteRow);
    expect(addSpy).not.toHaveBeenCalled();
  });

  it("removeFavorite retorna mensagem de confirmação", async () => {
    spyOn(favoriteRepository, "remove").mockResolvedValue(favoriteRow);
    const result = await favoriteService.removeFavorite(1, 10);
    expect(result).toEqual({ message: "Evento removido dos favoritos." });
  });
});
