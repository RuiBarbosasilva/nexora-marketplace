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
- Schemas iniciais de cadastro e resposta pública de usuário adicionados, com testes de normalização, validação e rejeição de campos extras.
- ADR-0002 documenta proposta de persistência PostgreSQL/Prisma, pendente de confirmação do ambiente.
- ADR-0003 documenta a proposta de autenticação baseada em sessões, ainda não implementada.
- Notebook principal `docs/NEXORA-NOTEBOOK.md` e documentação de usuários `docs/CORE-USERS.md` publicados.

## Alterações recentes

- `a1071af`: atualização de dependências diretas Zod e Vitest.
- `b363a1e`: auditoria de dependências adicionada ao pipeline CI.
- `e01bf4c`, `0db7893`, `2a46cc2`: schemas, helper de acesso e testes de organizações.
- `504587d`, `512ab09`, `f9b690f`: schemas de usuário, testes e documentação.
- `892dfda`: proposta de autenticação e sessões documentada.
- `b2787bf`: README atualizado com link da estratégia de autenticação.
- `87f7a4f`: roadmap atualizado.

## Endurecimento HTTP recente

- O handler de erros padroniza respostas 4xx e 5xx sem devolver a mensagem bruta da exceção.
- A política CSP padrão do Helmet está habilitada.
- Existe um teste dedicado para verificar cabeçalhos HTTP básicos; sua execução ainda precisa ser confirmada pelo CI.

## Ajuste de CI

- O workflow cancela execuções anteriores da mesma branch quando chega um novo commit e evita repetir a auditoria implícita durante `npm install`; a etapa explícita `npm audit --audit-level=high` continua ativa.
- O workflow ainda usa `npm install`, pois não foi localizado `package-lock.json` versionado. Isso não substitui a necessidade de criar e revisar um lockfile para builds reprodutíveis.

## Verificações e ressalvas

Os testes novos foram publicados no GitHub, mas não foram executados neste ambiente de trabalho remoto. A última execução local conhecida confirmou type check, testes e build antes das últimas mudanças de dependências e dos testes de organização. Ainda não há evidência verificada nesta sessão de CI verde para o commit mais recente.

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


## Atualização local reportada em 2026-10-26 — não confundir com CI

O usuário executou localmente, em Windows com Node.js 22.23.1/npm 10.9.8:
- TypeScript check: aprovado.
- Build: aprovado com limpeza de `dist` antes da compilação.
- Testes: 2 testes-fonte aprovados; `vitest.config.ts` exclui `dist/**`.
- Auditoria npm: zero vulnerabilidades após atualização de Vitest para `5.0.5` e Zod para `4.6.7`.

Essas alterações foram feitas localmente e ainda não há evidência de que todos os arquivos correspondentes tenham sido sincronizados com este branch remoto. O lockfile local e a configuração Vitest devem ser revisados antes de qualquer sincronização. Backups locais permanecem no computador do usuário e não devem ser removidos.

## Bloqueio de implementação Prisma

A Qwen relata dificuldade para criar/configurar Prisma. A mensagem de erro específica não foi fornecida; portanto, a causa ainda não está confirmada. No exame remoto mais recente, `prisma/schema.prisma` e `prisma.config.ts` não estavam presentes.

Foi adicionado o guia `docs/PRISMA-POSTGRESQL-TROUBLESHOOTING.md` com orientações para não misturar Prisma ORM 6 e 7, alinhar as versões de CLI/Client/adapter, configurar `DATABASE_URL` sem versionar segredos, validar schema e executar migrações apenas em banco de desenvolvimento.

**Próximo gate técnico:** obter a saída sanitizada do comando que falha e de `npx prisma -v`; confirmar versão e arquivos reais; executar `prisma validate` e `prisma generate`; aplicar migração e testes de integração somente quando houver PostgreSQL disponível. Não marcar persistência como concluída até haver evidências reais.

## Atualização de diagnóstico PostgreSQL/Prisma — 2026-10-26

