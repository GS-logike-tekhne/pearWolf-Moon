import React, { ReactNode } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  RefreshControl,
  StatusBar,
  Dimensions,
} from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { useXP } from '../hooks/useXP';
import { THEME } from '../styles/theme';
import { UserRole } from '../types/roles';
import UnifiedHeader from './UnifiedHeader';

const { width, height } = Dimensions.get('window');

interface PEARScreenProps {
  children: ReactNode;
  title?: string;
  role?: UserRole;
  showHeader?: boolean;
  showScroll?: boolean;
  enableRefresh?: boolean;
  onRefresh?: () => void;
  refreshing?: boolean;
  backgroundColor?: string;
  contentPadding?: boolean;
  safeAreaEdges?: ('top' | 'bottom' | 'left' | 'right')[];
  statusBarStyle?: 'light-content' | 'dark-content' | 'default';
  statusBarBackgroundColor?: string;
  navigation?: any;
}

export const PEARScreen: React.FC<PEARScreenProps> = ({
  children,
  title,
  role,
  showHeader = true,
  showScroll = true,
  enableRefresh = false,
  onRefresh,
  refreshing = false,
  backgroundColor,
  contentPadding = true,
  safeAreaEdges = ['top', 'bottom'],
  statusBarStyle = 'dark-content',
  statusBarBackgroundColor,
  navigation,
}) => {
  const { theme } = useTheme();
  const { user, currentRole } = useAuth();
  const { currentLevel, getXPSummary } = useXP();
  
  const xpSummary = getXPSummary();
  const xpTotal = xpSummary.totalXP;
  
  // Use current role from auth context, fallback to provided role
  const userRole = currentRole ? currentRole.toLowerCase().replace('_', '-') : (role ? role.toLowerCase().replace('_', '-') : 'trash-hero');

  // Get role-based background color
  const getRoleBackgroundColor = (userRole?: UserRole): string => {
    if (backgroundColor) return backgroundColor;
    
    switch (userRole) {
      case 'TRASH_HERO':
        return 'linear-gradient(135deg, #4CAF50 0%, #81C784 100%)';
      case 'IMPACT_WARRIOR':
        return 'linear-gradient(135deg, #FF5722 0%, #FF8A65 100%)';
      case 'ECO_DEFENDER':
        return 'linear-gradient(135deg, #2196F3 0%, #64B5F6 100%)';
      case 'ADMIN':
        return 'linear-gradient(135deg, #9C27B0 0%, #BA68C8 100%)';
      default:
        return theme.background;
    }
  };

  const roleBgColor = getRoleBackgroundColor(role);
  const finalStatusBarColor = statusBarBackgroundColor || theme.background;

  const renderContent = () => {
    if (showScroll) {
      return (
        <ScrollView
          style={[
            styles.scrollView, 
            { backgroundColor: theme.background },
            styles.scrollContent,
            contentPadding && styles.contentPadding,
          ]}
          showsVerticalScrollIndicator={false}
        >
          {children}
        </ScrollView>
      );
    }

    return (
      <View
        style={[
          styles.content,
          contentPadding && styles.contentPadding,
          { backgroundColor: theme.background },
        ]}
      >
        {children}
      </View>
    );
  };

  return (
    <SafeAreaView
      style={[
        styles.container,
        { backgroundColor: finalStatusBarColor },
      ]}
    >
      <StatusBar
        barStyle={statusBarStyle}
        backgroundColor={finalStatusBarColor}
        translucent={false}
      />
      
      {/* Role-based background overlay */}
      {role && (
        <View
          style={[
            styles.roleBackground,
            {
              backgroundColor: role === 'TRASH_HERO' ? '#4CAF50' :
                              role === 'IMPACT_WARRIOR' ? '#FF5722' :
                              role === 'ECO_DEFENDER' ? '#2196F3' :
                              role === 'ADMIN' ? '#9C27B0' : theme.primary,
              opacity: 0.05,
            },
          ]}
        />
      )}

      {/* Unified Header */}
      {showHeader && navigation && (
        <UnifiedHeader
          onMenuPress={() => {
            // Handle menu press - could be passed as prop or use navigation
            console.log('Menu pressed');
          }}
          role={userRole}
          points={xpTotal}
          onNotificationPress={() => navigation.navigate('Notifications')}
          onProfilePress={() => navigation.navigate('ProfileScreen', { 
            role: userRole,
            onSignOut: () => navigation.navigate('Login')
          })}
        />
      )}

      {/* Main Content */}
      {renderContent()}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  roleBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  header: {
    paddingHorizontal: THEME.SPACING.md,
    paddingVertical: THEME.SPACING.sm,
    borderBottomWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerLeft: {
    width: 40,
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
    marginHorizontal: THEME.SPACING.sm,
  },
  headerRight: {
    width: 40,
    alignItems: 'flex-end',
  },
  pearBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pearIcon: {
    fontSize: 18,
    color: 'white',
  },
  headerTitle: {
    fontSize: THEME.TYPOGRAPHY.fontSize.lg,
    fontWeight: '700',
    textAlign: 'center',
  },
  roleIndicator: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  roleText: {
    color: 'white',
    fontSize: THEME.TYPOGRAPHY.fontSize.xs,
    fontWeight: '700',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
  },
  contentPadding: {
    paddingHorizontal: THEME.SPACING.md,
    paddingVertical: THEME.SPACING.sm,
  },
});

export default PEARScreen;
