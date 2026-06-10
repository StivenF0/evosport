# Decisões de Arquitetura e Escopo (Evosport)

Este documento registra decisões de produto e arquitetura tomadas ao longo da evolução do projeto. Agentes devem consultá-lo antes de alterações estruturais.

---

## 2026-06-09 — Reformulação v2: Sistema Multi-Evento

O Evosport deixa de ser um painel de torneio único e passa a gerenciar **múltiplos eventos esportivos globais** (apenas eventos globais, para simplificar a rastreabilidade), com módulo de usuários, autenticação, favoritos e painel administrativo.

Referência visual: `esboco_novo.png` (raiz do repositório).

### Novas Páginas e Fluxos

> **Nota de nomenclatura:** no Next.js, tratamos a navegação e os componentes de rota exclusivamente pelo termo **"Páginas"**.

- **Homepage (Feed de Eventos):** listagem contínua estilo blog. Cada evento tem logo à esquerda do título, ícone de "corrente/link" junto ao título, breve descrição e um **placar dinâmico** integrado (partida em andamento ou próximo confronto).
- **Página de Evento (2 colunas):**
  - **Esquerda (principal):** breadcrumb (link Home + título do evento), botão **Favoritar**, e abas: **Sobre** (descrição + mapa Leaflet das sedes), **Classificação** (tabela), **Times** (grid de cards do evento).
  - **Direita (contexto fixo):** painel com partida atual/próximo jogo + placar, e abaixo um sumário (Table of Contents) da página. Dropdown do usuário no canto superior.
- **Meu Perfil e Favoritos:** layout compartilhado com sidebar fixa à esquerda (links Perfil / Favoritos).
  - **Favoritos:** seção estilo blog com os eventos salvos, com ícone de bandeira/marcador.
  - **Meu Perfil:** avatar minimalista com a inicial do nome, campo para alterar o nome e botão salvar.
- **Login / Cadastro:** páginas limpas. Cadastro com Nome, Email, Senha, Confirmar Senha.
- **Admin (CRUD):** áreas restritas para gerenciar eventos, times, partidas e estádios (com localizações).

### Design

- Minimalista e funcional, com **linhas limpas**. O site deve ser **majoritariamente branco**.
- Paleta: base preto/branco, com **verde, amarelo e azul em tons claros** como cores de apoio/destaque (acentos, badges, estados). Usar com parcimônia — o branco predomina.
- UI em **Português (Brasil)**; código-fonte em **Inglês** (ver [coding-guidelines.md](./coding-guidelines.md)).

### Decisões Técnicas (validadas pelo usuário)

| Tema | Decisão |
|---|---|
| **Modelagem evento↔times/sedes** | Tabelas de junção **N:N** (`event_teams`, `event_stadiums`). `matches` recebe `eventId`. Times e sedes são compartilhados entre eventos, sem duplicação de registros. |
| **Autenticação** | JWT em **cookie httpOnly** via `@elysiajs/jwt`. Hash de senha com `Bun.password` (bcrypt nativo). |
| **Papéis / Admin** | Coluna `role` (`'user' \| 'admin'`) na tabela `users`. Admin inicial criado via **seed**. Rotas admin protegidas por middleware que checa o papel. |
| **Placar dinâmico** | "Partida atual" = primeira partida com status `em_andamento`. Se não houver, "próximo jogo" = partida `agendado` com a data futura mais próxima. |

> **Nota:** Rigor arquitetural foi deliberadamente relaxado por ser projeto acadêmico — priorizar **simplicidade** sobre abstrações elaboradas.
