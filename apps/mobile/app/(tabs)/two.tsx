import { StyleSheet, View } from 'react-native'
import { useRouter } from 'expo-router'
import { Text, Button, Card, Divider } from 'react-native-paper'
import { useAuth } from '@/hooks/useAuth'
import { colors, spacing } from '@/lib/theme'

export default function SettingsScreen() {
  const router = useRouter()
  const { user, signOut, loading } = useAuth()

  const handleSignOut = async () => {
    try {
      await signOut()
      router.replace('/auth/login')
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text variant="headlineMedium" style={styles.title}>
          Settings
        </Text>
        <Text style={styles.subtitle}>
          Manage your account and preferences
        </Text>
      </View>

      <View style={styles.content}>
        {user ? (
          <>
            <Card style={styles.card}>
              <Card.Content>
                <Text variant="titleMedium" style={styles.cardTitle}>
                  Account
                </Text>
                <Divider style={styles.divider} />
                <Text style={styles.email}>{user.email}</Text>
                <Text style={styles.label}>Signed in</Text>
              </Card.Content>
            </Card>

            <Button
              mode="outlined"
              onPress={handleSignOut}
              style={styles.button}
              disabled={loading}
            >
              Sign Out
            </Button>
          </>
        ) : (
          <>
            <Card style={styles.card}>
              <Card.Content>
                <Text variant="titleMedium" style={styles.cardTitle}>
                  Welcome
                </Text>
                <Divider style={styles.divider} />
                <Text style={styles.description}>
                  Sign in to create alerts and get notified when exchange rates hit your target prices.
                </Text>
              </Card.Content>
            </Card>

            <Button
              mode="contained"
              onPress={() => router.push('/auth/login')}
              style={styles.button}
            >
              Sign In
            </Button>

            <Button
              mode="outlined"
              onPress={() => router.push('/auth/register')}
              style={styles.button}
            >
              Create Account
            </Button>
          </>
        )}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.screenBg,
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
  content: {
    padding: spacing.lg,
  },
  card: {
    backgroundColor: colors.cardBg,
    marginBottom: spacing.lg,
  },
  cardTitle: {
    color: colors.textPrimary,
    fontWeight: '600',
  },
  divider: {
    marginVertical: spacing.md,
    backgroundColor: colors.border,
  },
  email: {
    fontSize: 16,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  label: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  description: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  button: {
    marginBottom: spacing.md,
  },
})
