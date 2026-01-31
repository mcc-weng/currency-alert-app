import { StyleSheet, FlatList, RefreshControl, View } from 'react-native'
import { Stack, useLocalSearchParams } from 'expo-router'
import { Text, ActivityIndicator } from 'react-native-paper'
import { useCurrencyRates } from '@/hooks/useCurrencyRates'
import { BankRateRow } from '@/components/rates/BankRateRow'
import { CURRENCY_NAMES, CurrencyCode } from '@/lib/constants'
import { colors, spacing } from '@/lib/theme'

export default function CurrencyDetailScreen() {
  const { code } = useLocalSearchParams<{ code: CurrencyCode }>()
  const { rates, loading, error, refetch } = useCurrencyRates(code as CurrencyCode)

  const currencyName = CURRENCY_NAMES[code as CurrencyCode] || code

  if (loading && rates.length === 0) {
    return (
      <>
        <Stack.Screen options={{ title: currencyName }} />
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={colors.alertActive} />
          <Text style={styles.loadingText}>Loading rates...</Text>
        </View>
      </>
    )
  }

  if (error) {
    return (
      <>
        <Stack.Screen options={{ title: currencyName }} />
        <View style={styles.centerContainer}>
          <Text style={styles.errorText}>Error loading rates</Text>
          <Text style={styles.errorDetail}>{error.message}</Text>
        </View>
      </>
    )
  }

  return (
    <>
      <Stack.Screen
        options={{
          title: currencyName,
          headerStyle: {
            backgroundColor: colors.cardBg,
          },
          headerTintColor: colors.textPrimary,
        }}
      />
      <View style={styles.container}>
        <View style={styles.header}>
          <Text variant="headlineSmall" style={styles.title}>
            {code} Exchange Rates
          </Text>
          <Text style={styles.subtitle}>
            {rates.length} banks • TWD per 1 {code}
          </Text>
        </View>

        <FlatList
          data={rates}
          keyExtractor={(item) => `${item.bank_name}-${item.id}`}
          renderItem={({ item }) => <BankRateRow rate={item} />}
          refreshControl={
            <RefreshControl
              refreshing={loading}
              onRefresh={refetch}
              colors={[colors.alertActive]}
            />
          }
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No rates available</Text>
            </View>
          }
        />
      </View>
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.screenBg,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.screenBg,
    padding: spacing.xl,
  },
  header: {
    padding: spacing.lg,
    backgroundColor: colors.cardBg,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  title: {
    color: colors.textPrimary,
    fontWeight: 'bold',
  },
  subtitle: {
    color: colors.textSecondary,
    fontSize: 14,
    marginTop: spacing.xs,
  },
  loadingText: {
    marginTop: spacing.md,
    color: colors.textSecondary,
  },
  errorText: {
    color: colors.negative,
    fontSize: 18,
    fontWeight: '600',
  },
  errorDetail: {
    color: colors.textSecondary,
    marginTop: spacing.sm,
    textAlign: 'center',
  },
  listContent: {
    backgroundColor: colors.cardBg,
  },
  emptyContainer: {
    padding: spacing.xl,
    alignItems: 'center',
  },
  emptyText: {
    color: colors.textSecondary,
    fontSize: 16,
  },
})
