import { afterEach, beforeAll, describe, expect, it, mock, spyOn } from "bun:test";
import { eventRoutes } from "@api/routes/event-routes";
import { authService } from "@api/services/auth-service";
import { eventService } from "@api/services/event-service";
import { Elysia } from "elysia";
import { adminUser, getAdminCookie } from "../helpers/auth";

const app = new Elysia().use(eventRoutes);
const req = (p: string, o?: RequestInit) =>
  app.handle(new Request(`http://localhost/event${p}`, o));

let adminCookie = "";

describe("EventRoutes", () => {
  beforeAll(async () => {
    adminCookie = await getAdminCookie();
  });
  afterEach(() => mock.restore());

  const asAdmin = () => spyOn(authService, "getProfile").mockResolvedValue(adminUser);

  const validEvent = {
    id: 1,
    name: "Copa Evosport",
    description: null,
    startDate: new Date("2026-06-11T00:00:00.000Z"),
    endDate: new Date("2026-07-19T00:00:00.000Z"),
    logoUrl: null,
  };

  const bodyData = JSON.stringify({
    name: "Copa Evosport",
    startDate: "2026-06-11T00:00:00.000Z",
    endDate: "2026-07-19T00:00:00.000Z",
  });

  it("POST / (admin)", async () => {
    asAdmin();
    spyOn(eventService, "createEvent").mockResolvedValue(validEvent);
    const res = await req("/", {
      method: "POST",
      headers: { "Content-Type": "application/json", cookie: adminCookie },
      body: bodyData,
    });
    expect(res.status).toBe(200);
  });

  it("POST / sem autenticação retorna 401", async () => {
    const res = await req("/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: bodyData,
    });
    expect(res.status).toBe(401);
  });

  it("GET /", async () => {
    // Retorna array porque o service de listar tudo retorna array, mas a rota pega o [0]
    spyOn(eventService, "getAllEvents").mockResolvedValue([validEvent]);
    expect((await req("/")).status).toBe(200);
  });

  it("GET /list", async () => {
    spyOn(eventService, "getAllEvents").mockResolvedValue([validEvent]);
    const res = await req("/list");
    expect(res.status).toBe(200);
    // biome-ignore lint/suspicious/noExplicitAny: resposta de rota sem tipo
    const data: any = await res.json();
    expect(data).toBeArrayOfSize(1);
  });

  it("GET /:id", async () => {
    spyOn(eventService, "getEventById").mockResolvedValue(validEvent);
    expect((await req("/1")).status).toBe(200);
  });

  it("GET /:id/highlight retorna a partida em destaque ou null", async () => {
    spyOn(eventService, "getHighlightMatch").mockResolvedValue(null);
    const res = await req("/1/highlight");
    expect(res.status).toBe(200);
  });

  it("PUT /:id (admin)", async () => {
    asAdmin();
    spyOn(eventService, "updateEvent").mockResolvedValue(validEvent);
    const res = await req("/1", {
      method: "PUT",
      headers: { "Content-Type": "application/json", cookie: adminCookie },
      body: bodyData,
    });
    expect(res.status).toBe(200);
  });

  it("DELETE /:id (admin)", async () => {
    asAdmin();
    spyOn(eventService, "deleteEvent").mockResolvedValue(validEvent);
    expect((await req("/1", { method: "DELETE", headers: { cookie: adminCookie } })).status).toBe(
      200,
    );
  });
});
