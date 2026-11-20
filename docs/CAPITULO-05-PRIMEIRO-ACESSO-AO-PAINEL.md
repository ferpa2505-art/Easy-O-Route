# Capítulo 05: Primeiro Acesso ao Painel

> **Baseado no ebook "IA BARATA de Verdade" - Fernando Paulino**

---

## 🎯 O que você vai aprender neste capítulo

- ✅ **Visão geral do painel** do OmniRoute
- ✅ **Navegação** pelos menus principais
- ✅ **Criar sua chave do OmniRoute**
- ✅ **Teste rápido** para verificar se tudo funciona
- ✅ **Os 3 dados** que toda ferramenta pede

---

## 🖥️ O Painel: Sala de Controle do OmniRoute

O painel é onde você **conecta provedores, monta combos e acompanha o gasto**.

> **💡 Não tenha medo da quantidade de menus! Você vai usar poucos.**

---

## 🗺️ O Mapa da Tela Inicial

A tela de **Início** (Home) é a primeira que você vê depois de entrar.

### 📌 Os 4 elementos principais:

```
┌─────────────────────────────────────────────────────────────┐
│  OMNIROUTE 3.8.54                          [Logado como: você] │
├───────────────────┬─────────────────────────────────────────┤
│                   │                                         │
│  1. MENU LATERAL  │  2. INÍCIO RÁPIDO                       │
│                   │     ════════════════════                │
│  • Endpoints     │     ✓ Criar chave de API                │
│  • Gerenciador   │     ✓ Conectar provedores               │
│    API           │     ✓ Apontar seu cliente              │
│  • Provedores    │     ✓ Monitorar                       │
│  • Modelos       │                                         │
│  • Combinações   │  3. TOPOLOGIA DO PROVEDOR               │
│  • Combo Studio  │     [Diagrama: OmniRoute no centro]     │
│  • Análises      │     ✅ Ativos / ⚠️ Recentes / ❌ Erro │
│  • Custos        │                                         │
│  • Monitoramento │  4. REQUISIÇÕES RECENTES                │
│  • Configuração  │     [Tabela: Últimos pedidos]            │
│  • Ajuda         │     Modelo | Tokens Entrada | Tokens Saída│
│                   │                                         │
└───────────────────┴─────────────────────────────────────────┘
```

### 📝 Descrição dos elementos:

1. **Menu lateral** - Aqui ficam todas as áreas do painel
2. **Início rápido** - Os 4 passos do OmniRoute
3. **Topologia do provedor** - Desenho mostrando OmniRoute e provedores
4. **Requisições recentes** - Últimos pedidos: modelo, tokens de entrada/saída

---

## 📁 O Menu Lateral, Sem Mistério

| Menu | O que faz | Importância |
|------|-----------|-------------|
| **Endpoints** | Os endereços que suas ferramentas usam | ⭐⭐⭐ |
| **Gerenciador API** | Suas chaves do OmniRoute | ⭐⭐⭐ |
| **Provedores** | Conectar as IAs (Mistral, Groq, etc.) | ⭐⭐⭐ |
| **Modelos e Combos** | Lista de modelos e combos disponíveis | ⭐⭐⭐ |
| **Combinações** | Crie seus combos (filas de reserva) | ⭐⭐⭐ |
| **Combo Studio** | Teste seus combos ao vivo | ⭐⭐ |
| **Cota do Provedor** | Quanto de cada provedor você pode usar | ⭐⭐ |
| **Análises** | Métricas de uso | ⭐ |
| **Custos** | Visualização de custos | ⭐ |
| **Monitoramento** | Monitoramento em tempo real | ⭐ |
| **Configuração** | Configurações do sistema | ⭐⭐ |
| **Ajuda** | Documentação e suporte | ⭐ |

---

## 🔑 Sua Chave do OmniRoute

Suas ferramentas precisam **provar ao OmniRoute** que são suas.

### 📝 Como criar:

1. Vá em **Endpoint** → **Chaves Registradas**
2. Clique em **Criar Chave** (ou **Add Key**)
3. Dê um nome (ex: `minha-ferramenta`, `claude-code`)
4. Clique em **Salvar**

> **⚠️ ATENÇÃO: A chave do OmniRoute também é senha!**
> - Guarde num **gerenciador de senhas**
> - **Nunca a cole em chats, grupos ou capturas de tela**

### 💡 Dica importante
> **Crie uma chave por ferramenta ou ambiente.**
> 
> Se uma vazar, você apaga **só ela**.

---

## 📋 Os 3 Dados que Toda Ferramenta Pede

Toda ferramenta que você conectar ao OmniRoute precisa de **3 informações**:

| Campo | O que colocar | Exemplo |
|-------|---------------|---------|
| **URL base** | Endereço do OmniRoute | `http://localhost:20128/v1` |
| **Chave de API** | A chave que você criou | `OR-xyz123...` |
| **Modelo** | Modelo ou combo | `auto` ou `combo/economico` |

---

## ⚡ Teste Rápido de 2 Minutos

Peça ao OmniRoute a lista de modelos que ele conhece.

### Windows (PowerShell):

```powershell
curl.exe http://localhost:20128/v1/models -H "Authorization: Bearer SUA_CHAVE"
```

### Linux/Mac (Terminal):

```bash
curl http://localhost:20128/v1/models -H "Authorization: Bearer SUA_CHAVE"
```

> **✅ Resultado esperado**: Uma lista de modelos em formato JSON

### Exemplo de resultado (resumido):

```json
{
  "data": [
    {"id": "auto/best-coding", "name": "Best Coding"},
    {"id": "auto/best-reasoning", "name": "Best Reasoning"},
    {"id": "auto/best-fast", "name": "Best Fast"},
    {"id": "mistral/codestral-latest", "name": "Codestral Latest"},
    ...
  ]
}
```

> **💡 Se aparecer uma lista, o OmniRoute está respondendo corretamente!**

---

## 💡 Dica: Modelos Auto

Os nomes como `auto/best-coding`, `auto/best-fast` são **atalhos prontos**.

Você vai criar **seus próprios combos** no Capítulo 07.

---

## 📋 Resumo do Capítulo

| ✅ | Conceito | Onde | Como |
|----|----------|------|------|
| 1 | **Tela de Início** | Painel | 4 elementos principais |
| 2 | **Menu Lateral** | Painel | Poucos menus são usados |
| 3 | **Chave do OmniRoute** | Endpoint → Chaves Registradas | Criar uma por ferramenta |
| 4 | **3 Dados** | Toda ferramenta | URL, Chave, Modelo |
| 5 | **Teste Rápido** | Terminal | `curl` com sua chave |

---

## 🔗 Próximo Capítulo

👉 **Capítulo 06 (Conectando Provedores) ainda não foi escrito.** Enquanto isso, use `easy-o-route providers --setup-guide`.

---

<div align="center">
  <p><strong>Capítulo 05</strong> - Primeiro Acesso ao Painel</p>
  <p>✨ Parte da documentação Easy-O-Route</p>
</div>
