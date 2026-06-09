# Diretrizes de Código e Linting (Biome)

O projeto Evosport aplica regras de linting rigorosas via Biome para garantir a qualidade, consistência e acessibilidade do código. Agentes devem aderir estritamente a estas diretrizes.

## Configuração do Biome

A configuração principal do Biome está em `biome.json` na raiz do projeto. As regras são ativadas via `linter.rules.recommended: true` e personalizadas para cenários específicos.

## Regras e Padrões Essenciais

### 1. 🌐 Idioma

- **Código-fonte:** Todo código, variáveis, nomes de arquivos, tipos, funções e props devem ser em **Inglês**.
- **Interface do usuário:** Toda UI visível (textos, badges, tooltips, placeholders, mensagens de erro) deve ser em **Português (Brasil)**.

### 2. 🚫 `noExplicitAny` em Testes de Backend (Mocks do Drizzle)

-   **Contexto:** Ao criar *mocks* para o Drizzle ORM em testes (ex: `spyOn(db, "insert").mockReturnValue({...} as any)`), a tipagem encadeada do Drizzle (Builder Pattern) é complexa. Mocks simplificados frequentemente requerem `as any` para bypassar a verificação de tipo.
-   **Diretriz:** O uso de `as any` é **permitido nestes mocks específicos de teste**, mas **DEVE** ser suprimido explicitamente na linha acima com um comentário Biome formatado:
    ```typescript
    // biome-ignore lint/suspicious/noExplicitAny: mock de Drizzle em teste
    spyOn(db, "query.matches as any", "findMany").mockResolvedValue([...]);
    ```
    Ou, para atribuições de objeto:
    ```typescript
    // biome-ignore lint/suspicious/noExplicitAny: mock de Drizzle em teste
    if (!db.query) db.query = { matches: {} } as any;
    ```
    Ou, para o retorno de um JSON:
    ```typescript
    // biome-ignore lint/suspicious/noExplicitAny: resposta de rota sem tipo
    const json: any = await res.json();
    ```

### 3. 🖨️ Console Logs (`noConsole`)

-   **Contexto:** A regra `lint/suspicious/noConsole` é frequentemente ativada para evitar `console.log` em código de produção.
-   **Diretriz:** No projeto Evosport, esta regra está configurada como `"off"` em `biome.json`. Portanto, é **permitido** usar `console.log`, especialmente em scripts de utilidade (ex: `apps/api/src/db/seed.ts`) que precisam de feedback de progresso no console.

### 4. 🖼️ Imagens no Frontend (Next.js) (`noImgElement`)

-   **Contexto:** O Next.js oferece o componente `<Image />` para otimização automática de imagens (lazy loading, redimensionamento, formatos modernos). O uso da tag `<img>` nativa é desencorajado.
-   **Diretriz:** **NÃO** utilize a tag `<img>` nativa do HTML. Utilize sempre o componente `<Image />` do `next/image`.
-   **Imagens Externas:** Para URLs de imagens de domínios externos (ex: `https://flagfeed.com/`, `https://i.pinimg.com/`), você **DEVE** configurar o bloco `images.remotePatterns` no arquivo `apps/web/next.config.ts`.
    ```typescript
    // apps/web/next.config.ts
    const nextConfig: NextConfig = {
      images: {
        remotePatterns: [
          {
            protocol: "https",
            hostname: "flagfeed.com",
          },
          {
            protocol: "https",
            hostname: "i.pinimg.com",
          },
        ],
      },
    };
    ```
-   **Props:** O componente `<Image />` requer os atributos `width`, `height` ou `fill` e `alt`. Certifique-se de fornecer dimensões adequadas ou configurar o layout `fill` com um pai que tenha `position: relative`.
-   **`priority` em imagens acima da dobra:** Imagens que estão visíveis no viewport inicial (acima da dobra) **DEVEM** receber a prop `priority` para evitar lazy loading e melhorar o LCP (Largest Contentful Paint). Exemplo: o logo do evento na Home (`apps/web/src/app/page.tsx`).
    ```tsx
    <Image src={event.logoUrl} alt="..." width={144} height={144} priority />
    ```
-   **Imagens abaixo da dobra** (cards de times, bandeiras na tabela, escudos nas partidas) **DEVEM** depender do lazy loading padrão do Next.js (sem `priority`), que já carrega sob demanda conforme o usuário scrolla.

