const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const pool = require("../config/db");
const { createShortUrl, redirectShortUrl, getMyUrls } = require("../controllers/urlController");

router.post("/shorten", authMiddleware, createShortUrl);
router.get("/my", authMiddleware, getMyUrls);

// Analytics — must be BEFORE /:shortCode so "analytics" isn't treated as a short code
router.get("/analytics/:shortCode", authMiddleware, async (req, res) => {
  try {
    const { shortCode } = req.params;

    const totalResult = await pool.query(
      "SELECT COUNT(*) as total FROM clicks WHERE short_code = $1",
      [shortCode]
    );

    const byCountry = await pool.query(
      `SELECT country, COUNT(*) as count
       FROM clicks
       WHERE short_code = $1
       GROUP BY country
       ORDER BY count DESC
       LIMIT 10`,
      [shortCode]
    );

    const byDay = await pool.query(
      `SELECT DATE(clicked_at) as date, COUNT(*) as count
       FROM clicks
       WHERE short_code = $1
       GROUP BY DATE(clicked_at)
       ORDER BY date DESC
       LIMIT 7`,
      [shortCode]
    );

    res.json({
      shortCode,
      totalClicks: parseInt(totalResult.rows[0].total),
      byCountry: byCountry.rows,
      last7Days: byDay.rows,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/:shortCode", redirectShortUrl);

module.exports = router;
