import { MD3LightTheme, MD3DarkTheme } from 'react-native-paper'

// Wise-inspired Light Theme
export const lightTheme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: '#00B9FF',      // Wise teal/blue
    secondary: '#37B77E',    // Wise green (for positive changes)
    error: '#DF3B57',        // Wise red (for negative changes)
    background: '#F7F9FA',   // Subtle gray background
    surface: '#FFFFFF',      // Clean white surface for cards
    surfaceVariant: '#F7F9FA', // Subtle gray for secondary surfaces
    outline: '#E6E9EB',      // Light borders
    onSurface: '#222222',    // Almost black text
    onSurfaceVariant: '#6D7680', // Secondary text color
  },
}

// Revolut-inspired Dark Theme
export const darkTheme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    primary: '#37DBA4',      // Revolut bright teal (for dark mode)
    secondary: '#5AD389',    // Bright green
    error: '#FF5C6C',        // Bright red
    background: '#0E0E0E',   // Revolut deep black
    surface: '#1C1C1E',      // Slightly lighter surface
    surfaceVariant: '#2C2C2E', // Subtle gray for secondary surfaces
    outline: '#2C2C2E',      // Subtle borders
    onSurface: '#FFFFFF',    // White text
    onSurfaceVariant: '#8E8E93', // Secondary text color
  },
}

// Custom color palette for currency app
export const colors = {
  // Status colors (Wise style)
  positive: '#37B77E',      // Wise green - price going up
  negative: '#DF3B57',      // Wise red - price going down
  neutral: '#8B9AA8',       // Gray - no change

  // Alert states
  alertActive: '#00B9FF',    // Wise blue - active alert
  alertTriggered: '#FF9900', // Orange - triggered
  alertInactive: '#B8BFC5',  // Light gray - inactive

  // Currency types
  spot: '#00B9FF',          // Wise blue
  cash: '#5AC8FA',          // Light blue
  best: '#37DBA4',          // Revolut teal (highlight)

  // UI elements (Wise inspired)
  textPrimary: '#222222',   // Almost black
  textSecondary: '#6D7680', // Medium gray
  textTertiary: '#B8BFC5',  // Light gray
  border: '#E6E9EB',        // Subtle border
  cardBg: '#FFFFFF',        // White cards
  screenBg: '#F7F9FA',      // Light gray background

  // Revolut accents (for dark mode)
  gradient1: '#5C7CFA',     // Blue
  gradient2: '#48DBB4',     // Teal
}

// Typography scale
export const typography = {
  h1: { fontSize: 32, fontWeight: 'bold' as const },
  h2: { fontSize: 24, fontWeight: '600' as const },
  h3: { fontSize: 20, fontWeight: '600' as const },
  body: { fontSize: 16, fontWeight: 'normal' as const },
  caption: { fontSize: 14, color: colors.textSecondary },
  rate: { fontSize: 28, fontWeight: 'bold' as const },
  change: { fontSize: 16, fontWeight: '600' as const },
}

// Layout spacing (8px grid system)
export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
}
