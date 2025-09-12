import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types/roles';
import UnifiedHeader from '../components/UnifiedHeader';
import MenuModal from '../components/MenuModal';
import { useXP } from '../hooks/useXP';
import { useActivityTracking } from '../hooks/useActivityTracking';
import CelebrationAnimation from '../components/animations/CelebrationAnimation';

interface WalletScreenProps {
  navigation: any;
  route: any;
}

const WalletScreen: React.FC<WalletScreenProps> = ({ navigation, route }) => {
  const { theme } = useTheme();
  const { user, currentRole, logout } = useAuth();
  const [showMenu, setShowMenu] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  
  // XP and gamification data
  const { currentLevel, getXPSummary } = useXP();
  const { 
    efficiencySummary, 
    getMissionStats,
    refreshEfficiencySummary 
  } = useActivityTracking();
  const streak = 3;
  const xpSummary = getXPSummary();
  const xpTotal = xpSummary.totalXP;
  
  // Mission efficiency data
  const missionStats = getMissionStats();
  
  // Use current role from auth context, fallback to route params, then to user role
  const userRole = route?.params?.role || 
                   (currentRole ? currentRole.toLowerCase().replace('_', '-') : 'trash-hero') ||
                   (user?.role ? user.role.toLowerCase().replace('_', '-') : 'trash-hero');

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.background}>
        {/* Unified Header */}
        <UnifiedHeader
          onMenuPress={() => setShowMenu(true)}
          role={userRole}
          points={xpTotal}
          onNotificationPress={() => navigation.navigate('Notifications')}
          onProfilePress={() => navigation.navigate('ProfileScreen', { 
            role: userRole,
            onSignOut: () => navigation.navigate('Login')
          })}
        />

        <ScrollView style={styles.scrollView}>
          {/* Test Content */}
          <View style={styles.testContainer}>
            <Text style={styles.testTitle}>🎉 NEW GAMIFIED WALLET 🎉</Text>
            <Text style={styles.testText}>This is the new wallet screen!</Text>
            <Text style={styles.testText}>Level: {currentLevel.level}</Text>
            <Text style={styles.testText}>XP: {xpTotal}</Text>
            <Text style={styles.testText}>Streak: {streak}</Text>
            <Text style={styles.testText}>Role: {userRole}</Text>
            
            <View style={styles.testCard}>
              <Text style={styles.cardTitle}>TrashHero Pro</Text>
              <Text style={styles.cardTier}>Guardian Tier</Text>
              <Text style={styles.cardBalance}>$580.00</Text>
              <Text style={styles.cardEco}>240 Eco Points</Text>
            </View>
            
            <View style={styles.testButtons}>
              <View style={styles.testButton}>
                <Text style={styles.buttonText}>+ Earn More</Text>
              </View>
              <View style={styles.testButton}>
                <Text style={styles.buttonText}>🌱 Redeem</Text>
              </View>
            </View>
            
            {/* Test Sign Out Button */}
            <View style={[styles.testButton, { backgroundColor: '#dc3545', marginTop: 20 }]}>
              <Text 
                style={styles.buttonText}
                onPress={async () => {
                  console.log('Direct sign out test');
                  try {
                    await logout();
                    navigation.getParent()?.reset({
                      index: 0,
                      routes: [{ name: 'Login' }],
                    });
                  } catch (error) {
                    console.error('Direct logout failed:', error);
                  }
                }}
              >
                🚪 Test Sign Out
              </Text>
            </View>
          </View>

          {/* Bottom Spacing */}
          <View style={styles.bottomSpacing} />
        </ScrollView>

        {/* Celebration Animation */}
        <CelebrationAnimation
          visible={showCelebration}
          rewards={[
            { type: 'eco_points', value: 50, source: 'redeem', timestamp: new Date() },
            { type: 'xp', value: 25, source: 'redeem', timestamp: new Date() }
          ]}
          userRole={userRole}
          onComplete={() => setShowCelebration(false)}
        />

        {/* Menu Modal */}
        <MenuModal
          visible={showMenu}
          onClose={() => setShowMenu(false)}
          userRole={userRole.toUpperCase().replace('-', '_') as any}
          userName="TrashHero Pro"
          userLevel={currentLevel.level}
          onNavigate={(screen, params) => {
            console.log('Navigating to:', screen, params);
            navigation.navigate(screen, params);
          }}
          onSignOut={async () => {
            console.log('Sign out pressed');
            try {
              await logout();
              // Use getParent() to navigate to the root navigator
              navigation.getParent()?.reset({
                index: 0,
                routes: [{ name: 'Login' }],
              });
            } catch (error) {
              console.error('Logout failed:', error);
              // Still navigate to login even if logout fails
              navigation.getParent()?.reset({
                index: 0,
                routes: [{ name: 'Login' }],
              });
            }
          }}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    flex: 1,
    backgroundColor: '#0C3F1A',
  },
  scrollView: {
    flex: 1,
    paddingBottom: 20,
  },
  testContainer: {
    padding: 20,
    alignItems: 'center',
  },
  testTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#F4C542',
    marginBottom: 20,
    textAlign: 'center',
  },
  testText: {
    fontSize: 16,
    color: 'white',
    marginBottom: 10,
  },
  testCard: {
    backgroundColor: '#35B87F',
    borderRadius: 20,
    padding: 20,
    marginVertical: 20,
    width: '100%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  cardTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: 'white',
    marginBottom: 5,
  },
  cardTier: {
    fontSize: 16,
    fontWeight: '600',
    color: '#F4C542',
    marginBottom: 10,
  },
  cardBalance: {
    fontSize: 36,
    fontWeight: '700',
    color: 'white',
    marginBottom: 8,
  },
  cardEco: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
  },
  testButtons: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  testButton: {
    flex: 1,
    backgroundColor: '#35B87F',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: 'center',
    shadowColor: '#35B87F',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
  },
  buttonText: {
    fontSize: 14,
    fontWeight: '600',
    color: 'white',
  },
  bottomSpacing: {
    height: 40,
  },
});

export default WalletScreen;