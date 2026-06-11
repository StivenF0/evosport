# ⚽ Evosport

Plataforma web SaaS para gestão de **múltiplos eventos esportivos globais**. Inclui autenticação (JWT em cookie httpOnly), favoritos por usuário, painel administrativo (CRUD), sedes com mapa interativo e tabela de classificação calculada por evento.

## 🛠️ Stack

| Camada | Tecnologia |
|--------|-----------|
| Runtime | Bun |
| Backend | ElysiaJS + SQLite + Drizzle ORM |
| Frontend | Next.js 16 + React 19 + Tailwind CSS v4 |
| Mapas | Leaflet / react-leaflet |
| Linter/Formatter | Biome |
| Query | TanStack React Query |

## 📁 Estrutura do Projeto

```
evosport/
├── apps/
│   ├── api/          # Backend (API Elysia)
│   └── web/          # Frontend (Next.js)
├── packages/
│   └── types/        # Tipos TypeScript compartilhados
├── biome.json        # Configuração do Biome
├── package.json      # Monorepo Bun Workspaces
└── tsconfig.base.json
```

### Backend (`apps/api`)

| Camada | Descrição |
|--------|-----------|
| `src/db/` | Schema Drizzle, conexão SQLite, seed |
| `src/repositories/` | Acesso a dados (DAL) |
| `src/services/` | Regras de negócio |
| `src/routes/` | Endpoints ElysiaJS |
| `tests/` | Testes com bun:test |

### Frontend (`apps/web`)

| Camada | Descrição |
|--------|-----------|
| `src/app/` | Páginas (App Router) + providers |
| `src/components/` | Componentes React reutilizáveis |
| `src/hooks/` | Custom hooks (TanStack Query) |
| `src/services/` | Chamadas HTTP para a API |
| `src/lib/` | Cliente HTTP genérico |

## 🚀 Como Rodar Localmente

### Pré-requisitos

- [Bun](https://bun.sh/) instalado

### Passos

```bash
# 1. Clonar o repositório
git clone https://github.com/StivenF0/evosport.git
cd evosport

# 2. Instalar dependências
bun install

# 3. Configurar variáveis de ambiente
# apps/api/.env       -> DB_FILE_NAME=file:sqlite.db  e  JWT_SECRET=uma-chave-secreta
#   (use apps/api/.env.example como base)
# apps/web/.env.local -> NEXT_PUBLIC_API_URL=http://localhost:8080/api

# 4. Aplicar as migrations e popular o banco com dados iniciais
bun --filter api db:migrate
bun --filter api db:seed

# 5. Rodar API + Web em paralelo
bun dev
```

A API estará disponível em `http://localhost:8080/api` e o frontend em `http://localhost:3000`.

O seed cria um administrador inicial: **admin@evosport.com** / **admin123**.

## 📡 Endpoints da API

| Método | Rota | Descrição |
|--------|------|-----------|
| POST | `/auth/register`, `/auth/login`, `/auth/logout` | Autenticação (cookie httpOnly) |
| GET/PUT | `/auth/me` | Perfil do usuário autenticado |
| GET | `/event/list` | Lista de eventos (feed) |
| GET | `/event/:id/matches`, `/teams`, `/venues`, `/ranking` | Dados escopados por evento |
| GET | `/event/:id/highlight` | Partida em destaque (placar dinâmico) |
| GET/POST/DELETE | `/favorites`, `/favorites/:eventId` | Favoritos do usuário (requer login) |
| POST/PUT/DELETE | `/event`, `/team`, `/venue`, `/match` | CRUD administrativo (requer admin) |

## 🌐 Páginas (Frontend)

| Rota | Descrição |
|------|-----------|
| `/` | Feed de eventos com placar dinâmico |
| `/events/:id` | Página do evento (Sobre, Classificação, Times + painel) |
| `/login`, `/register` | Autenticação |
| `/profile`, `/favorites` | Área da conta (sidebar) |
| `/admin/*` | Painel administrativo (CRUD), restrito a admins |
| `/teams`, `/matches`, `/rankings`, `/venues` | Listagens gerais e mapa das sedes |

## 🧪 Testes

```bash
bun --filter api test        # Rodar testes do backend
bun --filter api coverage    # Com cobertura
```

## 🧹 Linting e Formatação

```bash
bun run lint      # Verificar linting
bun run lint:fix  # Corrigir automaticamente
bun run format    # Formatar código
```
