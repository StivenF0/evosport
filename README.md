# ⚽ Evosport

Plataforma web SaaS para gestão de eventos e torneios esportivos. Permite administrar times, partidas, sedes com mapa interativo e gera tabela de classificação em tempo real.

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
# Crie apps/api/.env (ex: DATABASE_URL=file:./data/evosport.db)
# Crie apps/web/.env.local (ex: NEXT_PUBLIC_API_URL=http://localhost:8080)

# 4. Popular o banco de dados com dados iniciais
bun --filter api db:seed

# 5. Rodar API + Web em paralelo
bun dev
```

A API estará disponível em `http://localhost:8080` e o frontend em `http://localhost:3000`.

## 📡 Endpoints da API

| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/event` | Dados do evento principal |
| GET | `/teams` | Lista de times |
| GET | `/matches` | Partidas formatadas |
| GET | `/ranking` | Tabela de classificação |
| GET | `/venues` | Sedes e estádios |

## 🌐 Páginas (Frontend)

| Rota | Descrição |
|------|-----------|
| `/` | Home com hero do evento |
| `/teams` | Grid de times participantes |
| `/matches` | Calendário de partidas |
| `/rankings` | Tabela de classificação |
| `/venues` | Mapa interativo das sedes |

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
