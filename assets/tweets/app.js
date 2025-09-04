/* ========= Config ========= */
const API_BASE = "http://localhost:5001"; // backend del paso 1
const USER = "iZoteXD";             // usuario por defecto
const LIMIT = 10;                         // 5..10
const SPEED = 80;                         // px/s fijo
const THEME = "dark";
const SHOW_REPLIES = false;

/* ========= Helpers ========= */
const $ = (s) => document.querySelector(s);
const ROOT = document.documentElement;
const getCSSnum = (name, fallback=0) => {
  const v = parseFloat(getComputedStyle(ROOT).getPropertyValue(name));
  return Number.isFinite(v) ? v : fallback;
};
const GAP = getCSSnum("--gap", 24);
const TWEET_W = getCSSnum("--tweet-w", 360);

const normalize = (u) => String(u).replace(/^https?:\/\/x\.com/i, "https://twitter.com");
const extractId  = (u) => (normalize(u).match(/status\/(\d+)/) || [])[1] || null;

function waitForTwttr(){
  return new Promise(res=>{
    if (window.twttr && twttr.widgets) return res();
    const iv=setInterval(()=>{ if(window.twttr&&twttr.widgets){clearInterval(iv);res();}},50);
  });
}

function makeCard(){
  const card=document.createElement("div"); card.className="card";
  const mount=document.createElement("div"); mount.className="mount";
  card.appendChild(mount);
  return {card,mount};
}

function showError(mount,url,msg){
  mount.innerHTML = `<div class="err">❗ ${msg}<br><small>${url||""}</small></div>`;
}

/* ========= 1) Traer 5–10 URLs desde la API ========= */
async function fetchTweetUrls(user=USER, limit=LIMIT){
  try{
    const r = await fetch(`${API_BASE}/api/tweets?user=${encodeURIComponent(user)}&limit=${limit}`);
    const j = await r.json();
    if (!Array.isArray(j.urls)) return [];
    return j.urls;
  }catch(e){
    console.error("API error", e);
    return [];
  }
}

/* ========= 2) Renderizar pista A y esperar 'rendered' ========= */
async function buildTapeA(tapeEl, urls){
  const mounts = [];
  tapeEl.innerHTML = "";
  for(const url of urls){
    const {card,mount}=makeCard();
    tapeEl.appendChild(card);
    mounts.push({mount,url});
  }

  await waitForTwttr();

  await Promise.all(mounts.map(({mount,url}) => new Promise(async (resolve)=>{
    const id = extractId(url);
    if(!id){ showError(mount,url,"URL inválida (falta /status/ID)"); return resolve(); }
    try{
      const widget = await twttr.widgets.createTweet(id, mount, {
        theme: THEME,
        width: TWEET_W,
        conversation: SHOW_REPLIES ? "all" : "none",
        lang: "es",
        dnt: true,
        align: "center"
      });
      // espera a 'rendered' para medir bien
      const safety = setTimeout(resolve, 2000);
      function onRendered(ev){
        if (ev.target === widget){
          clearTimeout(safety);
          twttr.events.unbind("rendered", onRendered);
          resolve();
        }
      }
      twttr.events.bind("rendered", onRendered);
    }catch(e){
      showError(mount,url,"No se pudo embeber (¿borrado/privado?)");
      console.error("Embed fail:", url, e);
      resolve();
    }
  })));
}

/* ========= 3) Asegurar overflow real (duplicar A y armar B) ========= */
function ensureOverflow(viewport, scroller, tapeA, tapeB){
  // espejo inicial
  tapeB.innerHTML = tapeA.innerHTML;

  // queremos que A + gap + B > 1.6 × viewport (margen)
  const target = viewport.clientWidth * 1.6;
  while (scroller.scrollWidth <= target){
    const clones = Array.from(tapeA.children).map(n => n.cloneNode(true));
    tapeA.append(...clones);
    tapeB.innerHTML = tapeA.innerHTML;
  }
}

/* ========= 4) Marquee infinito (80 px/s) con pausa en hover ========= */
function startMarquee(){
  const viewport = $("#viewport");
  const scroller = $("#scroller");
  const tapeA = $("#tapeA");
  const tapeB = $("#tapeB");

  ensureOverflow(viewport, scroller, tapeA, tapeB);

  let paused = false;
  let start = performance.now();
  let segment = tapeA.scrollWidth + GAP;

  function step(now){
    if (!paused && segment > 0){
      const t = (now - start)/1000;      // segundos
      const x = (SPEED * t) % segment;   // desplazamiento modular
      viewport.scrollLeft = x;
    } else if (paused){
      // reanudar sin salto
      start = now - (viewport.scrollLeft / SPEED) * 1000;
    }
    requestAnimationFrame(step);
  }
  requestAnimationFrame(step);

  // pausa al pasar el puntero
  viewport.addEventListener("mouseenter", ()=> paused = true);
  viewport.addEventListener("mouseleave", ()=> paused = false);

  // por si cambia el tamaño de ventana
  let to;
  window.addEventListener("resize", ()=>{
    clearTimeout(to);
    to = setTimeout(()=>{
      ensureOverflow(viewport, scroller, tapeA, tapeB);
      segment = tapeA.scrollWidth + GAP;
      const now = performance.now();
      start = now - (viewport.scrollLeft / SPEED) * 1000;
    }, 150);
  }, {passive:true});
}

/* ========= 5) Init: cargar 5–10 desde API y arrancar ========= */
(async ()=>{
  const urls = await fetchTweetUrls(USER, LIMIT);
  if (urls.length === 0){
    // Mensaje visible si no hay tweets o la API falló
    const mount = document.createElement("div");
    mount.className = "err";
    mount.style.margin = "12px";
    mount.innerHTML = "No se pudieron cargar tweets. Revisa el backend o el token.";
    $("#tapeA").appendChild(mount);
    return;
  }
  await buildTapeA($("#tapeA"), urls);
  startMarquee();
})();
