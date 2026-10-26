# Core — Identidade de usuário (contratos iniciais)

Este módulo define contratos de validação; não implementa autenticação nem persistência.

## Cadastro

`registerUserSchema`:
- normaliza o e-mail para minúsculas e remove espaços externos;
- valida formato e limite de 254 caracteres;
- exige nome de exibição entre 2 e 80 caracteres;
- exige senha entre 12 e 128 caracteres;
- rejeita propriedades extras, incluindo tentativas de definir papel/permissão no cadastro.

O limite de senha é um contrato de entrada, não uma política completa de segurança. Antes de expor cadastro real, implementar hash de senha com algoritmo apropriado e parâmetros revisados, proteção contra abuso, verificação de e-mail, recuperação segura, limitação de tentativas e respostas que não permitam enumeração de contas. Nunca registrar ou persistir senha em texto puro.

## Dados públicos

`publicUserSchema` contém apenas identificador, e-mail, nome de exibição e status. Ele rejeita campos extras, como `passwordHash`, para ajudar a evitar vazamento acidental em objetos de resposta. Ainda assim, handlers devem montar explicitamente a resposta pública em vez de devolver registros brutos do banco.

## Limites

Os schemas não verificam unicidade de e-mail, não consultam banco, não autenticam usuários, não criam sessões e não protegem rotas. Essas garantias precisam de persistência, transações/constraints e integração explícita com autenticação.
