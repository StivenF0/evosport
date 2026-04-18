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

- [x] Repository de Classificação.
Criar funções para buscar partidas finalizadas que servirão de base para o serviço de ranking.

- [x] Script de População.
Criar um arquivo apps/api/src/db/seed.ts que utiliza o Drizzle para inserir:
  1 registro de Evento.
  Pelo menos 8 Times.
  Pelo menos 4 Sedes/Estádios.
  Uma lista inicial de Partidas.

- [ ] Comando Bun.
Adicionar no package.json o script "db:seed": "bun src/db/seed.ts".

## Sprint 2:

- [ ] Criar MatchService.
Implementar lógica para formatar as datas vindas do banco para o padrão brasileiro (DD/MM/YYYY).
Criar função para retornar partidas agrupadas por estádio ou data.

- [ ] Criar RankingService.
O Desafio da Sprint: Criar a função que busca todas as partidas, itera sobre elas e calcula: Pontos, Vitórias, Empates, Derrotas e Saldo de Gols.
Retornar um array de objetos ordenado (do 1º ao último colocado).

- [ ] Criar VenueService.
Consolidar os dados da sede com as informações de geolocalização para o mapa.

- [ ] Implementar Rotas de Evento e Sedes.
GET /event: Retorna o objeto do evento (UC01).
GET /venues: Retorna a lista de estádios/cidades (UC05).
GET /venues/:id: Retorna detalhes de uma sede específica.

- [ ] Implementar Rotas de Competição.
GET /matches: Retorna a lista de jogos formatada (UC02 e UC03).
GET /ranking: Retorna a tabela de classificação calculada pelo Service (UC04).

- [ ] Documentação Automática.
Configurar o plugin @elysiajs/swagger (já que você está usando Elysia). Isso gera uma página visual com todos os seus endpoints automaticamente — o que ganha muitos pontos em disciplinas de engenharia.

- [ ] Habilitar Acesso Externo.
Configurar o plugin @elysiajs/cors para permitir que o Next.js (porta 3000) acesse a API (porta 3001).

- [ ] Exportar Tipos para o Frontend.
Garantir que as interfaces dos objetos de resposta da API estejam no diretório packages/types para que o frontend tenha "IntelliSense" (autocompletar).

## Sprint 3

- [ ] Configurar Variáveis de Ambiente.
Criar o arquivo .env.local na pasta apps/web com a variável NEXT_PUBLIC_API_URL=http://localhost:3001

- [ ] Configurar o TanStack Query.
Configurar o QueryClientProvider no arquivo principal do Next.js (geralmente app/layout.tsx ou providers.tsx). Isso vai gerenciar o cache e os estados de "carregando" das suas requisições.

- [ ] Criar utilitário de Fetch.
Criar um arquivo (ex: src/lib/api.ts) com uma função base que usa o fetch nativo apontando para a sua NEXT_PUBLIC_API_URL.

- [ ] Desenvolver o Header (Navbar).
Criar o menu de navegação superior com links para "Home", "Jogos" e "Sedes".
Garantir que o menu funciona no celular (ex: um botão de "hambúrguer" simples usando Tailwind).

- [ ] Desenvolver o Footer.
Rodapé simples com o nome do projeto (Evosport), ano e os nomes dos membros da equipe (ótimo para a apresentação da disciplina).

- [ ] Aplicar o Layout Global.
Garantir que todas as páginas do Next.js herdem esse Header e Footer automaticamente através do layout.tsx.

- [ ] Importar Tipos do Monorepo.
Consumir as interfaces TypeScript exportadas do seu packages/types para tipar as respostas da API no frontend.

- [ ] Criar o Hook de Busca (Event Data).
Criar um custom hook (ex: useEventInfo()) usando o TanStack Query para chamar a rota GET /event do Elysia.

- [ ] Desenvolver a seção Hero (Capa).
Construir a interface principal da Home (app/page.tsx).
Exibir dinamicamente o Nome do Evento, as Datas e a Logo (Caso de Uso: UC01).

- [ ] Tratar Estados de UI.
Adicionar um texto ou spinner de "Carregando..." enquanto a API responde, e uma mensagem de erro amigável caso o backend esteja desligado.

## Sprint 4

- [ ] Criar o Hook de Busca (Matches).
Criar um custom hook (ex: useMatches()) com o TanStack Query para consumir a rota GET /matches da sua API Elysia.

- [ ] Desenvolver Componente de Card de Jogo.
Criar um componente visual reutilizável para exibir as informações individuais de cada partida (escudos ou nomes dos times, data, horário e estádio).

- [ ] Implementar a Página de Tabela de Jogos.
Construir a interface da rota app/jogos/page.tsx, mapeando os dados vindos do useMatches() para renderizar uma lista ou grade com os Cards de Jogo (Caso de Uso: UC02).

- [ ] Exibir Placares e Status da Partida.
Adicionar lógica no Card de Jogo para exibir o resultado numérico (placar_a e placar_b) e o status do jogo (ex: "Encerrado", "Em Andamento" ou "Em Breve") (Caso de Uso: UC03).

