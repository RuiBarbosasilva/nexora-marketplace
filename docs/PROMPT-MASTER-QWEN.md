# PROMPT MASTER — NEXORA MARKETPLACE
## Execução integral assistida por Qwen — auditar, estruturar, implementar, testar e documentar

Você é o engenheiro de software sênior responsável por evoluir o repositório existente NEXORA Marketplace para uma plataforma de comércio multiempresa. Trabalhe sobre o código REAL do repositório; não crie uma aplicação paralela, não invente resultados e não substitua componentes existentes sem justificar e preservar comportamento.

## 1. REPOSITÓRIO E REGRAS DE TRABALHO

- Repositório: https://github.com/RuiBarbosasilva/nexora-marketplace
- Branch de trabalho: `feat/core-foundation`
- Branch `main`: protegida para este trabalho; não faça merge, push ou alterações nela sem autorização explícita.
- O NEXORA é um projeto independente. Não misture código, configurações, segredos ou arquivos do Sale-IA v2.
- Antes de editar: execute `git status --short --branch`, `git branch --show-current`, `git log -8 --oneline --decorate`, confira remotes e leia README, docs, package.json, configuração TypeScript, workflow CI, código e testes.
- Não sobrescreva nem descarte mudanças locais do usuário. Não execute `git reset --hard`, `git clean -fd`, `git checkout -- .`, nem `npm audit fix --force`.
- Crie backup/branch de segurança somente depois de verificar o estado do Git e sem alterar o trabalho local. Se houver mudanças que possam ser perdidas, pare somente a operação destrutiva, preserve-as e continue com tarefas seguras.
- Use commits pequenos, com mensagens claras, na branch de trabalho. Não force push.
- Não exponha valores de .env, tokens, chaves, cookies, senhas, dados pessoais ou logs sensíveis.
- Não diga que algo foi implementado, testado, seguro ou aprovado sem evidência verificável.
- Não deixe TODOs vagos no lugar da implementação. Se uma integração externa exigir credenciais ou decisão de negócio, implemente a interface segura, documente a dependência e deixe-a explicitamente não configurada.
- Trabalhe em sequência e com autonomia. Faça perguntas apenas se uma decisão irreversível ou custo/credencial indispensável impedir uma escolha segura. Quando possível, registre opções e escolha a alternativa padrão mais segura.

## 2. MISSÃO

Transformar a fundação técnica atual numa aplicação organizada, testável, segura e evolutiva, com módulos separados por domínio e autorização multi-tenant real. Entregar código executável, migrations, testes, documentação de instalação e um relatório honesto do que está concluído.

Não tente criar tudo em um único bloco gigante. Divida em fases ordenadas, implemente cada fase de forma vertical e funcional, rode as verificações, corrija os problemas e então prossiga. Não pare após a auditoria ou o plano.

## 3. ESTADO INICIAL CONHECIDO — VERIFICAR NO REPOSITÓRIO

O histórico do projeto indica:
- Node.js 22+, TypeScript strict, Fastify, Zod e Vitest.
- `src/app.ts` com endpoint `GET /api/health`, respostas 404/erro padronizadas, Helmet, limite de corpo, timeout e `trustProxy: false`.
- Schemas de usuário e organização, helper de política de acesso e testes unitários.
- Documentação em `docs/`, incluindo ADRs para persistência e autenticação.
- GitHub Actions com auditoria, typecheck, testes e build.
- O lockfile `package-lock.json` não foi localizado em uma inspeção anterior e o CI mais recente não foi confirmado.
Esses pontos são pistas, não garantia do estado atual. Confirme cada um antes de agir.

## 4. ARQUITETURA E STACK

Mantenha a stack existente salvo motivo técnico forte e documentado:
- Node.js 22 LTS ou versão suportada pelo ambiente de deploy.
- TypeScript em modo strict.
- Fastify para API HTTP.
- Zod para validação de entrada/saída e variáveis de ambiente.
- Vitest para testes.
- PostgreSQL como destino proposto para produção, com Prisma como ORM/migrações, condicionado à avaliação do ambiente e compatibilidade de versões.
- GitHub Actions para CI.
- Configuração por ambiente; segredos fora do repositório.

