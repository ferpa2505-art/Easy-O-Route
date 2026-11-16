# 🚀 Guia Rápido Easy-O-Route

> **Instale, configure e comece a economizar em 5 minutos!**

---

## 🎯 O que é o Easy-O-Route?

**Easy-O-Route** é uma **CLI (Command Line Interface)** que simplifica a configuração e uso do **[OmniRoute](https://github.com/cheaper-inference/OmniRoute)** - o roteador de IA que permite usar **múltiplos provedores de IA** de forma **econômica e eficiente**.

---

## ⚡ Instalação Rápida

### Windows / Mac / Linux

```bash
# 1. Instalar Node.js (se não tiver)
#    Baixe em: https://nodejs.org (versão LTS 24.x)

# 2. Instalar o OmniRoute
npm install -g omniroute

# 3. Instalar o Easy-O-Route (opcional - coordenador)
npm install -g easy-o-route

# 4. Ligar o OmniRoute
omniroute
```

> **✅ Pronto!** Acesse: [http://localhost:20128](http://localhost:20128)

---

## 🔧 Configuração Inicial

### 1️⃣ Trocar a Senha

1. Entre com a senha padrão: **`CHANGEME`**
2. Vá em **Configuração** → **Senha**
3. Troque para uma senha segura

### 2️⃣ Criar Chave do OmniRoute

1. Vá em **Endpoint** → **Chaves Registradas**
2. Clique em **Criar Chave**
3. Dê um nome (ex: `minha-cli`)
4. Salve a chave em um lugar seguro

### 3️⃣ Conectar Provedores

**Provedores gratuitos recomendados:**

| Provedor | Site | Taxa de Acerto |
|----------|------|----------------|
| Mistral | [console.mistral.ai](https://console.mistral.ai) | 95% |
| NVIDIA | [build.nvidia.com](https://build.nvidia.com) | 81% |
| Groq | [console.groq.com](https://console.groq.com) | 10% (recusa pedidos grandes) |
| Google Gemini | [aistudio.google.com](https://aistudio.google.com) | - |

**Passos:**
1. Crie conta no site do provedor
2. Gere uma **Chave de API**
3. No OmniRoute: **Provedores** → **Adicionar**
4. Escolha o provedor e cole a chave
5. Teste a conexão

---

## 🎯 Criar seu Primeiro Combo

**Combo = Fila de reserva: gratuitos na frente, pagos por último**

### Usando o Easy-O-Route CLI:

```bash
# Criar combo "economico"
easy-o-route combo create economico \
  --strategy priority \
  --models "mistral/codestral-latest,nvidia/llama-3.2-90b,groq/llama-3.1-70b,deepseek/deepseek-chat"
```

### Usando o Painel:

1. Vá em **Combinações** → **Criar Combo**
2. Dê um nome: `economico`
3. Adicione modelos na ordem:
   - `mistral/codestral-latest`
   - `nvidia/llama-3.2-90b`
   - `google/gemini-1.5-flash`
   - `groq/llama-3.1-70b`
   - `deepseek/deepseek-chat` (pago - reserva)
4. Escolha estratégia: **priority**
5. Salve

---

## 🔗 Ligar suas Ferramentas

### Claude Code (Recomendado)

```bash
# Criar atalho para Claude Code
echo "@echo off" > claude-easy.cmd
echo "set OMNIROUTE_API_KEY=SUA_CHAVE" >> claude-easy.cmd
echo "set ANTHROPIC_BASE_URL=http://localhost:20128" >> claude-easy.cmd
echo "set ANTHROPIC_API_KEY=SUA_CHAVE" >> claude-easy.cmd
echo "claude %*" >> claude-easy.cmd
```

### Outras Ferramentas

**Dados que toda ferramenta precisa:**

| Campo | Valor |
|-------|-------|
| URL base | `http://localhost:20128/v1` |
| Chave de API | SUA_CHAVE_DO_OMNIROUTE |
| Modelo | `combo/economico` ou `auto` |

---

## 📊 Testar a Configuração

### Teste rápido com curl:

```bash
# Listar modelos disponíveis
curl http://localhost:20128/v1/models \
  -H "Authorization: Bearer SUA_CHAVE"

# Fazer uma pergunta
curl http://localhost:20128/v1/chat/completions \
  -H "Authorization: Bearer SUA_CHAVE" \
  -H "Content-Type: application/json" \
  -d '{"model":"combo/economico","messages":[{"role":"user","content":"Explique o que é um token."}]}'
```

### Usando o Combo Studio:

1. Vá em **Combo Studio**
2. Escolha o combo `economico`
3. Digite uma pergunta
4. Veja qual provedor respondeu

---

## 💰 Medir a Economia

### Painel do OmniRoute:

1. Vá em **Análises** → **Visão Geral**
2. Veja:
   - Tokens de entrada/saída
   - Nível de cache (reutilização)
   - Custo de tabela
   - Taxa de acerto por provedor

### Comparativo do Autor:

| Período | Tokens | Custo sem OmniRoute | Custo com OmniRoute | Economia |
|---------|--------|---------------------|---------------------|----------|
| Set/2026 | 582,6M | US$ 113,58 | US$ 113,58 | 0% |
| Out/2026 | 300M | ~US$ 60 | US$ 12,09 | **89%** |

---

## 📌 Dicas Rápidas

### ✅ Faça isso:

1. **Comece com 3 provedores gratuitos** (Mistral, NVIDIA, Groq)
2. **Modelos grandes na frente** para pedidos de ferramentas de código
3. **Revise o combo a cada 2-3 semanas** (modelos mudam)
4. **Defina tetos de gasto** em provedores pagos
5. **Faça backup da pasta `~/.omniroute`**

### ❌ Não faça isso:

1. **Não cole chaves em chats ou grupos** (mesmo para pedir ajuda)
2. **Não use modelos que recusam pedidos grandes na frente** (ex: Groq)
3. **Não ignore erros 429** (limite de uso - o combo resolve)
4. **Não confunda custo de tabela com custo real**
5. **Não use provedores com cookie** (pode violar termos)

---

## 🆘 Resolver Problemas

### Erros comuns:

| Erro | Causa | Solução |
|------|-------|---------|
| **429** | Limite de uso | Combo com fallbacks |
| **413** | Pedido grande | Modelos grandes na frente |
| **529/503** | Servidor lotado | Tentar novamente |
| **401** | Chave errada | Verificar chave API |
| **403** | Cota esgotada | Verificar cota |
| **404** | Modelo não existe | Remover do combo |

### Check-up:

```bash
# Verificar se tudo está certo
omniroute doctor

# Testar todos os provedores
omniroute providers test-all
```

---

## 🎓 Próximos Passos

1. **Leia o ebook completo**: [Documentação](README.md)
2. **Aprofunde-se**: Chapters 01-13
3. **Contribua**: [GitHub](https://github.com/ferpa2505-art/Easy-O-Route)
4. **Compartilhe**: Compartilhe com a comunidade!

---

## 📞 Suporte

- **Documentação**: [docs/](.)
- **Issues**: [GitHub Issues](https://github.com/ferpa2505-art/Easy-O-Route/issues)
- **Discussões**: [GitHub Discussions](https://github.com/ferpa2505-art/Easy-O-Route/discussions)

---

<div align="center">
  <h2>✨ Easy-O-Route - Guia Rápido</h2>
  <p>O facilitador definitivo para o OmniRoute</p>
  <p>Feito com ❤️ pela comunidade de IA open source</p>
</div>
