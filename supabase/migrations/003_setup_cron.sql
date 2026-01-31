-- Currency Alert App - pg_cron Setup
-- Schedules the scraper Edge Function to run every hour

-- ============================================================================
-- ENABLE PG_CRON EXTENSION
-- ============================================================================
CREATE EXTENSION IF NOT EXISTS pg_cron;

-- ============================================================================
-- SCHEDULE SCRAPER TO RUN EVERY HOUR
-- ============================================================================
-- Note: You'll need to replace YOUR_PROJECT_URL and SERVICE_ROLE_KEY
-- after creating your Supabase project

-- IMPORTANT: Replace YOUR_SECRET_KEY below with your actual SUPABASE_SECRET_KEY from .env
-- before running this migration

-- For security, you can also set this up via Supabase Dashboard:
-- Dashboard > Database > Cron Jobs > Create new cron job
-- This avoids storing the secret key in migration files

SELECT cron.schedule(
  'scrape-currencies-hourly',
  '0 * * * *',  -- Every hour at minute 0
  $$
  SELECT net.http_post(
    url := 'https://sgqnbkpbtjxuvrayttpq.supabase.co/functions/v1/scrape-currencies',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer YOUR_SECRET_KEY'
    ),
    body := '{}'::jsonb
  ) AS request_id;
  $$
);

-- ============================================================================
-- SCHEDULE CLEANUP JOB (Runs daily at 3 AM)
-- ============================================================================
SELECT cron.schedule(
  'cleanup-old-rates-daily',
  '0 3 * * *',  -- Every day at 3 AM
  $$
  SELECT cleanup_old_rates();
  $$
);

-- ============================================================================
-- VIEW SCHEDULED JOBS
-- ============================================================================
-- Run this to see all scheduled jobs:
-- SELECT * FROM cron.job;

-- ============================================================================
-- UNSCHEDULE A JOB (if needed)
-- ============================================================================
-- SELECT cron.unschedule('scrape-currencies-hourly');
