# Fluxo de Trabalho e Comandos do Projeto Evosport

Este documento descreve o fluxo de trabalho recomendado para desenvolvimento, testes, gerenciamento de banco de dados e padrões de commit no projeto Evosport.

## 🚀 Como Rodar a Aplicação

O projeto utiliza **Bun** como runtime e gerenciador de pacotes. Certifique-se de ter o Bun instalado.

### 1. Instalar Dependências (na raiz do monorepo)

```bash
bun install
```

### 2. Variáveis de Ambiente

Crie um arquivo `.env` na raiz das pastas `apps/api` e `apps/web` (se necessário, siga os arquivos `.env.example` que podem existir).

### 3. Rodar a API (Backend)

```bash
bun --filter api dev
```
Isso iniciará o servidor ElysiaJS em modo de desenvolvimento.

### 4. Rodar o Frontend (Next.js)

```bash
bun --filter web dev
```
Isso iniciará o servidor de desenvolvimento do Next.js.

### 5. Rodar Tudo (API e Web em paralelo)

```bash
bun dev
```
Este comando executa ambos os `dev` scripts das `apps/api` e `apps/web` em paralelo.

---

## ✅ Testes

O projeto utiliza `bun:test` para os testes do backend.

-   **Rodar todos os testes da API:**
    ```bash
    bun --filter api test
    ```
-   **Rodar testes com cobertura:**
    ```bash
    bun --filter api coverage
    ```

---

## 🗄️ Banco de Dados (Drizzle ORM)

O Drizzle ORM é usado para gerenciar o schema e as migrations do SQLite.

-   **Gerar uma nova migration:** Após modificar o `schema.ts` (em `apps/api/src/db/`), use:
    ```bash
    cd apps/api && bunx drizzle-kit generate
    ```
    Isso criará um novo arquivo de migration em `apps/api/drizzle/`.

-   **Aplicar as migrations no banco de dados:** (Este comando executa a lógica definida nos arquivos de migration)
    ```bash
    cd apps/api && bun src/db/migrate.ts
    ```
    **(Nota:** O script `migrate.ts` pode precisar ser criado ou verificado se existe no projeto para aplicar as migrations. Se não existir, pode-lo-ás criar).

-   **Popular o banco de dados com dados iniciais (Seed):**
    ```bash
    bun --filter api db:seed
    ```
    Este comando executa o script `apps/api/src/db/seed.ts`.

---

## 🧹 Linting e Formatação (Biome)

O [Biome](https://biomejs.dev/) é a ferramenta unificada para linting e formatação de código.

-   **Verificar Linting e Formatação (não aplica correções):**
    ```bash
    bun run lint
    ```
-   **Aplicar Correções de Linting (auto-fix):**
    ```bash
    bun run lint:fix
    ```
-   **Formatar Arquivos (aplica formatação):**
    ```bash
    bun run format
    ```

---

## 📝 Padrões de Commit (Conventional Commits)

O projeto segue a especificação [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/).

-   **Formato:** `<tipo>(<escopo>): <descrição>`
-   **Tipos Comuns:**
    -   `feat`: Uma nova feature.
    -   `fix`: Uma correção de bug.
    -   `docs`: Mudanças apenas na documentação.
    -   `chore`: Outras mudanças que não modificam o código da aplicação (ex: build, tools).
    -   `refactor`: Uma mudança de código que não corrige um bug nem adiciona uma feature.
    -   `style`: Mudanças que não afetam o significado do código (espaços em branco, formatação, ponto e vírgula, etc.).
    -   `test`: Adição ou refatoração de testes.
-   **Escopos Comuns:**
    -   `api`: Mudanças no código do backend (`apps/api`).
    -   `web`: Mudanças no código do frontend (`apps/web`).
    -   `schema`: Mudanças no schema do banco de dados (`apps/api/src/db/schema.ts`).
    -   `deps`: Atualização de dependências.
    -   `ci`: Mudanças nos arquivos e scripts de CI/CD.
    -   `agents`: Mudanças nos arquivos de contexto para agentes de IA.

-   **Exemplos:**
    -   `feat(api): add user authentication endpoint`
    -   `fix(web): correct image loading on TeamCard`
    -   `chore(deps): update bun and drizzle-kit versions`
    -   `docs(agents): update architecture guidelines`

-   **Linguagem:** Mensagens de commit e PRs devem preferencialmente ser escritas em **Inglês**. A documentação interna (`.agents/`, `README.md`) e os textos para o usuário final estão em Português.
