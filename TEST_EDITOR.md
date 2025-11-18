# 🧪 TESTE RÁPIDO - Editor de Portfólio

## PASSO 1: Verificar se você está como ADMIN

Abra o console do navegador (F12) e digite:

```javascript
JSON.parse(localStorage.getItem('user'))
```

**Resultado esperado:**
```json
{
  "id": 1,
  "name": "Administrador Nishizawa",
  "email": "caiojundi@gmail.com",
  "role": "admin"
}
```

**Se `role` não for `"admin"`:**
- Faça logout
- Faça login com: `caiojundi@gmail.com` / `admin123`

---

## PASSO 2: Verificar se o componente foi importado

No console do navegador, digite:

```javascript
// Ver se há erros de React
console.log('React version:', React.version)
```

---

## PASSO 3: TESTE VISUAL SIMPLES

Adicione esta linha temporariamente no `ClientDashboard.jsx`:

**Logo após a linha 70**, adicione:

```jsx
<div className="fixed bottom-6 right-6 bg-red-500 text-white p-4 rounded-lg z-50">
  TESTE: Admin = {isAdmin() ? 'SIM' : 'NÃO'}
</div>
```

Isso vai mostrar um quadrado vermelho no canto da tela dizendo se você é admin ou não.

---

## PASSO 4: Se não funcionar, use esta versão SUPER SIMPLIFICADA

Substitua TEMPORARIAMENTE o conteúdo de `PortfolioEditor.jsx` por:

```jsx
import React, { useState } from 'react';

const PortfolioEditor = ({ clientId, portfolio, onUpdate }) => {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      {/* Botão sempre visível para teste */}
      <button
        onClick={() => {
          alert('Botão funciona! clientId: ' + clientId);
          setShowModal(true);
        }}
        style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          padding: '15px 30px',
          backgroundColor: '#3B82F6',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          fontSize: '16px',
          fontWeight: 'bold',
          cursor: 'pointer',
          zIndex: 9999
        }}
      >
        ✏️ TESTE EDITOR
      </button>

      {/* Modal simples */}
      {showModal && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.8)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 10000
          }}
          onClick={() => setShowModal(false)}
        >
          <div
            style={{
              backgroundColor: '#1a1d29',
              padding: '40px',
              borderRadius: '12px',
              color: 'white'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h2>✅ Modal Funcionando!</h2>
            <p>Cliente ID: {clientId}</p>
            <p>Ativos: {portfolio?.length || 0}</p>
            <button
              onClick={() => setShowModal(false)}
              style={{
                marginTop: '20px',
                padding: '10px 20px',
                backgroundColor: '#666',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Fechar
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default PortfolioEditor;
```

---

## RESULTADO ESPERADO:

1. ✅ Você verá um botão azul "TESTE EDITOR" no canto inferior direito
2. ✅ Ao clicar, aparece um alert com o clientId
3. ✅ Depois abre um modal simples
4. ✅ Se isso funcionar, sabemos que o problema não é no código, mas na configuração

---

## ME AVISE:

Depois de testar, me diga:

1. O botão de TESTE apareceu?
2. O alert funcionou?
3. O modal abriu?
4. Qual é o `role` do seu usuário no localStorage?
