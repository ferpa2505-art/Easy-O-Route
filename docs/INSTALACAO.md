# 📋 Guia de Instalação Completo - Easy-O-Route

> **Guia passo a passo para instalar e configurar o Easy-O-Route e o OmniRoute**

---

## 🎯 Visão Geral

Este guia contém **todos os passos necessários** para:
1. Instalar o Node.js
2. Instalar o OmniRoute
3. Instalar o Easy-O-Route (opcional, mas recomendado)
4. Configurar o ambiente
5. Testar a instalação

---

## 📋 Pré-requisitos

### Sistema Operacional
- ✅ **Windows** 10/11 (64-bit)
- ✅ **macOS** 10.15+ (Catalina ou superior)
- ✅ **Linux** (qualquer distribuição moderna: Ubuntu, Fedora, Debian, etc.)

### Requisitos de Hardware
- **CPU**: Qualquer processador moderno
- **RAM**: 4GB mínimo (recomendado 8GB+)
- **Espaço em disco**: 500MB livre
- **Conexão com a internet**: Estável

---

## 🚀 Passo 1: Instalar o Node.js

O OmniRoute e o Easy-O-Route requerem o **Node.js** versão **22.x ou 24.x**.

### Windows

1. **Baixe o Node.js** em: [https://nodejs.org](https://nodejs.org)
2. **Selecionar versão LTS** (24.x recomendado)
3. **Execute o instalador** e siga as instruções
4. **Verifique a instalação**

### Mac

#### Opção A: Usando o site oficial
1. Acesse: [https://nodejs.org](https://nodejs.org)
2. Baixe a versão LTS (24.x)
3. Execute o instalador

#### Opção B: Usando Homebrew (recomendado)
```bash
# Instalar Homebrew (se não tiver)
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Instalar Node.js
brew install node@24

# Adicionar ao PATH
echo 'export PATH="/usr/local/opt/node@24/bin:$PATH"' >> ~/.zshrc
echo 'export PATH="/usr/local/opt/node@24/bin:$PATH"' >> ~/.bashrc

# Recarregar shell
source ~/.zshrc  # ou ~/.bashrc
```

### Linux (Ubuntu/Debian)

```bash
# Instalar dependências
sudo apt update
sudo apt install -y curl gnupg ca-certificates

# Adicionar repositório do NodeSource
curl -fsSL https://deb.nodesource.com/setup_24.x | sudo -E bash -

# Instalar Node.js
sudo apt install -y nodejs

# Verificar instalação
node --version
npm --version
```

### Linux (Fedora/RHEL/CentOS)

```bash
# Instalar Node.js 24.x
curl -fsSL https://rpm.nodesource.com/setup_24.x | sudo bash -
sudo dnf install -y nodejs

# Verificar instalação
node --version
npm --version
```

### Verificar Instalação

```bash
# Verificar Node.js
node --version
# Deve mostrar: v24.x.x

# Verificar npm
npm --version
# Deve mostrar: 10.x.x ou superior
```

> **⚠️ Se os comandos não funcionarem, reinicie o terminal ou o computador**

---

## 🚀 Passo 2: Instalar o OmniRoute

### Método 1: Instalação Global (Recomendado)

```bash
# Instalar globalmente
npm install -g omniroute

# Verificar versão
omniroute --version
# Deve mostrar: 3.8.52 ou superior
```

#### Se houver erro com npm 11+:

```bash
# Liberar scripts necessários
npm install -g omniroute --allow-scripts=omniroute,keytar,onnxruntime-node,@parcel/watcher,@swc/core,protobufjs,esbuild --force
```

### Método 2: Usando Docker (Linux/Mac)

```bash
# Rodar com Docker
docker run -d \
  --name omniroute \
  --restart unless-stopped \
  --stop-timeout 40 \
  -p 127.0.0.1:20128:20128 \
  -v omniroute-data:/app/data \
  diegosouzapw/omniroute:latest
```

> **⚠️ O Docker usa 1GB de memória por padrão. Para ferramentas de programação, pode ser necessário aumentar.**

### Verificar Instalação

```bash
# Verificar se o comando está disponível
which omniroute  # Linux/Mac
where omniroute  # Windows

# Verificar versão
omniroute --version
```

---

## 🚀 Passo 3: Instalar o Easy-O-Route (Opcional, mas Recomendado)

### Método 1: Instalação Global

```bash
# Instalar globalmente
npm install -g easy-o-route

# Verificar
Easy-O-Route --version
# ou
easy-o-route --version
```

### Método 2: Instalação Local (Para desenvolvimento)

```bash
# Clonar repositório
git clone https://github.com/ferpa2505-art/Easy-O-Route.git
cd Easy-O-Route

# Instalar dependências
npm install

# Link global (para usar o comando easy-o-route)
npm link

# Verificar
easy-o-route --version
```

### Método 3: Usar Scripts Bash (Sem Node.js)

```bash
# Baixar scripts
curl -L https://raw.githubusercontent.com/ferpa2505-art/Easy-O-Route/main/scripts/setup.sh -o setup.sh
curl -L https://raw.githubusercontent.com/ferpa2505-art/Easy-O-Route/main/scripts/start.sh -o start.sh

# Tornar executáveis
chmod +x setup.sh start.sh

# Executar setup
./setup.sh
```

---

## 🚀 Passo 4: Configurar o OmniRoute

### Iniciar o OmniRoute

```bash
# Iniciar
omniroute
```

> **💡 Deixe a janela aberta e acesse o painel em: [http://localhost:20128](http://localhost:20128)**

### Primeiro Acesso

1. **Senha padrão**: `CHANGEME`
2. **Troque a senha** imediatamente (Configuração → Senha)
3. **Salve a nova senha** em um gerenciador de senhas

> **⚠️ NUNCA compartilhe esta senha!**

### Configurar Início Automático

```bash
# Windows
omniroute autostart enable

# Linux
omniroute autostart enable

# Mac (use o app OmniRouteTray)
# brew install --cask zoispag/tap/omniroute-tray
```

---

## 🚀 Passo 5: Configurar Provedores

### Provedores Gratuitos Recomendados

| Provedor | Site | Taxa de Acerto | Latência |
|----------|------|----------------|----------|
| **Mistral** | [console.mistral.ai](https://console.mistral.ai) | 95% | ~6.6s |
| **NVIDIA** | [build.nvidia.com](https://build.nvidia.com) | 81% | ~16.5s |
| **Groq** | [console.groq.com](https://console.groq.com) | 10% | ~0.8s |
| **Google** | [aistudio.google.com](https://aistudio.google.com) | - | ~3.8s |

### Passos para conectar cada provedor:

1. **Crie uma conta** no site do provedor
2. **Gere uma Chave de API** (na área do desenvolvedor)
3. **Copie a chave**
4. **No OmniRoute**:
   - Vá em **Provedores**
   - Clique em **Adicionar**
   - Escolha o provedor
   - Cole a chave
   - Salve
5. **Teste a conexão**

### Exemplo: Conectar Mistral

1. Acesse: [https://console.mistral.ai](https://console.mistral.ai)
2. Crie conta ou faça login
3. Vá em **API Keys** ou **Settings**
4. Crie uma nova chave
5. Copie a chave
6. No OmniRoute:
   - **Provedores** → **Adicionar**
   - Selecione **Mistral**
   - Cole a chave
   - **Salvar**
   - **Testar conexão**

---

## 🚀 Passo 6: Criar seu Primeiro Combo

### O que é um Combo?

Um **combo** é uma **fila de reserva** de modelos de IA. O OmniRoute:
1. Tenta o **primeiro modelo**
2. Se falhar, tenta o **segundo**
3. Se falhar, tenta o **terceiro**
4. E assim por diante...

### Combo Recomendado: "economico"

```
🟢 Gratuitos (na frente)
├── 1. mistral/codestral-latest        (95% de acerto)
├── 2. nvidia/llama-3.2-90b            (81% de acerto)
├── 3. google/gemini-1.5-flash        (bom para textos longos)
├── 4. openrouter/mistralai/mistral-7b (reserva)
├── 5. groq/llama-3.1-70b              (10% de acerto - recusa pedidos grandes)
├── 6. cloudflare/llama-3.1-8b         (reserva)
└── 🔴 Pagos (por último)
    ├── 7. deepseek/deepseek-chat     (pago - reserva)
    └── 8. anthropic/claude-haiku-5.5  (pago - última reserva)
```

### Criar Combo pelo Painel:

1. Vá em **Combinações** (ou **Combos**)
2. Clique em **Criar Combo**
3. Dê um nome: `economico`
4. Adicione os modelos na ordem acima
5. Escolha estratégia: **priority**
6. **Salvar**

### Criar Combo pela CLI (Easy-O-Route):

```bash
easy-o-route combo create economico \
  --strategy priority \
  --models "mistral/codestral-latest,nvidia/llama-3.2-90b,google/gemini-1.5-flash,openrouter/mistralai/mistral-7b,groq/llama-3.1-70b,cloudflare/llama-3.1-8b,deepseek/deepseek-chat,anthropic/claude-haiku-5.5"
```

---

## 🚀 Passo 7: Criar Chave do OmniRoute

### Para suas ferramentas falarem com o OmniRoute, você precisa de uma **Chave do OmniRoute**.

1. Vá em **Endpoint** → **Chaves Registradas**
2. Clique em **Criar Chave**
3. Dê um nome: `claude-code` (ou o nome da sua ferramenta)
4. **Salvar**
5. **Copie a chave** gerada
6. **Guarde em um gerenciador de senhas**

> **⚠️ Esta chave também é uma senha! Nunca compartilhe!**

---

## 🚀 Passo 8: Configurar suas Ferramentas

### Toda ferramenta precisa de 3 dados:

| Campo | Valor | Exemplo |
|-------|-------|---------|
| **URL base** | Endereço do OmniRoute | `http://localhost:20128/v1` |
| **Chave de API** | Chave do OmniRoute | `OR-xyz123...` |
| **Modelo** | Combo ou modelo | `combo/economico` ou `auto` |

### Exemplo: Claude Code

#### Windows (PowerShell)

```powershell
# Criar atalho
New-Item -Path "claude-easy.cmd" -ItemType File -Value @'
@echo off
set OMNIROUTE_API_KEY=SUA_CHAVE_DO_OMNIROUTE
set ANTHROPIC_BASE_URL=http://localhost:20128
set ANTHROPIC_API_KEY=%OMNIROUTE_API_KEY%
claude %*
'@

# Tornar executável (opcional)
# Move para pasta no PATH
```

#### Usando Easy-O-Route CLI:

```bash
# Configurar automaticamente
easy-o-route configure opencode --dry-run

# Ou manualmente
# Copie o comando gerado e execute
```

### Outras Ferramentas

**Continue, Cursor, Cline, Aider, OpenCode, etc.**

Todos aceitam os 3 campos. Procure por:
- **API URL** ou **Base URL**
- **API Key**
- **Model** ou **Model Name**

---

## 🚀 Passo 9: Testar Tudo

### Teste 1: Listar Modelos

```bash
# Usando curl
curl http://localhost:20128/v1/models \
  -H "Authorization: Bearer SUA_CHAVE_DO_OMNIROUTE"
```

> **✅ Deve mostrar uma lista de modelos em JSON**

### Teste 2: Fazer uma Pergunta

```bash
curl http://localhost:20128/v1/chat/completions \
  -H "Authorization: Bearer SUA_CHAVE_DO_OMNIROUTE" \
  -H "Content-Type: application/json" \
  -d '{"model":"combo/economico","messages":[{"role":"user","content":"Explique o que é um token."}]}'
```

> **✅ Deve mostrar uma resposta da IA**

### Teste 3: Usar Combo Studio

1. Vá em **Combo Studio**
2. Escolha o combo `economico`
3. Digite: "Explique o que é um token"
4. Veja qual provedor respondeu

---

## ✅ Verificação Final

```bash
# Verificar se o OmniRoute está rodando
curl -s http://localhost:20128/v1/models > /dev/null && echo "✅ OmniRoute está rodando" || echo "❌ OmniRoute não está rodando"

# Verificar versão
omniroute --version

# Verificar se o Easy-O-Route está instalado (opcional)
easy-o-route --version

# Verificar provedores conectados
omniroute providers list

# Verificar combos
omniroute combo list
```

---

## 🆘 Solução de Problemas

### Problema: OmniRoute não inicia

**Solução:**
```bash
# Verificar logs
cat ~/.omniroute/omniroute.log  # Linux/Mac
# ou
cat %USERPROFILE%\.omniroute\omniroute.log  # Windows

# Executar doctor
omniroute doctor
```

### Problema: Port 20128 em uso

**Solução:**
```bash
# Windows
netstat -ano | findstr 20128
taskkill /PID <PID> /F

# Linux/Mac
lsof -i :20128
kill -9 <PID>
```

### Problema: Erro 401 (Não autorizado)

**Solução:**
- Verifique se a **chave do OmniRoute** está correta
- Verifique se a **URL está correta** (`http://localhost:20128/v1`)
- Tente trocar a senha do painel

### Problema: Erro 429 (Limite de uso)

**Solução:**
- **Normal!** O combo passa para o próximo provedor automaticamente
- Verifique seus provedores em **Provedores** → **Cota**
- Espere ou adicione mais provedores

---

## 📋 Checklist de Instalação

- [ ] Node.js instalado (22.x ou 24.x)
- [ ] npm instalado (10.x+)
- [ ] OmniRoute instalado (`npm install -g omniroute`)
- [ ] OmniRoute iniciado (`omniroute`)
- [ ] Painel acessível (http://localhost:20128)
- [ ] Senha trocada (de CHANGEME)
- [ ] Início automático configurado (`omniroute autostart enable`)
- [ ] Pelo menos 3 provedores conectados
- [ ] Combo "economico" criado
- [ ] Chave do OmniRoute criado
- [ ] Ferramenta configurada (Claude Code, etc.)
- [ ] Teste realizado com sucesso

---

## 🎉 Parabéns!

Você concluiu a instalação do **Easy-O-Route** e do **OmniRoute**! 🎉

Agora você está pronto para:
- ✅ Economizar até **89%** nos custos com IA
- ✅ Usar múltiplos provedores de forma organizadas
- ✅ Monitorar o uso e os custos
- ✅ Ter fallback automático quando um provedor falha

---

## 📖 Próximos Passos

1. **Leia o ebook completo**: [Documentação](README.md)
2. **Aprofunde-se**: Chapters 06-13
3. **Monitore o uso**: painel do OmniRoute → Análises
4. **Ajuste seu combo**: Adicione/remova provedores conforme necessário
5. **Compartilhe**: Conte para a comunidade!

---

<div align="center">
  <h2>✨ Guia de Instalação - Easy-O-Route</h2>
  <p>Pronto para economizar com IA!</p>
</div>
