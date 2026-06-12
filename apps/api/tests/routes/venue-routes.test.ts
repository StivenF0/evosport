import { afterEach, beforeAll, describe, expect, it, mock, spyOn } from "bun:test";
import { venueRoutes } from "@api/routes/venue-routes";
import { authService } from "@api/services/auth-service";
import { venueService } from "@api/services/venue-service";
import { Elysia } from "elysia";
import { adminUser, getAdminCookie } from "../helpers/auth";

const app = new Elysia().use(venueRoutes);
const req = (p: string, o?: RequestInit) =>
  app.handle(new Request(`http://localhost/venue${p}`, o));

let adminCookie = "";

describe("VenueRoutes", () => {
  beforeAll(async () => {
    adminCookie = await getAdminCookie();
  });
  afterEach(() => mock.restore());

  const asAdmin = () => spyOn(authService, "getProfile").mockResolvedValue(adminUser);

  const validVenue = {
    id: 1,
    name: "Maracanã",
    city: "Rio",
    capacity: 78000,
    latitude: null,
    longitude: null,
  };

  it("POST / (admin)", async () => {
    asAdmin();
    spyOn(venueService, "createVenue").mockResolvedValue(validVenue);
    const res = await req("/", {
      method: "POST",
      headers: { "Content-Type": "application/json", cookie: adminCookie },
      body: JSON.stringify({ name: "Maracanã", city: "Rio" }),
    });
    expect(res.status).toBe(200);
  });

  it("POST / sem autenticação retorna 401", async () => {
    const res = await req("/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: "Maracanã", city: "Rio" }),
    });
    expect(res.status).toBe(401);
  });

  it("GET /", async () => {
    spyOn(venueService, "getAllVenues").mockResolvedValue([validVenue]);
    expect((await req("/")).status).toBe(200);
  });

  it("GET /:id", async () => {
    spyOn(venueService, "getVenueById").mockResolvedValue(validVenue);
    expect((await req("/1")).status).toBe(200);
  });

  it("PUT /:id (admin)", async () => {
    asAdmin();
    spyOn(venueService, "updateVenue").mockResolvedValue(validVenue);
    const res = await req("/1", {
      method: "PUT",
      headers: { "Content-Type": "application/json", cookie: adminCookie },
      body: JSON.stringify({ name: "Maracanã", city: "Rio" }),
    });
    expect(res.status).toBe(200);
  });

  it("DELETE /:id (admin)", async () => {
    asAdmin();
    spyOn(venueService, "deleteVenue").mockResolvedValue(validVenue);
    expect((await req("/1", { method: "DELETE", headers: { cookie: adminCookie } })).status).toBe(
      200,
    );
  });
});
