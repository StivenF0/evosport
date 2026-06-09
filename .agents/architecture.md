# Arquitetura do Projeto Evosport

O projeto Evosport é uma plataforma web (SaaS) para gestão de eventos e torneios esportivos. Permite administrar times, partidas, sedes (com mapa interativo) e gera automaticamente uma tabela de classificação (ranking) em tempo real.

Estruturado como um **monorepo** utilizando [Bun Workspaces](https://bun.sh/docs/workspaces) para gerenciar múltiplas aplicações e pacotes de código de forma coesa.

## Estrutura do Monorepo

```
evosport/
├── .agents/                    # Documentação para agentes de IA
│   ├── architecture.md
│   ├── tech-stack.md
│   ├── coding-guidelines.md
│   └── workflow.md
├── apps/
│   ├── api/                    # Aplicação Backend (API)
│   └── web/                    # Aplicação Frontend (Next.js)
├── packages/
│   └── types/                  # Tipos TypeScript compartilhados entre apps
├── biome.json                  # Configuração do Biome (linter/formatter)
├── bun.lockb                   # Lockfile do Bun
├── package.json                # Configuração do Monorepo Bun
└── tsconfig.json               # Configuração TypeScript raiz
```

---

## Estrutura Detalhada por Aplicação

### 🖥️ Backend (`apps/api`)

A aplicação de backend segue um padrão arquitetural que separa as responsabilidades em camadas claras:

-   `src/db/`: Contém a configuração do banco de dados e o schema Drizzle.
    -   `schema.ts`: Definição das tabelas do SQLite e suas relações usando Drizzle ORM.
    -   `index.ts`: Inicialização da conexão com o banco de dados.
    -   `seed.ts`: Script para popular o banco de dados com dados iniciais (seed).
-   `src/repositories/`: Camada de Acesso a Dados (DAL - Data Access Layer).
    -   Contém funções para interagir diretamente com o Drizzle ORM, realizando operações CRUD básicas e consultas mais complexas nas tabelas do banco de dados.
-   `src/services/`: Camada de Regras de Negócio.
    -   Contém a lógica de negócio principal da aplicação. Utiliza os *repositories* para acessar os dados e aplica validações, transformações e coordenação entre diferentes entidades.
-   `src/routes/`: Camada de API (Endpoints ElysiaJS).
    -   Define os endpoints da API usando ElysiaJS. Cada arquivo representa um grupo de rotas relacionadas e interage com os *services* para processar as requisições HTTP e retornar as respostas.
-   `tests/`: Testes unitários e de integração para o backend.

### 🌐 Frontend (`apps/web`)

Construído com Next.js App Router. As rotas principais são chamadas de **collections**.

-   `src/app/`: Collections do App Router.
    -   `/` (Home): Hero com dados do evento (usa `usePrimaryEvent`).
    -   `/teams`: Grid de cards com escudos e nomes dos times (usa `useTeams`).
    -   `/matches`: Lista de `MatchCard` em grid 1-col/2-col (usa `useMatches`).
    -   `/rankings`: Tabela de classificação com `RankingTable` (usa `useRanking`).
    -   `/venues`: Mapa interativo Leaflet com pins das sedes (usa `useVenues`).
    -   `not-found.tsx`: Página 404 customizada.
    -   `providers/`: `QueryClientProvider` do TanStack React Query.
    -   `layout.tsx`: Layout raiz com `<Header />`, `<Footer />` e `<Providers />`.
-   `src/components/`: Componentes React reutilizáveis.
    -   `ui/`: `LoadingSpinner`, `ErrorMessage`, `EmptyState`, `RankingTable`, `Map`, `DynamicMap`.
    -   `matches/MatchCard.tsx`: Card individual de partida (escudos, placar, status, data).
    -   `teams/TeamCard.tsx`: Card individual de time (escudo ou fallback com inicial).
    -   `Header.tsx`: Navbar responsiva com menu hambúrguer em mobile.
    -   `Footer.tsx`: Rodapé simples com ano e direitos reservados.
-   `src/hooks/`: Custom Hooks com TanStack React Query.
    -   `use-event.ts`, `use-teams.ts`, `use-matches.ts`, `use-ranking.ts`, `use-venues.ts`.
    -   `use-match.ts` também exporta `useMatchesGrouped` e `useCreateMatch` (mutation).
    -   `use-team.ts` também exporta `useCreateTeam` (mutation).
-   `src/services/`: Camada de chamadas HTTP que consomem o `api-client`.
    -   `event-service.ts`, `match-service.ts`, `team-service.ts`, `ranking-service.ts`, `venue-service.ts`.
-   `src/lib/`: Utilitários.
    -   `api-client.ts`: Cliente HTTP genérico (`get`, `post`, `put`, `delete`) que aponta para `NEXT_PUBLIC_API_URL`.
-   `src/types/`: Tipos TypeScript específicos do frontend.
-   `next.config.ts`: Configuração do Next.js (`images.remotePatterns` para `flagfeed.com` e `i.pinimg.com`, `reactCompiler: true`).

### 📦 Pacotes Compartilhados (`packages/types`)

Contratos de API compartilhados entre frontend e backend:
- `Match` (id, homeTeamId, awayTeamId, stadiumId, date, status, homeScore, awayScore)
- `Team` (id, name, flagUrl)
- `Venue` (id, name, city, latitude, longitude — **sem** state/distrito)
- `Event` (id, name, startDate, endDate, logoUrl)
- `Ranking` / `TeamStats` (points, played, wins, draws, losses, goalsFor, goalsAgainst, goalDifference)
