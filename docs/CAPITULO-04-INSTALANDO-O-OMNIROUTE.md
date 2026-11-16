# Capítulo 04: Instalando o OmniRoute

> **Baseado no ebook "IA BARATA de Verdade" - Fernando Paulino**

---

## 🎯 O que você vai aprender neste capítulo

- ✅ **Escolher o caminho** de instalação (Windows, Mac, Linux)
- ✅ **Instalação no Windows** em 5 passos
- ✅ **Instalação no Mac** (npm ou app)
- ✅ **Instalação no Linux** (npm ou Docker)
- ✅ **Primeiro acesso** ao painel
- ✅ **Deixar iniciar sozinho**
- ✅ **Conferir se está tudo certo**

---

## 🌍 Escolha o seu caminho

| Sistema | Como instalar | Testado pelo autor? |
|---------|---------------|---------------------|
| **Windows** | Node.js + um comando (npm) | ✅ **SIM** |
| **Mac** | npm ou app de barra de menu | ❌ Não |
| **Linux** | npm ou Docker | ❌ Não |

> **⚠️ Mac e Linux seguem a documentação oficial do OmniRoute**

---

## 🪟 Instalação no Windows (5 passos)

### Passo 1: Instale o Node.js

1. Acesse: [https://nodejs.org](https://nodejs.org)
2. Baixe a **versão LTS mais recente** (24.x)
3. Execute o instalador
4. Siga as instruções até o fim

> **✅ O Node.js é a base que faz o OmniRoute funcionar!**

### Passo 2: Abra o PowerShell

- Aperte a tecla **Windows**
- Digite **PowerShell**
- Aperte **Enter**

### Passo 3: Instale o OmniRoute

```powershell
# Instalar globalmente
npm install -g omniroute
```

> **⚠️ Se o npm bloquear a instalação:**
> A partir do npm 11, os scripts de instalação podem ser bloqueados.
> 
> **Solução:** Liberar os pacotes listados no aviso:
> ```powershell
> npm install -g --allow-scripts=omniroute,keytar,onnxruntime-node,@parcel/watcher,@swc/core,protobufjs,esbuild omniroute
> ```

### Passo 4: Confira a versão

```powershell
omniroute --version
```

> **✅ Deve aparecer**: `3.8.52` (ou versão mais recente)

### Passo 5: Ligue o OmniRoute

```powershell
omniroute
```

> **💡 Deixe a janela aberta** e entre no navegador em: [http://localhost:20128](http://localhost:20128)

---

## 🍎 Instalação no Mac

### Opção 1: Usando npm

```bash
# Instalar o Node.js em nodejs.org
# No Terminal:
npm install -g omniroute

# Depois:
omniroute
```

### Opção 2: Usando app de barra de menu (Comunidade)

```bash
# Instalar via Homebrew
brew install --cask zoispag/tap/omniroute-tray
```

> **⚠️ App não oficial, da comunidade**

---

## 🐧 Instalação no Linux

### Opção 1: Usando npm

```bash
# Instalar o Node.js LTS (24.x)
# No terminal:
npm install -g omniroute

# Depois:
omniroute

# Início automático:
omniroute autostart enable
```

### Opção 2: Usando Docker

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

> **⚠️ A imagem Docker vem com limite de memória de 1GB**
> - Suficiente para o painel e conversas leves
> - Ferramentas de programação que enviam textos enormes pedem mais memória

---

## 🌐 Primeiro acesso ao painel

Ao abrir o endereço [http://localhost:20128](http://localhost:20128), o OmniRoute pede uma **senha**.

### 🔐 Senha padrão

- **Na primeira vez**, a senha padrão é: **`CHANGEME`**
- **A tela informa** que a senha padrão é pública

### ⚠️ IMPORTANTE

> **⚠️ TROQUE A SENHA IMEDIATAMENTE!**
> 
> 1. Entre com a senha `CHANGEME`
> 2. Vá em **Configuração** (Settings)
> 3. Troque a senha

> **💡 Quem a conhecer e chegar ao seu painel consegue entrar!**

---

## ⚙️ Deixe iniciar sozinho

Se você fechar a janela, o OmniRoute **para**. Para ele subir junto com o computador:

### Windows

```powershell
omniroute autostart enable
```

> **💡 No Windows, usa um atalho na pasta de inicialização**

### Linux

```bash
omniroute autostart enable
```

> **💡 No Linux, usa um serviço de usuário do systemd**

### Mac

> **💡 Use o app OmniRouteTray (comunidade)**

---

## ✅ Conferindo se está tudo certo

O OmniRoute tem um **"check-up" embutido**:

```powershell
omniroute doctor
```

### 📋 Saída esperada (exemplo real do autor)

```
OmniRoute Doctor

Data dir: C:\Users\SEU_USUARIO\.omniroute

✅ Config: .env found
✅ Database: SQLite quick_check passed
✅ Storage/encryption: samples decrypt successfully
⚠️  Port availability: port 20128 is already in use
✅ Node runtime: v24.15.0 is supported
✅ Memory: 512 MB limit configured; 2.5 GB free
✅ Crash log: No supervisor crash record found
```

### 📌 O que cada status significa

| Status | Significado |
|--------|-------------|
| **✅ OK** | Tudo certo |
| **⚠️ WARN** | Aviso, mas não é crítico |
| **❌ ERROR** | Problema que precisa ser resolvido |

> **💡 O aviso "porta em uso" é normal quando o OmniRoute já está rodando!**

---

## 📋 Resumo do Capítulo

| ✅ | Passo | Comando/Link |
|----|-------|--------------|
| 1 | Instalar Node.js | [nodejs.org](https://nodejs.org) |
| 2 | Instalar OmniRoute | `npm install -g omniroute` |
| 3 | Verificar versão | `omniroute --version` |
| 4 | Ligar OmniRoute | `omniroute` |
| 5 | Acessar painel | [http://localhost:20128](http://localhost:20128) |
| 6 | Trocar senha | Configuração → Senha |
| 7 | Início automático | `omniroute autostart enable` |
| 8 | Check-up | `omniroute doctor` |

---

## 🔗 Próximo Capítulo

👉 **[Capítulo 05: Primeiro acesso ao painel →](CAPITULO-05-PRIMEIRO-ACESSO-AO-PAINEL.md)**

*Conheça as telas e crie a chave que liga suas ferramentas!*

---

<div align="center">
  <p><strong>Capítulo 04</strong> - Instalando o OmniRoute</p>
  <p>✨ Parte da documentação Easy-O-Route</p>
</div>
