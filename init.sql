CREATE TABLE IF NOT EXISTS users (
  id            SERIAL PRIMARY KEY,
  email         VARCHAR(255) UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  created_at    TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS urls (
  id           SERIAL PRIMARY KEY,
  short_code   VARCHAR(10) UNIQUE NOT NULL,
  original_url TEXT NOT NULL,
  user_id      INTEGER REFERENCES users(id),
  click_count  INTEGER DEFAULT 0,
  expires_at   TIMESTAMP,
  created_at   TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS clicks (
  id         SERIAL PRIMARY KEY,
  short_code VARCHAR(10) NOT NULL,
  country    VARCHAR(100) DEFAULT 'Unknown',
  clicked_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_clicks_short_code ON clicks(short_code);
