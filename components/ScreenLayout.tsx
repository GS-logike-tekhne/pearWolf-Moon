import React, { ReactNode } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { THEME, getRoleTheme } from '../styles/theme';

interface ScreenLayoutProps {
  children: ReactNode;
  scrollable?: boolean;
  keyboardAvoiding?: boolean;
  safeAreaEdges?: ('top' | 'bottom' | 'left' | 'right')[];
  backgroundColor?: string;
  padding?: {
    horizontal?: number;
    vertical?: number;
  };
  style?: any;
  contentContainerStyle?: any;
  showsVerticalScrollIndicator?: boolean;
  showsHorizontalScrollIndicator?: boolean;
  refreshControl?: React.ReactElement;
  onScroll?: (event: any) => void;
  scrollEventThrottle?: number;
}

const ScreenLayout: React.FC<ScreenLayoutProps> = ({
  children,
  scrollable = true,
  keyboardAvoiding = true,
  safeAreaEdges = ['top', 'bottom'],
  backgroundColor,
  padding = {
    horizontal: THEME.LAYOUT.screenPadding.horizontal,
    vertical: THEME.LAYOUT.screenPadding.vertical,
  },
  style,
  contentContainerStyle,
  showsVerticalScrollIndicator = false,
  showsHorizontalScrollIndicator = false,
  refreshControl,
  onScroll,
  scrollEventThrottle = 16,
}) => {
  const { theme } = useTheme();
  const { currentRole } = useAuth();
  
  // Get role-specific theme
  const roleTheme = getRoleTheme(currentRole);
  
  // Determine background color
  const screenBackgroundColor = backgroundColor || roleTheme.background;
  
  // Create container style
  const containerStyle = [
    styles.container,
    {
      backgroundColor: screenBackgroundColor,
      paddingHorizontal: padding.horizontal,
      paddingVertical: padding.vertical,
    },
    style,
  ];
  
  // Create content container style for ScrollView
  const scrollContentStyle = [
    styles.scrollContent,
    contentContainerStyle,
  ];
  
  // Render content based on scrollable prop
  const renderContent = () => {
    if (scrollable) {
      return (
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={scrollContentStyle}
          showsVerticalScrollIndicator={showsVerticalScrollIndicator}
          showsHorizontalScrollIndicator={showsHorizontalScrollIndicator}
          refreshControl={refreshControl}
          onScroll={onScroll}
          scrollEventThrottle={scrollEventThrottle}
          keyboardShouldPersistTaps="handled"
        >
          {children}
        </ScrollView>
      );
    }
    
    return (
      <View style={[styles.content, contentContainerStyle]}>
        {children}
      </View>
    );
  };
  
  // Render with keyboard avoiding if enabled
  const renderWithKeyboardAvoiding = () => {
    if (keyboardAvoiding && Platform.OS === 'ios') {
      return (
        <KeyboardAvoidingView
          style={styles.keyboardAvoidingView}
          behavior="padding"
          keyboardVerticalOffset={0}
        >
          {renderContent()}
        </KeyboardAvoidingView>
      );
    }
    
    return renderContent();
  };
  
  return (
    <SafeAreaView
      style={[styles.safeArea, { backgroundColor: screenBackgroundColor }]}
      edges={safeAreaEdges}
    >
      <StatusBar
        barStyle={theme.isDark ? 'light-content' : 'dark-content'}
        backgroundColor={screenBackgroundColor}
        translucent={false}
      />
      {renderWithKeyboardAvoiding()}
    </SafeAreaView>
  );
};

// Specialized ScreenLayout variants for common use cases
export const ScreenLayoutWithHeader: React.FC<ScreenLayoutProps & {
  header?: ReactNode;
}> = ({ header, children, ...props }) => (
  <ScreenLayout {...props}>
    {header && (
      <View style={styles.headerContainer}>
        {header}
      </View>
    )}
    {children}
  </ScreenLayout>
);

export const ScreenLayoutWithTabBar: React.FC<ScreenLayoutProps & {
  tabBar?: ReactNode;
}> = ({ tabBar, children, ...props }) => (
  <ScreenLayout {...props}>
    {children}
    {tabBar && (
      <View style={styles.tabBarContainer}>
        {tabBar}
      </View>
    )}
  </ScreenLayout>
);

export const ScreenLayoutFullScreen: React.FC<ScreenLayoutProps> = (props) => (
  <ScreenLayout
    {...props}
    safeAreaEdges={[]}
    padding={{ horizontal: 0, vertical: 0 }}
  />
);

export const ScreenLayoutCentered: React.FC<ScreenLayoutProps> = ({ children, ...props }) => (
  <ScreenLayout
    {...props}
    contentContainerStyle={[
      styles.centeredContent,
      props.contentContainerStyle,
    ]}
  >
    {children}
  </ScreenLayout>
);

export const ScreenLayoutWithFloatingAction: React.FC<ScreenLayoutProps & {
  floatingAction?: ReactNode;
}> = ({ floatingAction, children, ...props }) => (
  <ScreenLayout {...props}>
    {children}
    {floatingAction && (
      <View style={styles.floatingActionContainer}>
        {floatingAction}
      </View>
    )}
  </ScreenLayout>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  keyboardAvoidingView: {
    flex: 1,
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
  headerContainer: {
    marginBottom: THEME.SPACING.lg,
  },
  tabBarContainer: {
    marginTop: THEME.SPACING.lg,
  },
  centeredContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  floatingActionContainer: {
    position: 'absolute',
    bottom: THEME.SPACING.xl,
    right: THEME.SPACING.lg,
    zIndex: 1000,
  },
});

export default ScreenLayout;
