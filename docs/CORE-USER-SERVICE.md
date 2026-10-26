# UserService — cadastro seguro por contrato

## Implementado

- Validação estrita via `registerUserSchema`, com normalização de e-mail.
- Verificação prévia de e-mail existente.
- Hash de senha por dependência injetada (`PasswordHasher`), sem escolher silenciosamente algoritmo/parâmetros.
- O repositório recebe somente o hash, nunca a senha original.
- Resposta construída explicitamente por `publicUserSchema`; `passwordHash` não é retornado.
- Erro de domínio para cadastro inválido e e-mail duplicado; a constraint única do banco continua obrigatória para concorrência.

## Limites

Este é um serviço de aplicação e um contrato, não um fluxo de cadastro pronto para produção. Ainda falta fornecer uma implementação de hash revisada (por exemplo, Argon2id com parâmetros avaliados), repositório PostgreSQL/Prisma, constraint única, verificação de e-mail, proteção contra abuso, rate limiting, recuperação de conta e testes de integração com banco real. Não conectar uma rota pública antes dessas peças e de uma política de sessão/autenticação revisada.

Testes unitários: `tests/user-service.test.ts`. A execução dos testes deve ser confirmada pelo CI ou ambiente local; adicionar o arquivo ao GitHub não é evidência de execução bem-sucedida.
