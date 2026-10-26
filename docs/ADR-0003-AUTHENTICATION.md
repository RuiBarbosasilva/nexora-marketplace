# ADR-0003: Estratégia inicial de autenticação

- **Status:** Proposta para revisão; não implementada.
- **Data:** 2026-10-26.

## Contexto

A API ainda não possui autenticação, persistência de usuários ou sessões. O schema de cadastro valida a entrada, mas não autentica ninguém e não deve ser tratado como controle de segurança. O marketplace precisa impedir acesso a contas e organizações de terceiros.

## Proposta

Para o MVP web, preferir sessões opacas mantidas no servidor e cookie de sessão seguro, em vez de introduzir JWTs de longa duração sem necessidade concreta. A sessão só poderá ser criada após credenciais verificadas e usuário elegível.

### Senhas

- Usar uma biblioteca mantida e algoritmo de hash de senha resistente a ataques offline, preferencialmente Argon2id quando suportado no ambiente de produção.
- Nunca armazenar senha em texto puro nem usar SHA-256/MD5 diretamente como hash de senha.
- Não implementar algoritmo criptográfico próprio.
- Não registrar senha, token de recuperação ou cookie nos logs.
- Definir parâmetros de hash com base nas recomendações atuais e medir custo no ambiente alvo.
- Recuperação de senha por token aleatório, curto prazo de validade, uso único e armazenamento do token apenas em forma protegida.

### Sessões e cookies

- Token de sessão opaco, aleatório e imprevisível; guardar somente representação protegida no banco quando viável.
- Cookie com `HttpOnly`, `Secure` em HTTPS, `SameSite=Lax` ou política mais estrita conforme fluxo e escopo limitado.
- Rotacionar sessão após login e mudança de privilégio; invalidar no logout, suspensão de conta e eventos relevantes.
- Definir expiração ociosa e absoluta; não confiar em IDs de sessão fornecidos em URLs.
- Se a autenticação usar cookies, avaliar e implementar defesa CSRF para operações que alterem estado.

### Proteção contra abuso

- Limitação de tentativas por conta e origem, com respostas e tempos que reduzam enumeração de contas.
- Verificação de e-mail antes de operações sensíveis.
- Registro de eventos de segurança sem guardar credenciais.
- Segredos via variáveis de ambiente/secret manager; nunca no repositório.
- Controles de recuperação e suporte sem permitir que operadores leiam senhas ou assumam contas sem trilha de auditoria.

### Autorização multi-tenant

Autenticação identifica o usuário; não concede acesso automático a uma organização. Em cada operação de organização, a API deve carregar a associação ativa no banco e verificar o papel requerido. Nunca confiar em `organizationId`, `role` ou `isAdmin` enviados pelo cliente como prova de permissão.

## Critérios de aceitação antes de produção

1. Testes de login válido/inválido, usuário suspenso, logout, expiração e rotação de sessão.
2. Testes de recuperação de senha: expiração, uso único e resposta que não revele se o e-mail existe.
3. Rate limit aplicado e testado.
4. Cookies e CSRF verificados em ambiente HTTPS.
5. Testes de autorização para usuário sem associação, associação inativa, papel insuficiente e tentativa de acessar outra organização.
6. Revisão de logs para garantir ausência de senha, tokens e cookies.
7. Dependências e configurações revisadas; procedimento de revogação e resposta a incidentes documentado.

## Alternativas não escolhidas por enquanto

- **JWT de longa duração no navegador:** aumenta complexidade de revogação e armazenamento; só reconsiderar com requisito concreto de clientes/API distribuídos.
- **Construir autenticação do zero:** risco e custo desnecessários.
- **Delegar a um provedor externo:** opção válida se orçamento, disponibilidade e requisitos operacionais justificarem; comparar antes de fechar a arquitetura.

## Consequências

A proposta não habilita login. Antes de implementar, confirmar ambiente de deploy, armazenamento de sessões, biblioteca de hash e estratégia de e-mail. O desenvolvimento deve vir depois de persistência e constraints de usuários.
