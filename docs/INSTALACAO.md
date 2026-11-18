# 📋 Complete Installation Guide - Easy-O-Route

> Step-by-step guide to install and configure Easy-O-Route and OmniRoute.

---

## 🎯 Overview

This guide contains **all necessary steps** to:
1. Install Node.js
2. Install OmniRoute
3. Install Easy-O-Route (optional, but recommended)
4. Configure the environment
5. Test the installation

---

## 📋 Prerequisites

### Operating System
- ✅ **Windows** 10/11 (64-bit)
- ✅ **macOS** 10.15+ (Catalina or later)
- ✅ **Linux** (any modern distribution: Ubuntu, Fedora, Debian, etc.)

### Hardware Requirements
- **CPU**: Any modern processor
- **RAM**: 4GB minimum (8GB+ recommended)
- **Disk Space**: 500MB free
- **Internet Connection**: Stable

---

## 🚀 Step 1: Install Node.js

OmniRoute and Easy-O-Route require **Node.js version 22.x or 24.x**.

### Windows

1. **Download Node.js** from: [https://nodejs.org](https://nodejs.org)
2. **Select LTS version** (24.x recommended)
3. **Run the installer** and follow instructions
4. **Verify installation**

### Mac

#### Option A: Official Website
1. Access: [https://nodejs.org](https://nodejs.org)
2. Download LTS version (24.x)
3. Run the installer

#### Option B: Using Homebrew (Recommended)
```bash
# Install Homebrew (if not installed)
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Install Node.js
brew install node@24

# Add to PATH
echo 'export PATH="/usr/local/opt/node@24/bin:$PATH"' >> ~/.zshrc
echo 'export PATH="/usr/local/opt/node@24/bin:$PATH"' >> ~/.bashrc

# Reload shell
source ~/.zshrc  # or ~/.bashrc
```

### Linux (Ubuntu/Debian)

```bash
# Install dependencies
sudo apt update
sudo apt install -y curl gnupg ca-certificates

# Add NodeSource repository
curl -fsSL https://deb.nodesource.com/setup_24.x | sudo -E bash -

# Install Node.js
sudo apt install -y nodejs

# Verify installation
node --version
npm --version
```

### Linux (Fedora/RHEL/CentOS)

```bash
# Install Node.js 24.x
curl -fsSL https://rpm.nodesource.com/setup_24.x | sudo bash -
sudo dnf install -y nodejs

# Verify installation
node --version
npm --version
```

### Verify Installation

```bash
# Check Node.js
node --version
# Should show: v24.x.x

# Check npm
npm --version
# Should show: 10.x.x or higher
```

> **⚠️ If commands don't work, restart the terminal or computer.**

---

## 🚀 Step 2: Install OmniRoute

### Method 1: Global Installation (Recommended)

```bash
# Install globally
npm install -g omniroute

# Check version
omniroute --version
# Should show: 3.8.53 or higher
```

#### If there's an error with npm 11+:

```bash
# Allow necessary scripts
npm install -g omniroute --allow-scripts=omniroute,keytar,onnxruntime-node,@parcel/watcher,@swc/core,protobufjs,esbuild --force
```

### Method 2: Using Docker (Linux/Mac)

```bash
# Run with Docker
docker run -d \
  --name omniroute \
  --restart unless-stopped \
  --stop-timeout 40 \
  -p 127.0.0.1:20128:20128 \
  -v omniroute-data:/app/data \
  diegosouzapw/omniroute:latest
```

> **⚠️ Docker uses 1GB of memory by default. For programming tools, you may need to increase it.**

### Verify Installation

```bash
# Check if command is available
which omniroute  # Linux/Mac
where omniroute  # Windows

# Check version
omniroute --version
```

---

## 🚀 Step 3: Install Easy-O-Route (Optional, but Recommended)

### Method 1: Global Installation

```bash
# Install globally
npm install -g easy-o-route

# Verify
Easy-O-Route --version
# or
easy-o-route --version
```

### Method 2: Local Installation (For Development)

```bash
# Clone repository
git clone https://github.com/ferpa2505-art/Easy-O-Route.git
cd Easy-O-Route

# Install dependencies
npm install

# Link globally (to use the easy-o-route command)
npm link

# Verify
easy-o-route --version
```

### Method 3: Use Bash Scripts (No Node.js)

```bash
# Download scripts
curl -L https://raw.githubusercontent.com/ferpa2505-art/Easy-O-Route/main/scripts/setup.sh -o setup.sh
curl -L https://raw.githubusercontent.com/ferpa2505-art/Easy-O-Route/main/scripts/start.sh -o start.sh

# Make executable
chmod +x setup.sh start.sh

# Run setup
./setup.sh
```

---

## 🚀 Step 4: Configure OmniRoute

### Start OmniRoute

```bash
# Start
omniroute
```

> **💡 Keep the window open and access the dashboard at: [http://localhost:20128](http://localhost:20128)**

### First Access

1. **Default password**: `CHANGEME`
2. **Change the password** immediately (Settings → Password)
3. **Save the new password** in a password manager

> **⚠️ NEVER share this password!**

### Configure Auto-Start

```bash
# Windows
omniroute autostart enable

# Linux
omniroute autostart enable

# Mac (use OmniRouteTray app)
# brew install --cask zoispag/tap/omniroute-tray
```

---

## 🚀 Step 5: Configure Providers

### Recommended Free Providers

| Provider | Website | Success Rate | Latency |
|----------|---------|--------------|---------|
| **Mistral** | [console.mistral.ai](https://console.mistral.ai) | 95% | ~6.6s |
| **NVIDIA** | [build.nvidia.com](https://build.nvidia.com) | 81% | ~16.5s |
| **Groq** | [console.groq.com](https://console.groq.com) | 10% | ~0.8s |
| **Google** | [aistudio.google.com](https://aistudio.google.com) | - | ~3.8s |

### Steps to Connect Each Provider:

1. **Create an account** on the provider's website
2. **Generate an API Key** (in the developer area)
3. **Copy the key**
4. **In OmniRoute**:
   - Go to **Providers**
   - Click **Add**
   - Select the provider
   - Paste the key
   - Save
5. **Test the connection**

### Example: Connect Mistral

1. Access: [https://console.mistral.ai](https://console.mistral.ai)
2. Create account or log in
3. Go to **API Keys** or **Settings**
4. Create a new key
5. Copy the key
6. In OmniRoute:
   - **Providers** → **Add**
   - Select **Mistral**
   - Paste the key
   - **Save**
   - **Test connection**

---

## 🚀 Step 6: Create Your First Combo

### What is a Combo?

A **combo** is a **reservation queue** of AI models. OmniRoute:
1. Tries the **first model**
2. If it fails, tries the **second**
3. If it fails, tries the **third**
4. And so on...

### Recommended Combo: "economico"

```
🟢 Free (first)
├── 1. mistral/codestral-latest        (95% success)
├── 2. nvidia/llama-3.2-90b            (81% success)
├── 3. google/gemini-1.5-flash        (good for long texts)
├── 4. openrouter/mistralai/mistral-7b (fallback)
├── 5. groq/llama-3.1-70b              (10% success - rejects large requests)
├── 6. cloudflare/llama-3.1-8b         (fallback)
└── 🔴 Paid (last resort)
    ├── 7. deepseek/deepseek-chat     (paid - fallback)
    └── 8. anthropic/claude-haiku-5.5  (paid - ultimate fallback)
```

### Create Combo via Dashboard:

1. Go to **Combos** (or **Combinations**)
2. Click **Create Combo**
3. Name: `economico`
4. Add models in the order above
5. Choose strategy: **priority**
6. **Save**

### Create Combo via CLI (Easy-O-Route):

```bash
easy-o-route combo create economico \
  --strategy priority \
  --models "mistral/codestral-latest,nvidia/llama-3.2-90b,google/gemini-1.5-flash,openrouter/mistralai/mistral-7b,groq/llama-3.1-70b,cloudflare/llama-3.1-8b,deepseek/deepseek-chat,anthropic/claude-haiku-5.5"
```

---

## 🚀 Step 7: Create an OmniRoute Key

### To connect your tools to OmniRoute, you need an **OmniRoute Key**.

1. Go to **Endpoint** → **Registered Keys**
2. Click **Create Key**
3. Name: `claude-code` (or your tool's name)
4. **Save**
5. **Copy the generated key**
6. **Store it securely**

> **⚠️ This key is also a password! Never share it!**

---

## 🚀 Step 8: Configure Your Tools

### Every tool needs 3 pieces of data:

| Field | Value | Example |
|-------|-------|---------|
| **Base URL** | OmniRoute address | `http://localhost:20128/v1` |
| **API Key** | OmniRoute key | `OR-xyz123...` |
| **Model** | Combo or model | `combo/economico` or `auto` |

### Example: Claude Code

#### Windows (PowerShell)

```powershell
# Create shortcut
New-Item -Path "claude-easy.cmd" -ItemType File -Value @'
@echo off
set OMNIROUTE_API_KEY=YOUR_OMNIROUTE_KEY
set ANTHROPIC_BASE_URL=http://localhost:20128
set ANTHROPIC_API_KEY=%OMNIROUTE_API_KEY%
claude %*
'@

# Make executable (optional)
# Move to PATH folder
```

#### Using Easy-O-Route CLI:

```bash
# Configure automatically
easy-o-route configure opencode --dry-run

# Or manually
# Copy the generated command and run it
```

### Other Tools

**Continue, Cursor, Cline, Aider, OpenCode, etc.**

All require the 3 fields. Look for:
- **API URL** or **Base URL**
- **API Key**
- **Model** or **Model Name**

---

## 🚀 Step 9: Test Everything

### Test 1: List Models

```bash
# Using curl
curl http://localhost:20128/v1/models \
  -H "Authorization: Bearer YOUR_OMNIROUTE_KEY"
```

> **✅ Should show a list of models in JSON**

### Test 2: Ask a Question

```bash
curl http://localhost:20128/v1/chat/completions \
  -H "Authorization: Bearer YOUR_OMNIROUTE_KEY" \
  -H "Content-Type: application/json" \
  -d '{"model":"combo/economico","messages":[{"role":"user","content":"Explain what a token is."}]}'
```

> **✅ Should show an AI response**

### Test 3: Use Combo Studio

1. Go to **Combo Studio**
2. Select the `economico` combo
3. Type: "Explain what a token is"
4. See which provider responded

---

## ✅ Final Verification

```bash
# Check if OmniRoute is running
curl -s http://localhost:20128/v1/models > /dev/null && echo "✅ OmniRoute is running" || echo "❌ OmniRoute is not running"

# Check version
omniroute --version

# Check if Easy-O-Route is installed (optional)
easy-o-route --version

# Check connected providers
omniroute providers list

# Check combos
omniroute combo list
```

---

## 🆘 Troubleshooting

### Problem: OmniRoute won't start

**Solution:**
```bash
# Check logs
cat ~/.omniroute/omniroute.log  # Linux/Mac
# or
cat %USERPROFILE%\.omniroute\omniroute.log  # Windows

# Run doctor
omniroute doctor
```

### Problem: Port 20128 in use

**Solution:**
```bash
# Windows
netstat -ano | findstr 20128
taskkill /PID <PID> /F

# Linux/Mac
lsof -i :20128
kill -9 <PID>
```

### Problem: Error 401 (Unauthorized)

**Solution:**
- Verify the **OmniRoute key** is correct
- Verify the **URL is correct** (`http://localhost:20128/v1`)
- Try changing the dashboard password

### Problem: Error 429 (Rate Limit)

**Solution:**
- **Normal!** The combo automatically switches to the next provider
- Check your provider quotas in **Providers** → **Quota**
- Wait or add more providers

---

## 📋 Installation Checklist

- [ ] Node.js installed (22.x or 24.x)
- [ ] npm installed (10.x+)
- [ ] OmniRoute installed (`npm install -g omniroute`)
- [ ] OmniRoute started (`omniroute`)
- [ ] Dashboard accessible (http://localhost:20128)
- [ ] Password changed (from CHANGEME)
- [ ] Auto-start configured (`omniroute autostart enable`)
- [ ] At least 3 providers connected
- [ ] Combo "economico" created
- [ ] OmniRoute key created
- [ ] Tool configured (Claude Code, etc.)
- [ ] Test completed successfully

---

## 🎉 Congratulations!

You have completed the **Easy-O-Route** and **OmniRoute** installation! 🎉

Now you are ready to:
- ✅ Save up to **89%** on AI costs
- ✅ Use multiple providers in an organized way
- ✅ Monitor usage and costs
- ✅ Have automatic fallback when a provider fails

---

## 📖 Next Steps

1. **Read the full ebook**: [Documentation](README.md)
2. **Dive deeper**: Chapters 06-13
3. **Monitor usage**: OmniRoute dashboard → Analytics
4. **Adjust your combo**: Add/remove providers as needed
5. **Share**: Tell the community!

---

<div align="center">
  <h2>✨ Installation Guide - Easy-O-Route</h2>
  <p>Ready to save with AI!</p>
</div>
