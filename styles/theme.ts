import { UserRole } from '../types/roles';

// ============================================================================
// PEAR DESIGN SYSTEM - Centralized Theme Configuration
// ============================================================================

// Role Colors - Primary brand colors for each user role
export const ROLE_COLORS = {
  TRASH_HERO: '#28A745',      // Green - Environmental action
  IMPACT_WARRIOR: '#dc3545',   // Red - Social impact
  ECO_DEFENDER: '#007bff',     // Blue - Business/defense
  VOLUNTEER: '#6f42c1',        // Purple - Community service
  BUSINESS: '#fd7e14',         // Orange - Commercial
  ADMIN: '#6c757d',           // Gray - Administrative
} as const;

// Extended Color Palette
export const COLORS = {
  // Primary Colors
  primary: '#28A745',
  secondary: '#6c757d',
  success: '#28A745',
  danger: '#dc3545',
  warning: '#ffc107',
  info: '#007bff',
  
  // Neutral Colors
  white: '#ffffff',
  black: '#000000',
  gray: {
    50: '#f8f9fa',
    100: '#e9ecef',
    200: '#dee2e6',
    300: '#ced4da',
    400: '#adb5bd',
    500: '#6c757d',
    600: '#495057',
    700: '#343a40',
    800: '#212529',
    900: '#000000',
  },
  
  // Background Colors
  background: {
    light: '#ffffff',
    dark: '#121212',
    card: '#ffffff',
    overlay: 'rgba(0, 0, 0, 0.5)',
  },
  
  // Text Colors
  text: {
    primary: '#212529',
    secondary: '#6c757d',
    light: '#ffffff',
    muted: '#6c757d',
    disabled: '#adb5bd',
  },
  
  // Border Colors
  border: {
    light: '#dee2e6',
    medium: '#ced4da',
    dark: '#adb5bd',
  },
  
  // Status Colors
  status: {
    online: '#28A745',
    offline: '#6c757d',
    pending: '#ffc107',
    error: '#dc3545',
    success: '#28A745',
  },
} as const;

// Typography System
export const TYPOGRAPHY = {
  // Font Families
  fontFamily: {
    regular: 'System',
    medium: 'System',
    bold: 'System',
    light: 'System',
  },
  
  // Font Sizes
  fontSize: {
    xs: 12,
    sm: 14,
    base: 16,
    lg: 18,
    xl: 20,
    '2xl': 24,
    '3xl': 30,
    '4xl': 36,
    '5xl': 48,
  },
  
  // Font Weights
  fontWeight: {
    light: '300',
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
    extrabold: '800',
  },
  
  // Line Heights
  lineHeight: {
    tight: 1.2,
    normal: 1.4,
    relaxed: 1.6,
    loose: 1.8,
  },
} as const;

// Spacing System (8px base unit)
export const SPACING = {
  xs: 4,    // 4px
  sm: 8,    // 8px
  md: 16,   // 16px
  lg: 24,   // 24px
  xl: 32,   // 32px
  '2xl': 48, // 48px
  '3xl': 64, // 64px
  '4xl': 96, // 96px
} as const;

// Border Radius System
export const BORDER_RADIUS = {
  none: 0,
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  '2xl': 24,
  full: 9999,
} as const;

// Shadow System
export const SHADOWS = {
  none: {
    shadowColor: 'transparent',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  xl: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 8,
  },
} as const;

// Button Styles
export const BUTTON_STYLES = {
  // Primary Button
  primary: {
    backgroundColor: COLORS.primary,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
    borderRadius: BORDER_RADIUS.md,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    ...SHADOWS.sm,
  },
  
  // Secondary Button
  secondary: {
    backgroundColor: COLORS.gray[100],
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
    borderRadius: BORDER_RADIUS.md,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    borderWidth: 1,
    borderColor: COLORS.border.medium,
  },
  
  // Outline Button
  outline: {
    backgroundColor: 'transparent',
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
    borderRadius: BORDER_RADIUS.md,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    borderWidth: 2,
    borderColor: COLORS.primary,
  },
  
  // Ghost Button
  ghost: {
    backgroundColor: 'transparent',
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
  },
  
  // Disabled Button
  disabled: {
    backgroundColor: COLORS.gray[300],
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
    borderRadius: BORDER_RADIUS.md,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    opacity: 0.6,
  },
} as const;

