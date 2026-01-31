import { View, StyleSheet, TouchableOpacity } from 'react-native'
import { Card, Text } from 'react-native-paper'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { BestRate } from '@/lib/types'
import { CURRENCY_NAMES, CURRENCY_SYMBOLS } from '@/lib/constants'
import { colors, spacing } from '@/lib/theme'

interface CurrencyCardProps {
  rate: BestRate
  onPress: () => void
}

export function CurrencyCard({ rate, onPress }: CurrencyCardProps) {
  // Use best cash buy rate as the primary display rate
  const displayRate = rate.best_cash_buy || rate.best_spot_buy || 0
  const displayBank = rate.best_cash_buy_bank || rate.best_spot_buy_bank || 'N/A'

  return (
    <TouchableOpacity onPress={onPress}>
      <Card style={styles.card} mode="elevated">
        <Card.Content style={styles.content}>
          {/* Header with currency code and icon */}
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <MaterialCommunityIcons
                name="currency-usd"
                size={24}
                color={colors.alertActive}
              />
              <Text variant="titleLarge" style={styles.currencyCode}>
                {rate.currency_code}
              </Text>
            </View>
            <MaterialCommunityIcons
              name="chevron-right"
              size={24}
              color={colors.textSecondary}
            />
          </View>

          {/* Currency name */}
          <Text style={styles.currencyName}>
            {CURRENCY_NAMES[rate.currency_code as keyof typeof CURRENCY_NAMES]}
          </Text>

          {/* Large rate display - Wise style */}
          <Text style={styles.rateDisplay}>
            {displayRate.toFixed(4)}
          </Text>

          {/* Label - TWD per 1 currency */}
          <Text style={styles.rateLabel}>
            TWD per 1 {rate.currency_code}
          </Text>

          {/* Divider */}
          <View style={styles.divider} />

          {/* Bank info */}
          <View style={styles.bankInfo}>
            <Text style={styles.bankLabel}>Best rate</Text>
            <Text style={styles.bankName}>{displayBank}</Text>
          </View>

          {/* Updated timestamp */}
          <Text style={styles.timestamp}>
            {rate.updated_at ? formatTimestamp(rate.updated_at) : 'Not available'}
          </Text>
        </Card.Content>
      </Card>
    </TouchableOpacity>
  )
}

function formatTimestamp(timestamp: string): string {
  const date = new Date(timestamp)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / 60000)

  if (diffMins < 1) return 'Just now'
  if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`

  const diffHours = Math.floor(diffMins / 60)
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`

  return date.toLocaleDateString()
}

const styles = StyleSheet.create({
  card: {
    margin: spacing.md,
    backgroundColor: colors.cardBg,
    borderRadius: 12,
    elevation: 2,
  },
  content: {
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  currencyCode: {
    color: colors.textPrimary,
    fontWeight: '600',
  },
  currencyName: {
    color: colors.textSecondary,
    fontSize: 14,
    marginBottom: spacing.md,
  },
  rateDisplay: {
    color: colors.textPrimary,
    fontSize: 48,
    fontWeight: 'bold',
    letterSpacing: -1,
    marginTop: spacing.xs,
  },
  rateLabel: {
    color: colors.textSecondary,
    fontSize: 14,
    marginTop: spacing.xs,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: spacing.md,
  },
  bankInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  bankLabel: {
    color: colors.textSecondary,
    fontSize: 14,
  },
  bankName: {
    color: colors.textPrimary,
    fontSize: 14,
    fontWeight: '500',
  },
  timestamp: {
    color: colors.textTertiary,
    fontSize: 12,
    marginTop: spacing.sm,
  },
})
