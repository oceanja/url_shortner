const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const { createShortUrl, redirectShortUrl, getMyUrls } = require("../controllers/urlController");

router.post("/shorten", authMiddleware, createShortUrl);
router.get("/my", authMiddleware, getMyUrls);
router.get("/:shortCode", redirectShortUrl);

module.exports = router;
