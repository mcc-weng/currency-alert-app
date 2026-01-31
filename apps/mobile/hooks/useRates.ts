import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { BestRate } from '@/lib/types'

export function useBestRates() {
  const [rates, setRates] = useState<BestRate[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const fetchRates = async () => {
    try {
      setLoading(true)
      const { data, error: fetchError } = await supabase
        .from('best_rates')
        .select('*')
        .order('currency_code', { ascending: true })

      if (fetchError) throw fetchError

      setRates(data || [])
      setError(null)
    } catch (err) {
      setError(err as Error)
      console.error('Error fetching best rates:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchRates()
  }, [])

  return { rates, loading, error, refetch: fetchRates }
}
