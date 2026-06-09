# Arquitetura do Projeto Evosport

O projeto Evosport é estruturado como um **monorepo** utilizando [Bun Workspaces](https://bun.sh/docs/workspaces) para gerenciar múltiplas aplicações e pacotes de código de forma coesa. A estrutura principal é dividida em `apps/` para aplicações (backend e frontend) e `packages/` para pacotes compartilhados (ex: tipos, utilitários).

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

A aplicação de frontend, construída com Next.js, adota a estrutura do App Router:

-   `src/app/`: Contém as rotas da aplicação Next.js (utilizando o App Router).
    -   Arquivos `page.tsx` para páginas renderizadas, `layout.tsx` para layouts compartilhados, etc.
-   `src/components/`: Componentes React reutilizáveis.
    -   Subdividido em categorias (ex: `teams/`, `matches/`, `ui/`) para organizar componentes específicos ou genéricos.
-   `src/hooks/`: Custom Hooks React para lógica de componente reutilizável (ex: `use-event.ts`).
-   `src/types/`: Tipos TypeScript específicos do frontend.
-   `next.config.ts`: Configuração do Next.js, incluindo `images.remotePatterns` para otimização de imagens externas.

### 📦 Pacotes Compartilhados (`packages/`)

-   `types/`: Contém definições de tipos TypeScript que são compartilhadas entre o backend e o frontend. Isso garante consistência e segurança de tipo em todo o monorepo.
    -   Ex: `api-types.ts`, `match-types.ts`, `team-types.ts`, `venue-types.ts`.
