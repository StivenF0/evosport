import 'dotenv/config';
import { Elysia } from "elysia";
import cors from '@elysiajs/cors';

import { eventRoutes } from './routes/event-routes.ts';
import { venueRoutes } from './routes/venue-routes.ts';
import { matchRoutes } from './routes/match-routes.ts';
import { teamRoutes } from './routes/team-routes.ts';
import { rankingRoutes } from './routes/ranking-routes.ts';

const app = new Elysia({ prefix: '/api'})
  .use(cors())
  .get('/', () => 'API Evosport rodando com sucesso!')
  .use(eventRoutes)
  .use(venueRoutes)
  .use(matchRoutes)
  .use(teamRoutes)
  .use(rankingRoutes)
  .listen(8080);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
