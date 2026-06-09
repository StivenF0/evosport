import { t } from "elysia";

export const TeamBody = t.Object({
  name: t.String({
    description: "Nome do time/seleção",
    examples: ["Brasil"],
  }),
  flagUrl: t.Optional(
    t.Nullable(
      t.String({
        description: "URL da imagem da bandeira do time",
        examples: ["https://example.com/flags/br.png"],
      }),
    ),
  ),
});

export const TeamResponse = t.Object({
  id: t.Number({ description: "ID único do time" }),
  name: t.String({ description: "Nome do time" }),
  flagUrl: t.Nullable(t.String({ description: "URL da bandeira do time" })),
});

export const TeamListResponse = t.Array(TeamResponse);
