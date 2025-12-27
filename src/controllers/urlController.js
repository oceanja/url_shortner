const pool = require("../config/db");


const generateShortCode = async () => {
  let code, exists = true;

  while (exists) {
    code = Math.random().toString(36).substring(2, 8);
    const check = await pool.query(
      "SELECT id FROM urls WHERE short_code = $1",
      [code]
    );
    exists = check.rows.length > 0;
  }

  return code;
};


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
      [shortCode, original_url, userId, expires_at]
    );

    res.json({
      short_url: `http://127.0.0.1:9001/${shortCode}`
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


const redirectShortUrl = async (req, res) => {
  try {
    const { shortCode } = req.params;

    const result = await pool.query(
      "SELECT * FROM urls WHERE short_code = $1",
      [shortCode]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Short URL not found" });
    }

    const urlData = result.rows[0];

    if (urlData.expires_at && new Date(urlData.expires_at) < new Date()) {
      return res.status(410).json({ message: "Link has expired" });
    }

    await pool.query(
      "UPDATE urls SET click_count = click_count + 1 WHERE id = $1",
      [urlData.id]
    );

    res.redirect(urlData.original_url);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


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
