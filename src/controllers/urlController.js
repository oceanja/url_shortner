const pool = require("../config/db");
const Redis = require("ioredis");

const redis = new Redis(process.env.REDIS_URL || "redis://localhost:6379");

// ── Generate unique short code ──────────────────────────────────────────────
const generateShortCode = async () => {
  let code, exists = true;
  while (exists) {
    code = Math.random().toString(36).substring(2, 8);
    const check = await pool.query("SELECT id FROM urls WHERE short_code = $1", [code]);
    exists = check.rows.length > 0;
  }
  return code;
};

// ── Fire-and-forget click logger ─────────────────────────────────────────────
const logClick = async (shortCode, ip) => {
  try {
    const geo = await fetch(`http://ip-api.com/json/${ip}`);
    const { country } = await geo.json();
    await pool.query(
      "INSERT INTO clicks (short_code, country) VALUES ($1, $2)",
      [shortCode, country || "Unknown"]
    );
  } catch (_) {
    // never block the redirect if geo fails
  }
};

// ── POST /url/shorten ─────────────────────────────────────────────────────────
const createShortUrl = async (req, res) => {
  try {
    const { original_url, expires_at } = req.body;
    const userId = req.user.id;

    if (!original_url) {
      return res.status(400).json({ message: "Original URL is required" });
    }

    const shortCode = await generateShortCode();

    await pool.query(
      "INSERT INTO urls (short_code, original_url, user_id, expires_at) VALUES ($1, $2, $3, $4)",
      [shortCode, original_url, userId, expires_at || null]
    );

    res.json({
      short_url: `${process.env.BASE_URL || "http://127.0.0.1:9001"}/${shortCode}`,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ── GET /:shortCode ───────────────────────────────────────────────────────────
const redirectShortUrl = async (req, res) => {
  try {
    const { shortCode } = req.params;

    // 1. Check Redis cache first
    const cached = await redis.get(`url:${shortCode}`);
    if (cached) {
      // update click count + log asynchronously — don't await
      pool.query("UPDATE urls SET click_count = click_count + 1 WHERE short_code = $1", [shortCode]);
      logClick(shortCode, req.headers["x-forwarded-for"] || req.ip);
      return res.redirect(cached);
    }

    // 2. Cache miss — query DB
    const result = await pool.query("SELECT * FROM urls WHERE short_code = $1", [shortCode]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Short URL not found" });
    }

    const urlData = result.rows[0];

    // 3. Check expiry
    if (urlData.expires_at && new Date(urlData.expires_at) < new Date()) {
      return res.status(410).json({ message: "Link has expired" });
    }

    // 4. Store in Redis with 1 hour TTL
    await redis.setex(`url:${shortCode}`, 3600, urlData.original_url);

    // 5. Update click count + log (async)
    pool.query("UPDATE urls SET click_count = click_count + 1 WHERE id = $1", [urlData.id]);
    logClick(shortCode, req.headers["x-forwarded-for"] || req.ip);

    res.redirect(urlData.original_url);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ── GET /url/my ───────────────────────────────────────────────────────────────
const getMyUrls = async (req, res) => {
  try {
    const userId = req.user.id;
    const result = await pool.query(
      "SELECT short_code, original_url, click_count, created_at FROM urls WHERE user_id = $1 ORDER BY created_at DESC",
      [userId]
    );
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { createShortUrl, redirectShortUrl, getMyUrls };
