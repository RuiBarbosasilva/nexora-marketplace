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
- Schemas iniciais de cadastro de usuário e de resposta pública; e-mail normalizado, nome validado, senha com tamanho mínimo/máximo e rejeição de propriedades extras.
- Testes para os contratos de usuário; ainda aguardam execução automatizada confirmada.
- ADR-0002: proposta de persistência com PostgreSQL e Prisma, aguardando confirmação do ambiente de deploy.
- ADR-0003: proposta de autenticação com sessões opacas no servidor, cookies protegidos, hash de senha, recuperação de conta e mitigação de abuso; ainda não implementada.
- Documentação de arquitetura, threat model, resposta a incidentes, roadmap, ADRs, estado de desenvolvimento, usuários e organizações.

## Commits de referência

- `21a2d6ad3156823600ce6f16ac05007666d04445` — correção de tipagem do handler de erro.
- `a1071af462b09872ad13246666cf7ebd47944d80` — atualização de Zod e Vitest.
- `32e9cbf5ef06447cccf8e3f7d4e0c837f289ddfb` — teste de sanitização de erro.
- `b363a1eff8524d723c6de75afcd14a4b8683180b` — gate de auditoria no CI.
- `e01bf4c3db69b5e5ce86c4012b4b3b1dee3687a0` — schemas de organização.
- `0db7893edbe10bbedbded847ee0b44e21abc3c2a` — helper de acesso.
- `2a46cc2a679c35544535b9c8997663946f2fa114` — testes da política de acesso.
- `504587d098d4f9d5d0f86ba5e7eba2889baa39e6` — schemas de usuário.
- `512ab0960ed99acfc2b04ef8c9da831488e74b3c` — testes dos schemas de usuário.
- `f9b690f2ab3240581183afdc181d0a9adc82c082` — documentação de usuários.
- `892dfda83684f4cb5b993dbc26ee862810d3508a` — proposta de autenticação.
- `1c169edb15d641059b0f2d1e5bb87ea00a948325` — status atualizado.

## Atualização de segurança — 2026-10-26

- Commit `b0e3a93`: padroniza mensagens de erro 4xx/5xx para não devolver texto bruto de exceções.
- Commit `dcae4f5`: reativa a política CSP padrão do Helmet.
- Commit `ca919af`: adiciona teste dedicado aos cabeçalhos HTTP básicos do Helmet.
- Validação dos commits acima ainda depende de execução confirmada no GitHub Actions ou no ambiente local.

## Continuação — validação segura

- Adicionado `docs/LOCAL-VALIDATION-CHECKLIST.md` com comandos PowerShell para validar a branch local sem sobrescrever alterações e confirmar auditoria, tipos, testes e build.
- A API e os testes de segurança foram publicados, mas a execução ainda não foi confirmada. O `package-lock.json` não foi encontrado no branch; validar dependências e lockfile continua sendo prioridade.

## Prompt Master para execução assistida por Qwen

- Criado `docs/PROMPT-MASTER-QWEN.md`, com instruções para auditar o repositório real, preservar mudanças locais, implementar em fases, validar dependências/CI, persistência, autenticação, isolamento multi-tenant e módulos comerciais.
- O prompt exige resultados verificáveis e proíbe declarar testes/integrações como concluídos sem execução real.
- Referência: branch `feat/core-foundation`; commit do prompt `940b6e62b0b6c679b9af00b36f5bfc6793d396c9`.

## Pendências prioritárias

1. Verificar o resultado real do GitHub Actions no branch e corrigir falhas.
2. Atualizar a cópia local com cuidado e gerar `package-lock.json` usando a versão atual de `package.json`; não aproveitar um lockfile antigo sem validação.
3. Confirmar `npm audit`, `npm run check`, `npm test` e `npm run build` em instalação limpa.
4. Confirmar a estratégia de persistência documentada em `docs/ADR-0002-PERSISTENCE.md`.
5. Implementar persistência de usuários, organizações e associações com restrições de unicidade e integridade.
6. Implementar autenticação real conforme `docs/ADR-0003-AUTHENTICATION.md`.
7. Integrar autorização às rotas e adicionar testes ponta a ponta de isolamento entre organizações.
8. Só então construir CRUD de organizações e catálogo/produtos.

## O que ainda NÃO existe

Autenticação funcional, banco de dados de negócio, migrações aplicadas, organizações persistidas, lojas, produtos, pedidos, pagamentos, logística, afiliados operacionais e NEXORA SENTINEL. A fundação atual não deve ser apresentada como marketplace funcional ou seguro para produção.

## Links