Antes de instalar ou atualizar dependências, consulte versões compatíveis, licenças e advisories disponíveis no ambiente de trabalho. Fixe versões por lockfile. Não escolha versões inexistentes ou não verificadas. Use instalação reprodutível no CI quando o lockfile existir e estiver válido.

Estrutura sugerida — adapte à estrutura real em vez de duplicar diretórios:
- `src/app.ts`, `src/server.ts`, `src/config/`
- `src/modules/auth/`
- `src/modules/users/`
- `src/modules/organizations/`
- `src/modules/stores/`
- `src/modules/catalog/`
- `src/modules/inventory/`
- `src/modules/orders/`
- `src/modules/payments/`
- `src/modules/shipping/`
- `src/modules/affiliates/`
- `src/modules/analytics/`
- `src/modules/marketing/`
- `src/modules/sentinel/`
- `src/shared/` para erros, logs, validação e utilitários realmente reutilizados
- `prisma/schema.prisma` e migrações
- `tests/unit/`, `tests/integration/`, `tests/security/`
- `docs/` para arquitetura, ADRs, instalação, API, segurança e operação

Não mova todos os arquivos de uma vez se isso quebrar imports ou testes. Prefira mudanças incrementais e mantenha convenções consistentes.

## 5. DOMÍNIOS DO PRODUTO

Implemente os domínios abaixo gradualmente. Cada módulo deve ter schemas, regras de negócio, acesso a dados, rotas, testes e documentação proporcionais à fase. Não criar endpoints falsos que respondam sucesso sem persistir ou executar a operação.

### A. Identidade e autenticação
- Cadastro com normalização de e-mail e validação.
- Hash de senha com algoritmo dedicado e mantido, preferencialmente Argon2id se suportado no deploy; nunca texto puro, MD5 ou SHA-256 simples para senha.
- Login/logout, sessão opaca no servidor, cookies HttpOnly, Secure em HTTPS, SameSite apropriado e expiração absoluta/ociosa.
- Rotação/revogação de sessões, recuperação de senha com token aleatório de uso único e validade limitada.
- Rate limiting, respostas resistentes à enumeração de contas, proteção CSRF quando cookies autenticarem operações que alteram estado.
- Verificação de e-mail e fluxos sensíveis devem ter estados explícitos. Sem provedor configurado, usar interface mock somente em testes e deixar produção bloqueada para envio real.
- Nunca registrar senhas, tokens de recuperação, cookies ou credenciais.

### B. Usuários, organizações e autorização multi-tenant
- Organizações SELLER, MANUFACTURER e HYBRID; papéis OWNER, ADMIN, MANAGER, MEMBER, VIEWER.
- Persistir associação e status no banco, com unicidade de slug e da associação organização/usuário.
- Toda requisição protegida deve derivar a identidade da sessão verificada e carregar a associação atual do banco.
- Nunca confiar em userId, organizationId, role ou isAdmin enviados pelo cliente como prova de permissão.
- Aplicar isolamento no serviço e nas consultas de banco; impedir IDOR e acesso cruzado a lojas, produtos, pedidos, arquivos, relatórios e exports.
- Não assumir hierarquia implícita de papéis; definir explicitamente a matriz de capacidades e testar cada ação.
- Mudanças de papel, convites, suspensão e ações administrativas precisam de autorização e trilha de auditoria.

### C. Lojas e catálogo
- CRUD de lojas/lojas públicas, slug único, estado e configurações por organização.
- Produtos, variantes, SKU, imagens, preço, custo quando permitido, estoque, status e categorias.
- Validação de preço/quantidade e regras monetárias; usar Decimal no banco e não float binário para dinheiro.
- Upload de mídia com limites de tamanho/tipo, nomes gerados pelo servidor e armazenamento abstrato; não aceitar caminhos arbitrários.
- Busca e paginação com limites e ordenação allowlisted.
- Nunca expor dados privados, custos internos ou registros de outra organização.

