/* Minimizar os painéis "Sistema" e "Requisições recentes".
   Minimizado, o painel sai do palco e vira um botão no rodapé, ao lado de "Dados reais";
   clicar no botão do rodapé traz o painel de volta.
   O estado fica em localStorage (chave easyoroute-hud-collapsed) e vale só neste navegador. */
(function () {
  "use strict";
  var KEY = "easyoroute-hud-collapsed";
  var saved = {};
  try { saved = JSON.parse(localStorage.getItem(KEY) || "{}") || {}; } catch (e) { saved = {}; }

  var docks = {};

  function persist() {
    try { localStorage.setItem(KEY, JSON.stringify(saved)); } catch (e) { /* sem armazenamento: só não lembra */ }
  }

  function setCollapsed(panel, id, collapsed) {
    panel.classList.toggle("collapsed", collapsed);
    if (docks[id]) docks[id].hidden = !collapsed;
    var btn = panel.querySelector(".hud-min");
    if (btn) btn.setAttribute("aria-expanded", String(!collapsed));
    saved[id] = collapsed;
    persist();
  }

  function makeDock(panel, id) {
    var titleEl = panel.querySelector(".hud-panel-title > span");
    var dock = document.createElement("button");
    dock.type = "button";
    dock.className = "footer-btn dock-btn";
    dock.hidden = true;
    dock.textContent = titleEl ? titleEl.textContent.trim() : id;
    dock.setAttribute("title", "Expandir");
    dock.setAttribute("aria-label", "Expandir");
    var anchor = document.getElementById("btn-connect-open");
    if (anchor && anchor.parentNode) anchor.parentNode.insertBefore(dock, anchor);
    dock.addEventListener("click", function () { setCollapsed(panel, id, false); });
    docks[id] = dock;
  }

  // Recurso opcional: esconde o botão de vídeo se o arquivo de demonstração não estiver na pasta.
  // (O servidor devolve a página inicial para arquivos inexistentes, então confere o tipo.)
  var video = document.getElementById("btn-video");
  if (video && typeof fetch === "function") {
    fetch("media/demo.mp4", { method: "HEAD" }).then(function (r) {
      if (!r.ok || !/^video\//.test(r.headers.get("content-type") || "")) video.hidden = true;
    }, function () { video.hidden = true; });
  }

  ["panel-system", "panel-requests"].forEach(function (id) {
    var panel = document.getElementById(id);
    if (!panel) return;
    makeDock(panel, id);
    setCollapsed(panel, id, !!saved[id]);
    var btn = panel.querySelector(".hud-min");
    if (btn) btn.addEventListener("click", function () { setCollapsed(panel, id, true); });
  });
})();