- Branch: https://github.com/RuiBarbosasilva/nexora-marketplace/tree/feat/core-foundation
- Status: https://github.com/RuiBarbosasilva/nexora-marketplace/blob/feat/core-foundation/docs/DEVELOPMENT-STATUS.md
- Roadmap: https://github.com/RuiBarbosasilva/nexora-marketplace/blob/feat/core-foundation/docs/ROADMAP.md
- Notebook: https://github.com/RuiBarbosasilva/nexora-marketplace/blob/feat/core-foundation/docs/NEXORA-NOTEBOOK.md
- Usuários: https://github.com/RuiBarbosasilva/nexora-marketplace/blob/feat/core-foundation/docs/CORE-USERS.md
- Organizações: https://github.com/RuiBarbosasilva/nexora-marketplace/blob/feat/core-foundation/docs/CORE-ORGANIZATIONS.md
- Autenticação: https://github.com/RuiBarbosasilva/nexora-marketplace/blob/feat/core-foundation/docs/ADR-0003-AUTHENTICATION.md
- CI: https://github.com/RuiBarbosasilva/nexora-marketplace/blob/feat/core-foundation/.github/workflows/ci.yml


## Atualização local e bloqueio de Prisma — 2026-10-26

### Validação local informada pelo usuário

A execução local em `C:\\nexora-marketplace` informou:
- Node.js `v22.23.1`, npm `10.9.8`.
- `npm run check`: aprovado.
- `npm run build`: aprovado após limpar `dist`.
- `npm test`: 1 arquivo de teste-fonte e 2 testes aprovados; Vitest configurado para não executar `dist/tests`.
- `npm audit`: zero vulnerabilidades após atualização para Vitest `5.0.5` e Zod `4.6.7`.
- Alterações locais pendentes reportadas: `package.json`, `vitest.config.ts`, `package-lock.json` e diretório `backups/`. Elas não devem ser consideradas sincronizadas com o repositório remoto até revisão e commit/push autorizado.

### Problema de Prisma

A Qwen começou a implementação, mas o usuário relata dificuldades para criar/configurar Prisma. O erro exato ainda não foi fornecido. No último exame remoto, `prisma/schema.prisma` e `prisma.config.ts` não existiam; isso descreve o estado do branch remoto consultado, não necessariamente o estado atual do computador local.

Foi criado `docs/PRISMA-POSTGRESQL-TROUBLESHOOTING.md` com uma sequência compatível com a configuração do Prisma ORM 7, diagnóstico de erros comuns, critérios de validação e regras para não expor credenciais nem destruir dados.

### Próxima sequência obrigatória

1. No computador local, inspecionar o estado atual sem descartar mudanças: `git status --short --branch`.
2. Capturar o erro exato do Prisma e a saída de `npx prisma -v`, `npm ls prisma @prisma/client @prisma/adapter-pg pg`, sem exibir `.env` nem a URL do banco.
3. Conferir se `prisma`, `@prisma/client`, adapter, generator, schema e config pertencem à mesma major e seguem a documentação oficial dessa versão.
4. Validar o schema, gerar o cliente e só executar migrações quando houver PostgreSQL de desenvolvimento acessível.
5. Rodar check, testes, build e auditoria; registrar o resultado real.
6. Revisar as mudanças locais e sincronizar lockfile, configuração Vitest e scripts de build no branch de trabalho somente após confirmar o diff. Não sobrescrever arquivos locais nem enviar segredos.
7. Implementar persistência real de usuários, organizações e associações antes de avançar para lojas e catálogo.

Referência de troubleshooting: [PRISMA-POSTGRESQL-TROUBLESHOOTING.md](./PRISMA-POSTGRESQL-TROUBLESHOOTING.md).

**Limite:** testes locais informados pelo usuário validam a fundação atual; não comprovam Prisma funcional, migrações aplicadas, conexão PostgreSQL ou CI verde.

## Atualização de execução local — PostgreSQL/Prisma (2026-10-26)

- Ambiente reportado: Windows, Node.js v22.23.1, npm 10.9.8, Prisma CLI e client 6.19.3.
- prisma generate foi concluído com sucesso na máquina local.
- prisma validate está bloqueado porque a variável DATABASE_URL não está configurada no .env.
- O serviço PostgreSQL 18 está ativo e a porta local 5432 responde, mas a senha fornecida para postgres foi recusada. Nenhuma senha foi redefinida.
- Ainda não foi confirmada a lista de bancos/roles, não existe pasta prisma/migrations local segundo a verificação reportada e nenhuma migração foi executada.
- GitHub recebeu .env.example com placeholder de conexão local (não é uma credencial válida) e scripts/diagnose-local.ps1, que verifica ambiente e executa checks sem revelar valores de .env; não cria banco nem executa migrações.
- O cliente gerado na máquina local não significa que o schema e as dependências Prisma estejam commitados no branch remoto. A conferência do branch e a sincronização das alterações locais continuam pendentes.
- Próximo gate: obter acesso autorizado ao PostgreSQL ou criar credenciais dedicadas de desenvolvimento; definir DATABASE_URL somente no .env local; validar o schema e confirmar dependências/arquivos no branch antes de migrar.
## Conferência direta do branch remoto — 2026-10-26

