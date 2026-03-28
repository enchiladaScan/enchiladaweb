/* 1) RECUPERAMOS LOS DATOS DESDE EL HTML (JEKYLL) */
// Si por alguna razón la lista falla, usamos una por defecto para que no de error
const TWEET_URLS = window.TWEET_DATA && window.TWEET_DATA.length > 0
  ? window.TWEET_DATA
  : ["https://x.com/EnchiladaScan/status/1959973771118256339"];

/* 2) Parámetros fijos (sin controles) */
const SPEED = 45;            // px/s, velocidad
const THEME = "dark";        // oscuro fijo
const SHOW_REPLIES = false;  // conversation:"none" si false

/* 3) Helpers */
const $ = (s) => document.querySelector(s);
const ROOT = document.documentElement;
const getCSSnum = (name, fallback = 0) => {
  const v = parseFloat(getComputedStyle(ROOT).getPropertyValue(name));
  return Number.isFinite(v) ? v : fallback;
};
const GAP = getCSSnum("--gap", 24);
const TWEET_W = getCSSnum("--tweet-w", 360);

const normalize = (u) => String(u).replace(/^https?:\/\/x\.com/i, "https://twitter.com");
const extractId = (u) => (normalize(u).match(/status\/(\d+)/) || [])[1] || null;

function waitForTwttr() {
  return new Promise(res => {
    if (window.twttr && twttr.widgets) return res();
    const iv = setInterval(() => { if (window.twttr && twttr.widgets) { clearInterval(iv); res(); } }, 50);
  });
}

function makeCard() {
  const card = document.createElement("div"); card.className = "card";
  const mount = document.createElement("div"); mount.className = "mount";
  card.appendChild(mount);
  return { card, mount };
}

function showError(mount, url, msg) {
  mount.innerHTML = `<div class="err">❗ ${msg}<br><small>${url}</small></div>`;
}

/* 4) Renderiza pista A y espera 'rendered' de cada widget */
async function buildTapeA(tapeEl, urls) {
  const mounts = [];
  for (const url of urls) {
    const { card, mount } = makeCard();
    tapeEl.appendChild(card);
    mounts.push({ mount, url });
  }

  await waitForTwttr();

  await Promise.all(mounts.map(({ mount, url }) => new Promise(async (resolve) => {
    const id = extractId(url);
    if (!id) { showError(mount, url, "URL inválida (falta /status/ID)"); return resolve(); }
    try {
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
      function onRendered(ev) {
        if (ev.target === widget) {
          clearTimeout(safety);
          twttr.events.unbind("rendered", onRendered);
          resolve();
        }
      }
      twttr.events.bind("rendered", onRendered);
    } catch (e) {
      showError(mount, url, "No se pudo embeber (¿borrado/privado?)");
      console.error("Embed fail:", url, e);
      resolve();
    }
  })));
}

/* 5) Duplica A hasta overflow real y arma B */
function ensureOverflow(viewport, scroller, tapeA, tapeB) {
  // espejo inicial
  tapeB.innerHTML = tapeA.innerHTML;

  // objetivo: que (A + gap + B) sea claramente mayor al viewport
  const target = viewport.clientWidth * 1.6;

  // duplica A dentro de A hasta exceder el objetivo
  while (scroller.scrollWidth <= target) {
    const clones = Array.from(tapeA.children).map(n => n.cloneNode(true));
    tapeA.append(...clones);
    tapeB.innerHTML = tapeA.innerHTML; // B siempre espejo de A
  }
}

/* 6) Marquee con desplazamiento modular por tiempo + pausa en hover */
function startMarquee() {
  const viewport = $("#viewport");
  const scroller = $("#scroller");
  const tapeA = $("#tapeA");
  const tapeB = $("#tapeB");

  ensureOverflow(viewport, scroller, tapeA, tapeB);

  let paused = false;
  let start = performance.now();
  let segment = tapeA.scrollWidth + GAP;

  function step(now) {
    if (!paused) {
      // Detectamos si estamos en PC o en Celular
      const isDesktop = window.innerWidth >= 1024;

      // Si es PC medimos la altura, si es celular medimos el ancho
      const segment = isDesktop ? (tapeA.scrollHeight + GAP) : (tapeA.scrollWidth + GAP);
      const dist = (SPEED * (now - start) / 1000) % segment;

      if (isDesktop) {
        viewport.scrollTop = dist;  // Cascada vertical
        viewport.scrollLeft = 0;    // Reseteo de seguridad
      } else {
        viewport.scrollLeft = dist; // Cinta horizontal
        viewport.scrollTop = 0;     // Reseteo de seguridad
      }
    }
    requestAnimationFrame(step);
  }
  requestAnimationFrame(step);

  // pausa en hover
  viewport.addEventListener("mouseenter", () => paused = true);
  viewport.addEventListener("mouseleave", () => paused = false);

  // Si cambia el tamaño de ventana, ajusta los cálculos sin saltos
  let to;
  window.addEventListener("resize", () => {
    clearTimeout(to);
    to = setTimeout(() => {
      const isDesktop = window.innerWidth >= 1024;
      const currentPos = isDesktop ? viewport.scrollTop : viewport.scrollLeft;

      // ancla el tiempo actual para evitar “saltos”
      const now = performance.now();
      start = now - (currentPos / SPEED) * 1000;
    }, 150);
  }, { passive: true });
}

/* 7) Función para (re)iniciar la cinta */
window.iniciarMarquee = async () => {
  const tapeA = $("#tapeA");
  const tapeB = $("#tapeB");

  // 1. Limpiamos las cintas actuales para no duplicar contenido
  tapeA.innerHTML = "";
  tapeB.innerHTML = "";

  // 2. Obtenemos los datos actuales de Firebase (guardados en window.TWEET_DATA)
  const links = window.TWEET_DATA && window.TWEET_DATA.length > 0
    ? window.TWEET_DATA
    : ["https://x.com/EnchiladaScan/status/1959973771118256339"];

  console.log("Iniciando renderizado de cinta con:", links);

  // 3. la pista A y arrancamos el movimiento
  await buildTapeA(tapeA, links);
  startMarquee();
};

// Ejecución inicial al cargar por primera vez
window.iniciarMarquee();
