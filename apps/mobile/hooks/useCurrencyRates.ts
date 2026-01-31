import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { ExchangeRate } from '@/lib/types'
import { CurrencyCode } from '@/lib/constants'

export function useCurrencyRates(currencyCode: CurrencyCode) {
  const [rates, setRates] = useState<ExchangeRate[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const fetchRates = async () => {
    try {
      setLoading(true)

      // Get the latest scraped_at timestamp for this currency
      const { data: latestData, error: latestError } = await supabase
        .from('exchange_rates')
        .select('scraped_at')
        .eq('currency_code', currencyCode)
        .order('scraped_at', { ascending: false })
        .limit(1)
        .single()

      if (latestError) throw latestError

      // Fetch all rates for this currency at the latest timestamp
      const { data, error: fetchError } = await supabase
        .from('exchange_rates')
        .select('*')
        .eq('currency_code', currencyCode)
        .eq('scraped_at', latestData.scraped_at)
        .order('cash_buy', { ascending: false, nullsFirst: false })

      if (fetchError) throw fetchError

      setRates(data || [])
      setError(null)
    } catch (err) {
      setError(err as Error)
      console.error('Error fetching currency rates:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchRates()
  }, [currencyCode])

  return { rates, loading, error, refetch: fetchRates }
}
