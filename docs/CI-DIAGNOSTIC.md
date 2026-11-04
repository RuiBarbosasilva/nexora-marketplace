# NEXORA — Diagnóstico do CI e próximos passos

Atualizado em 2026-10-26. Branch analisada: `feat/core-foundation`.

## Evidências verificadas no GitHub

- Workflow: `.github/workflows/ci.yml`.
- O pipeline declara checkout, configuração de Node.js 22, instalação via `npm install --no-audit --no-fund`, `npm audit --audit-level=high`, `npm run check`, `npm test` e `npm run build`.
- A execução mais recente consultada (run 84, commit `9fb152d8d847e88dfc926c0c58d4668a54306dd0`) terminou com `failure`.
- O job `validate` aparece concluído com falha, mas a API de etapas retornou uma lista vazia (`steps: []`). A tentativa de obter logs também não forneceu logs utilizáveis.
- `package-lock.json` e `vitest.config.ts` não foram encontrados na branch consultada.
- O repositório não declara Prisma nem `@prisma/client` no `package.json` remoto verificado anteriormente; a configuração Prisma local relatada não está comprovadamente sincronizada com este branch.

## Interpretação correta

Uma falha sem etapas registradas não permite atribuir a causa ao TypeScript, Vitest, npm audit ou build. Pode ser uma falha de inicialização/infraestrutura do runner ou falta de logs acessíveis; a causa exata permanece desconhecida. Execuções canceladas podem decorrer da política `cancel-in-progress: true`, mas isso não explica, por si só, os jobs concluídos como `failure`.

## Próximo procedimento seguro

1. Abrir a execução no GitHub Actions e verificar o resumo completo, anotações e disponibilidade de logs.
2. Disparar uma nova execução isolada após confirmar se a execução anterior foi iniciada por runner válido.
3. Quando houver logs, corrigir a primeira falha real, sem desabilitar `npm audit` e sem ignorar testes.
4. Adicionar e revisar um lockfile coerente com as dependências antes de trocar `npm install` por `npm ci`.
5. Sincronizar a configuração Vitest somente depois de revisar a versão local e o diff, evitando sobrescrever arquivos de trabalho locais.
6. Só registrar CI verde depois de observar check, testes, build e auditoria aprovados no commit atual.

## Situação de produto

A fundação HTTP, contratos/schemas de usuário e organização, serviços de domínio e baseline SENTINEL estão publicados. Persistência PostgreSQL/Prisma real, migrações, autenticação/sessões, rotas de cadastro protegidas e isolamento multi-tenant integrado continuam pendentes. Não considerar o produto pronto para produção.

## Evidência adicional do job 87

A consulta direta do job da execução 87 confirmou:
- `runner_id: 0`;
- `runner_name: ""`;
- `labels: ["ubuntu-latest"]`;
- `steps: []`;
- o job foi criado e marcado como concluído em cerca de dois segundos, sem runner atribuído.

Isso torna a falha anterior às etapas do workflow a hipótese mais consistente. Não é evidência de falha de TypeScript, testes, build ou auditoria. Como o runner não foi atribuído, alterar o código de aplicação não corrige a causa observada. A verificação seguinte deve ser feita nas configurações/estado do GitHub Actions do repositório e na disponibilidade de runners hospedados; essas configurações não podem ser alteradas por um commit comum no código.


## Retomada e nova execução — 2026-11-04

- A branch remota agora contém `vitest.config.ts` (commit `4954949571a618f98a45653adb9ee3e9961d63a1`), com descoberta limitada a `tests/**/*.test.ts` e exclusão de `dist/**`, `backups/**` e `node_modules/**`.
- Nova execução CI 41922948107 foi criada para esse commit e estava `queued` na consulta; resultado ainda não disponível.
- A execução anterior 40394911338 (run 91) terminou em falha com `runner_id: 0`, `runner_name: ""` e `steps: []`. A evidência aponta para falha anterior à execução das etapas, não para erro identificado no código.
- `package-lock.json` segue ausente. Não mudar o workflow para `npm ci` antes de versionar um lockfile real e coerente.
- Persistência Prisma segue fora da branch remota: não há schema, configuração, dependências ou migrações Prisma confirmadas.
- Próximo gate: aguardar/consultar run 41922948107; se houver runner e logs, corrigir a primeira falha real. Depois sincronizar lockfile e Prisma a partir dos arquivos locais revisados, sem sobrescrever alterações ou backups.


## Resultado confirmado — 2026-11-04

- Execução GitHub Actions: [run 95](https://github.com/RuiBarbosasilva/nexora-marketplace/actions/runs/41923061991).
- Commit validado: `5e0abe3c97ea0adda0c6e41d04631477e847a778` (`fix(sentinel): cap default recent-event query to buffer size`).
- Resultado final: **success**.
- Etapas observadas como concluídas com sucesso: instalação de dependências, auditoria de dependências, TypeScript check, testes e build.
- O job `validate` recebeu runner e executou as etapas; portanto, a falha anterior por ausência de runner não se reproduziu nesta execução.
- A validação comprova o estado do código neste commit; não comprova persistência Prisma/PostgreSQL, pois schema, configuração, dependências e migrações Prisma continuam ausentes da branch.
- `vitest.config.ts` está versionado. `package-lock.json` continua ausente; o workflow permanece em `npm install`, sem trocar para `npm ci` até existir lockfile revisado.
