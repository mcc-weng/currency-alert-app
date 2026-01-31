import { useState } from 'react'
import { StyleSheet, View, KeyboardAvoidingView, Platform, ScrollView } from 'react-native'
import { Stack, useRouter } from 'expo-router'
import { Text, TextInput, Button, Snackbar } from 'react-native-paper'
import { useAuth } from '@/hooks/useAuth'
import { colors, spacing } from '@/lib/theme'

export default function RegisterScreen() {
  const router = useRouter()
  const { signUp } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const handleRegister = async () => {
    if (!email || !password || !confirmPassword) {
      setError('Please fill in all fields')
      return
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }

    try {
      setLoading(true)
      setError('')
      await signUp(email, password)
      setSuccess(true)
      // Auto redirect to login after 2 seconds
      setTimeout(() => router.replace('/auth/login'), 2000)
    } catch (err: any) {
      setError(err.message || 'Failed to sign up')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Stack.Screen options={{ title: 'Sign Up' }} />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.content}>
            {/* Header */}
            <View style={styles.header}>
              <Text variant="displaySmall" style={styles.title}>
                Create account
              </Text>
              <Text style={styles.subtitle}>
                Get notified when rates hit your target
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
                disabled={loading || success}
              />

              <TextInput
                label="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                mode="outlined"
                style={styles.input}
                disabled={loading || success}
              />

              <TextInput
                label="Confirm Password"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
                mode="outlined"
                style={styles.input}
                disabled={loading || success}
              />

              <Button
                mode="contained"
                onPress={handleRegister}
                loading={loading}
                disabled={loading || success}
                style={styles.button}
              >
                {success ? 'Account Created!' : 'Sign Up'}
              </Button>

              <Button
                mode="text"
                onPress={() => router.back()}
                disabled={loading || success}
                style={styles.linkButton}
              >
                Already have an account? Sign in
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

        <Snackbar
          visible={success}
          onDismiss={() => setSuccess(false)}
          duration={2000}
          style={styles.successSnackbar}
        >
          Account created! Redirecting to sign in...
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
  successSnackbar: {
    backgroundColor: colors.positive,
  },
})
