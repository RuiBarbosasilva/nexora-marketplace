# NEXORA — Status de desenvolvimento

Atualizado em 2026-10-26.

## Estado confirmado no repositório

- Repositório privado; branch de implementação: `feat/core-foundation`.
- API Node.js 22+ com TypeScript estrito e Fastify.
- `GET /api/health`, resposta 404 padronizada e tratamento de erros internos sem devolver detalhes sensíveis.
- Limite de corpo de requisição, timeout, `trustProxy: false` e cabeçalhos Helmet configurados.
- Testes de health, 404 e sanitização de erro presentes no repositório.
- GitHub Actions configurado para instalar dependências, executar auditoria, type check, testes e build.
- Schemas iniciais de organizações e papéis de membros adicionados.
- Helper de política de acesso com testes para negar acesso cruzado entre organizações; não integrado à autenticação, banco ou rotas.
- Notebook principal `docs/NEXORA-NOTEBOOK.md` e proposta de persistência `docs/ADR-0002-PERSISTENCE.md` publicados.

## Alterações recentes

- `a1071af`: atualização de dependências diretas Zod e Vitest.
- `b363a1e`: auditoria de dependências adicionada ao pipeline CI.
- `e01bf4c`, `0db7893`, `2a46cc2`: schemas, helper de acesso e testes de organizações.
- `61d00d7`: notebook principal publicado.
- `8b5ded0`: proposta de persistência documentada.
- `5e06880`: README atualizado com links do notebook e ADR.
- `bc49256`: roadmap atualizado.

## Verificações e ressalvas

A última execução local conhecida confirmou type check, testes e build antes das últimas mudanças de dependências e dos testes de organização. Ainda não há evidência verificada nesta sessão de CI verde para o commit mais recente; a consulta disponível não retornou execuções de workflow associadas ao commit consultado.

A atualização de Zod e Vitest precisa ser confirmada com instalação limpa, lockfile atualizado e auditoria da árvore resolvida. Não usar `npm audit fix --force` sem avaliar mudanças incompatíveis. Não declarar segurança, CI ou build atuais como aprovados sem logs reais.

## Pendências imediatas

1. Consultar GitHub Actions e obter resultado real do pipeline.
2. Sincronizar a branch local sem sobrescrever arquivos locais; revisar o `package-lock.json` não versionado antes de regenerá-lo.
3. Executar em instalação limpa `npm audit`, `npm run check`, `npm test` e `npm run build`.
4. Confirmar a decisão de banco e hospedagem descrita em `docs/ADR-0002-PERSISTENCE.md`.
5. Implementar persistência e migrações de usuários, organizações e associações.
6. Implementar autenticação e autorização integrada às rotas, com testes ponta a ponta de isolamento multi-tenant.

## Limite do produto atual

NEXORA ainda é apenas a fundação técnica da API. Não existem autenticação funcional, banco de dados de negócio, lojas, produtos, pedidos, pagamentos, logística, afiliados operacionais ou SENTINEL implementados. Não está pronto para produção.
