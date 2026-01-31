// Currency codes (starting with 5 for MVP)
export const CURRENCIES = ['USD', 'JPY', 'EUR', 'GBP', 'AUD'] as const

export type CurrencyCode = (typeof CURRENCIES)[number]

// Rate types
export const RATE_TYPES = ['cash_buy', 'cash_sell', 'spot_buy', 'spot_sell'] as const

export type RateType = (typeof RATE_TYPES)[number]

// Alert conditions
export const ALERT_CONDITIONS = ['above', 'below', 'equals'] as const

export type AlertCondition = (typeof ALERT_CONDITIONS)[number]

// Currency display names
export const CURRENCY_NAMES: Record<CurrencyCode, string> = {
  USD: 'US Dollar',
  JPY: 'Japanese Yen',
  EUR: 'Euro',
  GBP: 'British Pound',
  AUD: 'Australian Dollar',
}

// Currency symbols
export const CURRENCY_SYMBOLS: Record<CurrencyCode, string> = {
  USD: '$',
  JPY: '¥',
  EUR: '€',
  GBP: '£',
  AUD: 'A$',
}

// Rate type display names
export const RATE_TYPE_NAMES: Record<RateType, string> = {
  cash_buy: 'Cash Buy',
  cash_sell: 'Cash Sell',
  spot_buy: 'Spot Buy',
  spot_sell: 'Spot Sell',
}
