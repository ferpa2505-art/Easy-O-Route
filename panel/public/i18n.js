/* Tradutor PT/EN da página inteira.
   O português é o texto original da página; o inglês é aplicado por cima, tanto nos textos
   estáticos quanto nos que o código gera depois (um MutationObserver traduz o que aparecer).
   A escolha fica em localStorage (chave easyoroute-lang). */
(function () {
  "use strict";

  var STORE_KEY = "easyoroute-lang";
  var ATTRS = ["placeholder", "title", "aria-label"];
  var SKIP = { SCRIPT: 1, STYLE: 1, TEXTAREA: 1 };
  var TITLE_PT = document.title;

  // Texto exato em português (sem espaços nas pontas) -> inglês.
  var MAP = {
    "Gateway de IA": "AI Gateway",
    "Topologia do provedor": "Provider topology",
    "Ligado": "On", "Automático": "Auto", "Desligado": "Off",
    "Modelos": "Models", "▶ Vídeo": "▶ Video", "Adicionar provedor": "Add provider",
    "Modo de operação": "Operating mode", "Alternar tema": "Switch theme", "Idioma": "Language",
    "Escuro": "Dark", "Médio": "Medium", "Claro": "Light",
    "Legenda": "Legend", "Ida / Request": "Request", "Volta / Response": "Response", "Erro / Error": "Error",
    "Ativo": "Active", "Recente": "Recent", "Erro": "Error",
    "Diagrama da topologia": "Topology diagram",
    "Nenhum modelo": "No models", "Buscar modelo": "Search model", "Fechar": "Close",
    "monitoramento": "monitor",
    "Sistema": "System", "Memória": "Memory", "Requisições": "Requests",
    "Métricas do Sistema": "System metrics", "Requisições Recentes": "Recent requests",
    "Requisições recentes": "Recent requests", "em tempo real": "live",
    "erro": "error", "Minimizar": "Minimize", "Expandir": "Expand",
    "modo demonstração": "demo mode", "Demonstração": "Demo",
    "Conexão: simulada (sem OmniRoute)": "Connection: simulated (no OmniRoute)",
    "Conexão: dados importados": "Connection: imported data",
    "Sem conexão": "No connection", "Dados reais": "Live data",
    "Conectar OmniRoute": "Connect OmniRoute",
    "● OmniRoute conectado": "● OmniRoute connected",
    "● Dados reais · falta token": "● Live data · token missing",
    "● Dados reais · com avisos": "● Live data · warnings",
    "● Sem acesso ao OmniRoute": "● No access to OmniRoute",
    "Fechar painel": "Close panel", "Fechar (Esc)": "Close (Esc)",
    "Lê provedores e requisições reais do OmniRoute a cada 4 segundos.":
      "Reads real providers and requests from OmniRoute every 4 seconds.",
    "Token do OmniRoute": "OmniRoute token",
    "Cole aqui o token oma_live_…": "Paste the oma_live_… token here",
    "Conectar": "Connect", "Desconectar": "Disconnect",
    "Colar JSON": "Paste JSON", "Carregar arquivo .json": "Load .json file",
    "Importar da área de transferência": "Import from clipboard", "Aplicar": "Apply",
    "Não conseguiu conectar?": "Can't connect?",
    "Como criar o token no OmniRoute": "How to create the token in OmniRoute",
    "Diagnóstico": "Diagnostics",
    "Endpoint em uso:": "Endpoint in use:", "Última resposta:": "Last response:",
    "Provedores:": "Providers:", "· Requisições:": "· Requests:",
    "Campos reconhecidos:": "Recognized fields:", "nenhum": "none",
    "Ver JSON bruto": "View raw JSON", "Copiar": "Copy", "Copiado": "Copied",
    "Aguardando conexão.": "Waiting for connection.",
    "JSON da resposta do endpoint": "Endpoint response JSON",
    "Cole aqui a resposta JSON do endpoint": "Paste the endpoint's JSON response here",
    "Nenhuma resposta recebida ainda.": "No response received yet.",
    "Painel lateral": "Side panel",
    "Como resolver um erro": "How to fix an error",
    "Clique para ver como resolver": "Click to see how to fix it",
    "Provedores ainda não instalados. Instale para conectar a rota.":
      "Providers not installed yet. Install to connect the route.",
    "Estes provedores não estão ativos no seu OmniRoute. Ative-os lá e eles aparecem aqui sozinhos.":
      "These providers are not active in your OmniRoute. Enable them there and they will show up here automatically.",
    "Modelos roteados": "Routed models",
    "Modelos disponíveis por provedor instalado.": "Models available per installed provider.",
    "Rota disponível": "Route available", "Não ativo no OmniRoute": "Not active in OmniRoute",
    "Instalar": "Install", "Como ativar": "How to enable",
    "Todos os provedores já estão instalados.": "All providers are already installed.",
    "Nenhum provedor instalado.": "No providers installed.",
    "Conexão iniciada": "Connection started", "Desconectado": "Disconnected",
    "Desconectado. Pulsos simulados.": "Disconnected. Simulated pulses.",
    "Simulação ativa. Os dados não vêm do OmniRoute.": "Simulation active. Data is not coming from OmniRoute.",
    "Modo demonstração ativado": "Demo mode on", "Modo demonstração desativado": "Demo mode off",
    "Dados importados": "Data imported",
    "Falta o token do OmniRoute: abra Conectar OmniRoute e siga o passo a passo.":
      "OmniRoute token missing: open Connect OmniRoute and follow the steps.",
    "Vídeo de demonstração": "Demo video",
    "Esta página está em HTTPS e o OmniRoute está em HTTP local. O navegador bloqueia essa combinação por segurança (Private Network Access), e nenhum cabeçalho de CORS resolve isso. Use os caminhos 1 ou 3 abaixo.":
      "This page is on HTTPS and OmniRoute is on local HTTP. The browser blocks that combination for security (Private Network Access). Use Paste JSON or Load file instead.",
    "sem resposta no tempo limite": "no response within the time limit"
  };

  function trProblems(text) {
    return text.split(" · ").map(function (seg) {
      var m = seg.match(/^(Provedores|Logs): (.+)$/);
      if (!m) return seg;
      var reason = MAP[m[2]] || m[2];
      return (m[1] === "Provedores" ? "Providers" : "Logs") + ": " + reason;
    }).join(" · ");
  }

  var VERBS = { instalar: "install", remover: "remove", conectar: "connect", "trocar modo": "switch mode" };

  // Textos com números ou nomes no meio.
  var PATTERNS = [
    [/^(\d+) instalados · (\d+) ativo · (\d+) processando · (\d+) erro$/, function (m) {
      return m[1] + " installed · " + m[2] + " active · " + m[3] + " processing · " + m[4] + " error";
    }],
    [/^(\d+) erros$/, function (m) { return m[1] + " errors"; }],
    [/^Dados reais de (.+)$/, function (m) { return "Live data from " + m[1]; }],
    [/^Polling de (.+) a cada 4 s, pelo proxy local\.$/, function (m) {
      return "Polling " + m[1] + " every 4 s through the local proxy.";
    }],
    [/^Conectado\. Provedores ativos: (\d+) · Logs lidos: (\d+)$/, function (m) {
      return "Connected. Active providers: " + m[1] + " · Logs read: " + m[2];
    }],
    [/^((?:Provedores|Logs): .+)$/, function (m) { return trProblems(m[1]); }],
    [/^Iniciando polling de (.+)$/, function (m) { return "Starting polling of " + m[1]; }],
    [/^Conectado, mas: (.+)$/, function (m) { return "Connected, but: " + trProblems(m[1]); }],
    [/^Conectado ao OmniRoute: (\d+) provedores ativos$/, function (m) {
      return "Connected to OmniRoute: " + m[1] + " active providers";
    }],
    [/^Modo: (.+)$/, function (m) { return "Mode: " + (MAP[m[1]] || m[1]); }],
    [/^Tema: (.+)$/, function (m) { return "Theme: " + (MAP[m[1]] || m[1]); }],
    [/^(.+) instalado$/, function (m) { return m[1] + " installed"; }],
    [/^(.+) removido$/, function (m) { return m[1] + " removed"; }],
    [/^Falha ao (instalar|remover|conectar|trocar modo)(: .*)?$/, function (m) {
      return "Failed to " + VERBS[m[1]] + (m[2] || "");
    }],
    [/^Para ativar (.+), adicione a conexão no painel do OmniRoute \(Provedores\)\. Ele aparece aqui sozinho\.$/, function (m) {
      return "To enable " + m[1] + ", add the connection in the OmniRoute panel (Providers). It will show up here automatically.";
    }],
    [/^às (.+)$/, function (m) { return "at " + m[1]; }]
  ];

  // Blocos com marcação dentro (negrito, código): trocados inteiros.
  var BLOCKS = [
    { find: function () { return document.querySelectorAll("#help-sec p")[0]; },
      en: "<strong>No response from health:</strong> confirm that OmniRoute is running on port 8080 and that the Easy-o-Route server (port 8090) is active." },
    { find: function () { return document.querySelectorAll("#help-sec p")[1]; },
      en: "<strong>401 on providers or logs:</strong> the token is missing. Paste the <code>oma_live_…</code> key from OmniRoute (not the provider <code>sk-…</code> key) into the Token field and click Connect." },
    { find: function () { return document.querySelectorAll("#help-sec p")[2]; },
      en: "<strong>No data after connecting:</strong> check the connection log above and the Diagnostics field." },
    { find: function () { return document.querySelector("#token-guide ol"); },
      en: "<li>In OmniRoute, open the left side menu and go to <strong>Settings → Access token</strong>.</li>" +
        "<li>Click <strong>Create token</strong>: name <code>Easy-o-Route</code>, permission <strong>Administration – Manage</strong>, optional expiration (in days).</li>" +
        "<li>Click <strong>Create</strong> and copy the token (<code>oma_live_…</code>); it is shown only once.</li>" +
        "<li>Paste it in the field above and click <strong>Connect</strong>.</li>" },
    { find: function () { return document.querySelector("#token-guide > p"); },
      en: "To avoid pasting it every time, start the server with <code>iniciar-easy-o-route.ps1</code>." }
  ];

  var lang = "pt";
  var origText = new WeakMap(), lastText = new WeakMap(), attrState = new WeakMap();

  function lookup(core) {
    if (Object.prototype.hasOwnProperty.call(MAP, core)) return MAP[core];
    var t = core.match(/^(\d{1,2}:\d{2}:\d{2}\s+)([\s\S]*)$/);   // linhas do log vêm com hora na frente
    if (t) {
      var inner = lookup(t[2]);
      return inner == null ? null : t[1] + inner;
    }
    for (var i = 0; i < PATTERNS.length; i++) {
      var m = core.match(PATTERNS[i][0]);
      if (m) return PATTERNS[i][1](m);
    }
    return null;
  }

  function translate(raw) {
    var core = raw.trim();
    if (!core) return null;
    var out = lookup(core);
    if (out == null) return null;
    return raw.match(/^\s*/)[0] + out + raw.match(/\s*$/)[0];
  }

  function translateTextNode(node) {
    if (lang !== "en") return;
    var parent = node.parentNode;
    if (parent && SKIP[parent.nodeName]) return;
    var v = node.nodeValue;
    if (lastText.get(node) === v) return;            // já é a nossa tradução
    var en = translate(v);
    if (en != null && en !== v) {
      origText.set(node, v);
      lastText.set(node, en);
      node.nodeValue = en;
    } else {
      origText.delete(node);
      lastText.delete(node);
    }
  }

  function translateAttrs(el) {
    if (lang !== "en" || !el.hasAttribute) return;
    var rec = attrState.get(el) || {};
    ATTRS.forEach(function (a) {
      if (!el.hasAttribute(a)) return;
      var v = el.getAttribute(a);
      if (rec[a] && rec[a].last === v) return;
      var en = translate(v);
      if (en != null && en !== v) {
        rec[a] = { orig: v, last: en };
        el.setAttribute(a, en);
      } else {
        delete rec[a];
      }
    });
    attrState.set(el, rec);
  }

  function translateTree(root) {
    if (root.nodeType === 3) { translateTextNode(root); return; }
    if (root.nodeType !== 1) return;
    translateAttrs(root);
    var w = document.createTreeWalker(root, NodeFilter.SHOW_TEXT | NodeFilter.SHOW_ELEMENT, null);
    var n;
    while ((n = w.nextNode())) {
      if (n.nodeType === 3) translateTextNode(n); else translateAttrs(n);
    }
  }

  function restoreTree(root) {
    var w = document.createTreeWalker(root, NodeFilter.SHOW_TEXT | NodeFilter.SHOW_ELEMENT, null);
    var n;
    while ((n = w.nextNode())) {
      if (n.nodeType === 3) {
        if (origText.has(n)) { n.nodeValue = origText.get(n); origText.delete(n); lastText.delete(n); }
      } else {
        var rec = attrState.get(n);
        if (rec) {
          Object.keys(rec).forEach(function (a) { n.setAttribute(a, rec[a].orig); });
          attrState.delete(n);
        }
      }
    }
  }

  BLOCKS.forEach(function (b) { b.el = b.find(); b.pt = b.el ? b.el.innerHTML : null; });

  function applyBlocks() {
    BLOCKS.forEach(function (b) {
      if (b.el) b.el.innerHTML = lang === "en" ? b.en : b.pt;
    });
  }

  function updateButtons() {
    Array.prototype.forEach.call(document.querySelectorAll(".lang-seg button"), function (btn) {
      var on = btn.getAttribute("data-lang") === lang;
      btn.classList.toggle("active", on);
      btn.setAttribute("aria-pressed", String(on));
    });
  }

  function setLang(next) {
    lang = next === "en" ? "en" : "pt";
    try { localStorage.setItem(STORE_KEY, lang); } catch (e) { /* sem armazenamento: só não lembra */ }
    document.documentElement.setAttribute("lang", lang === "en" ? "en" : "pt-BR");
    if (window.state) window.state.lang = lang;
    document.title = lang === "en" ? "Easy-o-Route · Provider topology" : TITLE_PT;
    applyBlocks();
    if (lang === "en") translateTree(document.body); else restoreTree(document.body);
    updateButtons();
  }

  var observer = new MutationObserver(function (records) {
    if (lang !== "en") return;
    records.forEach(function (r) {
      if (r.type === "childList") Array.prototype.forEach.call(r.addedNodes, function (n) { translateTree(n); });
      else if (r.type === "characterData") translateTextNode(r.target);
      else if (r.type === "attributes") translateAttrs(r.target);
    });
  });
  observer.observe(document.body, {
    subtree: true, childList: true, characterData: true, attributes: true, attributeFilter: ATTRS
  });

  Array.prototype.forEach.call(document.querySelectorAll(".lang-seg button"), function (btn) {
    btn.addEventListener("click", function () { setLang(btn.getAttribute("data-lang")); });
  });

  var saved = null;
  try { saved = localStorage.getItem(STORE_KEY); } catch (e) { saved = null; }
  if (!saved) saved = /^en/i.test(navigator.language || "") ? "en" : "pt";
  setLang(saved);
})();
