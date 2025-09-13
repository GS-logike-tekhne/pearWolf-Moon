import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import BadgeSystem from '../components/BadgeSystem';
import { useTheme } from '../context/ThemeContext';
import { useRoleManager } from '../hooks/useRoleManager';
import { THEME } from '../styles/theme';
import ScreenLayout from '../components/ScreenLayout';
import UnifiedHeader from '../components/UnifiedHeader';
import MenuModal from '../components/MenuModal';

interface BadgeSystemScreenProps {
  navigation: any;
  route: any;
}

const BadgeSystemScreen: React.FC<BadgeSystemScreenProps> = ({ navigation, route }) => {
  const { theme } = useTheme();
  const { currentRole } = useRoleManager();
  const [showMenu, setShowMenu] = useState(false);

  // Use current role from role manager, fallback to route param, then default
  const role = currentRole ? currentRole.toLowerCase().replace('_', '-') : 'impact-warrior';

  return (
    <ScreenLayout>
      <UnifiedHeader
        onMenuPress={() => setShowMenu(true)}
        role={role}
        points={role === 'admin' ? 0 : (role === 'trash-hero' ? 1240 : (role === 'business' ? 3450 : 2450))}
        onNotificationPress={() => navigation.navigate('Notifications')}
        onProfilePress={() => navigation.navigate('ProfileScreen')}
      />
      
      <BadgeSystem 
        navigation={navigation}
        route={route}
      />

      {/* Menu Modal */}
      <MenuModal
        visible={showMenu}
        onClose={() => setShowMenu(false)}
        userRole={currentRole || 'IMPACT_WARRIOR'}
        userName="User"
        userLevel={6}
        onNavigate={(screen, params) => {
          navigation.navigate(screen, params);
        }}
        onSignOut={() => navigation.navigate('Login')}
      />
    </ScreenLayout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default BadgeSystemScreen;
