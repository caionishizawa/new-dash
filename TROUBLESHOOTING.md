# 🔧 TROUBLESHOOTING - Editor de Portfólio

## ❓ O botão "Editar Portfólio" NÃO aparece?

### ✅ Verificação 1: Você está logado como ADMIN?

**IMPORTANTE:** O botão só aparece para usuários com perfil ADMIN!

**Login correto:**
```
Email: caiojundi@gmail.com
Senha: admin123
```

**Se você está logado como cliente normal** (`cliente@teste.com`), o botão NÃO vai aparecer!

---

### ✅ Verificação 2: Recarregou a página após as alterações?

1. Parar o frontend (Ctrl+C no terminal)
2. Reiniciar:
```bash
cd /home/user/new-dash/frontend
npm run dev
```
3. Abrir navegador em `http://localhost:5173`
4. Fazer login como admin
5. Ir para um dashboard de cliente

---

### ✅ Verificação 3: Verificar console do navegador

1. Abrir DevTools (F12)
2. Ir na aba "Console"
3. Verificar se há erros em vermelho
4. Tirar print e me mostrar

---

## 🐛 POSSÍVEIS PROBLEMAS E SOLUÇÕES

### Problema 1: "Cannot read property 'isAdmin' of undefined"

**Solução:** O contexto de autenticação não está disponível.

Verificar se o componente está dentro de `<AuthProvider>`:

```jsx
// App.jsx deve ter:
<AuthProvider>
  <BrowserRouter>
    <Routes>
      ...
    </Routes>
  </BrowserRouter>
</AuthProvider>
```

---

### Problema 2: Botão não aparece mesmo logado como admin

**Diagnóstico:**
1. Abrir console do navegador
2. Digitar: `localStorage.getItem('user')`
3. Ver se retorna um objeto com `role: "admin"`

**Se retornar `null` ou `role: "client"`:**
- Fazer logout
- Fazer login novamente com: caiojundi@gmail.com / admin123

---

### Problema 3: Botão aparece mas não abre o modal

**Solução:** Verificar se há erro de JavaScript no console

**Teste manual:**
```javascript
// No console do navegador:
console.log('Teste de clique');
```

---

### Problema 4: Modal abre mas não salva

**Possíveis causas:**
1. Backend não está rodando
2. Token JWT expirado
3. Erro na API

**Verificar:**
```bash
# Em outro terminal, testar o backend:
curl http://localhost:3000/health

# Deve retornar:
{"status":"ok","timestamp":"...","environment":"development"}
```

---

## 🧪 TESTE COMPLETO PASSO A PASSO

### Passo 1: Parar tudo
```bash
# Parar frontend (Ctrl+C)
# Parar backend (Ctrl+C)
```

### Passo 2: Reiniciar backend
```bash
cd /home/user/new-dash/backend
npm start
```

Aguardar ver:
```
🚀 Nishizawa Capital Backend
📡 Servidor rodando na porta 3000
```

### Passo 3: Reiniciar frontend (NOVO TERMINAL)
```bash
cd /home/user/new-dash/frontend
npm run dev
```

Aguardar ver:
```
VITE v5.x.x ready in XXX ms
➜  Local:   http://localhost:5173/
```

### Passo 4: Limpar cache do navegador
1. Abrir navegador em `http://localhost:5173`
2. Pressionar **Ctrl+Shift+Delete**
3. Limpar "Cookies" e "Cache"
4. Recarregar página (F5)

### Passo 5: Fazer login como admin
```
Email: caiojundi@gmail.com
Senha: admin123
```

### Passo 6: Ir para Clientes > Ver Dashboard
1. Clicar na aba "Clientes"
2. Clicar em "Ver Dashboard" do "Cliente Teste"

### Passo 7: Procurar botão
Procure no **canto inferior direito** da tela por:

```
┌──────────────────────────┐
│ ✏️ Editar Portfólio      │
└──────────────────────────┘
```

---

## 📸 COMO TIRAR PRINT E ME MOSTRAR

Se o botão não aparecer, me envie:

1. **Print da tela inteira** do dashboard
2. **Print do console** (F12 > Console)
3. **Resposta de:** `localStorage.getItem('user')` no console
4. **Qual email** você está usando para login

---

## 🔍 VERIFICAÇÃO MANUAL DO CÓDIGO

Se ainda não funcionar, execute:

```bash
cd /home/user/new-dash/frontend/src/pages
grep -n "PortfolioEditor" ClientDashboard.jsx
```

Deve retornar:
```
15:import PortfolioEditor from '../components/dashboard/PortfolioEditor';
124:{isAdmin() && (
125:  <PortfolioEditor
```

---

## ⚡ SOLUÇÃO RÁPIDA - FORÇAR EXIBIÇÃO

Se quiser testar removendo a restrição de admin temporariamente:

**Arquivo:** `frontend/src/pages/ClientDashboard.jsx`

**Mudar de:**
```jsx
{isAdmin() && (
  <PortfolioEditor
    clientId={currentClientId}
    portfolio={portfolio}
    onUpdate={fetchDashboard}
  />
)}
```

**Para:**
```jsx
<PortfolioEditor
  clientId={currentClientId}
  portfolio={portfolio}
  onUpdate={fetchDashboard}
/>
```

**⚠️ ATENÇÃO:** Isso vai mostrar o botão para TODOS (inclusive clientes). Apenas para teste!

---

## 📞 ME INFORME

Por favor, me diga:

1. ✅ Você está logado como admin? (caiojundi@gmail.com)
2. ✅ Você vê o botão "Editar Portfólio"?
3. ✅ Se não vê, há algum erro no console?
4. ✅ Qual navegador está usando?
5. ✅ O backend está rodando?

Com essas informações posso te ajudar melhor!
