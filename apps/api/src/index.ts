import "dotenv/config";
import openapi from "@elysia/openapi";
import cors from "@elysiajs/cors";
import { Elysia } from "elysia";

import { authRoutes } from "./routes/auth-routes.ts";
import { eventRoutes } from "./routes/event-routes.ts";
import { matchRoutes } from "./routes/match-routes.ts";
import { rankingRoutes } from "./routes/ranking-routes.ts";
import { teamRoutes } from "./routes/team-routes.ts";
import { venueRoutes } from "./routes/venue-routes.ts";

const app = new Elysia({ prefix: "/api" })
  .use(
    cors({
      origin: "*",
      methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
      credentials: true,
    }),
  )
  .use(
    openapi({
      scalar: {
        spec: {
          url: "/api/openapi/json",
        },
      },
      documentation: {
        info: {
          title: "Evosport API",
          version: "1.0.0",
          description:
            "API de gerenciamento de eventos esportivos, times, partidas e tabela de classificação.",
        },
        tags: [
          { name: "Events", description: "Gerenciamento de eventos esportivos" },
          { name: "Teams", description: "Gerenciamento de times" },
          { name: "Venues", description: "Gerenciamento de sedes/estádios" },
          { name: "Matches", description: "Gerenciamento de partidas" },
          { name: "Ranking", description: "Tabela de classificação calculada" },
          { name: "Auth", description: "Autenticação e gestão de usuários" },
        ],
      },
    }),
  )
  .get("/", () => "API Evosport rodando com sucesso!", {
    detail: { hide: true },
  })
  .use(authRoutes)
  .use(eventRoutes)
  .use(venueRoutes)
  .use(matchRoutes)
  .use(teamRoutes)
  .use(rankingRoutes)
  .listen(8080);

console.log(`🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`);
