# Capítulo 03: Antes de Começar

> **Baseado no ebook "IA BARATA de Verdade" - Fernando Paulino**

---

## 🎯 O que você vai aprender neste capítulo

- ✅ **Requisitos do computador** (Windows, Mac, Linux)
- ✅ **Contas que você vai criar** (Provedores gratuitos)
- ✅ **7 Regras de segurança** que valem ouro
- ✅ **Onde ficam seus dados**
- ✅ **Checklist** antes de avançarm

---

## 📋 Este capítulo é curto de propósito

Aqui você **confere** se o seu computador está pronto, **descobre** quais contas vai criar e **aprende** as regras de segurança que evitam o **erro mais caro** deste mundo: **deixar uma chave vazar**.

---

## 💻 O que você precisa ter

| Item | Requisito | Verificação |
|------|-----------|-------------|
| **Computador** | Windows, Mac ou Linux, de uso comum | ✅ Qualquer PC moderno |
| **Node.js** | Versão 22.22.2 (até 22.x) ou 24+ | `node --version` |
| **Internet** | Conexão estável | ✅ |
| **Navegador** | Chrome, Firefox, Edge, etc. | ✅ |
| **E-mail** | Para criar contas nos provedores | ✅ |
| **Tempo** | 30-60 minutos (primeira vez) | ⏳ |

### 🔍 Como verificar o Node.js

```bash
# Verificar versão do Node.js
node --version

# Verificar versão do npm
npm --version
```

> **✅ Recomendado**: Instale a **versão LTS mais recente** (24.x)

---

## 🆓 As contas que você vai criar

O OmniRoute **só funciona de verdade** com as contas que você conectar.

**Você não precisa de todas!** Comece com **2 ou 3 gratuitas** e vá aumentando.

### 🟢 Provedores Gratuitos (Recomendados)

| Provedor | Site | Taxa de Acerto (Autor) | Observações |
|----------|------|------------------------|-------------|
| **Mistral** | [console.mistral.ai](https://console.mistral.ai) | **95%** | Rápido e bom em código |
| **Groq** | [console.groq.com](https://console.groq.com) | **10%** | Muito rápido, mas recusa pedidos grandes |
| **Google Gemini** | [aistudio.google.com](https://aistudio.google.com) | - | Textos longos, cota diária |
| **NVIDIA** | [build.nvidia.com](https://build.nvidia.com) | **81%** | Modelos gigantes, pode ser lento |
| **Cloudflare** | [dash.cloudflare.com](https://dash.cloudflare.com) | - | Reserva, pede ID da conta e token |
| **OpenRouter** | [openrouter.ai](https://openrouter.ai) | **25%** | Variedade, limite diário baixo |
| **Ollama Cloud** | [ollama.com](https://ollama.com) | - | Plano gratuito limitado |

### 💰 Provedores Pagos (Reserva - Opcional)

| Provedor | Site | Custo | Observações |
|----------|------|-------|-------------|
| **DeepSeek** | [platform.deepseek.com](https://platform.deepseek.com) | ~US$ 0,0005/token | Raciocínio barato, exige saldo |
| **Anthropic** | [console.anthropic.com](https://console.anthropic.com) | US$ 0,25-2,50/1M tokens | Claude Haiku/Sonnet/Opus |

### ⚠️ Cadastros que pedem cartão

**Segundo o próprio OmniRoute:**
> Camadas gratuitas podem exigir cadastro, aprovação ou até um meio de pagamento.

**Exemplos (testados pelo autor):**
- Alibaba (Qwen) - **exigiu cartão**
- BytePlus (Doubao) - **exigiu cartão**

> **💡 Se um cadastro pedir cartão e você não quiser dar, pare e escolha outro provedor!**

---

## 🔐 7 Regras de Segurança que Valem Ouro

### 1️⃣ Chave de API é senha
> **Quem tem a sua chave usa a sua conta e pode gastar o seu dinheiro.**

### 2️⃣ Nunca cole chaves em chats, grupos ou e-mails
> **Nem para pedir ajuda!**

### 3️⃣ Cuidado com capturas de tela
> **Cubra chaves, e-mails e tokens antes de compartilhar qualquer print!**

> **⚠️ Chaves vazam assim com frequência!**

### 4️⃣ Vazou? Troque na hora
> Entre no site do provedor, **apague a chave antiga** e crie outra. **É grátis e leva um minuto.**

### 5️⃣ Ponha teto nos provedores pagos
> Coloque **só o saldo que aceita perder**. **O saldo é o seu freio.**

### 6️⃣ Fuja de atalhos por cookie ou conta pessoal
> Provedores marcados como "web" usam o login do seu navegador. **Podem violar os termos do serviço e levar ao bloqueio da sua conta.**

### 7️⃣ Seus textos vão para o provedor
> **O que você pede é enviado à IA escolhida.** **Não envie senhas, documentos ou dados de terceiros a provedores gratuitos.**

---

## 💾 Onde ficam os seus dados

O OmniRoute **guarda tudo numa pasta no seu computador**, e **nada fica num servidor dele**.

Segundo o próprio projeto: **as credenciais são criptografadas no disco.**

### 📁 Localização da pasta

| Sistema | Pasta |
|---------|-------|
| **Windows** | `C:\Users\SEU_USUÁRIO\.omniroute` |
| **Mac** | `~/.omniroute` |
| **Linux** | `~/.omniroute` |

### 💡 Dica importante
> **Faça uma cópia dessa pasta de vez em quando!** Nela estão seus provedores, seus combos e seu histórico. **Guarde a cópia num lugar seguro**, porque ela contém dados sensíveis.

---

## ✅ Checklist antes de avançar

- [ ] Sei qual sistema vou usar (Windows, Mac ou Linux)
- [ ] Tenho e-mail e navegador funcionando
- [ ] Tenho Node.js instalado (versão 24.x)
- [ ] Escolhi 2 ou 3 provedores gratuitos para começar
- [ ] Entendi que **chave é senha** e que **não vou colá-la em chats**
- [ ] Sei que meus dados ficam em `~/.omniroute`

---

## 📋 Resumo do Capítulo

| ✅ | Tópico | Explicação |
|----|--------|------------|
| 1 | **Requisitos** | Node.js, internet, navegador, e-mail, tempo |
| 2 | **Provedores** | Comece com 2-3 gratuitos (Mistral, Groq, etc.) |
| 3 | **Segurança** | Chave é senha: nunca em chats, grupos ou prints |
| 4 | **Dados** | Ficam em `~/.omniroute` no seu computador |

---

## 🔗 Próximo Capítulo

👉 **[Capítulo 04: Instalando o OmniRoute →](CAPITULO-04-INSTALANDO-O-OMNIROUTE.md)**

*Instale o OmniRoute e abra o painel no navegador!*

---

<div align="center">
  <p><strong>Capítulo 03</strong> - Antes de Começar</p>
  <p>✨ Parte da documentação Easy-O-Route</p>
</div>
