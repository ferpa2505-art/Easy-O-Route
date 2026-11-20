# 🚀 Easy-O-Route Quick Guide

> Install, configure, and start saving in 5 minutes!

---

## 🎯 What is Easy-O-Route?

**Easy-O-Route** is a **CLI (Command Line Interface)** that simplifies the setup and use of **[OmniRoute](https://github.com/cheaper-inference/OmniRoute)** — the AI router that allows you to use **multiple AI providers** in an **economical and efficient** way.

---

## ⚡ Quick Installation

### Windows / Mac / Linux

```bash
# 1. Install Node.js (if not installed)
#    Download from: https://nodejs.org (LTS 24.x version)

# 2. Install OmniRoute
npm install -g omniroute

# 3. Install Easy-O-Route (optional - coordinator)
npm install -g easy-o-route

# 4. Start OmniRoute
omniroute
```

> **✅ Done!** Access: [http://localhost:20128](http://localhost:20128)

---

## 🔧 Initial Setup

### 1️⃣ Change the Password

1. Log in with the default password: **`CHANGEME`**
2. Go to **Settings** → **Password**
3. Change to a secure password

### 2️⃣ Create an OmniRoute Key

1. Go to **Endpoint** → **Registered Keys**
2. Click **Create Key**
3. Give it a name (e.g., `my-cli`)
4. Save the key securely

### 3️⃣ Connect Providers

**Recommended Free Providers:**

| Provider | Website | Success Rate |
|----------|---------|--------------|
| Mistral  | [console.mistral.ai](https://console.mistral.ai) | 95% |
| NVIDIA   | [build.nvidia.com](https://build.nvidia.com) | 81% |
| Groq     | [console.groq.com](https://console.groq.com) | 10% (rejects large requests) |
| Google Gemini | [aistudio.google.com](https://aistudio.google.com) | - |

**Steps:**
1. Create an account on the provider's website
2. Generate an **API Key**
3. In OmniRoute: **Providers** → **Add**
4. Select the provider and paste the key
5. Test the connection

---

## 🎯 Create Your First Combo

**Combo = Reservation queue: free providers first, paid last**

### Using the Easy-O-Route CLI:

```bash
# Create "economico" combo
easy-o-route combo create economico \
  --strategy priority \
  --models "mistral/codestral-latest,nvidia/llama-3.2-90b,groq/llama-3.1-70b,deepseek/deepseek-chat"
```

### Using the Dashboard:

1. Go to **Combos** → **Create Combo**
2. Name: `economico`
3. Add models in order:
   - `mistral/codestral-latest`
   - `nvidia/llama-3.2-90b`
   - `google/gemini-1.5-flash`
   - `groq/llama-3.1-70b`
   - `deepseek/deepseek-chat` (paid - fallback)
4. Choose strategy: **priority**
5. Save

---

## 🔗 Connect Your Tools

### Claude Code (Recommended)

```bash
# Create a shortcut for Claude Code
echo "@echo off" > claude-easy.cmd
echo "set OMNIROUTE_API_KEY=YOUR_KEY" >> claude-easy.cmd
echo "set ANTHROPIC_BASE_URL=http://localhost:20128" >> claude-easy.cmd
echo "set ANTHROPIC_API_KEY=%OMNIROUTE_API_KEY%" >> claude-easy.cmd
echo "claude %*" >> claude-easy.cmd
```

### Other Tools

**Data required by every tool:**

| Field | Value |
|-------|-------|
| Base URL | `http://localhost:20128/v1` |
| API Key | YOUR_OMNIROUTE_KEY |
| Model | `combo/economico` or `auto` |

---

## 📊 Test Your Setup

### Quick Test with cURL:

```bash
# List available models
curl http://localhost:20128/v1/models \
  -H "Authorization: Bearer YOUR_KEY"

# Ask a question
curl http://localhost:20128/v1/chat/completions \
  -H "Authorization: Bearer YOUR_KEY" \
  -H "Content-Type: application/json" \
  -d '{"model":"combo/economico","messages":[{"role":"user","content":"Explain what a token is."}]}'
```

### Using Combo Studio:

1. Go to **Combo Studio**
2. Select the `economico` combo
3. Type a question
4. See which provider responded

---

## 💰 Measure Your Savings

### OmniRoute Dashboard:

1. Go to **Analytics** → **Overview**
2. Check:
   - Input/output tokens
   - Cache level (reusability)
   - Cost table
   - Success rate per provider

### Author's Results:

| Period | Tokens | Cost Without OmniRoute | Cost With OmniRoute | Savings |
|--------|--------|-----------------------|----------------------|---------|
| Set/2026 | 582.6M | $113.58 | $113.58 | 0% |
| Oct/2026 | 300M | ~$60 | $12.09 | **89%** |

---

## 📌 Quick Tips

### ✅ Do This:

1. **Start with 3 free providers** (Mistral, NVIDIA, Groq)
2. **Place larger models first** for coding tool requests
3. **Review your combo every 2-3 weeks** (models change)
4. **Set spending limits** for paid providers
5. **Backup the `~/.omniroute` folder**

### ❌ Avoid This:

1. **Do not share API keys in chats or groups** (even for help)
2. **Do not use providers that reject large requests first** (e.g., Groq)
3. **Do not ignore 429 errors** (rate limits - the combo handles this)
4. **Do not confuse cost table with actual cost**
5. **Do not use providers with cookies** (may violate terms)

---

## 🆘 Troubleshooting

### Common Errors:

| Error | Cause | Solution |
|-------|-------|----------|
| **429** | Rate limit | Combo with fallbacks |
| **413** | Large request | Place larger models first |
| **529/503** | Server overloaded | Retry |
| **401** | Invalid key | Verify API key |
| **403** | Quota exhausted | Check quota |
| **404** | Model not found | Remove from combo |

### Checkup:

```bash
# Verify everything is correct
omniroute doctor

# Test all providers
omniroute providers test-all
```

---

## 🎓 Next Steps

1. **Read the full ebook**: [Documentation](README.md)
2. **Dive deeper**: Chapters 01-13
3. **Contribute**: [GitHub](https://github.com/ferpa2505-art/Easy-O-Route)
4. **Share**: Share with the community!

---

## 📞 Support

- **Documentation**: [docs/](.)
- **Issues**: [GitHub Issues](https://github.com/ferpa2505-art/Easy-O-Route/issues)
- **Discussions**: [GitHub Discussions](https://github.com/ferpa2505-art/Easy-O-Route/discussions)

---

<div align="center">
  <h2>✨ Easy-O-Route - Quick Guide</h2>
  <p>The definitive facilitator for OmniRoute</p>
  <p>Made with ❤️ by the open-source AI community</p>
</div>
