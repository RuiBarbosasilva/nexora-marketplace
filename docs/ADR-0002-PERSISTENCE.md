# ADR-0002: Persistência de dados do marketplace

- **Status:** Proposta; ainda não implementada.
- **Data:** 2026-10-26.

## Contexto

NEXORA precisa persistir usuários, organizações, associação usuário-organização e, futuramente, produtos, pedidos e transações. A autorização multi-tenant exige integridade referencial e consultas que sempre limitem os dados à organização autorizada. A camada atual contém apenas schemas e um helper puro, sem banco ou autenticação.

## Proposta

Adotar PostgreSQL como banco relacional principal e Prisma como camada de acesso/migrações, condicionada à confirmação de ambiente de hospedagem e estratégia de backup. Usar migrações versionadas e revisadas no repositório. Não usar SQLite como banco de produção do marketplace.

## Requisitos de modelagem

- IDs estáveis e chaves estrangeiras para relacionamentos.
- Unicidade de slug de organização e de associação `(organizationId, userId)`.
- Status de associação e papel armazenados no banco; o papel nunca pode ser confiado apenas ao payload do cliente.
- Consultas de negócio sempre filtradas pela organização validada no servidor.
- Transações para operações que alterem múltiplas entidades relacionadas.
- Restrições e índices coerentes com as consultas; evitar índices especulativos.
- Valores monetários representados com tipo decimal adequado, não ponto flutuante binário.
- Segredos e URLs de conexão apenas em variáveis de ambiente; nunca versionar `.env`.
- Estratégia de backup/restauração e migrações testadas antes de produção.

## Alternativas consideradas

- **SQLite:** útil para protótipo local, mas não escolhido como destino de produção para um marketplace multiusuário.
- **PostgreSQL com acesso SQL direto:** viável, mas exigiria padronizar manualmente consultas, mapeamento e migrações.
- **PostgreSQL + Prisma:** proposta para reduzir inconsistência entre schema e migrações e facilitar tipagem; requer revisão de queries e segurança, não elimina riscos automaticamente.

## Consequências

A implementação deverá acrescentar configuração validada, cliente de banco isolado, schema inicial, migração, testes de integração com banco real e instruções de ambiente. O CI atual não comprova integração com banco. Não criar modelos de pagamentos, pedidos ou afiliados antes de estabilizar identidade, organização e associação.

## Critérios para aceitar a decisão

1. Confirmar disponibilidade de PostgreSQL no ambiente de deploy e custos.
2. Fixar versões compatíveis de Prisma e driver.
3. Executar migração em banco descartável no CI.
4. Testar slug único, associação única, chaves estrangeiras e isolamento entre organizações.
5. Documentar backup, restauração e tratamento de falhas.


## Nota de implementação Prisma — adicionada em 2026-10-26

A implementação deve fixar uma única major do Prisma e seguir a documentação correspondente, sem combinar exemplos de versões diferentes. Se for adotado Prisma ORM 7:
- a URL de conexão deve ser configurada no arquivo de configuração do Prisma (por exemplo, `prisma.config.ts` ou o nome que a versão instalada detectar), não copiada de exemplos da major 6;
- o generator `prisma-client` precisa de `output` explícito;
- o caminho de importação do cliente deve corresponder ao `output`;
- a criação do cliente PostgreSQL deve usar o driver adapter compatível com as versões fixadas de `prisma` e `@prisma/client`.

A configuração exata deve ser confirmada com a versão instalada e a documentação oficial: https://www.prisma.io/docs/guides/upgrade-prisma-orm/v7 e https://www.prisma.io/docs/orm/v7/reference/prisma-config-reference.

O relato de falha da Qwen ainda não inclui a mensagem de erro, então a causa não está determinada. Antes de declarar a persistência implementada, registrar o resultado real de `prisma validate`, `prisma generate`, migrações em PostgreSQL de desenvolvimento e testes de integração. Sem banco disponível, registrar migração/testes de integração como pendentes, não aprovados.


## Implementação inicial no repositório — 2026-11-04

A branch `feat/postgres-prisma-core` introduz uma primeira implementação versionada:

- Prisma ORM 7.10.1, PostgreSQL e driver adapter `@prisma/adapter-pg` 7.10.1.
- `prisma/schema.prisma` com usuários, organizações e associações, incluindo unicidade de e-mail, slug e associação usuário-organização.
- Migração SQL inicial em `prisma/migrations/20261104000100_core_identity` e `migration_lock.toml`.
- `prisma.config.ts` com fallback local apenas para validação/geração sem banco; operações de migração continuam exigindo uma conexão real.
- Cliente singleton em `src/db/prisma.ts`, que falha explicitamente quando `DATABASE_URL` não está definida.
- Scripts de geração, validação e migração e etapas de geração/validação no CI.

**Limites não aprovados como concluídos:** a migração ainda não foi aplicada em PostgreSQL real; não há teste de integração com banco; o cliente ainda não foi conectado aos serviços de cadastro/organização; não há autenticação nem sessão. O CI desta branch precisa aprovar geração, validação, type check, testes e build antes de considerar a base compilável. Não executar `migrate dev` contra dados existentes sem backup e confirmação explícita.
