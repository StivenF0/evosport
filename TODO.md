# Novas tasks

## Sprint 1:

- [x] Definir Schema Unificado.
Criar o arquivo apps/api/src/db/schema.ts contendo:
  Tabela event: (id, name, start_date, end_date, logo_url).
  Tabela teams: (id, name, flag_url).
  Tabela stadiums: (id, name, city, capacity, latitude, longitude).
  Tabela matches: (id, home_team_id, away_team_id, stadium_id, date, status).

- [x] Configurar Relacionamentos.
Utilizar as funções de relations do Drizzle para conectar matches com teams e stadiums.

- [x] Fluxo de Migração.
Configurar o arquivo drizzle.config.ts.
Gerar a primeira migration: bunx drizzle-kit generate:sqlite.
Aplicar a migration: bunx drizzle-kit push:sqlite.

- [x] Repository de Eventos e Sedes.
Criar apps/api/src/repositories/venue-repository.ts:
  Função findAll(): Retorna todas as sedes.
  Função findById(id): Retorna detalhes de uma sede específica.

- [x] Repository de Partidas.
Criar apps/api/src/repositories/match-repository.ts:
  Função getAllWithTeams(): Uma query que já faz o join com a tabela de times para trazer os nomes e bandeiras.

- [x] Repository de Times.
Criar apps/api/src/repositories/team-repository.ts:
Implementar o CRUD completo para gerenciar as entidades de times isoladamente no banco de dados.

- [x] Repository de Classificação.
Criar funções para buscar partidas finalizadas que servirão de base para o serviço de ranking.

- [x] Script de População.
Criar um arquivo apps/api/src/db/seed.ts que utiliza o Drizzle para inserir:
  1 registro de Evento.
  Pelo menos 8 Times.
  Pelo menos 4 Sedes/Estádios.
  Uma lista inicial de Partidas.

- [x] Comando Bun.
Adicionar no package.json o script "db:seed": "bun src/db/seed.ts".

## Sprint 2:

- [x] Criar MatchService.
Implementar lógica para formatar as datas vindas do banco para o padrão brasileiro (DD/MM/YYYY).
Criar função para retornar partidas agrupadas por estádio ou data.

- [x] Criar RankingService.
O Desafio da Sprint: Criar a função que busca todas as partidas, itera sobre elas e calcula: Pontos, Vitórias, Empates, Derrotas e Saldo de Gols.
Retornar um array de objetos ordenado (do 1º ao último colocado).

- [x] Criar VenueService.
Consolidar os dados da sede com as informações de geolocalização para o mapa.

- [x] Criar TeamService.
Implementar o CRUD completo na camada de serviço para gerenciar as regras de negócio e validações relacionadas aos times do campeonato.

- [x] Implementar EventRepository.
Criar apps/api/src/repositories/event-repository.ts:
Implementar o CRUD completo para abstrair as operações de banco de dados da entidade de Evento.

- [x] Implementar EventService.
Criar o arquivo apps/api/src/services/event-service.ts:
Implementar o CRUD completo na camada de serviço para gerenciar a lógica de negócio do evento principal.

- [x] Implementar Rotas de Evento e Sedes.
GET /event: Retorna o objeto do evento (UC01).
GET /venues: Retorna a lista de estádios/cidades (UC05).
GET /venues/:id: Retorna detalhes de uma sede específica.

- [x] Implementar Rotas de Competição.
GET /matches: Retorna a lista de jogos formatada (UC02 e UC03).
GET /teams: Retorna a lista de times.
GET /ranking: Retorna a tabela de classificação calculada pelo Service (UC04).

- [x] Atualizar Entrypoint da API.
Refatorar o arquivo principal para registrar todos os módulos de rotas criados, centralizando a inicialização da aplicação Elysia.

- [x] Implementação de Testes Unitários e Integração.
Configurar o runner nativo do Bun e implementar a cobertura de testes para as três camadas da API, garantindo que as mensagens de erro retornadas ao usuário estejam em português.
Repositories: Testar operações de banco de dados (CRUD) com mocks do Drizzle.
Services: Validar regras de negócio, formatação de datas e cálculos de ranking.
Controllers (Elysia): Testar os endpoints utilizando o método app.handle() para validar status HTTP e payloads.

