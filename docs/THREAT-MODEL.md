# Modelo de Ameaças — NEXORA

## Ativos a proteger

- Contas, sessões e informações pessoais.
- Dados comerciais e pedidos de cada loja.
- Registros de pagamentos, reembolsos e comissões.
- Credenciais de integrações e webhooks.
- Logs de auditoria e configurações de segurança.
- Disponibilidade e integridade da plataforma.

## Ameaças prioritárias

| Ameaça | Controle inicial |
|---|---|
| Acesso a dados de outra loja | Autorização por organização em cada requisição e testes negativos |
| Roubo de conta | MFA, limitação de tentativas, sessões revogáveis e alertas |
| Webhook falso ou repetido | Assinatura, janela temporal, idempotência e conciliação |
| Fraude em afiliados | Atribuição verificável, detecção de padrões e regras transparentes |
| Alteração indevida de pedidos | Máquina de estados, autorização e auditoria |
| Vazamento de segredos | Cofre de segredos, varredura automatizada e rotação |
| Abuso de APIs | Rate limiting, validação e monitoramento |
| Ataque à cadeia de dependências | Atualizações controladas e análise de dependências |
| Indisponibilidade | Backups, recuperação testada e monitoramento |
| Uso indevido de IA | Privilégios mínimos, limites e aprovação humana para ações críticas |

## NEXORA SENTINEL

O SENTINEL deverá consumir eventos autorizados, aplicar regras versionadas e emitir alertas rastreáveis. Suas próprias alterações devem passar por revisão e auditoria. Não deve poder apagar logs, contornar permissões ou executar movimentações financeiras irrestritas.

## Validação

Antes do lançamento, criar testes de autorização, isolamento multi-tenant, abuso de API, repetição de webhooks, recuperação de backup e resposta a incidentes.

Este documento é uma avaliação inicial; deverá ser atualizado com a implementação real e os riscos observados.
