# Roadmap do NEXORA

## Fase 0 — Fundação
- [x] Criar repositório GitHub.
- [x] Estabelecer documentação inicial.
- [x] Definir stack inicial, arquitetura executável e padrão de testes.
- [x] Definir validação automatizada por GitHub Actions.
- [x] Publicar notebook principal e registrar próximos passos.
- [x] Documentar proposta inicial de persistência (ADR; decisão ainda depende de confirmação de ambiente).
- [x] Documentar proposta de autenticação e requisitos de sessão (ADR; ainda não implementada).
- [ ] Adicionar e versionar lockfile de dependências após validar a instalação limpa.
- [ ] Definir política de branches e revisão protegida.
- [ ] Validar nome, marca, domínio e requisitos legais.
- [ ] Confirmar CI verde com auditoria de dependências.

## Fase 1 — MVP comercial
- [ ] Confirmar a decisão de persistência e implementar banco/migrações.
- [x] Schemas iniciais de cadastro e resposta pública de usuário (sem autenticação ou persistência).
- [ ] Implementar autenticação, sessões e perfis de usuário.
- [x] Schemas iniciais de organização e papéis de membro (sem persistência).
- [x] Helper de política de acesso por organização com testes de isolamento.
- [ ] Persistência de usuários, organizações e associação de membros.
- [ ] Autorização integrada a rotas, banco de dados e testes de isolamento ponta a ponta.
- [ ] Cadastro de lojas e produtos.
- [ ] Catálogo, carrinho e fluxo de pedidos.
- [ ] Integração com provedor de pagamentos escolhido.
- [ ] Webhooks idempotentes e conciliação.
- [ ] Links de afiliados e atribuição auditável vinculada a vendas válidas.
- [ ] Cálculo de taxas, custos e margem por pedido.
- [ ] Testes automatizados e isolamento entre lojas.

## Fase 2 — Operação
- [ ] Integração com agregador de logística.
- [ ] Rastreamento, cancelamentos e devoluções.
- [ ] Painel de suporte e histórico de eventos.
- [ ] Alertas operacionais, backups e teste de restauração.

## Fase 3 — SENTINEL e crescimento
- [ ] Eventos de segurança normalizados.
- [ ] Detecção de anomalias e alertas.
- [ ] Gestão de conteúdo e campanhas.
- [ ] Avaliação controlada de fornecedores e recursos B2B.

## Fase 4 — Escala
- [ ] Testes de carga e resiliência.
- [ ] Revisão independente de segurança.
- [ ] Observabilidade e procedimentos operacionais.
- [ ] Expansão gradual baseada em métricas reais.

## Critério de conclusão

Uma tarefa só será considerada concluída após implementação, testes pertinentes, documentação atualizada e evidência verificável. Itens planejados não representam funcionalidades disponíveis.
