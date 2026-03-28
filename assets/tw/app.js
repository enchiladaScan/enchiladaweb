/* 1) RECUPERAMOS LOS DATOS DESDE EL HTML */
const SPEED = 45;
const THEME = "dark";
const SHOW_REPLIES = false;

/* 2) Helpers */
const $ = (s) => document.querySelector(s);
const ROOT = document.documentElement;
const getCSSnum = (name, fallback = 0) => {
  const v = parseFloat(getComputedStyle(ROOT).getPropertyValue(name));
  return Number.isFinite(v) ? v : fallback;
};

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

/* 3) Renderiza pista A */
async function buildTapeA(tapeEl, urls) {
  const mounts = [];
  const TWEET_W = getCSSnum("--tweet-w", 290); // Lee el nuevo tamaño de 290px

  for (const url of urls) {
    const { card, mount } = makeCard();
    tapeEl.appendChild(card);
    mounts.push({ mount, url });
  }

  await waitForTwttr();

  await Promise.all(mounts.map(({ mount, url }) => new Promise(async (resolve) => {
    const id = extractId(url);
    if (!id) { showError(mount, url, "URL inválida"); return resolve(); }
    try {
      const widget = await twttr.widgets.createTweet(id, mount, {
        theme: THEME,
        width: TWEET_W,
        conversation: SHOW_REPLIES ? "all" : "none",
        lang: "es",
        dnt: true,
        align: "center"
      });
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
      showError(mount, url, "No se pudo embeber");
      resolve();
    }
  })));
}

/* 4) Duplica A hasta overflow real y arma B */
function ensureOverflow(viewport, scroller, tapeA, tapeB) {
  tapeB.innerHTML = tapeA.innerHTML;
  const isDesktop = window.innerWidth >= 1024;
  const target = isDesktop ? viewport.clientHeight * 1.6 : viewport.clientWidth * 1.6;
  if (target === 0) return;
  const currentSize = () => isDesktop ? scroller.scrollHeight : scroller.scrollWidth;

  while (currentSize() <= target) {
    const clones = Array.from(tapeA.children).map(n => n.cloneNode(true));
    tapeA.append(...clones);
    tapeB.innerHTML = tapeA.innerHTML;
  }
}

/* 5) Motor Marquee Anti-Colisiones */
let isMarqueeRunning = false;
let paused = false;
let animationStart = performance.now();

function startMarquee() {
  if (isMarqueeRunning) return;
  isMarqueeRunning = true;

  const viewport = $("#viewport");
  const tapeA = $("#tapeA");
  const GAP = getCSSnum("--gap", 24);

  function step(now) {
    if (!paused && tapeA.children.length > 0) {
      const isDesktop = window.innerWidth >= 1024;
      const segment = isDesktop ? (tapeA.scrollHeight + GAP) : (tapeA.scrollWidth + GAP);

      if (segment > 0) {
        const dist = (SPEED * (now - animationStart) / 1000) % segment;
        if (isDesktop) {
          viewport.scrollTop = dist;
          viewport.scrollLeft = 0;
        } else {
          viewport.scrollLeft = dist;
          viewport.scrollTop = 0;
        }
      }
    }
    requestAnimationFrame(step);
  }
  requestAnimationFrame(step);

  viewport.addEventListener("mouseenter", () => paused = true);
  viewport.addEventListener("mouseleave", () => paused = false);

  let to;
  window.addEventListener("resize", () => {
    clearTimeout(to);
    to = setTimeout(() => {
      const isDesktop = window.innerWidth >= 1024;
      const currentPos = isDesktop ? viewport.scrollTop : viewport.scrollLeft;
      const now = performance.now();
      animationStart = now - (currentPos / SPEED) * 1000;

      const scroller = $("#scroller");
      const tapeB = $("#tapeB");
      if (tapeA.children.length > 0) {
        const originalCards = Array.from(tapeB.children);
        tapeA.innerHTML = "";
        tapeA.append(...originalCards.map(n => n.cloneNode(true)));
        ensureOverflow(viewport, scroller, tapeA, tapeB);
      }
    }, 150);
  }, { passive: true });
}

/* 6) Lógica de Firebase: Filtro y Orden */
window.iniciarMarquee = async () => {
  const tapeA = $("#tapeA");
  const tapeB = $("#tapeB");
  const viewport = $("#viewport");
  const scroller = $("#scroller");

  tapeA.innerHTML = "";
  tapeB.innerHTML = "";
  viewport.scrollTop = 0;
  viewport.scrollLeft = 0;
  animationStart = performance.now();

  let rawLinks = window.TWEET_DATA && window.TWEET_DATA.length > 0
    ? window.TWEET_DATA
    : ["https://x.com/EnchiladaScan/status/1884405324548489679"];

  // Filtramos duplicados, tomamos los últimos 5, y los invertimos (nuevo arriba)
  let uniqueLinks = [...new Set(rawLinks)];
  let finalLinks = uniqueLinks.slice(-5);

  await buildTapeA(tapeA, finalLinks);
  ensureOverflow(viewport, scroller, tapeA, tapeB);
  startMarquee();
};