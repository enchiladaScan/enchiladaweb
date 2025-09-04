// API mínima para devolver 5–10 URLs de tweets públicos de un usuario.
// Requiere Node 18+ (fetch nativo) y la variable de entorno X_BEARER_TOKEN.

const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors()); // permite llamadas desde tu front (localhost:5000, etc.)

const PORT = process.env.PORT || 5001;
const TOKEN = process.env.X_BEARER_TOKEN;

if (!TOKEN) {
  console.error("❌ Falta la variable de entorno X_BEARER_TOKEN");
  process.exit(1);
}

async function xFetch(url) {
  const r = await fetch(url, {
    headers: { Authorization: `Bearer ${TOKEN}` }
  });
  if (!r.ok) {
    const msg = `X API error ${r.status}`;
    throw new Error(msg);
  }
  return r.json();
}

// GET /api/tweets?user=EnchiladaScan&limit=10
app.get("/api/tweets", async (req, res) => {
  try {
    const user = (req.query.user || "").replace(/^@/, "");
    if (!user) return res.status(400).json({ error: "missing_user" });

    const limit = Math.min(10, Math.max(5, parseInt(req.query.limit || "10", 10)));

    // 1) username -> user id
    const u = await xFetch(`https://api.twitter.com/2/users/by/username/${encodeURIComponent(user)}`);
    if (!u?.data?.id) return res.status(404).json({ error: "user_not_found" });

    // 2) últimos tweets (sin retweets ni replies)
    const t = await xFetch(
      `https://api.twitter.com/2/users/${u.data.id}/tweets?max_results=${limit}&exclude=retweets,replies`
    );

    const urls = (t?.data || []).map(x => `https://twitter.com/${user}/status/${x.id}`);

    res.set("Cache-Control", "public, max-age=120"); // cache 2 min
    res.json({ user, count: urls.length, urls });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "server_error" });
  }
});

app.listen(PORT, () => {
  console.log(`✅ API lista en http://localhost:${PORT}`);
});
