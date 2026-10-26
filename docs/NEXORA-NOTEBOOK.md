# NEXORA Marketplace — Notebook principal

Atualizado em: 2026-10-26  
Repositório: https://github.com/RuiBarbosasilva/nexora-marketplace  
Branch de trabalho: `feat/core-foundation`  
Estado: fundação técnica em desenvolvimento; não pronta para produção.

## Regras de trabalho

- Este projeto é separado do Sale-IA v2.
- Desenvolver na branch `feat/core-foundation`; não mesclar em `main` sem revisão explícita.
- Não declarar CI, testes, segurança ou prontidão como aprovados sem evidência executada.
- Não adicionar credenciais reais, tokens ou segredos ao repositório.
- Toda autorização deve validar usuário, associação ativa e organização no servidor; o helper puro existente não substitui autenticação.
- Atualizar este notebook e `docs/DEVELOPMENT-STATUS.md` após mudanças relevantes.

## Visão do produto

Marketplace para pequenos vendedores e fabricantes, com lojas próprias, catálogo, pedidos, análise de margem/lucro, afiliados com comissão vinculada a vendas reais, integrações futuras de pagamento e logística, ferramentas de marketing com IA e monitoramento NEXORA SENTINEL. A ordem e os requisitos detalhados estão em `docs/ROADMAP.md`.

## Stack publicada

- Node.js 22+
- TypeScript em modo estrito
- Fastify
- Zod para validação
- Vitest para testes
- GitHub Actions para auditoria, type check, testes e build

## O que já está no GitHub

- API inicial com `GET /api/health`.
- Cabeçalhos Helmet, limite de corpo, timeout e `trustProxy: false`.
- Resposta 404 padronizada e erro interno sem detalhes sensíveis ao cliente.
- Testes de health, 404 e sanitização de erros.
- Workflow CI com `npm audit --audit-level=high`, type check, testes e build.
- Dependências diretas Zod e Vitest atualizadas; falta confirmar a árvore resolvida com lockfile e CI.
- Schemas de organização: tipos `SELLER`, `MANUFACTURER`, `HYBRID`; status; slug; papéis `OWNER`, `ADMIN`, `MANAGER`, `MEMBER`, `VIEWER`.
- Helper de política de acesso e testes para rejeitar acesso cruzado entre organizações, usuário divergente, associação inativa e papel insuficiente.
- Documentação de arquitetura, threat model, resposta a incidentes, roadmap, ADR da stack, estado de desenvolvimento e regras de organizações.

## Commits de referência

- `21a2d6ad3156823600ce6f16ac05007666d04445` — correção de tipagem do handler de erro.
- `a1071af462b09872ad13246666cf7ebd47944d80` — atualização de Zod e Vitest.
- `32e9cbf5ef06447cccf8e3f7d4e0c837f289ddfb` — teste de sanitização de erro.
- `b363a1eff8524d723c6de75afcd14a4b8683180b` — gate de auditoria no CI.
- `e01bf4c3db69b5e5ce86c4012b4b3b1dee3687a0` — schemas de organização.
- `0db7893edbe10bbedbded847ee0b44e21abc3c2a` — helper de acesso.
- `2a46cc2a679c35544535b9c8997663946f2fa114` — testes da política de acesso.
- `d06bdf58783bc0f714d0e9b536b02581402a95df` — documentação de organizações.
- `6d4d1cde460f77808d58f9e082398c555d9be297` — estado de desenvolvimento.

## Pendências prioritárias

1. Verificar o resultado real do GitHub Actions no branch e corrigir falhas.
2. Atualizar a cópia local com cuidado e gerar `package-lock.json` usando a versão atual de `package.json`; não aproveitar um lockfile antigo sem validação.
3. Confirmar `npm audit`, `npm run check`, `npm test` e `npm run build` em instalação limpa.
4. Decidir a persistência antes de criar modelos e migrações. A proposta a avaliar está em `docs/ADR-0002-PERSISTENCE.md`.
5. Implementar persistência de usuários, organizações e associações com restrições de unicidade e integridade.
6. Implementar autenticação real e autorização por organização nas rotas; testes negativos de tenant isolation são obrigatórios.
7. Só então construir CRUD de organizações e, depois, catálogo/produtos.
8. Manter atualizados roadmap, status e este notebook.

## O que ainda NÃO existe

Autenticação funcional, banco de dados de negócio, migrações aplicadas, organizações persistidas, lojas, produtos, pedidos, pagamentos, logística, afiliados operacionais e NEXORA SENTINEL. A fundação atual não deve ser apresentada como marketplace funcional ou seguro para produção.

## Links

- Branch: https://github.com/RuiBarbosasilva/nexora-marketplace/tree/feat/core-foundation
- Status: https://github.com/RuiBarbosasilva/nexora-marketplace/blob/feat/core-foundation/docs/DEVELOPMENT-STATUS.md
- Roadmap: https://github.com/RuiBarbosasilva/nexora-marketplace/blob/feat/core-foundation/docs/ROADMAP.md
- Organizações: https://github.com/RuiBarbosasilva/nexora-marketplace/blob/feat/core-foundation/docs/CORE-ORGANIZATIONS.md
- CI: https://github.com/RuiBarbosasilva/nexora-marketplace/blob/feat/core-foundation/.github/workflows/ci.yml