- [x] Documentação Automática.
Configurar o plugin @elysia/openapi. Isso gera uma página visual com todos os seus endpoints automaticamente.

- [x] Habilitar Acesso Externo.
Configurar o plugin @elysiajs/cors para permitir que o Next.js (porta 3000) acesse a API (porta 3001).

- [x] Exportar Tipos para o Frontend.
Garantir que as interfaces dos objetos de resposta da API estejam no diretório packages/types para que o frontend tenha "IntelliSense" (autocompletar).

## Sprint 3

- [x] Configurar Variáveis de Ambiente.
Criar o arquivo .env.local na pasta apps/web com a variável NEXT_PUBLIC_API_URL=http://localhost:3001

- [x] Configurar o TanStack Query.
Configurar o QueryClientProvider no arquivo principal do Next.js (geralmente app/layout.tsx ou providers.tsx). Isso vai gerenciar o cache e os estados de "carregando" das suas requisições.

- [x] Criar utilitário de Fetch.
Criar um arquivo (ex: src/lib/api.ts) com uma função base que usa o fetch nativo apontando para a sua NEXT_PUBLIC_API_URL.

- [x] Desenvolver o Header (Navbar).
Criar o menu de navegação superior com links para "Home", "Jogos" e "Sedes".
Garantir que o menu funciona no celular (ex: um botão de "hambúrguer" simples usando Tailwind).

- [x] Desenvolver o Footer.
Rodapé simples com o nome do projeto (Evosport), ano e os nomes dos membros da equipe (ótimo para a apresentação da disciplina).

- [x] Aplicar o Layout Global.
Garantir que todas as páginas do Next.js herdem esse Header e Footer automaticamente através do layout.tsx.

- [x] Importar Tipos do Monorepo.
Consumir as interfaces TypeScript exportadas do seu packages/types para tipar as respostas da API no frontend.

- [x] Criar o Hook de Busca (Event Data).
Criar um custom hook (ex: useEventInfo()) usando o TanStack Query para chamar a rota GET /event do Elysia.

- [x] Desenvolver a seção Hero (Capa).
Construir a interface principal da Home (app/page.tsx).
Exibir dinamicamente o Nome do Evento, as Datas e a Logo (Caso de Uso: UC01).

- [x] Tratar Estados de UI.
Adicionar um texto ou spinner de "Carregando..." enquanto a API responde, e uma mensagem de erro amigável caso o backend esteja desligado.

## Sprint 4

- [x] Tratar estados vazios.
Criação do componente `EmptyState` integrado com o `lucide-react` (já utilizado no projeto) e refatoração da página de times (`web/src/app/teams/page.tsx`) para utilizá-lo.

- [x] Criar o Hook de Busca (Matches).
Criar um custom hook (ex: useMatches()) com o TanStack Query para consumir a rota GET /matches da sua API Elysia.

- [x] Desenvolver Componente de Card de Jogo.
Criar um componente visual reutilizável para exibir as informações individuais de cada partida (escudos ou nomes dos times, data, horário e estádio).

- [x] Implementar a Página de Tabela de Jogos.
Construir a interface da rota app/jogos/page.tsx, mapeando os dados vindos do useMatches() para renderizar uma lista ou grade com os Cards de Jogo (Caso de Uso: UC02).

- [x] Exibir Placares e Status da Partida.
Adicionar lógica no Card de Jogo para exibir o resultado numérico (placar_a e placar_b) e o status do jogo (ex: "Encerrado", "Em Andamento" ou "Em Breve") (Caso de Uso: UC03).

- [x] Criar o Hook de Busca (Ranking).
Criar um custom hook (ex: useRanking()) com o TanStack Query para consumir a rota GET /ranking da API.

- [x] Desenvolver Componente de Tabela de Classificação.
Criar uma tabela estlizada com Tailwind CSS para listar as posições, times, pontos (PTS), vitórias (V), empates (E), derrotas (D) e saldo de gols (SG).

