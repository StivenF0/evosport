# Stack Tecnológica do Projeto Evosport

Este documento lista as principais ferramentas, frameworks e bibliotecas utilizadas no projeto Evosport, com foco nas versões e seu propósito.

## 🛠️ Ferramentas e Ambiente

-   **Runtime:** [Bun](https://bun.sh/) (utilizado para gerenciamento de pacotes, execução de scripts e como runtime para o backend).
-   **Gerenciador de Pacotes:** Bun (workspaces).
-   **Controle de Versão:** Git.
-   **Linter/Formatter:** [Biome](https://biomejs.dev/) (`@biomejs/biome@^2.4.16`).

---

## 🖥️ Backend (`apps/api`)

-   **Framework Web:** [ElysiaJS](https://elysiajs.com/) (`elysia@^1.4.27`) - Um framework HTTP rápido e leve para Bun.
-   **Banco de Dados:** [SQLite](https://sqlite.org/index.html) (utilizado para persistência de dados).
-   **Driver SQLite:** [`@libsql/client@^0.17.2`](https://github.com/libsql/libsql-client-ts) - Cliente TypeScript para SQLite.
-   **ORM (Object-Relational Mapper):** [Drizzle ORM](https://orm.drizzle.team/) (`drizzle-orm@^0.45.1`, `drizzle-kit@^0.31.9`) - Utilizado para definição de schema, queries e migrations.
-   **Variáveis de Ambiente:** [`dotenv@^17.3.1`](https://www.npmjs.com/package/dotenv) - Para carregar variáveis de ambiente.
-   **Testes:** Bun's embutido `bun:test`.

---

## 🌐 Frontend (`apps/web`)

-   **Framework Frontend:** [Next.js](https://nextjs.org/) (`next@16.1.6`) - Utilizando o [App Router](https://nextjs.org/docs/app) para roteamento e renderização.
-   **Biblioteca UI:** [React](https://react.dev/) (`react@19.2.3`, `react-dom@19.2.3`).
-   **Estilização:** [Tailwind CSS v4](https://tailwindcss.com/) (`tailwindcss@^4`) - Framework CSS utilitário.
-   **Gerenciamento de Estado (Query):** [`@tanstack/react-query@^5.100.10`](https://tanstack.com/query/latest) - Para caching e sincronização de dados do servidor.
-   **Ícones:** [Lucide React](https://lucide.dev/) (`lucide-react@^1.14.0`) - Biblioteca de ícones.
-   **Formulários:** [`react-hook-form@^7.71.2`](https://react-hook-form.com/) - Para gerenciamento de formulários.
-   **Mapas Interativos:** [`react-leaflet@^5.0.0`](https://react-leaflet.js.org/) e [Leaflet](https://leafletjs.com/) - Para renderização de mapas.
-   **Compilador React (Experimental):** `babel-plugin-react-compiler@1.0.0` (presente em `devDependencies`, mas seu uso no `next.config.ts` está habilitado por `reactCompiler: true`).
-   **Tipagem:** `@types/react@^19`, `@types/react-dom@^19`.

---

## 📦 Pacotes Compartilhados (`packages/types`)

-   **Tipagem:** TypeScript. Contém interfaces e tipos que são utilizados tanto no frontend quanto no backend para garantir a consistência dos dados.
