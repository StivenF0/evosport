import { t } from 'elysia';

/**
 * Schema reutilizável para parâmetros de ID na URL.
 * O t.Numeric() converte automaticamente a string do parâmetro para number.
 */
export const IdParam = t.Object({
  id: t.Numeric({
    description: 'ID numérico do recurso'
  })
});

/**
 * Schema padrão para respostas de erro.
 */
export const ErrorResponse = t.Object({
  message: t.String({
    description: 'Mensagem detalhando o erro ocorrido'
  })
});