- [ ] Criar o Hook de Busca (Ranking).
Criar um custom hook (ex: useRanking()) com o TanStack Query para consumir a rota GET /ranking da API.

- [ ] Desenvolver Componente de Tabela de Classificação.
Criar uma tabela estlizada com Tailwind CSS para listar as posições, times, pontos (PTS), vitórias (V), empates (E), derrotas (D) e saldo de gols (SG).

- [ ] Implementar a Página de Classificação.
Construir a interface da rota app/classificacao/page.tsx importando o componente de Tabela de Classificação para exibir o rendimento das equipes no torneio (Caso de Uso: UC04).

- [ ] Tratar Estados Vazios.
Adicionar mensagens amigáveis na interface para o caso de não existirem partidas cadastradas ou a tabela de classificação ainda estar vazia no banco de dados.

## Sprint 5

- [ ] Atualizar Banco de Dados (Geolocalização).
Adicionar colunas de latitude e longitude no schema da tabela de Sedes (Drizzle).
Atualizar o arquivo de seed (apps/api/src/db/seed.ts) para incluir coordenadas reais das cidades-sede.
Gerar e aplicar a migration para refletir essas mudanças no SQLite.

- [ ] Instalar e Configurar Biblioteca de Mapa.
Adicionar os pacotes leaflet e react-leaflet ao projeto frontend (apps/web).
Importar os estilos CSS obrigatórios do Leaflet no arquivo global de estilos (globals.css) do Next.js.

- [ ] Desenvolver Componente de Mapa Base.
Criar um componente isolado (ex: src/components/Map.tsx) com a diretiva "use client" no topo do arquivo.
Configurar o carregamento dinâmico do componente no Next.js (usando next/dynamic com ssr: false) para evitar erros de renderização no lado do servidor.
Definir o centro do mapa e o zoom inicial focado na região do evento.

- [ ] Criar Marcadores (Pins) Dinâmicos.
Utilizar o hook de busca do TanStack Query para resgatar a lista de sedes da API.
Mapear o array de dados para renderizar um componente de marcador (<Marker>) nas coordenadas de latitude e longitude de cada estádio.

- [ ] Adicionar Interatividade aos Marcadores.
Incluir um balão de informação (<Popup>) vinculado a cada marcador.
Configurar o Popup para exibir o nome do estádio, a cidade e um link (usando next/link) que direciona o usuário para a página de detalhes da sede correspondente.

- [ ] Implementar a Página de Mapa.
Construir a interface da rota app/mapa/page.tsx.
Integrar o componente de mapa em um layout responsivo, garantindo que a visualização preencha corretamente a tela em dispositivos móveis e desktops (Caso de Uso: UC06).

## Sprint 6

- [ ] Padronização e Limpeza de Código.
Rodar os comandos de verificação do Biome (linting e formatação) em todo o monorepo para garantir consistência no código.
Revisar os arquivos para remover `console.log` esquecidos, códigos comentados e importações não utilizadas.

- [ ] Revisão de Responsividade.
Testar todas as páginas (Home, Jogos, Classificação, Sedes e Mapa) em resoluções de celular e tablet utilizando as ferramentas de desenvolvedor do navegador.
Ajustar as classes do Tailwind CSS (usando os prefixos `sm:`, `md:`, `lg:`) para garantir que tabelas e grids não "quebrem" ou fiquem espremidos em telas menores.

- [ ] Tratamento de Erros e Página 404.
Criar uma página amigável para rotas inexistentes utilizando o arquivo padrão do Next.js (app/not-found.tsx).
Revisar os hooks de requisição (TanStack Query) para garantir que mensagens de erro claras sejam exibidas caso a API do Elysia esteja offline ou demore a responder.

- [ ] Otimização de Performance visual.
Revisar o carregamento de mídias, garantindo a utilização do componente `<Image />` nativo do Next.js (next/image) para logos, bandeiras e fotos de estádios.
Certificar-se de que as imagens estão utilizando otimização e "lazy loading" para não pesar o carregamento inicial do site.

- [ ] Elaboração da Documentação (README.md).
Atualizar o arquivo README.md na raiz do repositório com uma breve descrição do projeto (Evosport) e os nomes dos integrantes da equipe.
Documentar o passo a passo claro para rodar o projeto localmente, incluindo os comandos de instalação (`bun install`), execução do banco de dados/seed (`bun run seed`) e inicialização do servidor (`bun dev`).


Elysia is unopinionated about folder structure, leaving you to decide how to organize your code yourself.

However, if you don't have a specific structure in mind, we recommend a feature-based folder structure where each feature has its own folder containing controllers, services, and models.

| src
  | modules
	| auth
	  | index.ts (Elysia controller)
	  | service.ts (service)
	  | model.ts (model)
	| user
	  | index.ts (Elysia controller)
	  | service.ts (service)
	  | model.ts (model)
  | utils
	| a
	  | index.ts
	| b
	  | index.ts
