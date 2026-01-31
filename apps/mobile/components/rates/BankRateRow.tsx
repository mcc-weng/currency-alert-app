import { View, StyleSheet } from 'react-native'
import { Text, Divider } from 'react-native-paper'
import { ExchangeRate } from '@/lib/types'
import { colors, spacing } from '@/lib/theme'

interface BankRateRowProps {
  rate: ExchangeRate
}

export function BankRateRow({ rate }: BankRateRowProps) {
  return (
    <View>
      <View style={styles.row}>
        {/* Bank Name */}
        <View style={styles.bankColumn}>
          <Text style={styles.bankName}>{rate.bank_name}</Text>
        </View>

        {/* Rates Grid */}
        <View style={styles.ratesGrid}>
          {/* Cash Buy */}
          <View style={styles.rateCell}>
            <Text style={styles.rateLabel}>Cash Buy</Text>
            <Text style={styles.rateValue}>
              {rate.cash_buy?.toFixed(4) || '-'}
            </Text>
          </View>

          {/* Cash Sell */}
          <View style={styles.rateCell}>
            <Text style={styles.rateLabel}>Cash Sell</Text>
            <Text style={styles.rateValue}>
              {rate.cash_sell?.toFixed(4) || '-'}
            </Text>
          </View>

          {/* Spot Buy */}
          <View style={styles.rateCell}>
            <Text style={styles.rateLabel}>Spot Buy</Text>
            <Text style={styles.rateValue}>
              {rate.spot_buy?.toFixed(4) || '-'}
            </Text>
          </View>

          {/* Spot Sell */}
          <View style={styles.rateCell}>
            <Text style={styles.rateLabel}>Spot Sell</Text>
            <Text style={styles.rateValue}>
              {rate.spot_sell?.toFixed(4) || '-'}
            </Text>
          </View>
        </View>
      </View>
      <Divider style={styles.divider} />
    </View>
  )
}

const styles = StyleSheet.create({
  row: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
  },
  bankColumn: {
    marginBottom: spacing.sm,
  },
  bankName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  ratesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  rateCell: {
    flex: 1,
    minWidth: '45%',
  },
  rateLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 2,
  },
  rateValue: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.textPrimary,
  },
  divider: {
    backgroundColor: colors.border,
  },
})
