import { afterEach, describe, expect, it, mock, spyOn } from "bun:test";
import { venueRoutes } from "@api/routes/venue-routes";
import { venueService } from "@api/services/venue-service";
import { Elysia } from "elysia";

const app = new Elysia().use(venueRoutes);
const req = (p: string, o?: RequestInit) =>
  app.handle(new Request(`http://localhost/venue${p}`, o));

describe("VenueRoutes", () => {
  afterEach(() => mock.restore());

  const validVenue = {
    id: 1,
    name: "Maracanã",
    city: "Rio",
    capacity: 78000,
    latitude: null,
    longitude: null,
  };

  it("POST /", async () => {
    spyOn(venueService, "createVenue").mockResolvedValue(validVenue);
    const res = await req("/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: "Maracanã", city: "Rio" }),
    });
    expect(res.status).toBe(200);
  });

  it("GET /", async () => {
    spyOn(venueService, "getAllVenues").mockResolvedValue([validVenue]);
    expect((await req("/")).status).toBe(200);
  });

  it("GET /:id", async () => {
    spyOn(venueService, "getVenueById").mockResolvedValue(validVenue);
    expect((await req("/1")).status).toBe(200);
  });

  it("PUT /:id", async () => {
    spyOn(venueService, "updateVenue").mockResolvedValue(validVenue);
    const res = await req("/1", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: "Maracanã", city: "Rio" }),
    });
    expect(res.status).toBe(200);
  });

  it("DELETE /:id", async () => {
    spyOn(venueService, "deleteVenue").mockResolvedValue(validVenue);
    expect((await req("/1", { method: "DELETE" })).status).toBe(200);
  });
});
