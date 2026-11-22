/* Ajuda de erros: mostra a causa provável, os passos para resolver e um botão para buscar
   a solução na web. Aparece ao clicar numa requisição com erro ou no botão
   "Como resolver um erro" do painel Conectar OmniRoute.
   Nada é enviado sozinho: a busca na web só abre quando o usuário clica, e o texto da busca
   fica visível na janela. Nenhum token entra nos textos. */
(function () {
  "use strict";

  var ISSUES_URL = "https://github.com/ferpa2505-art/Easy-O-Route/issues/new";

  function isEn() { return document.documentElement.getAttribute("lang") === "en"; }
  function L(pt, en) { return isEn() ? en : pt; }

  function statusKind(status) {
    var s = String(status || "").toLowerCase();
    if (/^(401|403)$/.test(s)) return "bad-key";
    if (s === "404") return "not-found";
    if (s === "429") return "rate-limit";
    if (/^5\d\d$/.test(s)) return "server-error";
    if (/timeout|timed out|abort/.test(s)) return "timeout";
    return "unknown";
  }

  // Cada entrada devolve { title, why, steps[], query }.
  function describe(kind, ctx) {
    var provider = ctx.provider || L("o provedor", "the provider");
    var model = ctx.model || "";
    var status = ctx.status || "";
    switch (kind) {
      case "no-connection":
        return {
          title: L("Não consigo falar com o OmniRoute", "Can't reach OmniRoute"),
          why: L("O painel não recebeu resposta do OmniRoute.", "The panel got no answer from OmniRoute."),
          steps: [
            L("Abra o OmniRoute no navegador (normalmente http://localhost:20128). Se não abrir, ele não está rodando: inicie-o.",
              "Open OmniRoute in the browser (usually http://localhost:20128). If it does not open, it is not running: start it."),
            L("Se ele usa outra porta, reinicie o painel apontando para ela: easy-o-route panel --omni-url http://localhost:PORTA.",
              "If it uses another port, restart the panel pointing to it: easy-o-route panel --omni-url http://localhost:PORT."),
            L("Depois de reiniciar o OmniRoute, espere alguns segundos: esta página reconecta sozinha.",
              "After restarting OmniRoute, wait a few seconds: this page reconnects by itself.")
          ],
          query: "OmniRoute not running localhost 20128 connection refused"
        };
      case "need-token":
        return {
          title: L("O OmniRoute pediu o token", "OmniRoute asked for the token"),
          why: L("A saúde responde, mas provedores e logs exigem autenticação (401).",
            "Health answers, but providers and logs require authentication (401)."),
          steps: [
            L("No OmniRoute, menu lateral esquerdo → Configurações → Token de acesso.",
              "In OmniRoute, left side menu → Settings → Access token."),
            L("Criar token: nome Easy-o-Route, permissão Administração – Gerenciar, expiração opcional.",
              "Create token: name Easy-o-Route, permission Administration – Manage, optional expiration."),
            L("Copie o token (oma_live_…) — ele só aparece uma vez — e cole no campo Token do painel Conectar OmniRoute.",
              "Copy the token (oma_live_…) — it is shown only once — and paste it in the Token field of the Connect OmniRoute panel."),
            L("Clique em Conectar. O botão do rodapé fica verde quando funcionar.",
              "Click Connect. The footer button turns green when it works.")
          ],
          query: "OmniRoute access token 401 unauthorized management API"
        };
      case "timeout":
        return {
          title: L("O OmniRoute demorou demais para responder", "OmniRoute took too long to answer"),
          why: L("A leitura de provedores ou logs passou do tempo limite.", "Reading providers or logs exceeded the time limit."),
          steps: [
            L("Espere a próxima leitura (a cada 4 s); picos passam sozinhos.", "Wait for the next read (every 4 s); spikes pass by themselves."),
            L("Veja se o computador está sem memória ou com CPU no limite (painel Sistema).", "Check whether the computer is out of memory or CPU is maxed out (System panel)."),
            L("Se repetir, reinicie o OmniRoute e limpe logs muito grandes.", "If it keeps happening, restart OmniRoute and clear very large logs.")
          ],
          query: "OmniRoute slow response timeout request logs"
        };
      case "bad-key":
        return {
          title: L(provider + " recusou a chave (" + status + ")", provider + " rejected the key (" + status + ")"),
          why: L("A chave do provedor pode estar vencida, inválida ou sem permissão.", "The provider key may be expired, invalid or lack permission."),
          steps: [
            L("No OmniRoute, abra Provedores, encontre " + provider + " e clique em Testar.", "In OmniRoute, open Providers, find " + provider + " and click Test."),
            L("Se falhar, gere uma chave nova no site do provedor e atualize a conexão.", "If it fails, create a new key on the provider's site and update the connection."),
            L("Confira se a conta tem crédito ou plano ativo.", "Check that the account has credit or an active plan."),
            L("Se a chave apareceu em algum chat ou arquivo público, revogue-a e use a nova.", "If the key ever appeared in a chat or public file, revoke it and use the new one.")
          ],
          query: "OmniRoute " + provider + " " + status + " invalid api key"
        };
      case "not-found":
        return {
          title: L("Modelo ou rota não encontrada (404)", "Model or route not found (404)"),
          why: L("O provedor não conhece o modelo pedido" + (model ? " (" + model + ")" : "") + ".",
            "The provider does not know the requested model" + (model ? " (" + model + ")" : "") + "."),
          steps: [
            L("Confira o nome do modelo" + (model ? " " + model : "") + " no OmniRoute (Modelos).", "Check the model name" + (model ? " " + model : "") + " in OmniRoute (Models)."),
            L("Atualize a lista de modelos do provedor " + provider + ".", "Refresh the model list of " + provider + "."),
            L("Se usa um combo, veja se ele aponta para um modelo que ainda existe.", "If you use a combo, make sure it points to a model that still exists.")
          ],
          query: "OmniRoute " + provider + " model not found 404 " + model
        };
      case "rate-limit":
        return {
          title: L("Limite de uso atingido (429)", "Usage limit reached (429)"),
          why: L(provider + " limitou as chamadas por minuto ou por dia.", provider + " limited calls per minute or per day."),
          steps: [
            L("Espere alguns minutos e tente de novo.", "Wait a few minutes and try again."),
            L("Crie um combo com um provedor de reserva (fallback) para continuar sem parar.", "Create a combo with a backup provider (fallback) to keep going."),
            L("Se usa um plano gratuito, confira a cota no site do provedor.", "If you use a free plan, check the quota on the provider's site.")
          ],
          query: "OmniRoute " + provider + " 429 rate limit fallback combo"
        };
      case "server-error":
        return {
          title: L("O provedor falhou (" + status + ")", "The provider failed (" + status + ")"),
          why: L(provider + " respondeu com erro interno; geralmente é passageiro.", provider + " answered with an internal error; it is usually temporary."),
          steps: [
            L("Tente de novo em instantes.", "Try again in a moment."),
            L("Veja a página de status do provedor " + provider + ".", "Check the status page of " + provider + "."),
            L("Configure um combo com fallback para trocar de provedor automaticamente.", "Set up a combo with fallback to switch providers automatically.")
          ],
          query: "OmniRoute " + provider + " " + status + " server error"
        };
      default:
        return {
          title: L("Erro sem causa conhecida", "Error with no known cause"),
          why: L("Esta página ainda não sabe explicar este erro" + (status ? " (" + status + ")" : "") + ".",
            "This page cannot explain this error yet" + (status ? " (" + status + ")" : "") + "."),
          steps: [
            L("No OmniRoute, abra Logs e leia a linha completa deste erro.", "In OmniRoute, open Logs and read the full line of this error."),
            L("Use Buscar solução na web: a busca já leva o provedor e o código do erro.", "Use Search the web: the search already carries the provider and the error code."),
            L("Se não achar nada, abra um issue com o botão abaixo; os detalhes já vão copiados.", "If you find nothing, open an issue with the button below; the details are copied for you.")
          ],
          query: "OmniRoute " + provider + " " + status + " error " + model
        };
    }
  }

  // Estado atual da conexão (usa as variáveis da página, só leitura).
  function currentKind() {
    var last = (window.realPoll && window.realPoll.lastMsg) || "";
    if (typeof window.realActive !== "undefined" && !window.realActive) return { kind: "no-connection", ctx: {} };
    if (/401/.test(last)) return { kind: "need-token", ctx: {} };
    if (/tempo limite|time limit/i.test(last)) return { kind: "timeout", ctx: {} };
    if (/HTTP \d+|falha|failed/i.test(last)) return { kind: "unknown", ctx: { status: last.replace(/^Conectado[^:]*: ?/, "") } };
    return null;
  }

  var modal = null, current = null;

  function ensureModal() {
    if (modal) return modal;
    var css = document.createElement("style");
    css.textContent =
      ".req-item[data-help]{cursor:pointer}.req-item[data-help]:hover{border-color:rgba(244,63,94,.55)}" +
      ".help-backdrop{position:fixed;inset:0;z-index:120;display:flex;align-items:center;justify-content:center;" +
      "background:rgba(0,0,0,.55);padding:16px}.help-backdrop[hidden]{display:none}" +
      ".help-dialog{width:min(520px,100%);max-height:calc(100vh - 32px);overflow:auto;background:#0b0f16;color:#e5e7eb;" +
      "border:1px solid rgba(255,255,255,.14);border-radius:14px;padding:18px;box-shadow:0 24px 60px rgba(0,0,0,.55)}" +
      ".help-head{display:flex;justify-content:space-between;align-items:flex-start;gap:12px}" +
      ".help-head h2{font-size:16px;font-weight:600;margin:0}.help-x{width:28px;height:28px;border-radius:8px;cursor:pointer;" +
      "background:transparent;color:inherit;border:1px solid rgba(255,255,255,.16);font-size:16px;line-height:1}" +
      ".help-why{margin:8px 0 0;font-size:12.5px;color:#9ca3af}.help-steps{margin:12px 0 0 18px;padding:0;list-style:decimal;" +
      "font-size:13px;line-height:1.5}.help-steps li{margin:6px 0}.help-query{margin:12px 0 0;font-size:11px;color:#8b98a5;" +
      "font-family:ui-monospace,Menlo,monospace;word-break:break-word}.help-actions{display:flex;flex-wrap:wrap;gap:8px;margin-top:14px}" +
      "html[data-theme=light] .help-dialog{background:#fff;color:#0f172a;border-color:rgba(15,23,42,.14)}" +
      "html[data-theme=light] .help-why,html[data-theme=light] .help-query{color:#475569}" +
      "html[data-theme=light] .help-x{border-color:rgba(15,23,42,.2)}" +
      "html[data-theme=medium] .help-dialog{background:#2a3343}";
    document.head.appendChild(css);

    modal = document.createElement("div");
    modal.className = "help-backdrop";
    modal.hidden = true;
    var dlg = document.createElement("div");
    dlg.className = "help-dialog";
    dlg.setAttribute("role", "dialog");
    dlg.setAttribute("aria-modal", "true");
    dlg.setAttribute("aria-labelledby", "help-title");
    var head = document.createElement("div");
    head.className = "help-head";
    var h2 = document.createElement("h2");
    h2.id = "help-title";
    var x = document.createElement("button");
    x.type = "button"; x.className = "help-x"; x.textContent = "×";
    x.addEventListener("click", close);
    head.appendChild(h2); head.appendChild(x);
    var why = document.createElement("p"); why.className = "help-why";
    var steps = document.createElement("ol"); steps.className = "help-steps";
    var query = document.createElement("p"); query.className = "help-query";
    var actions = document.createElement("div"); actions.className = "help-actions";
    var bSearch = document.createElement("button"); bSearch.type = "button"; bSearch.className = "primary-btn";
    var bCopy = document.createElement("button"); bCopy.type = "button"; bCopy.className = "ghost-btn";
    var bIssue = document.createElement("button"); bIssue.type = "button"; bIssue.className = "ghost-btn";
    actions.appendChild(bSearch); actions.appendChild(bCopy); actions.appendChild(bIssue);
    dlg.appendChild(head); dlg.appendChild(why); dlg.appendChild(steps); dlg.appendChild(query); dlg.appendChild(actions);
    modal.appendChild(dlg);
    document.body.appendChild(modal);
    modal.addEventListener("click", function (ev) { if (ev.target === modal) close(); });
    document.addEventListener("keydown", function (ev) { if (ev.key === "Escape" && !modal.hidden) close(); });
    bSearch.addEventListener("click", function () {
      if (current) window.open("https://www.google.com/search?q=" + encodeURIComponent(current.info.query), "_blank", "noopener");
    });
    bCopy.addEventListener("click", copyDetails);
    bIssue.addEventListener("click", function () {
      copyDetails();
      window.open(ISSUES_URL, "_blank", "noopener");
    });
    modal._els = { h2: h2, why: why, steps: steps, query: query, bSearch: bSearch, bCopy: bCopy, bIssue: bIssue, x: x };
    return modal;
  }

  function detailsText() {
    var c = current;
    return [
      "Easy-o-Route panel — error details",
      "Problem: " + c.info.title,
      "Kind: " + c.kind,
      "Provider: " + (c.ctx.provider || "-"),
      "Model: " + (c.ctx.model || "-"),
      "Status: " + (c.ctx.status || "-"),
      "Time: " + new Date().toISOString(),
      "Connected to OmniRoute: " + (typeof window.realActive !== "undefined" ? String(window.realActive) : "?")
    ].join("\n");
  }

  function copyDetails() {
    if (!current) return;
    var text = detailsText();
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(function () { if (window.toast) window.toast(L("Copiado", "Copied")); });
    }
  }

  function close() { if (modal) modal.hidden = true; }

  function show(kind, ctx) {
    ctx = ctx || {};
    var info = describe(kind, ctx);
    current = { kind: kind, ctx: ctx, info: info };
    var m = ensureModal(), e = m._els;
    e.h2.textContent = info.title;
    e.why.textContent = info.why;
    e.steps.textContent = "";
    info.steps.forEach(function (s) {
      var li = document.createElement("li");
      li.textContent = s;
      e.steps.appendChild(li);
    });
    e.query.textContent = L("A busca na web usará: ", "The web search will use: ") + info.query;
    e.bSearch.textContent = L("Buscar solução na web", "Search the web for a fix");
    e.bCopy.textContent = L("Copiar detalhes", "Copy details");
    e.bIssue.textContent = L("Abrir issue (copia os detalhes)", "Open issue (copies the details)");
    e.x.setAttribute("aria-label", L("Fechar", "Close"));
    m.hidden = false;
    e.bSearch.focus();
  }

  function showCurrent() {
    var c = currentKind();
    if (!c) {
      var m = ensureModal(), e = m._els;
      current = { kind: "ok", ctx: {}, info: { title: "", why: "", steps: [], query: "OmniRoute" } };
      e.h2.textContent = L("Nenhum erro agora", "No error right now");
      e.why.textContent = L("A conexão com o OmniRoute está funcionando. Quando algo falhar, clique na requisição com erro (ou volte aqui) para ver como resolver.",
        "The connection to OmniRoute is working. When something fails, click the failed request (or come back here) to see how to fix it.");
      e.steps.textContent = "";
      e.query.textContent = "";
      e.bSearch.textContent = L("Buscar solução na web", "Search the web for a fix");
      e.bCopy.textContent = L("Copiar detalhes", "Copy details");
      e.bIssue.textContent = L("Abrir issue (copia os detalhes)", "Open issue (copies the details)");
      m.hidden = false;
      return;
    }
    show(c.kind, c.ctx);
  }

  // Marca uma linha de requisição com erro para ser clicável.
  function markRow(rowId, info) {
    var row = document.getElementById(rowId);
    if (!row) return;
    row.setAttribute("data-help", "1");
    row.setAttribute("data-status", info.status || "");
    row.setAttribute("data-provider", info.provider || "");
    row.setAttribute("data-model", info.model || "");
    row.setAttribute("title", "Clique para ver como resolver");
  }

  document.addEventListener("click", function (ev) {
    var row = ev.target.closest && ev.target.closest(".req-item[data-help]");
    if (!row) return;
    var status = row.getAttribute("data-status");
    show(statusKind(status), { status: status, provider: row.getAttribute("data-provider"), model: row.getAttribute("data-model") });
  });

  // Botão dentro do painel Conectar OmniRoute.
  var guide = document.getElementById("token-guide");
  if (guide && guide.parentNode) {
    var b = document.createElement("button");
    b.type = "button";
    b.className = "ghost-btn";
    b.id = "btn-help";
    b.style.marginTop = "8px";
    b.textContent = "Como resolver um erro";
    b.addEventListener("click", showCurrent);
    guide.parentNode.insertBefore(b, guide.nextSibling);
  }

  window.EasyHelp = { show: show, showCurrent: showCurrent, markRow: markRow };
})();