- [x] Implementar a Página de Classificação.
Construir a interface da rota app/rankings/page.tsx importando o componente de Tabela de Classificação para exibir o rendimento das equipes no torneio (Caso de Uso: UC04).

## Sprint 5

- [x] Atualizar Banco de Dados (Geolocalização).
Adicionar colunas de latitude e longitude no schema da tabela de Sedes (Drizzle).
Atualizar o arquivo de seed (apps/api/src/db/seed.ts) para incluir coordenadas reais das cidades-sede.
Gerar e aplicar a migration para refletir essas mudanças no SQLite.

- [x] Instalar e Configurar Biblioteca de Mapa.
Adicionar os pacotes leaflet e react-leaflet ao projeto frontend (apps/web).
Importar os estilos CSS obrigatórios do Leaflet no arquivo global de estilos (globals.css) do Next.js.

- [x] Desenvolver Componente de Mapa Base.
Criar um componente isolado (ex: src/components/Map.tsx) com a diretiva "use client" no topo do arquivo.
Configurar o carregamento dinâmico do componente no Next.js (usando next/dynamic com ssr: false) para evitar erros de renderização no lado do servidor.
Definir o centro do mapa e o zoom inicial focado na região do evento.

- [x] Criar Marcadores (Pins) Dinâmicos.
Utilizar o hook de busca do TanStack Query para resgatar a lista de sedes da API.
Mapear o array de dados para renderizar um componente de marcador (<Marker>) nas coordenadas de latitude e longitude de cada estádio.

- [x] Adicionar Interatividade aos Marcadores.
Incluir um balão de informação (<Popup>) vinculado a cada marcador.
Configurar o Popup para exibir o nome do estádio, a cidade e um link (usando next/link) que direciona o usuário para a página de detalhes da sede correspondente.

- [x] Implementar a Página de Mapa.
Construir a interface da rota app/map/page.tsx.
Integrar o componente de mapa em um layout responsivo, garantindo que a visualização preencha corretamente a tela em dispositivos móveis e desktops (Caso de Uso: UC06).

## Sprint 6

- [x] Padronização e Limpeza de Código.
Rodar os comandos de verificação do Biome (linting e formatação) em todo o monorepo para garantir consistência no código.
Revisar os arquivos para remover `console.log` esquecidos, códigos comentados e importações não utilizadas.

- [x] Revisão de Responsividade.
Testar todas as páginas (Home, Jogos, Classificação, Sedes e Mapa) em resoluções de celular e tablet utilizando as ferramentas de desenvolvedor do navegador.
Ajustar as classes do Tailwind CSS (usando os prefixos `sm:`, `md:`, `lg:`) para garantir que tabelas e grids não "quebrem" ou fiquem espremidos em telas menores.

- [x] Tratamento de Erros e Página 404.
Criar uma página amigável para rotas inexistentes utilizando o arquivo padrão do Next.js (app/not-found.tsx).
Revisar os hooks de requisição (TanStack Query) para garantir que mensagens de erro claras sejam exibidas caso a API do Elysia esteja offline ou demore a responder.

- [x] Otimização de Performance visual.
Revisar o carregamento de mídias, garantindo a utilização do componente `<Image />` nativo do Next.js (next/image) para logos, bandeiras e fotos de estádios.
Certificar-se de que as imagens estão utilizando otimização e "lazy loading" para não pesar o carregamento inicial do site.

- [x] Elaboração da Documentação (README.md).
Atualizar o arquivo README.md na raiz do repositório com uma breve descrição do projeto (Evosport) e os nomes dos integrantes da equipe.
Documentar o passo a passo claro para rodar o projeto localmente, incluindo os comandos de instalação (`bun install`), execução do banco de dados/seed (`bun run seed`) e inicialização do servidor (`bun dev`).

---

# Reformulação v2 — Sistema Multi-Evento

> Contexto e decisões técnicas em [.agents/decisions.md](./.agents/decisions.md). Referência visual: `esboco_novo.png`.
> Decisões-chave: junção N:N (`event_teams`/`event_stadiums`), JWT em cookie httpOnly, coluna `role` em `users`, placar dinâmico por status+data.

