import { afterEach, describe, expect, it, mock, spyOn } from "bun:test";
import { teamRoutes } from "@api/routes/team-routes";
import { teamService } from "@api/services/team-service";
import { Elysia } from "elysia";

const app = new Elysia().use(teamRoutes);
const req = (p: string, o?: RequestInit) => app.handle(new Request(`http://localhost/team${p}`, o));

describe("TeamRoutes", () => {
  afterEach(() => mock.restore());

  const validTeam = { id: 1, name: "Brasil", flagUrl: null };

  it("POST /", async () => {
    spyOn(teamService, "createTeam").mockResolvedValue(validTeam);
    const res = await req("/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: "Brasil" }),
    });
    expect(res.status).toBe(200);
  });

  it("GET /", async () => {
    spyOn(teamService, "getAllTeams").mockResolvedValue([validTeam]);
    expect((await req("/")).status).toBe(200);
  });

  it("GET /:id", async () => {
    spyOn(teamService, "getTeamById").mockResolvedValue(validTeam);
    expect((await req("/1")).status).toBe(200);
  });

  it("PUT /:id", async () => {
    spyOn(teamService, "updateTeam").mockResolvedValue(validTeam);
    const res = await req("/1", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: "Brasil" }),
    });
    expect(res.status).toBe(200);
  });

  it("DELETE /:id", async () => {
    spyOn(teamService, "deleteTeam").mockResolvedValue(validTeam);
    expect((await req("/1", { method: "DELETE" })).status).toBe(200);
  });
});
