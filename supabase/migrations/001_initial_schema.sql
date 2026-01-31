-- Currency Alert App - Initial Database Schema
-- Tables for storing exchange rates, alerts, and user preferences

-- ============================================================================
-- EXCHANGE RATES TABLE (Time-series data)
-- ============================================================================
CREATE TABLE IF NOT EXISTS exchange_rates (
  id BIGSERIAL PRIMARY KEY,
  currency_code VARCHAR(3) NOT NULL,
  bank_name VARCHAR(100) NOT NULL,
  cash_buy DECIMAL(10, 4),
  cash_sell DECIMAL(10, 4),
  spot_buy DECIMAL(10, 4),
  spot_sell DECIMAL(10, 4),
  transaction_fee TEXT,
  scraped_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT unique_rate_entry UNIQUE(currency_code, bank_name, scraped_at)
);

-- Indexes for performance
CREATE INDEX idx_exchange_rates_currency_time ON exchange_rates(currency_code, scraped_at DESC);
CREATE INDEX idx_exchange_rates_scraped_at ON exchange_rates(scraped_at DESC);
CREATE INDEX idx_exchange_rates_lookup ON exchange_rates(currency_code, bank_name, scraped_at DESC);

-- ============================================================================
-- BEST RATES CACHE (Materialized view updated after each scrape)
-- ============================================================================
CREATE TABLE IF NOT EXISTS best_rates (
  id SERIAL PRIMARY KEY,
  currency_code VARCHAR(3) NOT NULL UNIQUE,
  best_cash_buy DECIMAL(10, 4),
  best_cash_buy_bank VARCHAR(100),
  best_cash_sell DECIMAL(10, 4),
  best_cash_sell_bank VARCHAR(100),
  best_spot_buy DECIMAL(10, 4),
  best_spot_buy_bank VARCHAR(100),
  best_spot_sell DECIMAL(10, 4),
  best_spot_sell_bank VARCHAR(100),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_best_rates_currency ON best_rates(currency_code);

-- ============================================================================
-- USER PREFERENCES
-- ============================================================================
CREATE TABLE IF NOT EXISTS user_preferences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  favorite_currencies TEXT[] DEFAULT '{}',
  notification_enabled BOOLEAN DEFAULT true,
  email_notifications BOOLEAN DEFAULT false,
  push_token TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_user_preferences_user ON user_preferences(user_id);

-- ============================================================================
-- USER ALERTS
-- ============================================================================
CREATE TABLE IF NOT EXISTS alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  currency_code VARCHAR(3) NOT NULL,
  rate_type VARCHAR(20) NOT NULL, -- 'cash_buy', 'cash_sell', 'spot_buy', 'spot_sell'
  bank_name VARCHAR(100), -- NULL for 'best' alerts
  condition VARCHAR(10) NOT NULL, -- 'above', 'below', 'equals'
  target_rate DECIMAL(10, 4) NOT NULL,
  is_active BOOLEAN DEFAULT true,
  triggered_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_alerts_user ON alerts(user_id);
CREATE INDEX idx_alerts_active ON alerts(is_active, currency_code) WHERE is_active = true;

-- ============================================================================
-- ALERT NOTIFICATIONS LOG
-- ============================================================================
CREATE TABLE IF NOT EXISTS alert_notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  alert_id UUID REFERENCES alerts(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  triggered_rate DECIMAL(10, 4),
  bank_name VARCHAR(100),
  sent_at TIMESTAMPTZ DEFAULT NOW(),
  notification_method VARCHAR(20) -- 'push', 'email'
);

CREATE INDEX idx_notifications_user_time ON alert_notifications(user_id, sent_at DESC);

-- ============================================================================
-- SCRAPING METADATA (Track scraping health)
-- ============================================================================
CREATE TABLE IF NOT EXISTS scrape_metadata (
  id SERIAL PRIMARY KEY,
  scrape_started_at TIMESTAMPTZ NOT NULL,
  scrape_completed_at TIMESTAMPTZ,
  currencies_scraped INTEGER,
  total_rates_inserted INTEGER,
  errors TEXT[],
  status VARCHAR(20), -- 'success', 'partial', 'failed'
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_scrape_metadata_time ON scrape_metadata(scrape_started_at DESC);

-- ============================================================================
-- COMMENTS
-- ============================================================================
COMMENT ON TABLE exchange_rates IS 'Stores historical exchange rate data scraped from findrate.tw';
COMMENT ON TABLE best_rates IS 'Cached best rates across all banks for quick lookup';
COMMENT ON TABLE alerts IS 'User-defined price alerts for currency rates';
COMMENT ON TABLE alert_notifications IS 'Log of sent alert notifications';
COMMENT ON TABLE scrape_metadata IS 'Tracks scraper execution health and errors';
