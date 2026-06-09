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
    -   `/` (Home): Hero com dados do evento.
    -   `/teams`: Grid de cards com escudos e nomes dos times.
    -   `/matches`: Lista de `MatchCard` com times, placar e estádio.
    -   `/ranking`: Tabela de classificação com `RankingTable`.
    -   `/map`: Mapa interativo com Leaflet.
-   `src/components/`: Componentes React reutilizáveis.
    -   `ui/`: `LoadingSpinner`, `ErrorMessage`, `EmptyState`, `MatchCard`, `RankingTable`.
    -   `DynamicMap.tsx` / `Map.tsx`: Mapa Leaflet com SSR desabilitado via dynamic import.
-   `src/hooks/`: Custom Hooks com TanStack React Query.
    -   `use-event.ts`, `use-teams.ts`, `use-matches.ts`, `use-ranking.ts`, `use-venues.ts`.
-   `src/types/`: Tipos TypeScript específicos do frontend.
-   `next.config.ts`: Configuração do Next.js (`images.remotePatterns`, `reactCompiler`).

### 📦 Pacotes Compartilhados (`packages/types`)

Contratos de API compartilhados entre frontend e backend:
- `Match` (id, homeTeamId, awayTeamId, stadiumId, date, status, homeScore, awayScore)
- `Team` (id, name, flagUrl)
- `Venue` (id, name, city, latitude, longitude — **sem** state/distrito)
- `Event` (id, name, startDate, endDate, logoUrl)
- `Ranking` / `TeamStats` (points, played, wins, draws, losses, goalsFor, goalsAgainst, goalDifference)