Na branch remota `feat/core-foundation`, `package.json` ainda não declara `prisma` nem `@prisma/client`; `prisma/schema.prisma`, `src/infrastructure/database/prisma.ts` e `tests/infrastructure/database.test.ts` não foram encontrados no GitHub (404). Esses caminhos foram reportados como existentes localmente. Há divergência local/remoto que deve ser reconciliada por revisão de diff e commit seguro, não por reconstrução especulativa de schema.

O workflow CI atual valida auditoria, TypeScript, testes e build, mas não valida schema nem conexão de banco. O PostgreSQL local está ativo, mas `DATABASE_URL` não foi configurada e a autenticação `postgres` falhou. Não foram executadas migrações nem alterados bancos.

Próxima ação: revisar e sincronizar os arquivos locais reais de Prisma e lockfile no branch, confirmar dependências alinhadas com Prisma 6.19.3, então configurar uma credencial de desenvolvimento autorizada e validar o schema antes de criar migrações.

## Continuação de desenvolvimento — serviço de organizações

- Commit `ffbaa15`: criado `src/modules/core/organization.service.ts`, uma camada de serviço com porta de persistência injetável para criação de organizações.
- O serviço valida a identidade autenticada separadamente do payload, valida os dados com o schema existente, rejeita slug já utilizado e delega a criação da organização + associação OWNER a uma operação de repositório que deve ser transacional.
- Commit `7d90912`: adicionados testes unitários do serviço para criação, identidade inválida, payload inválido, slug duplicado e corrida de unicidade reportada pela persistência.
- Limite explícito: ainda não há adaptador PostgreSQL/Prisma nem rota HTTP ligada a este serviço; o teste usa repositório falso e não comprova persistência real. O adaptador deve aplicar constraint UNIQUE no slug e criar organização + associação OWNER na mesma transação.
- Validação remota pendente: os commits foram publicados diretamente na branch `feat/core-foundation`; consultar o novo resultado do GitHub Actions antes de considerar check/test/build aprovados.


## NEXORA SENTINEL — primeira base de eventos (2026-10-26)

- Criado `src/modules/sentinel/security-events.ts`: catálogo tipado de eventos de segurança, validação estrita com Zod, severidade por tipo, IDs UUID, timestamps ISO, contagem e consulta de eventos recentes.
- O buffer é limitado (1–10.000 eventos) e remove o evento mais antigo quando atinge o limite. O contrato não aceita campos extras, evitando anexar acidentalmente senhas, tokens, corpos de requisição ou metadados livres.
- Criado `tests/sentinel.test.ts` com testes para validação, severidade, retenção limitada, cópias defensivas, timestamp inválido e limpeza.
- Criado `docs/SENTINEL-BASELINE.md` com escopo, limites e critérios para a próxima etapa.
- Publicação feita na branch `feat/core-foundation`; os arquivos e testes foram enviados ao GitHub. A execução de CI deste commit ainda deve ser consultada antes de declarar os testes aprovados.
- **Limites:** armazenamento apenas em memória; não há integração automática com handlers HTTP, autenticação, autorização ou webhooks; não há alertas externos nem auditoria persistente. Não é uma implementação pronta para produção.
- Próxima etapa: consultar o CI e integrar eventos aos pontos reais de falha sem armazenar dados sensíveis; depois definir armazenamento append-only e acesso administrativo protegido.


## SENTINEL — integração inicial com o handler HTTP (2026-10-26)

- O buffer de eventos agora é exportado como singleton de processo limitado a 1.000 entradas.
- `src/app.ts` registra eventos `INPUT_REJECTED` para erros 4xx lançados por handlers e `UNEXPECTED_ERROR` para erros 5xx, incluindo apenas o ID da requisição e a origem HTTP.
- A gravação do SENTINEL fica protegida por tratamento de falha para que um erro do monitor não impeça a resposta HTTP sanitizada.
- Criado `tests/sentinel-http.test.ts` para verificar que erros 4xx/5xx geram eventos e que detalhes internos continuam fora da resposta.
- CI observado após os commits retornou `failure` com `steps: []`; não há evidência de que a execução tenha iniciado as etapas de instalação/check/test/build. A causa operacional do CI permanece por investigar. Portanto, não declarar os testes aprovados.
- Limites permanecem: memória volátil, sem endpoint de consulta, sem persistência durável e sem integração automática de eventos de autenticação, autorização ou webhooks.


## CORE — serviço de cadastro de usuário (2026-10-26)

