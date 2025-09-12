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
}) => {
  const { theme } = useTheme();

  // Get role-based background color
  const getRoleBackgroundColor = (userRole?: UserRole): string => {
    if (backgroundColor) return backgroundColor;
    
    switch (userRole) {
      case 'trash-hero':
        return 'linear-gradient(135deg, #4CAF50 0%, #81C784 100%)';
      case 'impact-warrior':
        return 'linear-gradient(135deg, #FF5722 0%, #FF8A65 100%)';
      case 'eco-defender':
        return 'linear-gradient(135deg, #2196F3 0%, #64B5F6 100%)';
      case 'admin':
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
          style={[styles.scrollView, { backgroundColor: theme.background }]}
          contentContainerStyle={[
            styles.scrollContent,
            contentPadding && styles.contentPadding,
          ]}
          showsVerticalScrollIndicator={false}
          refreshControl={
            enableRefresh && onRefresh ? (
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                tintColor={theme.primary}
                colors={[theme.primary]}
              />
            ) : undefined
          }
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
      edges={safeAreaEdges}
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
              backgroundColor: role === 'trash-hero' ? '#4CAF50' :
                              role === 'impact-warrior' ? '#FF5722' :
                              role === 'eco-defender' ? '#2196F3' :
                              role === 'admin' ? '#9C27B0' : theme.primary,
              opacity: 0.05,
            },
          ]}
        />
      )}

      {/* Header */}
      {showHeader && title && (
        <View
          style={[
            styles.header,
            {
              backgroundColor: theme.cardBackground,
              borderBottomColor: theme.borderColor || '#E0E0E0',
            },
          ]}
        >
          <View style={styles.headerContent}>
            <View style={styles.headerLeft}>
              {/* PEAR Logo/Badge */}
              <View
                style={[
                  styles.pearBadge,
                  {
                    backgroundColor: role === 'trash-hero' ? '#4CAF50' :
                                    role === 'impact-warrior' ? '#FF5722' :
                                    role === 'eco-defender' ? '#2196F3' :
                                    role === 'admin' ? '#9C27B0' : theme.primary,
                  },
                ]}
              >
                <Text style={styles.pearIcon}>🍐</Text>
              </View>
            </View>
            
            <View style={styles.headerCenter}>
              <Text
                style={[
                  styles.headerTitle,
                  { color: theme.textColor },
                ]}
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                {title}
              </Text>
            </View>
            
            <View style={styles.headerRight}>
              {/* Role indicator */}
              {role && (
                <View
                  style={[
                    styles.roleIndicator,
                    {
                      backgroundColor: role === 'trash-hero' ? '#4CAF50' :
                                      role === 'impact-warrior' ? '#FF5722' :
                                      role === 'eco-defender' ? '#2196F3' :
                                      role === 'admin' ? '#9C27B0' : theme.primary,
                    },
                  ]}
                >
                  <Text style={styles.roleText}>
                    {role === 'trash-hero' ? 'TH' :
                     role === 'impact-warrior' ? 'IW' :
                     role === 'eco-defender' ? 'ED' :
                     role === 'admin' ? 'AD' : 'U'}
                  </Text>
                </View>
              )}
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
