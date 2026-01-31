-- Currency Alert App - Row Level Security Policies
-- Ensures users can only access their own data

-- ============================================================================
-- ENABLE RLS ON ALL USER TABLES
-- ============================================================================
ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE alert_notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE exchange_rates ENABLE ROW LEVEL SECURITY;
ALTER TABLE best_rates ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- USER PREFERENCES POLICIES
-- ============================================================================

-- Users can view their own preferences
CREATE POLICY "Users can view own preferences"
  ON user_preferences FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Users can insert their own preferences
CREATE POLICY "Users can insert own preferences"
  ON user_preferences FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own preferences
CREATE POLICY "Users can update own preferences"
  ON user_preferences FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

-- Users can delete their own preferences
CREATE POLICY "Users can delete own preferences"
  ON user_preferences FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- ============================================================================
-- ALERTS POLICIES
-- ============================================================================

-- Users can view their own alerts
CREATE POLICY "Users can view own alerts"
  ON alerts FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Users can create their own alerts
CREATE POLICY "Users can create own alerts"
  ON alerts FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own alerts
CREATE POLICY "Users can update own alerts"
  ON alerts FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

-- Users can delete their own alerts
CREATE POLICY "Users can delete own alerts"
  ON alerts FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- ============================================================================
-- ALERT NOTIFICATIONS POLICIES
-- ============================================================================

-- Users can view their own notifications
CREATE POLICY "Users can view own notifications"
  ON alert_notifications FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Only system can insert notifications (service_role)
CREATE POLICY "Service role can insert notifications"
  ON alert_notifications FOR INSERT
  TO service_role
  WITH CHECK (true);

-- ============================================================================
-- EXCHANGE RATES POLICIES (Public Read-Only)
-- ============================================================================

-- All authenticated users can view exchange rates
CREATE POLICY "Anyone can view exchange rates"
  ON exchange_rates FOR SELECT
  TO authenticated
  USING (true);

-- Only service role (Edge Function) can insert rates
CREATE POLICY "Service role can insert rates"
  ON exchange_rates FOR INSERT
  TO service_role
  WITH CHECK (true);

-- ============================================================================
-- BEST RATES POLICIES (Public Read-Only)
-- ============================================================================

-- All authenticated users can view best rates
CREATE POLICY "Anyone can view best rates"
  ON best_rates FOR SELECT
  TO authenticated
  USING (true);

-- Only service role can manage best rates
CREATE POLICY "Service role can manage best rates"
  ON best_rates FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- ============================================================================
-- FUNCTIONS
-- ============================================================================

-- Function to automatically update best_rates table
CREATE OR REPLACE FUNCTION update_best_rates(p_currency_code VARCHAR(3))
RETURNS void AS $$
BEGIN
  INSERT INTO best_rates (
    currency_code,
    best_cash_buy,
    best_cash_buy_bank,
    best_cash_sell,
    best_cash_sell_bank,
    best_spot_buy,
    best_spot_buy_bank,
    best_spot_sell,
    best_spot_sell_bank,
    updated_at
  )
  SELECT
    p_currency_code,
    (SELECT cash_buy FROM exchange_rates WHERE currency_code = p_currency_code AND cash_buy IS NOT NULL ORDER BY cash_buy DESC LIMIT 1),
    (SELECT bank_name FROM exchange_rates WHERE currency_code = p_currency_code AND cash_buy IS NOT NULL ORDER BY cash_buy DESC LIMIT 1),
    (SELECT cash_sell FROM exchange_rates WHERE currency_code = p_currency_code AND cash_sell IS NOT NULL ORDER BY cash_sell ASC LIMIT 1),
    (SELECT bank_name FROM exchange_rates WHERE currency_code = p_currency_code AND cash_sell IS NOT NULL ORDER BY cash_sell ASC LIMIT 1),
    (SELECT spot_buy FROM exchange_rates WHERE currency_code = p_currency_code AND spot_buy IS NOT NULL ORDER BY spot_buy DESC LIMIT 1),
    (SELECT bank_name FROM exchange_rates WHERE currency_code = p_currency_code AND spot_buy IS NOT NULL ORDER BY spot_buy DESC LIMIT 1),
    (SELECT spot_sell FROM exchange_rates WHERE currency_code = p_currency_code AND spot_sell IS NOT NULL ORDER BY spot_sell ASC LIMIT 1),
    (SELECT bank_name FROM exchange_rates WHERE currency_code = p_currency_code AND spot_sell IS NOT NULL ORDER BY spot_sell ASC LIMIT 1),
    NOW()
  ON CONFLICT (currency_code)
  DO UPDATE SET
    best_cash_buy = EXCLUDED.best_cash_buy,
    best_cash_buy_bank = EXCLUDED.best_cash_buy_bank,
    best_cash_sell = EXCLUDED.best_cash_sell,
    best_cash_sell_bank = EXCLUDED.best_cash_sell_bank,
    best_spot_buy = EXCLUDED.best_spot_buy,
    best_spot_buy_bank = EXCLUDED.best_spot_buy_bank,
    best_spot_sell = EXCLUDED.best_spot_sell,
    best_spot_sell_bank = EXCLUDED.best_spot_sell_bank,
    updated_at = NOW();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to clean up old exchange rate data (keep last 30 days)
CREATE OR REPLACE FUNCTION cleanup_old_rates()
RETURNS void AS $$
BEGIN
  DELETE FROM exchange_rates
  WHERE scraped_at < NOW() - INTERVAL '30 days';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permissions to service role
GRANT EXECUTE ON FUNCTION update_best_rates(VARCHAR) TO service_role;
GRANT EXECUTE ON FUNCTION cleanup_old_rates() TO service_role;
