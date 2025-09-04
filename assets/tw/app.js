/* 1) URLs (x.com o twitter.com) con /status/ID */
const TWEET_URLS = [
  "https://x.com/EnchiladaScan/status/1959973771118256339",
  "https://x.com/EnchiladaScan/status/1960805837930201088",
  "https://x.com/EnchiladaScan/status/1960517127749951931",
  "https://x.com/EnchiladaScan/status/1955144854968672577"
  // ...más URLs válidas
];

/* 2) Parámetros fijos (sin controles) */
const SPEED = 80;            // px/s, siempre 80
const THEME = "dark";        // oscuro fijo
const SHOW_REPLIES = false;  // conversation:"none" si false

/* 3) Helpers */
const $ = (s) => document.querySelector(s);
const ROOT = document.documentElement;
const getCSSnum = (name, fallback=0) => {
  const v = parseFloat(getComputedStyle(ROOT).getPropertyValue(name));
  return Number.isFinite(v) ? v : fallback;
};
const GAP = getCSSnum("--gap", 24);
const TWEET_W = getCSSnum("--tweet-w", 360);

const normalize = (u) => String(u).replace(/^https?:\/\/x\.com/i, "https://twitter.com");
const extractId = (u) => (normalize(u).match(/status\/(\d+)/) || [])[1] || null;

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
  mount.innerHTML = `<div class="err">❗ ${msg}<br><small>${url}</small></div>`;
}

/* 4) Renderiza pista A y espera 'rendered' de cada widget */
async function buildTapeA(tapeEl, urls){
  const mounts = [];
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
      // Espera a que ese widget termine de ajustar su altura
      let safety = setTimeout(resolve, 2000);
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

/* 5) Duplica A hasta overflow real y arma B */
function ensureOverflow(viewport, scroller, tapeA, tapeB){
  // espejo inicial
  tapeB.innerHTML = tapeA.innerHTML;

  // objetivo: que (A + gap + B) sea claramente mayor al viewport
  const target = viewport.clientWidth * 1.6;

  // duplica A dentro de A hasta exceder el objetivo
  while (scroller.scrollWidth <= target){
    const clones = Array.from(tapeA.children).map(n => n.cloneNode(true));
    tapeA.append(...clones);
    tapeB.innerHTML = tapeA.innerHTML; // B siempre espejo de A
  }
}

/* 6) Marquee con desplazamiento modular por tiempo + pausa en hover */
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

  // pausa en hover
  viewport.addEventListener("mouseenter", ()=> paused = true);
  viewport.addEventListener("mouseleave", ()=> paused = false);

  // Si cambia el tamaño de ventana, reasegura overflow sin reiniciar todo
  let to;
  window.addEventListener("resize", ()=>{
    clearTimeout(to);
    to = setTimeout(()=>{
      ensureOverflow(viewport, scroller, tapeA, tapeB);
      segment = tapeA.scrollWidth + GAP;
      // ancla el tiempo actual para evitar “saltos”
      const now = performance.now();
      start = now - (viewport.scrollLeft / SPEED) * 1000;
    }, 150);
  }, {passive:true});
}

/* 7) Init */
(async ()=>{
  await buildTapeA($("#tapeA"), TWEET_URLS); // espera a 'rendered' de todos los tweets
  startMarquee();                             // arranca bucle infinito a 80 px/s
})();