// Button Text Styles
export const BUTTON_TEXT_STYLES = {
  primary: {
    color: COLORS.white,
    fontSize: TYPOGRAPHY.fontSize.base,
    fontWeight: TYPOGRAPHY.fontWeight.semibold,
  },
  secondary: {
    color: COLORS.text.primary,
    fontSize: TYPOGRAPHY.fontSize.base,
    fontWeight: TYPOGRAPHY.fontWeight.semibold,
  },
  outline: {
    color: COLORS.primary,
    fontSize: TYPOGRAPHY.fontSize.base,
    fontWeight: TYPOGRAPHY.fontWeight.semibold,
  },
  ghost: {
    color: COLORS.primary,
    fontSize: TYPOGRAPHY.fontSize.sm,
    fontWeight: TYPOGRAPHY.fontWeight.medium,
  },
  disabled: {
    color: COLORS.text.disabled,
    fontSize: TYPOGRAPHY.fontSize.base,
    fontWeight: TYPOGRAPHY.fontWeight.semibold,
  },
} as const;

// Card Styles
export const CARD_STYLES = {
  default: {
    backgroundColor: COLORS.background.card,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    ...SHADOWS.md,
  },
  elevated: {
    backgroundColor: COLORS.background.card,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    ...SHADOWS.lg,
  },
  flat: {
    backgroundColor: COLORS.background.card,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.border.light,
  },
} as const;

// Input Styles
export const INPUT_STYLES = {
  default: {
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.border.medium,
    borderRadius: BORDER_RADIUS.md,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
    fontSize: TYPOGRAPHY.fontSize.base,
    color: COLORS.text.primary,
  },
  focused: {
    backgroundColor: COLORS.white,
    borderWidth: 2,
    borderColor: COLORS.primary,
    borderRadius: BORDER_RADIUS.md,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
    fontSize: TYPOGRAPHY.fontSize.base,
    color: COLORS.text.primary,
  },
  error: {
    backgroundColor: COLORS.white,
    borderWidth: 2,
    borderColor: COLORS.danger,
    borderRadius: BORDER_RADIUS.md,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
    fontSize: TYPOGRAPHY.fontSize.base,
    color: COLORS.text.primary,
  },
  disabled: {
    backgroundColor: COLORS.gray[100],
    borderWidth: 1,
    borderColor: COLORS.border.light,
    borderRadius: BORDER_RADIUS.md,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
    fontSize: TYPOGRAPHY.fontSize.base,
    color: COLORS.text.disabled,
    opacity: 0.6,
  },
} as const;

// Gamification Styles
export const GAMIFICATION_STYLES = {
  // XP Progress Bar
  xpProgressBar: {
    height: 8,
    backgroundColor: COLORS.gray[200],
    borderRadius: BORDER_RADIUS.full,
    overflow: 'hidden' as const,
  },
  xpProgressFill: {
    height: '100%',
    backgroundColor: COLORS.primary,
    borderRadius: BORDER_RADIUS.full,
  },
  
  // Badge Styles
  badge: {
    backgroundColor: COLORS.warning,
    paddingVertical: SPACING.xs,
    paddingHorizontal: SPACING.sm,
    borderRadius: BORDER_RADIUS.full,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
  },
  badgeGlow: {
    ...SHADOWS.lg,
    shadowColor: COLORS.warning,
    shadowOpacity: 0.3,
  },
  
  // Level Indicator
  levelIndicator: {
    backgroundColor: COLORS.primary,
    paddingVertical: SPACING.xs,
    paddingHorizontal: SPACING.sm,
    borderRadius: BORDER_RADIUS.md,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
  },
  
  // Achievement Styles
  achievement: {
    backgroundColor: COLORS.background.card,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    alignItems: 'center' as const,
    ...SHADOWS.md,
  },
  achievementUnlocked: {
    backgroundColor: COLORS.background.card,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    alignItems: 'center' as const,
    borderWidth: 2,
    borderColor: COLORS.warning,
    ...SHADOWS.lg,
  },
} as const;