## Sprint 7 — Schema Multi-Evento e Migração de Dados

- [x] Atualizar o `schema.ts` para multi-evento.
Adicionar coluna `description` em `event`.
Criar tabela de junção `event_teams` (eventId, teamId) para relação N:N entre eventos e times.
Criar tabela de junção `event_stadiums` (eventId, stadiumId) para relação N:N entre eventos e sedes.
Adicionar coluna `eventId` (FK → event) na tabela `matches`.
Definir as `relations` do Drizzle para todas as novas associações.

- [x] Gerar e aplicar a migration.
Migration `0002_smooth_marauders.sql` gerada. Criado `src/db/migrate.ts` (+ script `db:migrate`) para aplicar migrations via Drizzle migrator.

- [x] Atualizar o seed para múltiplos eventos.
Seed popula 2 eventos globais (Copa do Mundo 2026 e Copa das Confederações 2025), vinculando times e sedes via `event_teams`/`event_stadiums` e partidas com `eventId`.

- [x] Atualizar `packages/types`.
Adicionado `description` em `Event` e `eventId` em `Match`; criados `user-types.ts` (`User`, `UserRole`, `NewUser`, `UpdateUser`) e `favorite-types.ts` (`Favorite`, `NewFavorite`).

## Sprint 8 — Autenticação e Usuários (Backend)

- [x] Criar tabela `users`.
Campos id, name, email (único), passwordHash, role ('user' | 'admin', default 'user'), createdAt. Migration `0003_boring_nebula.sql`.

- [x] Repository e Service de usuários.
`user-repository.ts` (create, findByEmail, findById, update) e `auth-service.ts` (register com `Bun.password.hash`, login com `Bun.password.verify`, validação de email único, `getProfile`, `updateName`). O hash de senha nunca é exposto (helper `toPublicUser`).

- [x] Configurar JWT.
`@elysiajs/jwt` configurado em `src/plugins/auth.ts`. Token emitido no login e gravado em cookie httpOnly (`sameSite: lax`, 7 dias). Derive `currentUser` a partir do cookie. `JWT_SECRET` no `.env`.

- [x] Rotas de autenticação.
POST /auth/register, POST /auth/login, POST /auth/logout, GET /auth/me, PUT /auth/me. Mensagens de erro em Português. Validação de entrada via TypeBox (`auth-schemas.ts`).

- [x] Middleware de autorização.
Guardas `requireAuth` (401) e `requireAdmin` (403) em `src/plugins/auth.ts`. Seed cria admin inicial (admin@evosport.com / admin123).

- [x] Testes da camada de auth.
19 testes novos cobrindo service (register/login/updateName + email duplicado + senha inválida), repository e rotas (incl. /me 401 sem cookie e 200 autenticado). Total: 132 testes passando.

## Sprint 9 — Favoritos e Escopo por Evento (Backend)

- [x] Tabela e CRUD de favoritos.
Criada `user_favorites` (userId, eventId, createdAt) com relations — migration `0004_unique_timeslip.sql`. `favorite-repository` (findByUser, exists, add, remove), `favorite-service` (add idempotente valida o evento) e `favorite-routes` (GET /favorites, POST/DELETE /favorites/:eventId) sob `requireAuth`.

- [x] Escopar rotas existentes por evento.
Novas rotas em `event-routes`: GET /event/:id/matches, /:id/teams, /:id/venues, /:id/ranking. `matchRepository.getByEvent`, `rankingRepository.getFinishedMatches(eventId?)`, `eventRepository.findTeamsByEvent/findStadiumsByEvent` via tabelas de junção. Mantidas GET /event (principal) e adicionada GET /event/list (feed multi-evento).

- [x] Endpoint de placar dinâmico.
`eventService.getHighlightMatch` exposto em GET /event/:id/highlight: prioriza partida `em_andamento`; senão o `agendado` futuro mais próximo; `null` se não houver.

