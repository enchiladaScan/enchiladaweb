/* 1) RECUPERAMOS DATOS */
const SPEED = 40;

// NUEVO: Conectamos la elección del usuario (Persistencia Universal)
// Lee si eligió modo claro, si no, usa oscuro por defecto.
const THEME = localStorage.getItem('site_theme') === 'light' ? 'light' : 'dark';

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

// BUG FIX: Renombramos la clase a .card.twitter-wrap para no chocar con el shadow rosa de los mangas
function makeCard() {
    const card = document.createElement("div");
    card.className = "card twitter-wrap"; // <--- AGREGAR CLASE AQUÍ
    const mount = document.createElement("div"); mount.className = "mount";
    card.appendChild(mount);
    return { card, mount };
}

/* 3) Función para construir Tweets LEGÍTIMOS (Con el tema dinámico) */
async function buildTape(tapeEl, urls) {
    const mounts = [];
    const TWEET_W = getCSSnum("--tweet-w", 290);

    for (const url of urls) {
        const { card, mount } = makeCard();
        tapeEl.appendChild(card);
        mounts.push({ mount, url });
    }

    await waitForTwttr();

    await Promise.all(mounts.map(({ mount, url }) => new Promise(async (resolve) => {
        const id = extractId(url);
        if (!id) { mount.innerHTML = `<div class="err">URL inválida</div>`; return resolve(); }
        try {
            const widget = await twttr.widgets.createTweet(id, mount, {
                theme: THEME, // <--- USA LA VARIABLE DINÁMICA DE ARRIBA (localStorage)
                width: TWEET_W,
                conversation: SHOW_REPLIES ? "all" : "none",
                lang: "es", dnt: true, align: "center"
            });
            let safety = setTimeout(resolve, 2000);
            function onRendered(ev) { if (ev.target === widget) { clearTimeout(safety); twttr.events.unbind("rendered", onRendered); resolve(); } }
            twttr.events.bind("rendered", onRendered);
        } catch (e) { mount.innerHTML = `<div class="err">Error embebiendo</div>`; resolve(); }
    })));
}

/* 4) Motor Marquee Anti-Bloqueo */
let isMarqueeRunning = false;
let paused = false;
let currentDist = 0;
let lastTime = null;

function startMarquee() {
    if (isMarqueeRunning) return;
    isMarqueeRunning = true;

    const viewport = $("#viewport");
    const tapeA = $("#tapeA");
    const GAP = getCSSnum("--gap", 24);

    function step(now) {
        if (!lastTime) lastTime = now;
        let dt = (now - lastTime) / 1000;
        lastTime = now;

        if (dt > 0.5) dt = 0.5; // Limita saltos si minimizas la pestaña

        if (!paused && tapeA.children.length > 0) {
            const isDesktop = window.innerWidth >= 1024;
            const segment = (isDesktop ? tapeA.scrollHeight : tapeA.scrollWidth) + GAP;

            if (segment > 0) {
                currentDist += SPEED * dt;
                currentDist %= segment;

                if (isDesktop) {
                    // Cascada Invertida (Caída libre)
                    viewport.scrollTop = segment - currentDist;
                    viewport.scrollLeft = 0;
                } else {
                    // Celular: Derecha a izquierda
                    viewport.scrollLeft = currentDist;
                    viewport.scrollTop = 0;
                }
            }
        }
        requestAnimationFrame(step);
    }
    requestAnimationFrame(step);

    viewport.addEventListener("mouseenter", () => paused = true);
    viewport.addEventListener("mouseleave", () => paused = false);
}

/* 5) Lógica Central de Firebase (Optimizada) */
window.iniciarMarquee = async () => {
    const tapeA = $("#tapeA");
    const tapeB = $("#tapeB");
    const viewport = $("#viewport");

    tapeA.innerHTML = ""; tapeB.innerHTML = ""; viewport.scrollTop = 0; viewport.scrollLeft = 0;
    currentDist = 0; lastTime = null;

    let rawLinks = window.TWEET_DATA && window.TWEET_DATA.length > 0
        ? window.TWEET_DATA
        : ["https://x.com/EnchiladaScan/status/1884405324548489679"];

    // Filtro 5 últimos, orden natural
    let uniqueLinks = [...new Set(rawLinks)];
    let finalLinks = uniqueLinks.slice(-5);

    await buildTape(tapeA, finalLinks);
    await buildTape(tapeB, finalLinks);

    startMarquee();
};