// Layout System
export const LAYOUT = {
  // Screen Padding
  screenPadding: {
    horizontal: SPACING.lg,
    vertical: SPACING.md,
  },
  
  // Container Max Widths
  containerMaxWidth: {
    sm: 640,
    md: 768,
    lg: 1024,
    xl: 1280,
  },
  
  // Safe Area
  safeArea: {
    top: 44, // iOS status bar height
    bottom: 34, // iOS home indicator height
  },
} as const;

// Animation Durations
export const ANIMATION = {
  duration: {
    fast: 150,
    normal: 300,
    slow: 500,
  },
  easing: {
    easeIn: 'ease-in',
    easeOut: 'ease-out',
    easeInOut: 'ease-in-out',
  },
} as const;

// ============================================================================
// THEME UTILITIES
// ============================================================================

/**
 * Get role-specific color
 */
export const getRoleColor = (role: UserRole): string => {
  return ROLE_COLORS[role] || ROLE_COLORS.TRASH_HERO;
};

/**
 * Get role-specific theme
 */
export const getRoleTheme = (role: UserRole) => {
  const primaryColor = getRoleColor(role);
  
  return {
    primary: primaryColor,
    background: COLORS.background.light,
    cardBackground: COLORS.background.card,
    textColor: COLORS.text.primary,
    secondaryText: COLORS.text.secondary,
    borderColor: COLORS.border.light,
    error: COLORS.danger,
    success: COLORS.success,
    warning: COLORS.warning,
    info: COLORS.info,
  };
};

/**
 * Create responsive spacing
 */
export const createSpacing = (multiplier: number = 1) => ({
  xs: SPACING.xs * multiplier,
  sm: SPACING.sm * multiplier,
  md: SPACING.md * multiplier,
  lg: SPACING.lg * multiplier,
  xl: SPACING.xl * multiplier,
  '2xl': SPACING['2xl'] * multiplier,
  '3xl': SPACING['3xl'] * multiplier,
  '4xl': SPACING['4xl'] * multiplier,
});

/**
 * Create button style with role color
 */
export const createRoleButtonStyle = (role: UserRole, variant: keyof typeof BUTTON_STYLES = 'primary') => {
  const roleColor = getRoleColor(role);
  
  if (variant === 'primary') {
    return {
      ...BUTTON_STYLES.primary,
      backgroundColor: roleColor,
    };
  }
  
  if (variant === 'outline') {
    return {
      ...BUTTON_STYLES.outline,
      borderColor: roleColor,
    };
  }
  
  return BUTTON_STYLES[variant];
};

/**
 * Create role button text style
 */
export const createRoleButtonTextStyle = (role: UserRole, variant: keyof typeof BUTTON_TEXT_STYLES = 'primary') => {
  const roleColor = getRoleColor(role);
  
  if (variant === 'outline' || variant === 'ghost') {
    return {
      ...BUTTON_TEXT_STYLES[variant],
      color: roleColor,
    };
  }
  
  return BUTTON_TEXT_STYLES[variant];
};

// Export all theme constants
export const THEME = {
  COLORS,
  ROLE_COLORS,
  TYPOGRAPHY,
  SPACING,
  BORDER_RADIUS,
  SHADOWS,
  BUTTON_STYLES,
  BUTTON_TEXT_STYLES,
  CARD_STYLES,
  INPUT_STYLES,
  GAMIFICATION_STYLES,
  LAYOUT,
  ANIMATION,
} as const;
