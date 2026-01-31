// Currency Alert App - Main Scraper Edge Function
// Scrapes exchange rates from findrate.tw and stores in database

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { DOMParser } from 'https://deno.land/x/deno_dom/deno-dom-wasm.ts'

// Start with 5 currencies for MVP
const CURRENCIES = ['USD', 'JPY', 'EUR', 'GBP', 'AUD']

interface ExchangeRate {
  currency_code: string
  bank_name: string
  cash_buy: number | null
  cash_sell: number | null
  spot_buy: number | null
  spot_sell: number | null
  transaction_fee: string | null
  scraped_at: string
}

serve(async (req) => {
  const startTime = Date.now()

  // Initialize Supabase client
  // Note: SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are automatically provided by Supabase
  const supabaseUrl = Deno.env.get('SUPABASE_URL')!
  const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  const supabase = createClient(supabaseUrl, supabaseKey)

  console.log('Starting currency scrape...', { currencies: CURRENCIES })

  try {
    // 1. Fetch all currencies in parallel
    console.log('Fetching HTML pages...')
    const fetchPromises = CURRENCIES.map(code =>
      fetch(`https://www.findrate.tw/${code}/`, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
          'Accept': 'text/html,application/xhtml+xml',
          'Accept-Language': 'zh-TW,zh;q=0.9,en-US;q=0.8,en;q=0.7',
        },
      })
        .then(r => r.text())
        .catch(err => {
          console.error(`Failed to fetch ${code}:`, err.message)
          return null
        })
    )

    const htmlPages = await Promise.all(fetchPromises)
    console.log('HTML pages fetched:', {
      total: htmlPages.length,
      successful: htmlPages.filter(h => h !== null).length
    })

    // 2. Parse all rates
    console.log('Parsing rates...')
    const allRates: ExchangeRate[] = []

    htmlPages.forEach((html, index) => {
      if (!html) return

      const currencyCode = CURRENCIES[index]
      try {
        const rates = parseRates(currencyCode, html)
        allRates.push(...rates)
        console.log(`Parsed ${currencyCode}:`, { ratesFound: rates.length })
      } catch (err) {
        console.error(`Error parsing ${currencyCode}:`, err.message)
      }
    })

    console.log('Total rates parsed:', allRates.length)

    if (allRates.length === 0) {
      throw new Error('No rates were successfully parsed')
    }

    // 3. Insert to database
    console.log('Inserting rates to database...')
    const { data: insertedRates, error: insertError } = await supabase
      .from('exchange_rates')
      .insert(allRates)
      .select()

    if (insertError) {
      console.error('Insert error:', insertError)
      throw insertError
    }

    console.log('Rates inserted successfully:', insertedRates?.length || 0)

    // 4. Update best rates cache
    console.log('Updating best rates...')
    for (const currency of CURRENCIES) {
      const { error: bestRatesError } = await supabase
        .rpc('update_best_rates', { p_currency_code: currency })

      if (bestRatesError) {
        console.error(`Error updating best rates for ${currency}:`, bestRatesError)
      }
    }

    // 5. Log scrape metadata
    const endTime = Date.now()
    const duration = endTime - startTime

    await supabase.from('scrape_metadata').insert({
      scrape_started_at: new Date(startTime).toISOString(),
      scrape_completed_at: new Date(endTime).toISOString(),
      currencies_scraped: CURRENCIES.length,
      total_rates_inserted: allRates.length,
      errors: [],
      status: 'success',
    })

    console.log('Scrape completed successfully', {
      duration: `${duration}ms`,
      rates: allRates.length,
      currencies: CURRENCIES.length,
    })

    return new Response(
      JSON.stringify({
        success: true,
        duration_ms: duration,
        currencies_scraped: CURRENCIES.length,
        total_rates: allRates.length,
        rates_per_currency: Math.round(allRates.length / CURRENCIES.length),
      }),
      {
        headers: { 'Content-Type': 'application/json' },
        status: 200,
      }
    )
  } catch (error) {
    console.error('Scrape failed:', error)

    // Log failure
    await supabase.from('scrape_metadata').insert({
      scrape_started_at: new Date(startTime).toISOString(),
      scrape_completed_at: new Date().toISOString(),
      currencies_scraped: 0,
      total_rates_inserted: 0,
      errors: [error.message],
      status: 'failed',
    })

    return new Response(
      JSON.stringify({
        success: false,
        error: error.message,
        duration_ms: Date.now() - startTime,
      }),
      {
        headers: { 'Content-Type': 'application/json' },
        status: 500,
      }
    )
  }
})

function parseRates(currencyCode: string, html: string): ExchangeRate[] {
  const doc = new DOMParser().parseFromString(html, 'text/html')
  if (!doc) {
    throw new Error(`Failed to parse HTML for ${currencyCode}`)
  }

  // Find all table rows in tbody
  const rows = doc.querySelectorAll('table tbody tr')
  if (!rows || rows.length === 0) {
    console.warn(`No table rows found for ${currencyCode}`)
    return []
  }

  const scrapedAt = new Date().toISOString()
  const rates: ExchangeRate[] = []

  Array.from(rows).forEach((row, index) => {
    try {
      const cells = row.querySelectorAll('td')

      if (cells.length < 5) {
        return // Skip rows with insufficient data
      }

      const bankName = cells[0]?.textContent?.trim()
      if (!bankName) {
        return // Skip if no bank name
      }

      // Parse numeric values, handling various formats
      const parseRate = (text: string | null | undefined): number | null => {
        if (!text) return null
        const cleaned = text.trim().replace(/[^\d.-]/g, '')
        const parsed = parseFloat(cleaned)
        return isNaN(parsed) ? null : parsed
      }

      const rate: ExchangeRate = {
        currency_code: currencyCode,
        bank_name: bankName,
        cash_buy: parseRate(cells[1]?.textContent),
        cash_sell: parseRate(cells[2]?.textContent),
        spot_buy: parseRate(cells[3]?.textContent),
        spot_sell: parseRate(cells[4]?.textContent),
        transaction_fee: cells[6]?.textContent?.trim() || null,
        scraped_at: scrapedAt,
      }

      rates.push(rate)
    } catch (err) {
      console.error(`Error parsing row ${index} for ${currencyCode}:`, err.message)
    }
  })

  return rates
}