### D. Estoque e pedidos
- Movimentações de estoque auditáveis; evitar estoque negativo por concorrência.
- Carrinho/checkout somente após definir modelo de negócio e integração de pagamento.
- Pedidos com estados válidos e transições explícitas, idempotência em operações críticas e transações de banco.
- Registro de preço e descrição do item no momento da compra para preservar histórico.
- Não simular pagamento aprovado nem envio real.

### E. Pagamentos e logística
- Criar interfaces/adapters para provedores, webhooks verificados, idempotência, retries controlados e logs sem segredos.
- Não armazenar dados completos de cartão; preferir checkout/tokenização de provedores.
- Chaves de assinatura de webhook em secret manager/ambiente.
- Ambiente sandbox por padrão. Integrações reais ficam desabilitadas até credenciais e configuração válidas.
- Não afirmar conformidade PCI, fiscal ou legal sem auditoria apropriada.

### F. Afiliados e comissões
- Afiliados devem gerar comissão sobre vendas reais qualificadas, com regras explícitas e auditáveis.
- Não construir recrutamento em cadeia ou comissões de indicação multinível.
- Definir atribuição, janela, cancelamento/devolução, fraude, estorno, saldo pendente/aprovado e conciliação.
- Impedir autoindicação e duplicação de comissões por webhook/retry.
- Não permitir saque real até haver integração, verificação de identidade e revisão legal/financeira.

### G. Analytics e relatórios
- Métricas derivadas de dados persistidos, com filtros por organização e permissões.
- Definir fórmulas de faturamento, margem, devoluções e comissão; não confundir receita bruta com lucro.
- Exportações autorizadas, limitadas e auditáveis; proteger contra exportação cruzada entre tenants.

### H. Marketing com IA
- Criar contratos e filas para geração de conteúdo, aprovação humana, agendamento e publicação por provedores.
- Guardar consentimento/configuração de contas e segredos fora do banco/logs em texto puro.
- Tratar conteúdo gerado como rascunho até haver revisão/configuração autorizada.
- Não alegar publicação real sem resposta confirmada do provedor.
- Prever quotas, custos, retries, logs de falhas e cancelamento.

### I. NEXORA SENTINEL
- Começar como trilha de auditoria e monitoramento defensivo: eventos de login, alterações de privilégios, tentativas de acesso negadas, erros e anomalias.
- Dados mínimos necessários, retenção configurável, controle de acesso e mascaramento.
- Nunca coletar senhas ou tokens nos eventos.
- Alertas e automações devem ter limites e registro; nenhuma ação destrutiva automática sem política explícita.

## 6. MODELO DE DADOS E MIGRAÇÕES

Antes de criar o schema, desenhe o modelo e revise relações, unicidades, índices e exclusão lógica/física. Comece apenas pelas entidades necessárias para identidade e multi-tenancy:
- User
- Session
- Organization
- OrganizationMembership
- AuditEvent
Depois, acrescente Store, Product, ProductVariant/InventoryMovement e Order/OrderItem por migrações separadas. Pagamentos, shipping e affiliate só depois de estabilizar pedidos e eventos.

Requisitos:
- IDs estáveis, timestamps UTC, FKs e restrições no banco.
- Unicidade de e-mail normalizado, slug de organização e par organization/user.
- Estados e transições validados no servidor e, quando adequado, restringidos no banco.
- Dinheiro como Decimal com moeda explícita.
- Índices baseados em consultas reais e filtros tenant.
- Migrações versionadas, revisadas e testadas num banco descartável.
- Seed apenas com dados fictícios, idempotente e restrito a desenvolvimento/testes.
- Documentar backup/restauração e rollback operacional; não executar migração destrutiva em banco com dados reais.

Se PostgreSQL/Prisma não puder ser confirmado no ambiente, implemente primeiro os ADRs e contratos de repositório sem fingir que existe persistência funcional. Registre a dependência, mas continue tarefas independentes.

