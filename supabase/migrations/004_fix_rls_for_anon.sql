-- Fix RLS policies to allow anonymous users to view exchange rates and best rates
-- The mobile app uses the anon/publishable key, not authenticated users

-- ============================================================================
-- UPDATE EXCHANGE RATES POLICIES
-- ============================================================================

-- Drop old policy
DROP POLICY IF EXISTS "Anyone can view exchange rates" ON exchange_rates;

-- Create new policy for anon users
CREATE POLICY "Anon users can view exchange rates"
  ON exchange_rates FOR SELECT
  TO anon, authenticated
  USING (true);

-- ============================================================================
-- UPDATE BEST RATES POLICIES
-- ============================================================================

-- Drop old policy
DROP POLICY IF EXISTS "Anyone can view best rates" ON best_rates;

-- Create new policy for anon users
CREATE POLICY "Anon users can view best rates"
  ON best_rates FOR SELECT
  TO anon, authenticated
  USING (true);
