# 📝 CHANGELOG - Nishizawa Capital

## [1.1.0] - 2024-11-18

### ✨ Novas Funcionalidades

#### 🎯 Editor de Portfólio (Apenas Admin)
- **Botão Flutuante**: Novo botão "Editar Portfólio" no canto inferior direito
- **Modal de Edição**: Interface completa para gerenciar ativos
- **Edição de Ativos**: Alterar quantidade e preço médio de compra
- **Suporte Multi-Ativos**: BTC, ETH, SOL, USDT, USDC, DAI, ENA, PENDLE
- **Validações**: Inputs validados (quantidade > 0, preço > 0)
- **Cálculo em Tempo Real**: Preview do valor total investido
- **Integração API**: Salva alterações no banco de dados
- **Recálculo Automático**: Dashboard atualiza após edições

#### 🏷️ Ajustes de Interface
- **Label Atualizado**: Primeiro card agora mostra "Valor Inicial Investido"
- **Labels Centralizados**: Todos os textos agora usam constants.js
- **Consistência Visual**: Design integrado com tema dark

### 🔒 Permissões
- Editor de portfólio visível **APENAS para administradores**
- Clientes normais veem apenas visualização do dashboard

### 🎨 Design
- Modal dark com bordas e sombras
- Botões com hover effects
- Layout responsivo
- Animações suaves (fade-in)
- Cores consistentes com design system

### 🔧 Técnico
- Novo componente: `PortfolioEditor.jsx`
- Integração com `adminAPI.updatePortfolio()`
- Função `onUpdate()` para refresh do dashboard
- TypeScript-ready (props tipadas)

---

## Como Usar

### Para Administradores:

1. **Faça login** com credenciais de admin
2. **Acesse qualquer dashboard** de cliente
3. **Clique no botão** "Editar Portfólio" (canto inferior direito)
4. **No modal**:
   - Veja lista de ativos atuais
   - Clique em "Editar" em qualquer ativo
   - Altere quantidade ou preço médio
   - Clique em "Salvar"
5. **Dashboard atualiza** automaticamente

### Exemplo de Edição:

```
Ativo: BTC
Quantidade Atual: 0.25500000
Nova Quantidade: 0.30000000
Preço Médio: $98,039.22

[Salvar] ✅
```

---

## Validações Implementadas

✅ Ativo deve ser selecionado
✅ Quantidade > 0
✅ Preço médio > 0
✅ Apenas admin pode editar
✅ Confirmação antes de salvar

---

## Próximas Funcionalidades

- [ ] Adicionar novos ativos (criar nova posição)
- [ ] Remover ativos do portfólio
- [ ] Histórico de edições
- [ ] Export/Import de portfólio
- [ ] Gráfico de evolução do portfólio editado

---

## Bugs Corrigidos

- ✅ Label "Investido" agora mostra "Valor Inicial Investido"
- ✅ Títulos hardcoded substituídos por constants

---

**Versão**: 1.1.0
**Data**: 18/11/2024
**Autor**: Claude Code Agent