- [x] Rotas administrativas (CRUD completo).
POST/PUT/DELETE de events, teams, venues e matches agora sob `requireAdmin` (401/403). Adicionado `eventId` em `MatchBody`/respostas. Vínculos N:N via POST/DELETE /event/:id/teams/:teamId e /event/:id/venues/:stadiumId (idempotentes). Testes atualizados — 149 testes passando.

## Sprint 10 — Fundação do Frontend (Auth, Layout, Design System)

- [x] Design system minimalista (majoritariamente branco).
`globals.css` com base branca/cinza-clara (gray-50) e texto gray-900; Header com borda fina + `sticky`, acentos em azul/verde claros. Cards com cantos arredondados e bordas suaves. (Tailwind v4 — `@theme` evitado por incompatibilidade com o parser do Biome; acentos aplicados via utilitários.)

- [x] Contexto de autenticação no front.
`hooks/use-auth.ts` (TanStack Query: query `me` + mutations login/register/logout/updateProfile, chave `['auth','me']`), `services/auth-service.ts`, tipos em `types/api-types.ts`. `api-client` agora envia `credentials: "include"`; CORS da API ajustado para `origin: true` (cookies httpOnly exigem origem refletida, não `*`).

- [x] Páginas de Login e Cadastro.
`/login` e `/register` com `react-hook-form` + `zod` (`schemas/auth-schemas.ts`); validação e mensagens em Português; cadastro confirma senha e faz auto-login ao concluir.

- [x] Dropdown do usuário e proteção de páginas.
`components/auth/UserMenu.tsx` (avatar com inicial, itens Perfil/Favoritos/Admin-se-admin/Sair, fecha ao clicar fora) integrado ao Header. `hooks/use-require-auth.ts` redireciona visitantes não autenticados (e não-admins) — pronto para as páginas restritas da Sprint 11/12.

## Sprint 11 — Páginas Principais (Feed, Evento, Perfil, Favoritos)

- [x] Homepage (Feed de Eventos).
`app/page.tsx` consome `useEvents` (GET /event/list). `EventFeedItem`: logo à esquerda do título, ícone de link (`Link2`), descrição e `EventScoreboard` (placar dinâmico via GET /event/:id/highlight) por evento. Padrão de 3 estados.

- [x] Página de Evento (layout 2 colunas).
`app/events/[id]/page.tsx`. Esquerda: breadcrumb (Home + título), `FavoriteButton` e abas Sobre (descrição + `DynamicMap` das sedes), Classificação (`RankingTable`) e Times (grid de `TeamCard`). Direita: painel `lg:sticky` com `EventScoreboard` + sumário (ToC) que controla as abas. Hooks escopados em `use-event.ts` (matches/teams/venues/ranking/highlight).

- [x] Layout compartilhado Perfil/Favoritos.
Route group `app/(account)/layout.tsx` com sidebar (Perfil / Favoritos) e proteção via `useRequireAuth` (redireciona visitantes).

- [x] Página de Favoritos.
`app/(account)/favorites/page.tsx` — lista estilo blog com `useFavorites`, ícone de marcador, ação favoritar/desfavoritar via `FavoriteButton` (hooks `use-favorite.ts` → /favorites).

- [x] Página Meu Perfil.
`app/(account)/profile/page.tsx` — avatar com a inicial do nome, campo de nome (`react-hook-form` + `zod`) e botão salvar (mutation PUT /auth/me via `useAuth().updateProfile`), com feedback de sucesso/erro.

## Sprint 12 — Painel Administrativo e Fechamento

- [ ] Páginas administrativas (CRUD).
Áreas restritas (visíveis apenas para admin) para gerenciar eventos, times, partidas e estádios (com localização lat/long). Formulários com `react-hook-form`.

- [ ] Revisão de responsividade e estados.
Aplicar padrão de 3 estados nas novas páginas, revisar mobile/tablet e o design minimalista em todas as telas.

- [ ] Linting, testes e documentação.
Rodar `bun run format && bun run lint` e `bun test`. Atualizar README e os docs de `.agents/` (arquitetura/tech-stack) com o novo escopo.
