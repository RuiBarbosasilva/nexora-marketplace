# Política de Segurança — NEXORA

## Comunicação de vulnerabilidades

Não publique credenciais, dados pessoais ou detalhes exploráveis de uma vulnerabilidade em issues públicas. Utilize um canal privado de contato com os mantenedores, a ser definido antes do lançamento público.

Ao comunicar um problema, inclua impacto, condições de reprodução e evidências mínimas necessárias. Não acesse dados de terceiros nem interrompa serviços para demonstrar uma falha.

## Controles obrigatórios antes de produção

- Autenticação robusta e MFA para contas privilegiadas.
- Autorização verificada no servidor em todas as operações sensíveis.
- Isolamento de dados entre lojas e organizações.
- Validação de entradas e proteção contra abuso e automação maliciosa.
- Segredos fora do código-fonte e rotação de credenciais.
- HTTPS e proteção de dados em trânsito e armazenamento.
- Webhooks autenticados, assinaturas verificadas, idempotência e proteção contra repetição.
- Registros de auditoria protegidos contra alterações indevidas.
- Limites de taxa, alertas, backups e testes periódicos de restauração.
- Análise de dependências, segredos e código antes das entregas.
- Plano documentado de resposta a incidentes.

## NEXORA SENTINEL

O SENTINEL deverá detectar e sinalizar anomalias, tentativas de fraude e eventos de segurança. A automação não deve ter acesso irrestrito a fundos, credenciais ou à exclusão dos próprios registros de auditoria.

Ações de alto impacto devem aplicar limites, trilhas de auditoria e revisão humana quando apropriado.

## Divulgação responsável

Defina um canal privado, responsáveis e prazos de resposta antes de anunciar um programa formal de divulgação de vulnerabilidades. Não declare a plataforma totalmente segura; segurança exige implementação, testes e operação contínua.
