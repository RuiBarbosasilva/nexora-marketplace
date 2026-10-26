# Arquitetura Inicial

## Objetivo

Evoluir a plataforma em domínios separados, com interfaces explícitas e controles de segurança consistentes. A arquitetura final será escolhida após validar os requisitos e o MVP; não presumir tecnologias ainda não aprovadas.

## Domínios

- Core: identidade, organizações, permissões e configurações.
- Market: produtos, busca, carrinho, pedidos e estados da compra.
- Stores: páginas de lojas, catálogo e gestão do vendedor.
- Partners: links, atribuição, regras de comissão e conciliação.
- Ship: cotações, etiquetas, rastreamento e devoluções.
- Growth: campanhas e criação de conteúdo.
- Supply: fornecedores e fluxos B2B.
- Trust: suporte, disputas e políticas.
- Profit: custos, taxas, margens e resultados por pedido.
- SENTINEL: eventos de segurança, regras de detecção e alertas.

## Regras arquiteturais

1. Isolar dados por organização e verificar autorização no servidor.
2. Tratar estados de pedidos e pagamentos por transições explícitas.
3. Usar idempotência para operações que possam ser repetidas.
4. Validar assinaturas e origem de webhooks.
5. Separar eventos operacionais de trilhas de auditoria.
6. Evitar que falhas de um provedor externo comprometam todo o sistema.
7. Versionar contratos de API e registrar decisões arquiteturais.
8. Não armazenar dados de cartão diretamente; avaliar provedores de pagamento adequados.

## Fluxo comercial de referência

Catálogo → carrinho → pedido pendente → confirmação do pagamento pelo provedor → processamento do pedido → expedição e rastreamento → conclusão, devolução ou disputa.

O fluxo real deverá contemplar falhas, cancelamentos, reembolsos, conciliação e eventos duplicados.

## Estado

Documento de referência inicial. Stack, infraestrutura, modelo de dados, APIs e implantação ainda precisam ser definidos e validados no repositório.
