import { useState } from 'react'
import { StyleSheet, View, KeyboardAvoidingView, Platform, ScrollView } from 'react-native'
import { Stack, useRouter } from 'expo-router'
import { Text, TextInput, Button, Snackbar } from 'react-native-paper'
import { useAuth } from '@/hooks/useAuth'
import { colors, spacing } from '@/lib/theme'

export default function LoginScreen() {
  const router = useRouter()
  const { signIn } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleLogin = async () => {
    if (!email || !password) {
      setError('Please fill in all fields')
      return
    }

    try {
      setLoading(true)
      setError('')
      await signIn(email, password)
      router.replace('/(tabs)')
    } catch (err: any) {
      setError(err.message || 'Failed to sign in')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Stack.Screen options={{ title: 'Sign In', headerShown: false }} />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.content}>
            {/* Header */}
            <View style={styles.header}>
              <Text variant="displaySmall" style={styles.title}>
                Welcome back
              </Text>
              <Text style={styles.subtitle}>
                Sign in to manage your currency alerts
              </Text>
            </View>

            {/* Form */}
            <View style={styles.form}>
              <TextInput
                label="Email"
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
                mode="outlined"
                style={styles.input}
                disabled={loading}
              />

              <TextInput
                label="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                mode="outlined"
                style={styles.input}
                disabled={loading}
              />

              <Button
                mode="contained"
                onPress={handleLogin}
                loading={loading}
                disabled={loading}
                style={styles.button}
              >
                Sign In
              </Button>

              <Button
                mode="text"
                onPress={() => router.push('/auth/register')}
                disabled={loading}
                style={styles.linkButton}
              >
                Don't have an account? Sign up
              </Button>
            </View>
          </View>
        </ScrollView>

        <Snackbar
          visible={!!error}
          onDismiss={() => setError('')}
          duration={3000}
          style={styles.snackbar}
        >
          {error}
        </Snackbar>
      </KeyboardAvoidingView>
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.screenBg,
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    padding: spacing.lg,
  },
  header: {
    marginBottom: spacing.xl,
  },
  title: {
    color: colors.textPrimary,
    fontWeight: 'bold',
    marginBottom: spacing.sm,
  },
  subtitle: {
    color: colors.textSecondary,
    fontSize: 16,
  },
  form: {
    gap: spacing.md,
  },
  input: {
    backgroundColor: colors.cardBg,
  },
  button: {
    marginTop: spacing.md,
    paddingVertical: spacing.xs,
  },
  linkButton: {
    marginTop: spacing.sm,
  },
  snackbar: {
    backgroundColor: colors.negative,
  },
})