- Adicionado `src/modules/core/user.service.ts`, com validação de entrada, normalização de e-mail, verificação prévia de duplicidade, hash por interface injetada e resposta pública explícita.
- O serviço não passa senha em texto puro ao repositório e não devolve `passwordHash`.
- Adicionado `tests/user-service.test.ts` para entrada inválida, normalização, duplicidade, hash e proteção da resposta pública.
- Adicionado `docs/CORE-USER-SERVICE.md` registrando o contrato e os limites.
- **Não pronto para produção:** faltam implementação de hash com parâmetros revisados, repositório PostgreSQL/Prisma, constraint única no banco, verificação de e-mail, proteção contra abuso e fluxo de sessão/autenticação. Nenhuma rota pública de cadastro foi aberta.
- **Validação pendente:** GitHub Actions continua retornando falha em jobs sem etapas registradas. Os testes não devem ser considerados aprovados até que o CI seja executado normalmente.

## Continuidade — CI e sincronização (2026-10-26)

- Publicado `docs/CI-DIAGNOSTIC.md` com evidências do CI e recuperação segura.
- Atualizado `docs/DEVELOPMENT-STATUS.md`: a execução mais recente falhou com `steps: []` e logs não utilizáveis; causa ainda não determinada.
- A branch remota consultada não contém `package-lock.json` nem `vitest.config.ts`. Revisar arquivos locais e diffs antes de sincronizar, sem apagar backups.
- Não foi feita alteração de banco de dados nem criada migração nesta etapa. A configuração Prisma local reportada não está comprovadamente sincronizada com o branch remoto.
- Próximo gate: obter execução/logs utilizáveis do CI e resolver a causa real; depois sincronizar configuração e lockfile revisados. Só então avançar para persistência real e migrações.

### Evidência do runner GitHub Actions — 2026-10-26

A execução 87 foi inspecionada diretamente: job `validate`, `runner_id: 0`, `runner_name` vazio e `steps: []`, concluído em aproximadamente dois segundos. A falha acontece antes de executar os comandos do workflow; não atribuir aos testes nem ao código da aplicação. Consultar a configuração/estado do GitHub Actions e a disponibilidade de runner hospedado. Essa configuração não é corrigível apenas alterando arquivos de aplicação. Detalhes em `docs/CI-DIAGNOSTIC.md`.

## Testes adicionais de isolamento de organizações — 2026-10-26

- Commit `a8f56c6`: criado `tests/organization-access.test.ts` com cobertura para associação ausente/inativa, usuário divergente, organização divergente, allowlist de papéis e allowlist vazia.
- Os testes foram publicados no branch `feat/core-foundation`; não foram executados nesta sessão. A execução válida depende de CI com runner atribuído ou validação local.
- O helper continua sendo uma política pura: não substitui autenticação, consulta de associação persistida, nem autorização integrada às rotas.


## Atualização de execução — 2026-11-04

- GitHub Actions run 95: https://github.com/RuiBarbosasilva/nexora-marketplace/actions/runs/41923061991
- Commit validado: `5e0abe3c97ea0adda0c6e41d04631477e847a778` — `fix(sentinel): cap default recent-event query to buffer size`.
- Resultado final do pipeline: **success**. Instalação, auditoria de dependências, type check, testes e build foram concluídos com sucesso.
- A branch agora contém `vitest.config.ts`; o arquivo `package-lock.json` ainda não está presente.
- O pipeline verde valida somente a fundação TypeScript/Fastify/SENTINEL deste commit. Não significa que o marketplace esteja pronto nem que Prisma, PostgreSQL, autenticação ou módulos comerciais estejam implementados.
- Próximo gate técnico: gerar e revisar o lockfile no ambiente local; em seguida sincronizar a configuração Prisma compatível com a versão efetivamente instalada, adicionar schema/migrações e validar com PostgreSQL de desenvolvimento. Não inventar URL/credenciais nem declarar migração aplicada sem banco acessível.


## Continuidade — PostgreSQL e Prisma (2026-11-04)

Foi criada a branch isolada `feat/postgres-prisma-core`, baseada na fundação aprovada `feat/core-foundation`, para implementar a primeira camada de persistência sem alterar a branch base.

Arquivos adicionados/alterados: `package.json` (Prisma ORM 7.10.1, adapter PostgreSQL e scripts), `prisma/schema.prisma`, `prisma.config.ts`, `src/db/prisma.ts`, migração SQL inicial e CI para gerar/validar Prisma.

Modelos: User, Organization e OrganizationMembership. Constraints: e-mail único, slug único, associação única por organização/usuário, índices de status e FKs com exclusão em cascata para associação.

Atenção: migration ainda não aplicada; banco PostgreSQL real não foi conectado; persistência ainda não foi integrada aos serviços; autenticação continua fora do escopo desta entrega. A execução CI da nova branch é o próximo gate obrigatório. Não afirmar que a camada está operacional até CI verde e testes de integração em PostgreSQL real.
