import React, { ReactNode } from 'react';
import {
  Text as RNText,
  StyleSheet,
  TextStyle,
} from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';

interface TextProps {
  children: ReactNode;
  variant?: 'h1' | 'h2' | 'h3' | 'body' | 'caption' | 'label';
  color?: 'primary' | 'secondary' | 'text' | 'textSecondary' | 'success' | 'warning' | 'error';
  weight?: 'normal' | 'medium' | 'semibold' | 'bold';
  align?: 'left' | 'center' | 'right';
  style?: TextStyle;
  numberOfLines?: number;
}

export const Text: React.FC<TextProps> = ({
  children,
  variant = 'body',
  color = 'text',
  weight = 'normal',
  align = 'left',
  style,
  numberOfLines,
}) => {
  const { theme } = useTheme();

  const getVariantStyle = (): TextStyle => {
    const variantStyles = {
      h1: {
        fontSize: theme.typography.fontSize.xxl,
        fontWeight: theme.typography.fontWeight.bold,
        lineHeight: theme.typography.fontSize.xxl * 1.2,
      },
      h2: {
        fontSize: theme.typography.fontSize.xl,
        fontWeight: theme.typography.fontWeight.bold,
        lineHeight: theme.typography.fontSize.xl * 1.2,
      },
      h3: {
        fontSize: theme.typography.fontSize.lg,
        fontWeight: theme.typography.fontWeight.semibold,
        lineHeight: theme.typography.fontSize.lg * 1.2,
      },
      body: {
        fontSize: theme.typography.fontSize.md,
        fontWeight: theme.typography.fontWeight.normal,
        lineHeight: theme.typography.fontSize.md * 1.4,
      },
      caption: {
        fontSize: theme.typography.fontSize.sm,
        fontWeight: theme.typography.fontWeight.normal,
        lineHeight: theme.typography.fontSize.sm * 1.3,
      },
      label: {
        fontSize: theme.typography.fontSize.xs,
        fontWeight: theme.typography.fontWeight.medium,
        lineHeight: theme.typography.fontSize.xs * 1.3,
      },
    };
    return variantStyles[variant];
  };

  const getColorStyle = (): TextStyle => {
    const colorStyles = {
      primary: { color: theme.colors.primary },
      secondary: { color: theme.colors.secondary },
      text: { color: theme.colors.text },
      textSecondary: { color: theme.colors.textSecondary },
      success: { color: theme.colors.success },
      warning: { color: theme.colors.warning },
      error: { color: theme.colors.error },
    };
    return colorStyles[color];
  };

  const getWeightStyle = (): TextStyle => {
    const weightStyles = {
      normal: { fontWeight: theme.typography.fontWeight.normal },
      medium: { fontWeight: theme.typography.fontWeight.medium },
      semibold: { fontWeight: theme.typography.fontWeight.semibold },
      bold: { fontWeight: theme.typography.fontWeight.bold },
    };
    return weightStyles[weight];
  };

  const textStyle: TextStyle = {
    ...getVariantStyle(),
    ...getColorStyle(),
    ...getWeightStyle(),
    textAlign: align,
  };

  return (
    <RNText
      style={[textStyle, style]}
      numberOfLines={numberOfLines}
    >
      {children}
    </RNText>
  );
};
