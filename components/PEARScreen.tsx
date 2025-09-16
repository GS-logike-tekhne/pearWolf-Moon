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
  TouchableOpacity,
} from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { useXP } from '../hooks/useXP';
import { THEME } from '../styles/theme';
import { UserRole } from '../types/roles';

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
            { backgroundColor: 'transparent' },
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
          { backgroundColor: 'transparent' },
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
        { backgroundColor: backgroundColor || 'transparent' },
      ]}
    >
      <StatusBar
        barStyle={statusBarStyle}
        backgroundColor={finalStatusBarColor}
        translucent={false}
      />
      
      {/* Role-based background overlay - removed */}

      {/* Simple Header */}
      {showHeader && (
        <View style={[styles.header, { backgroundColor: theme.background, borderBottomColor: theme.borderColor }]}>
          <View style={styles.headerContent}>
            <View style={styles.headerLeft}>
              {navigation && (
                <TouchableOpacity
                  style={styles.menuButton}
                  onPress={() => {
                    console.log('Menu pressed');
                  }}
                >
                  <Text style={[styles.menuIcon, { color: theme.text }]}>☰</Text>
                </TouchableOpacity>
              )}
            </View>
            <View style={styles.headerCenter}>
              <Text style={[styles.headerTitle, { color: theme.text }]}>
                {title || 'PEAR'}
              </Text>
            </View>
            <View style={styles.headerRight}>
              <View style={styles.headerStats}>
                <Text style={[styles.headerStatText, { color: theme.secondaryText }]}>
                  Level {currentLevel.level}
                </Text>
                <Text style={[styles.headerStatText, { color: theme.secondaryText }]}>
                  {xpTotal} XP
                </Text>
              </View>
            </View>
          </View>
        </View>
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
  menuButton: {
    padding: 8,
  },
  menuIcon: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerLeft: {
    flex: 1,
    alignItems: 'flex-start',
  },
  headerCenter: {
    flex: 2,
    alignItems: 'center',
  },
  headerRight: {
    flex: 1,
    alignItems: 'flex-end',
  },
  headerTitle: {
    fontSize: THEME.TYPOGRAPHY.fontSize.lg,
    fontWeight: 'bold',
  },
  headerStats: {
    alignItems: 'flex-end',
  },
  headerStatText: {
    fontSize: THEME.TYPOGRAPHY.fontSize.xs,
    fontWeight: '500',
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
    paddingHorizontal: THEME.SPACING.xs,
    paddingVertical: THEME.SPACING.xs,
  },
});

export default PEARScreen;