# Estado do Desenvolvimento (Handoff para Próximas Sessões)

Este documento registra o progresso da **Reformulação v2** (sistema multi-evento) e tudo o que é necessário para continuar o desenvolvimento em uma nova sessão. Leia também:
- [decisions.md](./decisions.md) — decisões de produto/arquitetura e descrição completa das telas.
- [TODO.md](../TODO.md) — backlog faseado (Sprints 7–12), fonte da verdade do que falta.
- `esboco_novo.png` (raiz) — wireframe das telas.

---

## Visão geral

O Evosport está migrando de um painel de torneio único para um sistema **multi-evento** (apenas eventos globais) com usuários, autenticação (JWT em cookie httpOnly), favoritos e painel admin. UI majoritariamente branca, minimalista, com verde/amarelo/azul claros como acentos. Código em Inglês, UI em PT-BR.

Decisões técnicas cravadas (ver decisions.md):
- Relação evento↔times/sedes: **tabelas de junção N:N** (`event_teams`, `event_stadiums`); `matches` tem `eventId`.
- Auth: `@elysiajs/jwt` + cookie httpOnly; senha com `Bun.password`.
- Papéis: coluna `role` ('user' | 'admin') em `users`; admin via seed; middleware nas rotas.
- Placar dinâmico: partida `em_andamento`; senão `agendado` futura mais próxima.

---

## Progresso por Sprint

- **Sprint 7 — Schema multi-evento: ✅ CONCLUÍDA** (branch `feat/sprint7`, 4 commits)
- **Sprint 8 — Autenticação e Usuários (backend): ✅ CONCLUÍDA** (branch `feat/sprint8`, 6 commits)
- **Sprint 9 — Favoritos e Escopo por Evento (backend): ✅ CONCLUÍDA** (branch `feat/sprint9`)
- **Sprint 10 — Fundação do Frontend (auth, layout, design system): ✅ CONCLUÍDA** (branch `feat/sprint10`)
- **Sprint 11 — Páginas Principais (feed, evento, perfil, favoritos): ✅ CONCLUÍDA** (branch `feat/sprint11`)
- **Sprint 12: ⬜ pendente** (ver TODO.md)

### O que a Sprint 7 entregou
- `apps/api/src/db/schema.ts`: `description` em `event`; `eventId` em `matches`; tabelas `event_teams` e `event_stadiums`; todas as `relations` Drizzle.
- Migration `apps/api/drizzle/0002_smooth_marauders.sql` + novo `apps/api/src/db/migrate.ts` (script `db:migrate`).
- `apps/api/src/db/seed.ts`: 2 eventos globais (Copa do Mundo 2026 com partidas agendadas; Copa das Confederações 2025 com partidas **encerradas com placar**, alimentando a classificação). Vínculos via tabelas de junção.
- `packages/types`: `description` em `Event`, `eventId` em `Match`, novos `user-types.ts` e `favorite-types.ts` (exportados em `index.ts`).

### O que a Sprint 8 entregou
- Tabela `users` (id, name, email único, passwordHash, role `'user'|'admin'`, createdAt) — migration `0003_boring_nebula.sql`.
- `apps/api/src/repositories/user-repository.ts` (create, findByEmail, findById, update).
- `apps/api/src/services/auth-service.ts` (register/login com `Bun.password`, getProfile, updateName; hash nunca exposto via `toPublicUser`).
- `apps/api/src/plugins/auth.ts`: plugin `@elysiajs/jwt`, derive `currentUser` do cookie httpOnly, guardas `requireAuth` (401) e `requireAdmin` (403).
- `apps/api/src/routes/auth-routes.ts`: `POST /auth/{register,login,logout}`, `GET/PUT /auth/me`. Schemas em `auth-schemas.ts`.
- `JWT_SECRET` no `.env`/`.env.example`; rotas registradas no `index.ts` (tag OpenAPI "Auth").
- Seed cria admin inicial: **admin@evosport.com / admin123**.
- 19 testes novos (service/repository/rotas, incl. fluxo autenticado via cookie). Total: **132 passando**.

### O que a Sprint 9 entregou
- **Favoritos**: tabela `user_favorites` (migration `0004_unique_timeslip.sql`), `favorite-repository`/`favorite-service`/`favorite-routes`. Rotas `GET /favorites`, `POST/DELETE /favorites/:eventId` sob `requireAuth`. Favoritar é idempotente e valida o evento.
- **Escopo por evento** (em `event-routes`): `GET /event/:id/matches`, `/:id/teams`, `/:id/venues`, `/:id/ranking`. Times/sedes resolvidos pelas tabelas de junção (`eventRepository.findTeamsByEvent/findStadiumsByEvent`); ranking via `rankingService.getRanking(eventId?)`. Adicionada `GET /event/list` (feed de todos os eventos); `GET /event` segue retornando o principal.
- **Placar dinâmico**: `GET /event/:id/highlight` → `eventService.getHighlightMatch` (partida `em_andamento`; senão `agendado` futuro mais próximo; `null` se nada).
- **Admin**: POST/PUT/DELETE de events/teams/venues/matches agora sob `requireAdmin` (401/403). `MatchBody`/respostas ganharam `eventId` + placar. Vínculos N:N: `POST/DELETE /event/:id/teams/:teamId` e `/event/:id/venues/:stadiumId` (idempotentes).
- **Tipos**: `NewMatch` com `homeScore?/awayScore?` opcionais; `EventResponse` expõe `description`.
- Testes: novos para favoritos (service/rotas) e highlight; rotas de escrita autenticam via helper `tests/helpers/auth.ts` (cookie admin assinado). **149 testes passando**, lint limpo.
  - Obs.: `bunx tsc --noEmit` aponta erros pré-existentes em `auth.ts`/`auth-routes.ts` (Sprint 8) — o projeto valida por Biome + Bun, não por `tsc`.