### 5. ♿ Acessibilidade Web (a11y)

-   **Contexto:** Garantir que a interface seja acessível é crucial.
-   **Diretriz:**
    -   **SVGs (`noSvgWithoutTitle`):** Elementos `<svg>` utilizados como ícones **DEVERÃO** conter um elemento `<title>` interno que descreva seu propósito para leitores de tela. Alternativamente, `aria-label` ou `aria-labelledby` podem ser usados se `role="img"` estiver presente.
        ```tsx
        <svg aria-label="Ícone de erro"> {/* Ou */}
          <title>Nome do Ícone</title>
          {/* ... paths do SVG ... */}
        </svg>
        ```
    -   **Botões (`useButtonType`):** Elementos `<button>` **DEVERÃO** sempre ter o atributo `type` explicitamente definido (`"button"`, `"submit"` ou `"reset"`).
        ```tsx
        <button type="button" onClick={handleClick}>
          Clicar
        </button>
        ```

### 6. 🩹 Tratamento de Exceções (`try/catch`)

-   **Contexto:** O Biome possui a regra `noUnusedVariables` que impede a declaração de variáveis não utilizadas. Isso se aplica a parâmetros de `catch`.
-   **Diretriz:** Se a variável `error` no bloco `catch` não for utilizada dentro do bloco (ou seja, apenas `throw new Error(...)`), **DEVERÁ** ser omitida usando a sintaxe do ES2019:
    ```typescript
    try {
      // ...
    } catch { // Sem a variável 'error'
      throw new Error("Algo deu errado.");
    }
    ```

### 7. ❌ NonNull Assertion (`noNonNullAssertion`)

-   **Contexto:** O operador `!` (NonNull Assertion) força o TypeScript a tratar um valor como não-nulo ou não-indefinido, ignorando verificações de tipo. Isso pode levar a erros em tempo de execução.
-   **Diretriz:** Evite utilizar `!` para asserção não-nula, especialmente em acessos a elementos de arrays ou propriedades de objetos (ex: `array[0]!.id`). Em vez disso, prefira:
    -   **Validação explícita:** Verifique se o valor existe antes de usá-lo.
    -   **Optional Chaining:** Utilize `?.` (ex: `array[0]?.id`) quando o valor pode ser nulo/indefinido.
    -   **Função Auxiliar:** Para cenários onde a ausência do valor é uma condição de erro, crie uma função como `ensure()`:
        ```typescript
        function ensure<T>(value: T | undefined, message?: string): T {
          if (value == null) {
            throw new Error(message || "Valor inesperado nulo ou indefinido.");
          }
          return value;
        }

        // Uso:
        const id = ensure(meuArray[0], "Item não encontrado").id;
        ```

### 8. 📛 Nomes Restritos (`noShadowRestrictedNames`)

-   **Contexto:** O Biome impede a utilização de nomes de variáveis ou funções que sombreiam tipos globais ou palavras-chave JavaScript/TypeScript (ex: `Map`, `String`, `name`).
-   **Diretriz:** Renomeie a variável, função ou componente para algo único e descritivo que não entre em conflito com nomes restritos.
    -   Ex: Um componente chamado `Map` deve ser renomeado para `MapView` ou `CustomMap`.

### 9. 📋 Padrão de 3 Estados em Collections

Toda *collection* (rota App Router) que consome dados da API **DEVE** tratar obrigatoriamente três cenários:

1. **`isLoading`** → exibir `<LoadingSpinner />`
2. **`isError`** → exibir `<ErrorMessage />`
3. **Sucesso com dados vazios** → exibir `<EmptyState />`

```tsx
if (isLoading) return <LoadingSpinner />;
if (isError) return <ErrorMessage />;
if (!data || data.length === 0) return <EmptyState />;
return <Dados />;
```

#### 🔍 Mensagens de erro dinâmicas

Ao usar o padrão de 3 estados, **sempre desestruture `error`** do hook TanStack Query e passe `error?.message` para o `<ErrorMessage />`. Isso exibe mensagens reais da API (em Português) em vez de textos genéricos:

```tsx
const { data, isLoading, isError, error } = useMatches();

if (isError) {
  return <ErrorMessage message={error?.message || "Mensagem de fallback genérica."} />;
}
```

