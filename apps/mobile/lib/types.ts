import { CurrencyCode, RateType, AlertCondition } from './constants'

// Database types matching Supabase schema
export interface ExchangeRate {
  id: number
  currency_code: CurrencyCode
  bank_name: string
  cash_buy: number | null
  cash_sell: number | null
  spot_buy: number | null
  spot_sell: number | null
  transaction_fee: string | null
  scraped_at: string
  created_at: string
}

export interface BestRate {
  id: number
  currency_code: CurrencyCode
  best_cash_buy: number | null
  best_cash_buy_bank: string | null
  best_cash_sell: number | null
  best_cash_sell_bank: string | null
  best_spot_buy: number | null
  best_spot_buy_bank: string | null
  best_spot_sell: number | null
  best_spot_sell_bank: string | null
  updated_at: string
}

export interface Alert {
  id: string
  user_id: string
  currency_code: CurrencyCode
  rate_type: RateType
  bank_name: string | null
  condition: AlertCondition
  target_rate: number
  is_active: boolean
  triggered_at: string | null
  created_at: string
  updated_at: string
}

export interface UserPreferences {
  id: string
  user_id: string
  favorite_currencies: CurrencyCode[]
  notification_enabled: boolean
  email_notifications: boolean
  push_token: string | null
  created_at: string
  updated_at: string
}

export interface AlertNotification {
  id: string
  alert_id: string
  user_id: string
  triggered_rate: number
  bank_name: string
  sent_at: string
  notification_method: 'push' | 'email'
}
