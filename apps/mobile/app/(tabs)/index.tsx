import { StyleSheet, FlatList, RefreshControl, View } from 'react-native'
import { Text, ActivityIndicator } from 'react-native-paper'
import { useRouter } from 'expo-router'
import { useBestRates } from '@/hooks/useRates'
import { CurrencyCard } from '@/components/rates/CurrencyCard'
import { colors, spacing } from '@/lib/theme'

export default function HomeScreen() {
  const router = useRouter()
  const { rates, loading, error, refetch } = useBestRates()

  if (loading && rates.length === 0) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={colors.alertActive} />
        <Text style={styles.loadingText}>Loading rates...</Text>
      </View>
    )
  }

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>Error loading rates</Text>
        <Text style={styles.errorDetail}>{error.message}</Text>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text variant="headlineMedium" style={styles.title}>
          Currency Rates
        </Text>
        <Text style={styles.subtitle}>
          Best exchange rates in Taiwan
        </Text>
      </View>

      <FlatList
        data={rates}
        keyExtractor={(item) => item.currency_code}
        renderItem={({ item }) => (
          <CurrencyCard
            rate={item}
            onPress={() => router.push(`/currency/${item.currency_code}`)}
          />
        )}
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={refetch}
            colors={[colors.alertActive]}
          />
        }
        contentContainerStyle={styles.listContent}
      />
    </View>
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
    paddingTop: spacing.xl,
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
    paddingBottom: spacing.lg,
  },
})
