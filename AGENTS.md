# Contexto para Agentes de IA (Evosport)

Bem-vindo! Se você é um assistente de IA, LLM ou agente automatizado trabalhando no repositório **Evosport**, você **deve** consultar os documentos neste diretório antes de fazer alterações arquiteturais, criar novos recursos ou resolver problemas de linting.

O contexto do projeto foi dividido de forma modular para facilitar a sua compreensão:

- 🏗️ **[Arquitetura](./.agents/architecture.md)**: Organização do monorepo, estrutura do Backend (camadas) e do Frontend (collections, componentes, hooks).
- 📚 **[Tech Stack](./.agents/tech-stack.md)**: Ferramentas, versões e bibliotecas utilizadas.
- ⚠️ **[Diretrizes de Código e Linting](./.agents/coding-guidelines.md)**: Regras essenciais do Biome, padrões para testes com Drizzle, tratamento de erros e acessibilidade no Next.js.
- 🔄 **[Workflow e Comandos](./.agents/workflow.md)**: Como rodar a aplicação, testes, migrations do banco de dados e padrões de commit.
- 🧭 **[Decisões de Arquitetura e Escopo](./.agents/decisions.md)**: Registro de decisões de produto e técnicas (ex.: reformulação multi-evento, autenticação, papéis).

> **Nota:** Por convenção, toda a documentação, nomes de tabelas principais, e textos para o usuário final estão em **Português**. Mensagens de commit seguem o formato *Conventional Commits* e geralmente são escritas em Inglês.
>
> **Nota 2:** Código-fonte (variáveis, types, arquivos) deve ser em **Inglês**; toda interface visível ao usuário deve ser em **Português (Brasil)**. Consulte o [coding-guidelines.md](./.agents/coding-guidelines.md) para regras detalhadas de idioma, padrão de 3 estados, badges, fallback de imagens, Leaflet SSR e estilização.

## 📋 Tasks Pendentes

O arquivo [TODO.md](../TODO.md) contém a lista de tarefas do projeto. Antes de iniciar qualquer trabalho, verifique o estado atual das tasks para evitar duplicação de esforço.