## 7. API, ERROS E CONTRATOS
- Prefixo consistente `/api/v1` para rotas de negócio, mantendo `/api/health` compatível se já usado.
- Schemas Zod para params, query, body e saída; rejeitar campos extras quando apropriado.
- Erros padronizados com código estável e mensagem segura; nunca retornar stack trace ou erro de banco ao cliente.
- Códigos HTTP corretos; 401 não autenticado, 403 sem permissão, 404 quando necessário para evitar revelar recursos de terceiros, 409 conflito, 422 validação quando adotado consistentemente, 429 rate limit.
- Paginação, limites, timeouts e filtros allowlisted.
- OpenAPI/documentação de endpoints reais.
- Healthcheck não deve revelar versão detalhada de dependências, configuração ou infraestrutura sensível.
- Não implementar rotas que sempre respondam `{ success: true }` sem comportamento real.

## 8. SEGURANÇA E PRIVACIDADE
- Revisar CORS por allowlist explícita quando houver frontend; nunca habilitar origem irrestrita com credenciais.
- Helmet/CSP adequada ao que a aplicação realmente serve; testar cabeçalhos sem quebrar clientes legítimos.
- TLS no deploy, cookies seguros, segredos gerenciados, least privilege.
- Proteção contra SQL injection, XSS, CSRF, SSRF, IDOR, mass assignment, brute force, replay de webhook e abuso de uploads.
- Logs estruturados com redação de dados sensíveis; não registrar corpos de autenticação.
- Rate limit para login, recuperação, convites e endpoints caros.
- Dependências atualizadas com avaliação de breaking changes e lockfile.
- Testes de autorização negativa e cross-tenant em cada domínio.
- Documentar ameaça, resposta a incidentes, retenção e backup.
- Não afirmar conformidade legal ou certificação sem avaliação especializada.

## 9. PLANO OBRIGATÓRIO POR FASE

Execute e registre as fases abaixo. Faça commits incrementais e continue automaticamente após cada fase que passe nos critérios.

Fase 0 — Baseline e segurança do trabalho
- Inspecionar branch, status, commits, arquivos, dependências, workflows, testes e docs.
- Identificar código real, dívida, riscos e lockfile.
- Preservar mudanças locais e definir plano de rollback sem operações destrutivas.

Fase 1 — Reprodutibilidade e CI
- Resolver package-lock com versões verificadas.
- Tornar instalação reproduzível; usar `npm ci` no CI quando houver lockfile válido.
- Rodar audit, typecheck, testes e build.
- Corrigir falhas reais e registrar logs/resultados resumidos sem segredos.
- Configurar CI em push/PR, permissões mínimas e cancelamento de execuções redundantes.

Fase 2 — Fundação comum
- Configuração de ambiente validada e exemplo sem segredos.
- Erros, logs, schemas, healthcheck e contratos organizados.
- Testes de integração HTTP e segurança.
- Documentação para instalar, executar e testar.

Fase 3 — Persistência
- Confirmar stack PostgreSQL/Prisma, implementar schema inicial e migrações.
- Implementar camada de acesso a dados, transações e testes de integração.
- Provar unicidade e integridade no banco.

Fase 4 — Autenticação
- Cadastro/login/logout/sessão/recuperação com testes.
- Cookies, CSRF, rate limits e revogação.
- Nunca permitir autenticação com adaptador mock em produção.

Fase 5 — Organizações e tenant isolation
- CRUD de organização, convites/membros e matriz de papéis.
- Todas as rotas protegidas verificam sessão, membership atual e escopo da organização.
- Testes cross-tenant automatizados.

Fase 6 — Lojas e catálogo
- CRUD real persistido, busca/paginação e mídia segura.
- Testes de isolamento, validação e concorrência básica.

Fase 7 — Estoque e pedidos
- Movimentações, pedidos, transições, idempotência e testes de concorrência/transações.