### O que a Sprint 10 entregou (frontend `apps/web`)
- **Auth no front**: `services/auth-service.ts` (register/login/logout/me/updateProfile), `hooks/use-auth.ts` (TanStack Query, chave `['auth','me']`, expõe `user/isAuthenticated/isAdmin` + mutations), `hooks/use-require-auth.ts` (proteção de páginas, opção `admin`). Tipos de usuário/auth em `types/api-types.ts`.
- **Cookies cross-origin**: `lib/api-client.ts` envia `credentials: "include"`; CORS da API mudou de `origin: "*"` para `origin: true` em `apps/api/src/index.ts` (navegador rejeita `*` com credenciais). Validado: preflight/login refletem `http://localhost:3000` e gravam o cookie httpOnly.
- **Páginas**: `/login` e `/register` com `react-hook-form` + `zod` (`schemas/auth-schemas.ts`); cadastro confirma senha e auto-loga ao concluir.
- **UI**: `components/auth/UserMenu.tsx` (dropdown: avatar com inicial, Perfil/Favoritos/Admin-se-admin/Sair) no `Header` (agora `sticky` com borda fina); design majoritariamente branco em `globals.css` (gray-50/gray-900). `layout.tsx` usa `flex-col`.
- Validação: `bun run lint` limpo (resta só o warning pré-existente `auth.ts:19`), `tsc --noEmit` do web limpo e `next build` com sucesso (rotas `/login` e `/register` geradas).
  - Pendências conhecidas para a Sprint 11/12: as rotas `/profile`, `/favorites`, `/admin` ainda não existem (links já apontam para elas); o feed multi-evento da home ainda usa o evento único antigo.

### O que a Sprint 11 entregou (frontend `apps/web`)
- **Dados escopados**: `services/event-service.ts` (+getAllEvents/getEventMatches/Teams/Venues/Ranking/Highlight), `services/favorite-service.ts`; hooks `use-event.ts` (queries por evento) e `use-favorite.ts` (lista + add/remove com invalidação).
- **Home (feed)**: `app/page.tsx` lista eventos (`useEvents`) com `components/events/EventFeedItem` (logo + título + ícone de link + descrição + `EventScoreboard`).
- **Página de evento**: `app/events/[id]/page.tsx` em 2 colunas — abas Sobre (descrição + `DynamicMap`), Classificação (`RankingTable`), Times (grid `TeamCard`); painel `lg:sticky` com `EventScoreboard` + ToC. `FavoriteButton` (favoritar/desfavoritar; visitante vai para /login).
- **Conta**: route group `app/(account)/` com `layout.tsx` (sidebar + `useRequireAuth`), `favorites/page.tsx` (lista estilo blog) e `profile/page.tsx` (avatar de inicial + alterar nome via `updateProfile`).
- **Componentes novos**: `events/EventScoreboard`, `events/EventFeedItem`, `events/FavoriteButton`.
- Validação: `bun run lint` limpo (só o warning pré-existente `auth.ts:19`), `tsc --noEmit` do web limpo, `next build` com sucesso (12 páginas; `/events/[id]` dinâmica). Domínios de imagem (`flagfeed.com`, `i.pinimg.com`) já configurados em `next.config`.

### Próximo passo: Sprint 12 — Painel Administrativo e Fechamento
Ver detalhes no TODO.md. Resumo: páginas admin (CRUD de eventos/times/partidas/estádios sob `/admin`, visíveis só para admin, `react-hook-form`); revisão de responsividade e estados; rodar lint/test/build, atualizar README e docs de `.agents/`.

---

## Arquitetura e Convenções (resumo prático)

Backend `apps/api` em camadas: `db/` → `repositories/` (DAL Drizzle) → `services/` (regras) → `routes/` (Elysia). Validação em `src/schemas/` (TypeBox). API roda em **`:8080`** com prefixo **`/api`** (nota: docs antigas mencionam 3001 — o código real usa 8080).

Frontend `apps/web` (Next.js App Router): páginas → hooks (TanStack Query) → services → `lib/api-client.ts` (`NEXT_PUBLIC_API_URL`, default `http://localhost:8080/api`).

Padrões obrigatórios (ver coding-guidelines.md): padrão de 3 estados nas páginas, `next/image` (nunca `<img>`), `<button type>`, SVG com `<title>`, sem `as any` (exceto mocks Drizzle com `biome-ignore`), Leaflet só client-side. Cada repository/service/route tem teste correspondente em `apps/api/tests/`.

---

## Comandos essenciais

```bash
bun install                  # raiz
bun dev                      # API + Web em paralelo
bun --filter api dev         # só API (:8080)
bun --filter web dev         # só Web (:3000)

# Banco (apps/api)
bunx drizzle-kit generate    # gerar migration após editar schema.ts
bun --filter api db:migrate  # aplicar migrations
bun --filter api db:seed     # popular dados

# Qualidade
bun run format && bun run lint   # sempre após editar
bun --filter api test            # testes (149 passando após a Sprint 9)
```

> Banco local: `apps/api/sqlite.db` (`DB_FILE_NAME=file:sqlite.db` no `.env`). Foi recriado do zero na Sprint 7 (migrate + seed). Se a estrutura mudar, rode migrate + seed novamente.

---

## Fluxo de trabalho

Branch por sprint (`feat/sprintN`). Conventional Commits, mensagens simples em inglês, **sem co-author**. Commits pequenos e em ordem de dependência, cada um deixando lint + testes verdes.
