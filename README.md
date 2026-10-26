# NEXORA

**Comércio inteligente. Crescimento compartilhado.**

NEXORA é uma plataforma em desenvolvimento para conectar vendedores, fabricantes, compradores e afiliados, com foco em transparência comercial, eficiência operacional e crescimento sustentável.

## Estado atual

A fundação documental foi publicada na branch `main`. A branch `feat/core-foundation` adiciona um scaffold inicial da API Node.js/TypeScript, endpoint de saúde, testes e validação automatizada. Essa base ainda não é um marketplace funcional nem está pronta para produção.

## Visão do produto

Ajudar pequenos vendedores e fabricantes a vender online, administrar pedidos, acompanhar rentabilidade e desenvolver canais de aquisição.

## Domínios planejados

- **Core:** identidade, contas, permissões e configuração.
- **Market:** catálogo, pesquisa, carrinho e pedidos.
- **Stores:** lojas e gestão de vendedores.
- **Partners:** afiliados, atribuição e comissões por vendas válidas.
- **Ship:** cotações de frete, rastreamento e devoluções.
- **Growth:** conteúdo, campanhas e aquisição.
- **Supply:** fornecedores, fabricantes e atacado.
- **Trust:** suporte, disputas e políticas de confiança.
- **Profit:** custos, taxas, margens e rentabilidade por pedido.
- **NEXORA SENTINEL:** monitoramento de ameaças, detecção de anomalias e alertas de segurança.

## Stack inicial

- Node.js 22+
- TypeScript em modo estrito
- Fastify
- Zod
- Vitest
- GitHub Actions para checagem, testes e build

Ver [ADR da stack](docs/ADR-0001-TECH-STACK.md) e [proposta de persistência](docs/ADR-0002-PERSISTENCE.md).

## Executar localmente

Requisitos: Node.js 22+ e npm.

```powershell
npm install
Copy-Item .env.example .env
npm run check
npm test
npm run build
npm run dev
```

Verifique a API em `http://127.0.0.1:3000/api/health`.

## Documentação

- [Notebook principal do projeto](docs/NEXORA-NOTEBOOK.md)
- [Status de desenvolvimento e validações pendentes](docs/DEVELOPMENT-STATUS.md)
- [Contratos iniciais de usuário](docs/CORE-USERS.md)
- [Organizações e isolamento entre vendedores](docs/CORE-ORGANIZATIONS.md)
- [Arquitetura](docs/ARCHITECTURE.md)
- [Modelo de ameaças](docs/THREAT-MODEL.md)
- [Roadmap](docs/ROADMAP.md)
- [Resposta a incidentes](docs/INCIDENT-RESPONSE.md)
- [Política de segurança](SECURITY.md)

## Princípios

1. Transparência nas taxas, comissões e regras comerciais.
2. Comissões de afiliados vinculadas a vendas legítimas, nunca ao recrutamento.
3. Proteção de dados e privacidade desde a concepção.
4. Segurança em camadas, auditoria e privilégios mínimos.
5. Decisões financeiras sensíveis sujeitas a controles e revisão apropriados.
6. Evolução incremental, com testes e critérios de aceitação.
7. Integrações com pagamentos e logística por provedores adequados.

## Limites do MVP

Priorizar lojas de vendedores, catálogo, pedidos, links de afiliados, cálculo de rentabilidade e integrações selecionadas de pagamento e logística. Expandir após validação técnica, comercial, operacional e jurídica.

## Aviso

Integrações financeiras, obrigações fiscais, proteção de dados, regras de consumo, logística e modelo de comissões deverão ser validados com profissionais competentes antes do lançamento comercial. Nunca commitar segredos, tokens ou dados pessoais.
