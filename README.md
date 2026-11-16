# Easy-O-Route

> **✨ O Facilitador Definitivo para Configuração do OmniRoute**

[![GitHub stars](https://img.shields.io/github/stars/ferpa2505-art/Easy-O-Route?style=social)](https://github.com/ferpa2505-art/Easy-O-Route/stargazers)
[![GitHub license](https://img.shields.io/github/license/ferpa2505-art/Easy-O-Route)](https://github.com/ferpa2505-art/Easy-O-Route/blob/main/LICENSE)
[![GitHub issues](https://img.shields.io/github/issues/ferpa2505-art/Easy-O-Route)](https://github.com/ferpa2505-art/Easy-O-Route/issues)
[![npm version](https://img.shields.io/npm/v/easy-o-route?label=npm)](https://www.npmjs.com/package/easy-o-route)
[![npm downloads](https://img.shields.io/npm/dw/easy-o-route)](https://www.npmjs.com/package/easy-o-route)
[![npm total downloads](https://img.shields.io/npm/dt/easy-o-route)](https://www.npmjs.com/package/easy-o-route)

---

## 🎯 **O que é o Easy-O-Route?**

**Easy-O-Route** é uma **CLI (Command Line Interface) + Scripts Bash** que **simplifica drasticamente** a configuração, gerenciamento e uso do **[OmniRoute](https://github.com/cheaper-inference/OmniRoute)** - o roteador de IA que permite usar **múltiplos provedores de IA** (Mistral, Groq, Google, NVIDIA, etc.) de forma **econômica e eficiente**.

Baseado no guia prático **["IA BARATA de Verdade"](https://github.com/ferpa2505-art/Easy-O-Route/docs)** - um ebook completo que ensina a instalar, configurar e medir economias com o OmniRoute.

---

## ✅ **Status do Projeto**

| Item | Status | Link |
|------|--------|------|
| **npm** | ✅ Publicado | [npmjs.com/package/easy-o-route](https://www.npmjs.com/package/easy-o-route) |
| **GitHub** | ✅ Publicado | [github.com/ferpa2505-art/Easy-O-Route](https://github.com/ferpa2505-art/Easy-O-Route) |
| **Release** | ✅ v1.0.0 | [Releases](https://github.com/ferpa2505-art/Easy-O-Route/releases) |
| **Documentação** | ✅ Completa | [docs/](docs/) |

---

## ⚡ **Por que usar o Easy-O-Route?**

### **💰 Economize até 89% nos custos com IA**
- Coloque **IAs gratuitas na frente da fila** e as pagas por último
- O dinheiro só sai quando todo o resto falha
- **Medido em uso real**: US$ 113,58 → US$ 12,09 (economia de **89%**)

### **⚡ Otimize seu fluxo de trabalho**
- **Sem precisar saber programar** - comandos simples e diretos
- **Configuração em minutos** - não em horas
- **Gerenciamento centralizado** - todas as suas chaves e provedores em um lugar

### **🛡️ Segurança e Controle**
- **Chaves criptografadas** no seu computador
- **Nunca compartilhe chaves** em chats ou grupos
- **Controle total** sobre quais provedores são usados

---

## 📦 **Instalação**

### **Opção 1: Instalação Global (Recomendado)**

```bash
# Instalar o Easy-O-Route globalmente
npm install -g easy-o-route

# Verificar versão
easy-o-route --version
```

### **Opção 2: Instalação Direta do GitHub**

```bash
# Clonar e instalar
npm install -g https://github.com/ferpa2505-art/Easy-O-Route.git
```

### **Opção 2: Instalação Local (Para desenvolvimento)**

```bash
# Clonar o repositório
git clone https://github.com/ferpa2505-art/Easy-O-Route.git
cd Easy-O-Route

# Instalar dependências
npm install

# Link global (opcional)
npm link

# Rodar normalmente
node dist/index.js
```

### **Opção 3: Usar Scripts Bash (Sem Node.js)**

```bash
# Baixar scripts
curl -L https://raw.githubusercontent.com/ferpa2505-art/Easy-O-Route/main/scripts/setup.sh -o setup.sh
chmod +x setup.sh

# Executar setup
./setup.sh
```

---

## 🚀 **Guia Rápido de Uso**

### **1️⃣ Configuração Inicial**

```bash
# Setup completo (instala OmniRoute + configura)
easy-o-route setup

# Ou use o script Bash
./scripts/setup.sh
```

### **2️⃣ Gerenciar Provedores**

```bash
# Listar todos os provedores
easy-o-route provider list

# Testar conexão com um provedor
easy-o-route provider test mistral

# Adicionar novo provedor (interativo)
easy-o-route provider add

# Ver informações de um provedor
easy-o-route provider info mistral
```

### **3️⃣ Gerenciar Chaves API**

```bash
# Adicionar chave API para um provedor
easy-o-route api add --provider mistral --key SUA_CHAVE

# Listar todas as chaves
easy-o-route api list

# Remover uma chave
easy-o-route api remove --provider mistral
```

### **4️⃣ Criar e Gerenciar Combos**

```bash
# Criar um novo combo
easy-o-route combo create economico --strategy priority --models "mistral/codestral-latest,nvidia/llama-3.2-90b,groq/llama-3.1-70b"

# Listar todos os combos
easy-o-route combo list

# Usar um combo
easy-o-route combo use economico

# Deletar um combo
easy-o-route combo delete economico
```

### **5️⃣ Backup e Restauração**

```bash
# Criar backup das configurações
easy-o-route backup create

# Listar backups
easy-o-route backup list

# Restaurar backup
easy-o-route backup restore

# Deletar backup
easy-o-route backup delete
```

### **6️⃣ Validar e Monitorar**

```bash
# Validar configuração atual
easy-o-route validate

# Ver status do OmniRoute
easy-o-route status

# Ver versão
easy-o-route version
```

---

## 📖 **Documentação Completa**

### **📚 Guia do Usuário (Baseado no Ebook "IA BARATA de Verdade")**

| Capítulo | Descrição | Link |
|----------|-----------|------|
| **Capítulo 01** | Por que a IA fica cara (tokens, preços, desperdício) | [Ler](docs/CAPITULO-01-POR-QUE-A-IA-FICA-CARA.md) |
| **Capítulo 02** | O que é o OmniRoute (central de IAs, combos) | [Ler](docs/CAPITULO-02-O-QUE-E-O-OMNIROUTE.md) |
| **Capítulo 03** | Antes de começar (requisitos, segurança) | [Ler](docs/CAPITULO-03-ANTES-DE-COMECAR.md) |
| **Capítulo 04** | Instalando o OmniRoute (Windows, Mac, Linux) | [Ler](docs/CAPITULO-04-INSTALANDO-O-OMNIROUTE.md) |
| **Capítulo 05** | Primeiro acesso ao painel | [Ler](docs/CAPITULO-05-PRIMEIRO-ACESSO-AO-PAINEL.md) |
| **Capítulo 06** | Conectando provedores (Mistral, Groq, etc.) | [Ler](docs/CAPITULO-06-CONECTANDO-PROVEDORES.md) |
| **Capítulo 07** | Combos: a fila de reserva | [Ler](docs/CAPITULO-07-COMBOS-A-FILA-DE-RESERVA.md) |
| **Capítulo 08** | Ligando suas ferramentas (Claude Code, etc.) | [Ler](docs/CAPITULO-08-LIGANDO-SUAS-FERRAMENTAS.md) |
| **Capítulo 09** | Medindo o uso (tokens, custos, cotas) | [Ler](docs/CAPITULO-09-MEDINDO-O-USO.md) |
| **Capítulo 10** | Quanto você economizou (método de cálculo) | [Ler](docs/CAPITULO-10-QUANTO-VOCE-ECONOMIZOU.md) |
| **Capítulo 11** | Limites e armadilhas | [Ler](docs/CAPITULO-11-LIMITES-E-ARMADILHAS.md) |
| **Capítulo 12** | Problemas e soluções | [Ler](docs/CAPITULO-12-PROBLEMAS-E-SOLUCOES.md) |
| **Capítulo 13** | Checklist, glossário e próximos passos | [Ler](docs/CAPITULO-13-CHECKLIST-GLOSSARIO.md) |

### **🎓 Tutoriais Práticos**

- **[Guia Rápido de Instalação](docs/GUIA-RAPIDO.md)** - Instale em 5 minutos
- **[Guia de Configuração](docs/INSTALACAO.md)** - Configuração passo a passo
- **[Exemplos de Combos](docs/EXEMPLOS-COMBOS.md)** - Combos prontos para usar
- **[Segurança](docs/SEGURANCA.md)** - Melhores práticas de segurança

---

## 🎨 **Exemplo de Combo (Fila de Reserva)**

```yaml
# Combo "economico" - Gratuitos na frente, pagos por último
combo: economico
strategy: priority
models:
  # 🟢 Gratuitos - Grande capacidade
  - mistral/codestral-latest        # 95% de acerto
  - nvidia/llama-3.2-90b            # 81% de acerto
  - google/gemini-1.5-flash        # Bom para textos longos
  
  # 🟡 Gratuitos - Reserva
  - openrouter/mistralai/mistral-7b-instruct
  - groq/llama-3.1-70b              # 10% de acerto (recusa pedidos grandes)
  - cloudflare/llama-3.1-8b
  
  # 🔴 Pagos - Última reserva (com teto de gasto)
  - deepseek/deepseek-chat          # US$ 0,0005/token
  - anthropic/claude-haiku-5.5     # US$ 0,25/1M tokens (até 100k)
```

**Resultado médio do autor:**
- **Taxa de sucesso:** 68% (com combo)
- **Latência média:** ~10 segundos
- **Economia:** 89% (US$ 113,58 → US$ 12,09)

---

## 📊 **Métricas do Autor (Oct/2026)**

| Métrica | Valor | Observação |
|---------|-------|------------|
| **Tokens de entrada** | 260,7 milhões | - |
| **Tokens de saída** | 1,3 milhão | - |
| **Solicitações** | 6.623 | - |
| **Modelos usados** | 181 | - |
| **Taxa de acerto** | 68% | Com combo |
| **Custo de tabela** | US$ 63,07 | Preço de lista |
| **Custo real** | US$ 0,00 | Provedores gratuitos |
| **Economia** | **89%** | vs. US$ 113,58 anterior |

---

## 🛠️ **Comandos CLI Disponíveis**

```
Usage: easy-o-route [options] [command]

Commands:
  setup           Configuração inicial do OmniRoute
  api             Gerenciar chaves API
  provider        Gerenciar provedores
  combo           Gerenciar combos
  backup          Gerenciar backups
  validate        Validar configuração
  status          Status do OmniRoute
  version         Versão do Easy-O-Route
  help [cmd]      Help

Options:
  -v, --version   Output the current version
  -h, --help      Display help for command
```

---

## 🤝 **Contribuindo**

1. **Fork** o repositório
2. **Clone** o fork: `git clone https://github.com/YOUR_USERNAME/Easy-O-Route.git`
3. **Crie uma branch**: `git checkout -b feature/nova-funcionalidade`
4. **Faça commit**: `git commit -m 'Adiciona nova funcionalidade'`
5. **Push**: `git push origin feature/nova-funcionalidade`
6. **Abra um Pull Request**

---

## 📜 **Licença**

Este projeto é licenciado sob a **MIT License** - veja [LICENSE](LICENSE) para detalhes.

---

## 🙏 **Agradecimentos**

- **[OmniRoute](https://github.com/cheaper-inference/OmniRoute)** - O roteador de IA incrível
- **[Fernando Paulino](https://github.com/ferpa2505-art)** - Autor do ebook "IA BARATA de Verdade"
- **Comunidade de IA Open Source** - Por tornarem a IA acessível a todos

---

## 📞 **Suporte**

- **Documentação**: [docs/](docs/)
- **Issues**: [GitHub Issues](https://github.com/ferpa2505-art/Easy-O-Route/issues)
- **Discussões**: [GitHub Discussions](https://github.com/ferpa2505-art/Easy-O-Route/discussions)
- **Ebook Original**: [IA BARATA de Verdade](docs/README.md)

---

<div align="center">
  <p><strong>Easy-O-Route</strong> - O facilitador definitivo para o OmniRoute</p>
  <p>✨ Feito com ❤️ pela comunidade de IA open source</p>
</div>