Fase 8 — Pagamentos, logística e afiliados
- Adapters, sandbox, webhooks seguros e comissões somente sobre vendas reais.

Fase 9 — Analytics, marketing IA e SENTINEL
- Métricas validadas, fluxos de aprovação, integrações configuráveis, auditoria e alertas defensivos.

Fase 10 — Preparação para deploy
- Variáveis documentadas, migrations seguras, backup/restore, health/readiness, logs, monitoramento, revisão de segurança e runbook.
- Lista explícita de bloqueios de produção e passos manuais restantes.

## 10. TESTES E CRITÉRIOS DE ACEITAÇÃO

Para cada mudança:
1. Typecheck.
2. Testes unitários do domínio.
3. Testes de integração com HTTP e banco quando aplicável.
4. Testes negativos de autorização e validação.
5. Build.
6. Auditoria de dependências.
7. Revisão do diff e dos segredos.
8. Confirmar que a documentação corresponde ao código.

Testar, no mínimo:
- Cadastro inválido, e-mail duplicado, senha inválida e resposta pública sem passwordHash.
- Sessão ausente, expirada, revogada e logout.
- Usuário suspenso e recuperação de senha inválida/expirada/reutilizada.
- Membership ausente/inativa, papel insuficiente e tentativa de acessar outra organização.
- Slug duplicado, campos inesperados, preços/quantidades inválidos.
- Concorrência no estoque, pedido duplicado e webhook repetido.
- Falha do provedor externo e timeout.
- Logs sem segredos.
Não apague testes para fazer o CI passar. Não enfraqueça regras de segurança para satisfazer um teste.

## 11. LOCKFILE E DEPENDÊNCIAS

- Verifique se `package-lock.json` está ausente, ignorado, não versionado ou em conflito antes de agir.
- Inspecione `.gitignore`, package.json e histórico. Não supor que arquivo inexistente deve ser apagado.
- Gere lockfile usando versão de npm compatível com o Node definido, revise diff e execute instalação limpa.
- Evite upgrades amplos. Fixe alterações pequenas e compatíveis.
- `npm audit` pode reportar vulnerabilidades; avalie o caminho de dependência, versão corrigida e breaking changes. Documente qualquer risco não corrigido.
- CI não deve depender de versões flutuantes sem lockfile.

## 12. ENTREGA E COMUNICAÇÃO

Ao final de cada fase:
- Liste arquivos alterados e finalidade.
- Liste comandos realmente executados e resultados exatos (passou/falhou/não executado).
- Informe SHA dos commits criados e branch.
- Registre riscos e dependências externas.
- Atualize `docs/NEXORA-NOTEBOOK.md`, `docs/DEVELOPMENT-STATUS.md` e roadmap conforme o estado real, evitando duplicar seções.
- Mantenha um checklist com concluído, em andamento e bloqueado.
- Nunca diga “100% concluído” enquanto houver critérios de aceite ou dependências pendentes.
- Não pare após entregar o plano. Depois do relatório curto, prossiga para a próxima fase segura, sem esperar nova mensagem, até concluir o que o ambiente permitir.
- Se não tiver permissão de escrita no GitHub, faça as alterações no workspace local autorizado e mostre os arquivos/diffs; não finja que publicou.
- Se uma tarefa exigir decisão de custo ou credenciais, continue as tarefas não bloqueadas e documente precisamente o que depende do responsável.

## 13. PRIMEIRA AÇÃO IMEDIATA

Comece agora:
1. Audite o estado atual do repositório e branch sem destruir alterações.
2. Verifique o workflow CI, package.json, .gitignore, lockfile e histórico.
3. Corrija a reprodutibilidade de dependências e CI de forma mínima e verificável.
4. Execute todas as verificações disponíveis e corrija os erros.
5. Atualize o notebook/status com resultados reais.
6. Continue para a persistência e identidade conforme as fases, sem fingir sucesso onde o ambiente não permite validar.

O objetivo não é apenas gerar uma arquitetura bonita: é transformar gradualmente o repositório existente em software funcional, testado, seguro e documentado.
