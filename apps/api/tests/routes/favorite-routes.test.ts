import { afterEach, beforeAll, describe, expect, it, mock, spyOn } from "bun:test";
import { favoriteRoutes } from "@api/routes/favorite-routes";
import { authService } from "@api/services/auth-service";
import { favoriteService } from "@api/services/favorite-service";
import { Elysia } from "elysia";
import { adminUser, getAdminCookie } from "../helpers/auth";

const app = new Elysia().use(favoriteRoutes);
const req = (p: string, o?: RequestInit) =>
  app.handle(new Request(`http://localhost/favorites${p}`, o));

const event = {
  id: 10,
  name: "Copa Evosport",
  description: null,
  startDate: new Date("2026-06-11"),
  endDate: new Date("2026-07-19"),
  logoUrl: null,
};

let cookie = "";

describe("FavoriteRoutes", () => {
  beforeAll(async () => {
    cookie = await getAdminCookie();
  });
  afterEach(() => mock.restore());

  const asUser = () => spyOn(authService, "getProfile").mockResolvedValue(adminUser);

  it("GET /favorites retorna 401 sem autenticação", async () => {
    const res = await req("/");
    expect(res.status).toBe(401);
  });

  it("GET /favorites retorna os eventos favoritados quando autenticado", async () => {
    asUser();
    spyOn(favoriteService, "getUserFavorites").mockResolvedValue([event]);
    const res = await req("/", { headers: { cookie } });
    expect(res.status).toBe(200);
    // biome-ignore lint/suspicious/noExplicitAny: resposta de rota sem tipo
    const data: any = await res.json();
    expect(data).toBeArrayOfSize(1);
  });

  it("POST /favorites/:eventId favorita um evento", async () => {
    asUser();
    spyOn(favoriteService, "addFavorite").mockResolvedValue({
      id: 1,
      userId: 1,
      eventId: 10,
      createdAt: new Date("2026-01-01"),
    });
    const res = await req("/10", { method: "POST", headers: { cookie } });
    expect(res.status).toBe(200);
  });

  it("DELETE /favorites/:eventId desfavorita um evento", async () => {
    asUser();
    spyOn(favoriteService, "removeFavorite").mockResolvedValue({
      message: "Evento removido dos favoritos.",
    });
    const res = await req("/10", { method: "DELETE", headers: { cookie } });
    expect(res.status).toBe(200);
  });
});
