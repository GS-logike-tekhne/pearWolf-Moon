import { StyleSheet } from 'react-native';
import { THEME } from './theme';

export const sharedStyles = StyleSheet.create({
  card: {
    padding: THEME.SPACING.md,
    margin: THEME.SPACING.md,
    borderRadius: THEME.BORDER_RADIUS.lg,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  
  sectionTitle: {
    fontSize: THEME.TYPOGRAPHY.fontSize.lg,
    fontWeight: 'bold',
    marginBottom: THEME.SPACING.md,
  },
  
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: THEME.SPACING.md,
    borderRadius: THEME.BORDER_RADIUS.lg,
  },
  
  buttonText: {
    fontSize: THEME.TYPOGRAPHY.fontSize.base,
    fontWeight: 'bold',
    marginLeft: THEME.SPACING.sm,
  },
  
  primaryButton: {
    backgroundColor: THEME.COLORS.primary,
  },
  
  primaryButtonText: {
    color: 'white',
  },
  
  successButton: {
    backgroundColor: THEME.COLORS.success,
  },
  
  successButtonText: {
    color: 'white',
  },
  
  secondaryButton: {
    borderWidth: 1,
    paddingHorizontal: THEME.SPACING.md,
    paddingVertical: THEME.SPACING.sm,
    borderRadius: 20,
  },
  
  secondaryButtonText: {
    fontWeight: '600',
  },
  
  badge: {
    paddingHorizontal: THEME.SPACING.sm,
    paddingVertical: THEME.SPACING.xs,
    borderRadius: THEME.BORDER_RADIUS.sm,
  },
  
  badgeText: {
    fontSize: THEME.TYPOGRAPHY.fontSize.xs,
    fontWeight: 'bold',
    color: 'white',
  },
  
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  
  gridItem: {
    width: '48%',
    marginBottom: THEME.SPACING.md,
  },
  
  label: {
    fontSize: THEME.TYPOGRAPHY.fontSize.xs,
    marginTop: THEME.SPACING.xs,
    marginBottom: THEME.SPACING.xs,
  },
  
  value: {
    fontSize: THEME.TYPOGRAPHY.fontSize.sm,
    fontWeight: '600',
  },
  
  container: {
    flex: 1,
  },
  
  bottomSpacing: {
    height: 20,
  },
});
