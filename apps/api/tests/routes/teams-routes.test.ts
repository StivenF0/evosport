import { afterEach, beforeAll, describe, expect, it, mock, spyOn } from "bun:test";
import { teamRoutes } from "@api/routes/team-routes";
import { authService } from "@api/services/auth-service";
import { teamService } from "@api/services/team-service";
import { Elysia } from "elysia";
import { adminUser, getAdminCookie } from "../helpers/auth";

const app = new Elysia().use(teamRoutes);
const req = (p: string, o?: RequestInit) => app.handle(new Request(`http://localhost/team${p}`, o));

let adminCookie = "";

describe("TeamRoutes", () => {
  beforeAll(async () => {
    adminCookie = await getAdminCookie();
  });
  afterEach(() => mock.restore());

  const asAdmin = () => spyOn(authService, "getProfile").mockResolvedValue(adminUser);

  const validTeam = { id: 1, name: "Brasil", flagUrl: null };

  it("POST / (admin)", async () => {
    asAdmin();
    spyOn(teamService, "createTeam").mockResolvedValue(validTeam);
    const res = await req("/", {
      method: "POST",
      headers: { "Content-Type": "application/json", cookie: adminCookie },
      body: JSON.stringify({ name: "Brasil" }),
    });
    expect(res.status).toBe(200);
  });

  it("POST / sem autenticação retorna 401", async () => {
    const res = await req("/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: "Brasil" }),
    });
    expect(res.status).toBe(401);
  });

  it("GET /", async () => {
    spyOn(teamService, "getAllTeams").mockResolvedValue([validTeam]);
    expect((await req("/")).status).toBe(200);
  });

  it("GET /:id", async () => {
    spyOn(teamService, "getTeamById").mockResolvedValue(validTeam);
    expect((await req("/1")).status).toBe(200);
  });

  it("PUT /:id (admin)", async () => {
    asAdmin();
    spyOn(teamService, "updateTeam").mockResolvedValue(validTeam);
    const res = await req("/1", {
      method: "PUT",
      headers: { "Content-Type": "application/json", cookie: adminCookie },
      body: JSON.stringify({ name: "Brasil" }),
    });
    expect(res.status).toBe(200);
  });

  it("DELETE /:id (admin)", async () => {
    asAdmin();
    spyOn(teamService, "deleteTeam").mockResolvedValue(validTeam);
    expect((await req("/1", { method: "DELETE", headers: { cookie: adminCookie } })).status).toBe(
      200,
    );
  });
});