O `api-client.ts` já extrai `error.message` das respostas da API e também trata erros de rede com a mensagem: *"Servidor indisponível. Verifique sua conexão e tente novamente."*

#### 📄 Página 404

Crie o arquivo `apps/web/src/app/not-found.tsx` para rotas inexistentes. Siga o design system do projeto (rounded-3xl, shadow-sm, centralizado, SVG inline com `<title>`, texto em Português, link "Voltar para Home"). O componente pode ser um Server Component (sem `"use client"`) por ser estático.

### 10. 🏷️ Exibição Condicional de Placares

- Se o status da partida é `agendado`, nunca exiba `0 x 0`. Mostre apenas a letra **"X"** entre os times.
- `homeScore` e `awayScore` só são renderizados quando o status é `em_andamento` ou `encerrado`.

### 11. 🥇 Badges de Status de Partida

| Status | Cor | Texto | Extra |
|---|---|---|---|
| `agendado` | Cinza (`bg-gray-200`) | "Em Breve" | — |
| `em_andamento` | Verde (`bg-green-500`) | "Ao Vivo" | `animate-pulse` |
| `encerrado` | Azul (`bg-blue-500`) | "Encerrado" | — |

### 12. 🔄 Fallback de Imagens

Quando `logoUrl` (Evento) ou `flagUrl` (Time) forem `null`, renderize um círculo estilizado com a **primeira letra do nome** em destaque. Nunca quebre o layout ou exiba ícone de imagem quebrada.

### 13. 📱 Responsividade — Padrões Gerais

#### Tabela de Classificação

Em telas pequenas (`< sm`), oculte as colunas **GP** e **GC** com `hidden sm:table-cell` para priorizar pontos, saldo de gols e histórico. Use `overflow-x-auto` no container e `whitespace-nowrap` na tabela para permitir scroll horizontal quando necessário.

#### Padding e Fontes Responsivos

Use padding e fontes progressivos com breakpoints `sm:`, `md:`, `lg:` para evitar layouts espremidos em mobile:

```tsx
// Padding responsivo
<div className="p-4 sm:p-6 md:p-8">

// Fontes responsivas
<span className="text-xs sm:text-sm md:text-base">

// Tamanhos de elementos (escudos, logos, etc.)
<div className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20">
```

#### Grids Responsivos

- **Times:** `grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5` — 2 cols no mobile, até 5 em desktop.
- **Partidas:** `grid-cols-1 lg:grid-cols-2` — 1 coluna no mobile/tablet, 2 em desktop largo.

#### Header de Páginas

Use `flex-col md:flex-row` nos cabeçalhos de seção para empilhar em mobile e lado a lado em desktop, com `text-center sm:text-left` para alinhamento.

#### Viewport Height (`100dvh`)

Para layouts que ocupam a tela inteira (ex: mapa), prefira `100dvh` (dynamic viewport height) em vez de `100vh` para melhor comportamento em mobile com barra de URL dinâmica.

```tsx
<div className="min-h-[calc(100dvh-8rem)]"> {/* header h-16 + main py-8 */}
```

#### Menu Mobile (Header)

O Header possui um menu hambúrguer que alterna visibilidade via state `isOpen`. **Mantenha os links do menu mobile sempre sincronizados com o menu desktop** — ambos devem ter exatamente os mesmos itens de navegação.

### 14. 🗺️ Leaflet no Next.js (SSR)

- O componente de mapa (`DynamicMap`/`Map`) **DEVE** ser renderizado exclusivamente no cliente via `dynamic import` com `ssr: false`.
- O popup do mapa **não** deve acessar estado/distrito — o modelo `Venue` só possui `city`.
- Os caminhos nativos dos ícones de marcador do Leaflet **DEVEM** ser substituídos via CDN para evitar corrupção pelo bundler do Next.js.

### 15. 🎨 Convenções de Estilização (Tailwind)

- Bordas arredondadas: `rounded-2xl` ou `rounded-3xl`
- Sombras suaves: `shadow-sm`
- Cores de destaque: blue, green, emerald, yellow, gray
- Minimalismo, linhas limpas, sem excesso de adornos

### 16. 🔧 Ferramental

**Nenhuma** nova dependência de formatação/linting deve ser adicionada. O Biome cuida de tudo globalmente no monorepo.
