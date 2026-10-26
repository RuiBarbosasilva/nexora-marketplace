# Prisma/PostgreSQL — guia de implementação e diagnóstico local

Atualizado em: 2026-10-26  
Projeto: NEXORA Marketplace  
Branch de trabalho: `feat/core-foundation`

## Estado confirmado

A validação local informada em 2026-10-26 passou com Node.js 22.23.1, npm 10.9.8, TypeScript, build limpo, 2 testes-fonte e `npm audit` sem vulnerabilidades. Isso valida a fundação anterior, não valida Prisma nem uma conexão PostgreSQL.

O repositório ainda não tinha `prisma/schema.prisma` nem `prisma.config.ts` no último exame remoto. O erro exato da Qwen ainda precisa ser capturado do terminal; não se deve inventar a causa.

## Decisão técnica antes de instalar

Não misturar exemplos de Prisma ORM 6 e 7. A configuração muda entre versões.

Para Prisma ORM 7:
- Fixar a mesma versão exata para `prisma` e `@prisma/client`; selecionar e registrar também versões compatíveis de `@prisma/adapter-pg`, `pg` e `@types/pg`.
- O gerador recomendado é `provider = "prisma-client"` e exige `output` explícito.
- O bloco `datasource db` do schema contém `provider = "postgresql"`; a URL de conexão é definida em `prisma.config.ts`, não no schema.
- O cliente gerado deve ser importado do caminho configurado, não presumido como `@prisma/client`.
- A inicialização do cliente usa o driver adapter PostgreSQL compatível com a versão escolhida.
- Usar `import "dotenv/config"` no arquivo de configuração e obter `DATABASE_URL` do ambiente; nunca imprimir o valor.
- Prisma ORM 7.10+ pode gerar `prisma7.config.ts`; seguir o nome e a sintaxe documentados pela versão efetivamente instalada.

Referências oficiais:
- Configuração Prisma v7: https://www.prisma.io/docs/orm/v7/reference/prisma-config-reference
- Guia de migração v7: https://www.prisma.io/docs/guides/upgrade-prisma-orm/v7
- Adicionar Prisma a projeto existente: https://www.prisma.io/docs/v7/prisma-orm/add-to-existing-project/prisma-postgres
- Referência de schema v7: https://www.prisma.io/docs/orm/v7/reference/prisma-schema-reference

## Sequência segura para Qwen

1. Executar `git status --short --branch` e preservar todas as alterações.
2. Registrar `node --version`, `npm --version`, `npm ls prisma @prisma/client @prisma/adapter-pg pg` e `npm ls --depth=0`. Se pacote estiver ausente, registrar isso; não mascarar falhas.
3. Escolher explicitamente Prisma ORM 7 ou 6 antes de escrever os arquivos. Não copiar pedaços de tutoriais de majors diferentes.
4. Instalar as dependências compatíveis sem `--force`; atualizar `package-lock.json` e confirmar que os pacotes diretos `prisma` e `@prisma/client` usam a mesma versão.
5. Criar schema mínimo real para `User`, `Organization` e `OrganizationMember`, com IDs, e-mail normalizado único, slug único, chaves estrangeiras, unicidade composta da associação e índices necessários. Modelar os papéis e status com os contratos já existentes no código.
6. Criar configuração do CLI coerente com a versão e carregar a URL pelo ambiente. Adicionar `.env.example` sem credenciais reais e confirmar que `.env` está ignorado pelo Git.
7. Executar, nesta ordem, os comandos equivalentes à versão instalada:
   - `npx prisma -v`
   - `npx prisma validate`
   - `npx prisma format`
   - `npx prisma generate`
   - `npx prisma migrate dev --name init` somente com PostgreSQL de desenvolvimento acessível
   - `npx prisma migrate status`
8. Não afirmar que a migração foi aplicada se não houver banco acessível. Sem PostgreSQL, validar schema/generate e preparar instruções reproduzíveis; registrar a migração como não aplicada.
9. Integrar o cliente a um módulo isolado de infraestrutura, sem criar uma conexão nova por requisição; garantir encerramento limpo no servidor.
10. Adicionar testes: validação de schema, persistência real em PostgreSQL de teste, unicidade e chaves estrangeiras. Testes de integração devem falhar explicitamente ou ser marcados como não executados quando a URL de teste não existe — nunca declarar sucesso fictício.
11. Rodar `npm run check`, `npm test`, `npm run build`, `npm audit` e verificar `git diff --check`.
12. Atualizar `docs/NEXORA-NOTEBOOK.md` e `docs/DEVELOPMENT-STATUS.md` com versão exata, arquivos, comandos e resultados reais.

## Diagnóstico rápido por tipo de erro

- **P1001 / servidor inacessível:** verificar se PostgreSQL está em execução, host, porta, firewall e disponibilidade do serviço. Não trocar a URL por uma inventada.
- **P1000 / autenticação:** conferir usuário/senha no ambiente local sem exibir a string de conexão.
- **P1012 / erro de schema/config:** verificar primeiro a major instalada e se `url` está no local correto para essa major; revisar provider, generator, relações, enumerações e nomes de campos.
- **`PrismaClientInitializationError` ou adapter ausente:** conferir se o projeto está no Prisma 7, se o adapter PostgreSQL foi instalado e se o cliente está sendo criado com o adapter compatível.
- **Import de `@prisma/client` não encontrado ou cliente não gerado:** executar `prisma generate` após validar schema e conferir o caminho `output` do generator e os imports do código.
- **`Environment variable not found: DATABASE_URL`:** configurar `.env` local ignorado pelo Git ou definir variável no ambiente; nunca colar segredos em logs ou no chat.
- **Migração pede shadow database ou falha por permissões:** confirmar privilégios e existência do banco de desenvolvimento. Não usar produção para gerar/testar migrações.
- **Conflito de versões:** alinhar `prisma`, `@prisma/client` e adapter à mesma linha compatível; não resolver com `npm audit fix --force`.

## Evidência necessária para corrigir um erro específico

Para uma análise causal, coletar a mensagem completa do comando que falhou, o comando exato e a saída de `npx prisma -v`, removendo credenciais, URLs privadas e outros segredos. Não é necessário compartilhar o conteúdo de `.env`.

## Segurança e limites

- Nunca executar `migrate reset`, apagar banco ou sobrescrever migrações existentes como tentativa de correção automática.
- Não colocar `DATABASE_URL` real no Git, documentação, screenshots ou logs.
- Não usar banco de produção em `migrate dev`.
- Não considerar a persistência pronta até que migrações e testes de integração com PostgreSQL sejam realmente executados.
