# NEXORA SENTINEL — baseline inicial

## Objetivo

Preparar a camada de monitoramento de segurança do NEXORA para receber sinais explícitos e rastreáveis de autenticação, autorização, abuso de API, integridade de webhooks e falhas inesperadas.

## Implementação publicada nesta etapa

O módulo `src/modules/sentinel/security-events.ts` fornece:

- Tipos de eventos validados por Zod e rejeição de propriedades extras.
- Severidade inicial atribuída por tipo de evento.
- Identificador UUID e timestamp ISO-8601 por evento.
- Buffer em memória limitado a 1–10.000 eventos, com descarte do evento mais antigo quando cheio.
- Consulta dos eventos mais recentes, contagem por tipo e limpeza explícita.
- Ausência deliberada de campos para corpo HTTP, senha, token, endereço IP ou metadados arbitrários.

Tipos iniciais: `AUTH_FAILURE`, `AUTH_RATE_LIMITED`, `ACCESS_DENIED`, `INPUT_REJECTED`, `WEBHOOK_SIGNATURE_INVALID`, `WEBHOOK_REPLAY`, `API_RATE_LIMITED` e `UNEXPECTED_ERROR`.

## Limitações importantes

- O buffer é volátil: reiniciar o processo apaga os eventos.
- O módulo ainda não está conectado automaticamente aos handlers HTTP, autenticação, autorização ou webhooks.
- Não existe ainda dashboard, alerta externo, retenção durável, controle de acesso de operadores ou proteção contra adulteração em armazenamento persistente.
- A classificação de severidade é uma regra inicial e precisa de revisão operacional.
- O módulo não substitui logs operacionais, rate limiting de borda, autenticação ou auditoria persistente.

## Critérios para a próxima etapa

1. Integrar eventos aos pontos reais de falha, evitando registrar segredos ou dados pessoais desnecessários.
2. Adicionar persistência append-only com acesso restrito e política de retenção.
3. Definir alertas para repetição de falhas de autenticação, abuso de API e assinaturas inválidas de webhook.
4. Exigir autenticação e autorização administrativa antes de expor consultas ou métricas SENTINEL.
5. Adicionar testes de integração e confirmar check, testes, build, auditoria e CI em execução real.

## Validação

Os testes automatizados do módulo estão em `tests/sentinel.test.ts`. A presença dos testes no GitHub não significa que foram executados com sucesso; consultar GitHub Actions para confirmar o resultado do commit.
