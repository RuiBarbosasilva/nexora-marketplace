# ADR-0001: Stack inicial do MVP

- **Estado:** proposta inicial implementada no scaffold; sujeita a revisão.
- **Data:** 2026-10-26.

## Decisão

Usar Node.js 22+, TypeScript com modo estrito, Fastify para HTTP, Zod para validação de configuração e Vitest para testes.

## Motivos

- TypeScript estrito reduz classes comuns de erros.
- Fastify fornece injeção de requisições para testes sem abrir uma porta de rede.
- Zod valida configuração de execução.
- Vitest permite testes automatizados simples.
- A API começa sem banco ou provedor externo obrigatório, reduzindo dependências no primeiro passo.

## Segurança inicial

- Limite de corpo HTTP.
- Timeout de requisição.
- Cabeçalhos de segurança por plugin.
- Bind local por padrão (127.0.0.1).
- Respostas de erro sem detalhes internos em produção.
- CI executa checagem de tipos, testes e build.

## Próximas decisões

Selecionar banco de dados e estratégia de migrações; autenticação e sessões; política de autorização multi-tenant; logging/observabilidade; gestão de segredos; provedor de pagamentos e logística. Essas decisões exigem requisitos e validação antes de produção.

## Limitações conhecidas

O endpoint de saúde confirma somente que o processo HTTP responde. Ainda não há persistência, autenticação, comércio, pagamento, logística nem monitoramento 24/7. O scaffold não está pronto para produção.