Evidências informadas pelo usuário no Windows:
- Node.js v22.23.1, npm 10.9.8, Prisma CLI e @prisma/client 6.19.3.
- prisma generate concluiu com sucesso.
- prisma validate falha com P1012 porque DATABASE_URL não está definida.
- O .env local existe, mas declara somente NODE_ENV, HOST e PORT; o .env.example também não tinha DATABASE_URL.
- PostgreSQL 18 está instalado e o serviço está ativo; localhost:5432 aceita conexão TCP.
- Autenticação como postgres foi recusada por senha inválida; autenticação sem senha também falhou. Usuário/banco existentes ainda não foram listados.
- prisma/migrations ainda não existe.
- O script local de diagnóstico foi publicado em scripts/diagnose-local.ps1. Ele não imprime valores de ambiente, não cria banco e não executa migrações.
- .env.example agora documenta uma URL PostgreSQL local de exemplo com placeholder CHANGE_ME. Essa URL é apenas modelo e não configura o .env real nem prova conectividade.
- Não foram executadas migrações nem criados/modificados bancos durante este diagnóstico.

### Próximos passos

1. Confirmar credenciais locais válidas ou provisionar usuário e banco dedicados ao desenvolvimento com acesso administrativo autorizado.
2. Configurar DATABASE_URL apenas no .env local, nunca em commits.
3. Confirmar se o schema Prisma, dependências e infraestrutura estão versionados no branch; o cliente gerado localmente não comprova que o Prisma esteja configurado no GitHub.
4. Executar prisma validate e prisma generate; depois criar/aplicar migração inicial somente no banco de desenvolvimento confirmado.
5. Rodar type check, testes, build e CI e registrar resultados reais.
## GitHub reconciliation — 2026-10-26

Uma leitura direta do branch remoto `feat/core-foundation` confirmou que `package.json` não declara `prisma` nem `@prisma/client`, e os caminhos `prisma/schema.prisma`, `src/infrastructure/database/prisma.ts` e `tests/infrastructure/database.test.ts` retornam 404 no GitHub. Isso diverge do estado local reportado, no qual esses arquivos existem e `prisma generate` foi executado.

Consequência: a configuração Prisma local ainda não está sincronizada com o branch remoto. Não foi criado schema remoto por inferência, porque isso poderia sobrescrever ou divergir dos modelos locais. Antes de sincronizar, revisar os arquivos locais e o diff, manter backups e incluir dependências/lockfile coerentes.

O CI remoto atual executa npm install, npm audit, check, testes e build, mas não valida Prisma; o package.json remoto consultado não tem scripts de banco. O CI ainda não comprova persistência.

Bloqueio local continua: DATABASE_URL ausente no .env e credencial do usuário PostgreSQL postgres recusada. Nenhum banco/migração foi criado ou alterado.

## Atualização — serviço de organizações (2026-10-26)

- Adicionado `OrganizationService` com validação do ID do usuário autenticado, validação de entrada, detecção de slug existente e porta `OrganizationRepository`.
- A porta exige que a implementação real crie organização e associação OWNER em transação e imponha unicidade do slug no banco.
- Testes unitários adicionados usando repositório falso. Eles verificam lógica de domínio, não persistência real.
- **Ainda pendente:** adaptador PostgreSQL/Prisma, constraints/migração, rota HTTP, autenticação real e teste de integração com banco.
- Não marcar CI como aprovado até consultar a execução gerada por estes commits.


## NEXORA SENTINEL — baseline inicial (2026-10-26)

- Publicado `src/modules/sentinel/security-events.ts` com catálogo de eventos de segurança validado, severidade inicial, timestamp/UUID e buffer em memória limitado.
- Publicado `tests/sentinel.test.ts` cobrindo validação estrita, retenção, consulta, severidade e limpeza.
- Publicado `docs/SENTINEL-BASELINE.md` documentando o escopo e os limites.
- **Não confirmado:** execução dos novos testes, type check, build, auditoria e CI para o novo estado do branch.
- **Ainda pendente:** integração com requisições reais, persistência durável, alertas e endpoints protegidos. O buffer atual é volátil e não deve ser tratado como trilha de auditoria de produção.


## SENTINEL — integração inicial com erros HTTP (2026-10-26)

- O handler global de erros agora envia sinais sanitizados ao buffer SENTINEL: 4xx -> `INPUT_REJECTED`; 5xx -> `UNEXPECTED_ERROR`.
- O evento contém somente o tipo, a origem HTTP e o ID da requisição; não registra mensagem bruta da exceção nem corpo da requisição.
- Testes de integração adicionados em `tests/sentinel-http.test.ts`.
- **CI não validado:** as execuções recentes reportam falha sem passos iniciados (`steps: []`). Investigar a configuração/execução do GitHub Actions; não atribuir a falha aos testes sem logs.
- **Pendente:** persistência durável, consulta protegida, integração de autenticação/autorização/webhooks e alertas. O buffer permanece volátil.
