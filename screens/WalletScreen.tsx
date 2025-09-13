import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import { useAuth } from '../context/AuthContext';
import { useXP } from '../hooks/useXP';
import UnifiedHeader from '../components/UnifiedHeader';
import MenuModal from '../components/MenuModal';
import WalletCard from '../components/wallet/WalletCard';
import ActionButtons from '../components/wallet/ActionButtons';
import TransactionItem from '../components/wallet/TransactionItem';

interface WalletScreenProps {
  navigation: any;
  route: any;
}

const WalletScreen: React.FC<WalletScreenProps> = ({ navigation, route }) => {
  const { user, currentRole, logout } = useAuth();
  const { currentLevel, getXPSummary, progressPercent } = useXP();
  const [showMenu, setShowMenu] = useState(false);
  
  const xpSummary = getXPSummary();
  const xpTotal = xpSummary.totalXP;
  
  // Use current role from auth context, fallback to route params, then to user role
  const userRole = route?.params?.role || 
                   (currentRole ? currentRole.toLowerCase().replace('_', '-') : 'trash-hero') ||
                   (user?.role ? user.role.toLowerCase().replace('_', '-') : 'trash-hero');

  // Mock transaction data
  const transactions = [
    { id: 1, title: 'Beach Cleanup Mission', amount: '+$45', time: '2 hours ago', icon: 'star' },
    { id: 2, title: 'Recycling Bonus', amount: '+$12', time: '1 day ago', icon: 'leaf' },
    { id: 3, title: 'Community Event', amount: '+$28', time: '3 days ago', icon: 'people' },
    { id: 4, title: 'Daily Quest', amount: '+$8', time: '1 week ago', icon: 'trophy' },
  ];

  const getTierName = (level: number) => {
    if (level >= 10) return 'Eco Master';
    if (level >= 7) return 'Guardian';
    if (level >= 5) return 'Warrior';
    if (level >= 3) return 'Defender';
    return 'Rookie';
  };

  const getRoleTitle = (role: string) => {
    switch (role) {
      case 'trash-hero': return 'Trash Hero Pro';
      case 'impact-warrior': return 'Impact Warrior';
      case 'eco-defender': return 'Eco Defender';
      case 'admin': return 'Admin';
      default: return 'Trash Hero Pro';
    }
  };

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
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

        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>

          {/* Main Wallet Card */}
          <WalletCard
            role={getRoleTitle(userRole)}
            tier={getTierName(currentLevel.level)}
            id={`TH-${(user?.id?.toString() || '000000003').padStart(9, '0')}`}
            balance="580.00"
            ecoPoints={240}
            level={currentLevel.level}
            levelProgress={progressPercent || 0}
            nextTierEcoPoints={10000}
            nextTierCash="1000"
          />

          {/* Action Buttons */}
          <ActionButtons
            onEarnMore={() => navigation.navigate('TrashHeroMissions')}
            onRedeem={() => navigation.navigate('RedeemScreen')}
          />

          {/* Transactions Section */}
        <View style={styles.transactionsSection}>
            <Text style={styles.sectionTitle}>Recent Transactions</Text>
            {transactions.map((transaction, index) => (
              <TransactionItem
                key={transaction.id}
                icon={transaction.icon}
                title={transaction.title}
                amount={transaction.amount}
                timestamp={transaction.time}
                iconColor="#35B87F"
                isLast={index === transactions.length - 1}
              />
            ))}
          </View>
      </ScrollView>

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
              navigation.getParent()?.reset({
                index: 0,
                routes: [{ name: 'Login' }],
              });
            } catch (error) {
              console.error('Logout failed:', error);
              navigation.getParent()?.reset({
                index: 0,
                routes: [{ name: 'Login' }],
              });
            }
          }}
        />
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  safeArea: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 16,
  },
  transactionsSection: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    backgroundColor: '#ffffff',
    marginHorizontal: 20,
    borderRadius: 12,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: 16,
  },
});

export default WalletScreen;