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
- **Sprints 9–12: ⬜ pendentes** (ver TODO.md)

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

### Próximo passo: Sprint 9 — Favoritos e Escopo por Evento (backend)
Ver detalhes no TODO.md. Resumo: tabela `user_favorites` (+ repo/service/rotas sob `requireAuth`); escopar matches/teams/ranking/venues por evento (`/events/:id/...`); endpoint de "partida em destaque" (placar dinâmico) no event-service; CRUD admin completo (events/teams/stadiums/matches + junções) sob `requireAdmin`; testes.

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
bun --filter api test            # testes (113 passando na Sprint 7)
```

> Banco local: `apps/api/sqlite.db` (`DB_FILE_NAME=file:sqlite.db` no `.env`). Foi recriado do zero na Sprint 7 (migrate + seed). Se a estrutura mudar, rode migrate + seed novamente.

---

## Fluxo de trabalho

Branch por sprint (`feat/sprintN`). Conventional Commits, mensagens simples em inglês, **sem co-author**. Commits pequenos e em ordem de dependência, cada um deixando lint + testes verdes.
