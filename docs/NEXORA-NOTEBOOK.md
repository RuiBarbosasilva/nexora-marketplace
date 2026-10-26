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
