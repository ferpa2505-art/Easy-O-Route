# Capítulo 01: Por que a IA fica cara (e por que quase ninguém percebe)

> **Baseado no ebook "IA BARATA de Verdade" - Fernando Paulino**

---

## 🎯 O que você vai aprender neste capítulo

- ✅ O que é um **token** e como ele é cobrado
- ✅ Por que a **saída** custa mais do que a **entrada**
- ✅ Como o **histórico** faz a conta crescer sem você ver
- ✅ Onde está o **desperdício** no uso de IA
- ✅ A diferença entre **assinatura** e **API (pague pelo uso)**

---

## 💭 Por que a IA fica cara

Você abre um chat, faz uma pergunta e a resposta aparece em segundos. Parece de graça. Mas, por trás da tela, **alguém paga por cada palavra que a IA lê e escreve**. 

Quando você usa IA **só de vez em quando**, essa conta é pequena. Quando usa **todo dia**, ou deixa uma ferramenta trabalhar por você, ela pode crescer **sem você notar**.

Neste capítulo você vai entender, **sem fórmula e sem jargão**, de onde vem esse custo. Quem entende isso consegue gastar menos, **com ou sem OmniRoute**.

---

## 🪙 O token: a moeda da IA

A IA não lê palavras como nós. **Ela quebra o texto em pedacinhos chamados tokens**.

### 🍽️ Analogia: Restaurante a Quilo

Pense no restaurante a quilo: você não paga por prato, paga pelo **peso**. 

Na IA, você paga pelo **número de tokens**.

### 📊 Regras Práticas

- **Uma palavra comum em português** costuma virar entre **1 e 3 tokens**
- **Palavras curtas e comuns** gastam menos
- **Palavras longas, nomes e códigos** gastam mais
- **É uma estimativa**: cada IA corta o texto do seu jeito

#### 📌 Exemplo Prático

| Texto | Tokens Aproximados |
|-------|-------------------|
| "olá" | 1 |
| "hello" | 1 |
| "Bom dia" | 2 |
| "Fernando" | 1 |
| "Paulino" | 1 |
| "Inteligência Artificial" | 4-5 |
| " omniroute" | 1 |

> **⚠️ Importante**: O omniroute conta cerca de 1 token, mas "OmniRoute" (com O maiúsculo) pode contar 2 tokens dependendo da IA.

---

## 📤📥 Entrada, Saída e Memória (Cache)

A conta tem **três partes**, e cada uma tem um **preço diferente**:

### 1. 📥 Entrada (Input/Input Tokens)
**Tudo o que você manda para a IA ler.**

Inclui:
- Sua pergunta
- O histórico da conversa
- As instruções do sistema
- Os arquivos anexados

### 2. 📤 Saída (Output/Completion Tokens)
**O que a IA escreve de volta.**

É a parte **mais cara**, porque **dá mais trabalho gerar do que ler**.

> **💡 Regra de Ouro**: A saída custa **cerca de 5 vezes mais** do que a entrada

### 3. 💾 Cache (Memória)
**Quando o mesmo texto se repete**, alguns provedores cobram **muito menos** para "reler".

É um **desconto por repetição**.

> **✅ Exemplo**: Se você faz uma pergunta e a IA responde, e depois faz a mesma pergunta novamente, o provedor pode cobrar bem menos pela segunda vez.

---

## 📈 Por que a conta cresce sem você ver

**Aqui está o ponto que quase ninguém percebe:**

> **A IA não tem memória própria.**

A cada nova mensagem, a ferramenta **reenvia a conversa inteira**, mais as instruções e os arquivos que ela precisa.

### 📚 Analogia: Livro
É como se, a cada pergunta, você tivesse que **relér o livro todo desde a primeira página**.

#### 📊 Exemplo Real (Autor - Out/2026)

- **Média por tentativa**: ~60.000 tokens de entrada
- **Total em um provedor**: 2.911 tentativas
- **Tokens totais**: 174 milhões
- **Custo estimado (Sonnet 5.5, sem cache)**: US$ 349

> **Cálculo**: 174,35 milhões de tokens × US$ 2 por milhão (entrada)

---

## 💳 Assinatura ou API: Duas Formas de Pagar

Existem **dois jeitos de pagar por IA**, e é importante não confundi-los:

### 1. 📅 Assinatura Mensal

**Características:**
- ✅ Valor fixo por mês
- ✅ Limites de uso por período
- ✅ Ótima para uso leve ou moderado
- ❌ Se ultrapassar o limite, paga mais ou para

**Exemplo (Claude - Out/2026):**
| Plano | Preço/Mês | Limite |
|-------|-----------|--------|
| Pro | US$ 20 | Limite de tokens |
| Max | US$ 100 | Limite maior |
| Ultra | US$ 200 | Limite máximo |

> **⚠️ Atenção**: Os valores mudam. Confira sempre no [site oficial](https://claude.com/pricing).

### 2. 🔌 API (Pague pelo Uso)

**Características:**
- ✅ Você paga por **token usado**
- ✅ Sem teto, a menos que você crie um
- ✅ Ideal para ferramentas e automação
- ❌ Pode ter custos imprevisíveis se não controlar

> **💡 O OmniRoute trabalha com o segundo mundo, o da API**: ele ajuda quem usa ferramentas que consomem **muitos tokens** e quer controlar **de onde vem cada resposta e quanto custa**.

---

## 🗑️ Onde está o desperdício

### 1. ❌ Modelo grande para tarefa simples
**Usar o modelo mais caro para corrigir uma vírgula** é como chamar um **caminhão para levar uma carta**.

> **💡 Solução**: Use modelos adequados para cada tarefa

### 2. ❌ Contexto repetido
**Ferramentas que reenviam arquivos inteiros a cada passo** gastam tokens à toa.

> **💡 Solução**: Use cache ou otimize o contexto

### 3. ❌ Travar no limite
**Quando o limite acaba**, você para de trabalhar ou paga mais caro para continuar.

> **💡 Solução**: Use combos com fallbacks (OmniRoute)

### 4. ❌ Não medir
**Quem não vê quanto gasta não consegue gastar menos**.

> **💡 Solução**: Monitore o uso (Painel do OmniRoute)

---

## 📌 O que este capítulo promete (e o que não promete)

### ✅ Promete
- Um **método** para medir e reduzir o que você paga, com **números reais**

### ❌ Não promete
- A mesma **qualidade** do Claude em modelos gratuitos
- Uso **ilimitado** sem custo

> **💡 Você vai ver os dois lados**: economia **e** qualidade

---

## 📋 Resumo do Capítulo

| ✅ | Conceito | Explicação |
|----|----------|------------|
| 1 | **Token** | Pedaço de texto, moeda da IA |
| 2 | **Saída > Entrada** | Saída custa ~5x mais |
| 3 | **Histórico** | Reenviado a cada mensagem → conta cresce |
| 4 | **Assinatura** | Preço fixo com limites |
| 5 | **API** | Pague pelo uso, sem limites |
| 6 | **Desperdício** | Modelo grande, contexto repetido, não medir |

---

## 🔗 Próximo Capítulo

👉 **[Capítulo 02: O que é o OmniRoute →](CAPITULO-02-O-QUE-E-O-OMNIROUTE.md)**

*Descubra como o OmniRoute resolve os problemas deste capítulo!*

---

<div align="center">
  <p><strong>Capítulo 01</strong> - Por que a IA fica cara</p>
  <p>✨ Parte da documentação Easy-O-Route</p>
</div>
