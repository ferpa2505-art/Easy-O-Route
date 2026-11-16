# 📚 Easy-O-Route - Documentação

> **Documentação completa baseada no ebook "IA BARATA de Verdade"**

Este diretório contém toda a documentação do **Easy-O-Route**, organizada em capítulos e guias práticos baseados no ebook original de Fernando Paulino.

---

## 📖 **Guia do Usuário (Ebook Completo)**

### **🎯 Parte 1: Entendendo os Conceitos**

| # | Capítulo | Descrição | Status |
|---|----------|-----------|--------|
| 1 | [Por que a IA fica cara](CAPITULO-01-POR-QUE-A-IA-FICA-CARA.md) | Tokens, preços e onde está o desperdício | ✅ |
| 2 | [O que é o OmniRoute](CAPITULO-02-O-QUE-E-O-OMNIROUTE.md) | A central de táxi das IAs, combos e estratégias | ✅ |

### **🚀 Parte 2: Instalação e Configuração**

| # | Capítulo | Descrição | Status |
|---|----------|-----------|--------|
| 3 | [Antes de começar](CAPITULO-03-ANTES-DE-COMECAR.md) | Requisitos, contas e regras de segurança | ✅ |
| 4 | [Instalando o OmniRoute](CAPITULO-04-INSTALANDO-O-OMNIROUTE.md) | Windows, Mac, Linux - passo a passo | ✅ |
| 5 | [Primeiro acesso ao painel](CAPITULO-05-PRIMEIRO-ACESSO-AO-PAINEL.md) | Navegação, senha, teste rápido | ✅ |
| 6 | [Conectando provedores](CAPITULO-06-CONECTANDO-PROVEDORES.md) | Mistral, Groq, NVIDIA, Google e mais | ✅ |

### **⚡ Parte 3: Uso Avançado**

| # | Capítulo | Descrição | Status |
|---|----------|-----------|--------|
| 7 | [Combos: a fila de reserva](CAPITULO-07-COMBOS-A-FILA-DE-RESERVA.md) | Crie sua estratégia de fallbacks | ✅ |
| 8 | [Ligando suas ferramentas](CAPITULO-08-LIGANDO-SUAS-FERRAMENTAS.md) | Claude Code, OpenCode e mais | ✅ |

### **📊 Parte 4: Monitoramento e Economia**

| # | Capítulo | Descrição | Status |
|---|----------|-----------|--------|
| 9 | [Medindo o uso](CAPITULO-09-MEDINDO-O-USO.md) | Tokens, custos, cotas e painel | ✅ |
| 10 | [Quanto você economizou](CAPITULO-10-QUANTO-VOCE-ECONOMIZOU.md) | Método de cálculo e comparativos | ✅ |

### **⚠️ Parte 5: Solução de Problemas**

| # | Capítulo | Descrição | Status |
|---|----------|-----------|--------|
| 11 | [Limites e armadilhas](CAPITULO-11-LIMITES-E-ARMADILHAS.md) | O que ninguém conta sobre o OmniRoute | ✅ |
| 12 | [Problemas e soluções](CAPITULO-12-PROBLEMAS-E-SOLUCOES.md) | Erros traduzidos e resolvidos | ✅ |
| 13 | [Checklist final](CAPITULO-13-CHECKLIST-GLOSSARIO.md) | Checklist, glossário e próximos passos | ✅ |

---

## 🎓 **Tutoriais Práticos**

| Tutorial | Descrição | Link |
|----------|-----------|------|
| **Guia Rápido** | Instale e configure em 5 minutos | [GUIA-RAPIDO.md](GUIA-RAPIDO.md) |
| **Guia de Instalação** | Instalação detalhada | [INSTALACAO.md](INSTALACAO.md) |
| **Exemplos de Combos** | Combos prontos para usar | [EXEMPLOS-COMBOS.md](EXEMPLOS-COMBOS.md) |
| **Segurança** | Melhores práticas | [SEGURANCA.md](SEGURANCA.md) |

---

## 📊 **Dados do Autor (Referência)**

### **Configuração do Autor (Oct/2026)**
- **OmniRoute**: 3.8.52
- **Sistema**: Windows
- **Node.js**: v24.15.0
- **npm**: 11.12.1

### **Provedores Usados**
| Provedor | Taxa de Acerto | Latência Média | Tipo |
|----------|----------------|-----------------|------|
| Mistral | 95% | 6.608 ms | Gratuito |
| NVIDIA | 81% | 16.471 ms | Gratuito |
| OpenRouter | 25% | 3.945 ms | Gratuito |
| Groq | 10% | 828 ms | Gratuito |
| DeepSeek | - | - | Pago (reserva) |
| Anthropic Haiku | - | - | Pago (reserva) |

### **Erros Mais Comuns**
| Erro | Código | Ocorrências | Solução |
|------|--------|-------------|---------|
| Limite de uso | 429 | 1.009 | Combo com fallbacks |
| Pedido grande | 413 | - | Modelos grandes na frente |
| Servidor lotado | 529/503 | - | Tentar novamente |
| Não autorizado | 401 | - | Verificar chave API |
| Proibido | 403 | - | Verificar cota |
| Modelo não encontrado | 404 | - | Remover do combo |

---

## 💡 **Dicas do Autor**

### **✅ O que funciona bem**
1. **Comece com 3 provedores gratuitos** (Mistral, NVIDIA, Groq)
2. **Modelos grandes na frente** para pedidos de ferramentas de código
3. **Revise o combo a cada 2-3 semanas** (modelos aparecem e desaparecem)
4. **Defina tetos de gasto** em provedores pagos
5. **Faça backup da pasta `.omniroute`** regularmente

### **❌ O que evitar**
1. **Não coloque chaves em chats ou grupos** (mesmo para pedir ajuda)
2. **Não use modelos que recusam pedidos grandes na frente** (ex: Groq)
3. **Não ignore erros 429** (limite de uso - o combo resolve sozinho)
4. **Não confunda custo de tabela com custo real** (ver capítulo 9)
5. **Não use provedores com cookie** (pode violar termos de uso)

---

## 📥 **Recursos Adicionais**

- **[OmniRoute Oficial](https://github.com/cheaper-inference/OmniRoute)**
- **[Documentação OmniRoute](https://docs.omniroute.io/)**
- **[Painel OmniRoute](http://localhost:20128)** (após instalação)
- **[Comunidade OmniRoute](https://discord.gg/...)**

---

## 🔍 **Pesquisa na Documentação**

Use os comandos abaixo para pesquisar na documentação:

```bash
# Pesquisar por um termo
grep -r "termodebusca" docs/

# Listar todos os arquivos
tree docs/ -L 2

# Ver conteúdo de um arquivo
cat docs/NOME-DO-ARQUIVO.md
```

---

<div align="center">
  <p><strong>Documentação Easy-O-Route</strong></p>
  <p>Baseado no ebook "IA BARATA de Verdade" de Fernando Paulino</p>
  <p>✨ Feito para tornar o OmniRoute acessível a todos</p>
</div>
