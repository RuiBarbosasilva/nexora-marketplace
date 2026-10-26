# NEXORA — Status de desenvolvimento

Atualizado em 2026-10-26.

## Estado confirmado

- Repositório privado e documentação inicial publicados.
- Branch de implementação: `feat/core-foundation`.
- API Node.js 22+ com TypeScript estrito e Fastify.
- `GET /api/health` implementado.
- Resposta 404 padronizada.
- Tratamento de erros internos sem devolver detalhes sensíveis ao cliente.
- Limite de corpo de requisição, timeout, `trustProxy: false` e cabeçalhos Helmet configurados.
- Testes de saúde, 404 e sanitização de erro adicionados.
- GitHub Actions executa instalação, auditoria de dependências, type check, testes e build.

- Schemas iniciais de organizações e papéis de membros adicionados.
- Helper de política de acesso com testes para negar acesso cruzado entre organizações; ainda não integrado a autenticação, banco ou rotas.

## Alterações recentes

- `21a2d6a`: correção de tipagem no handler de erros.
- `a1071af`: atualização das dependências diretas Zod e Vitest para versões que corrigem os avisos reportados pela auditoria local.
- `32e9cbf`: teste de não exposição de detalhes de erro interno.
- `b363a1e`: auditoria de dependências adicionada ao pipeline CI.
- `643b18a`: roadmap sincronizado com o estado real da fundação.

## Verificações e ressalvas

Antes da atualização de dependências, o ambiente local confirmou type check, 2 testes e build aprovados. A auditoria reportou vulnerabilidades em versões resolvidas de Vitest, `@vitest/mocker`, `tinypool` e Zod. As dependências diretas foram atualizadas no GitHub, mas essa atualização ainda precisa ser confirmada por uma instalação limpa e pela execução do CI.

Não declarar segurança ou CI como aprovados até haver execução verde no GitHub Actions. Não usar `npm audit fix --force` como substituto de revisão.

## Pendências imediatas

1. Confirmar CI no commit mais recente.
2. Gerar e versionar `package-lock.json` a partir de uma instalação limpa após atualizar a branch local.
3. Resolver qualquer incompatibilidade de Vitest 5 ou Zod 4 revelada pela execução real.
4. Definir e implementar persistência e migrações para organizações e membros.
5. Integrar autenticação e autorização à API; o helper atual isoladamente não protege rotas.
6. Atualizar o notebook principal do projeto com os commits, estado e próximos passos.

## Limite do produto atual

NEXORA ainda é apenas a fundação técnica da API. Não existem ainda autenticação, banco de dados de negócio, lojas, produtos, pedidos, pagamentos, logística, afiliados operacionais ou SENTINEL implementados. Esses itens continuam no roadmap.
