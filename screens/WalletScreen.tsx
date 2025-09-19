import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  Text,
  Dimensions,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import { useXP } from '../hooks/useXP';
import { useRoleManager } from '../hooks/useRoleManager';
import { getRoleColor } from '../types/roles';
import MenuModal from '../components/MenuModal';
import UnifiedHeader from '../components/UnifiedHeader';

interface WalletScreenProps {
  navigation: any;
  route: any;
}

const WalletScreen: React.FC<WalletScreenProps> = ({ navigation, route }) => {
  const { user, logout } = useAuth();
  const { currentLevel, getXPSummary } = useXP();
  const { currentRole } = useRoleManager();
  const [showMenu, setShowMenu] = useState(false);
  
  const xpSummary = getXPSummary();
  const xpTotal = xpSummary.totalXP;
  
  // Use current role from role manager
  const userRole = currentRole || 'TRASH_HERO';

  // Mock user data
  const userData = {
    name: 'Justin Moore',
    username: 'trashhero_pro',
    email: 'justin@pearapp.com',
    phone: '(555) 123-4567',
    address: '123 Eco Street, Green City, CA 90210',
    dob: 'March 15, 1990'
  };

  const walletData = {
    balance: '$580.00',
    ecoPoints: '240',
    level: currentLevel.level,
    xp: xpTotal,
    walletId: `TH-000000003`,
    verified: true
  };

  const recentTransactions = [
    {
      id: 1,
      type: 'earned',
      amount: '+$45.00',
      description: 'Beach Cleanup Initiative',
      date: 'Today',
      icon: 'add-circle',
      color: '#90E31C'
    },
    {
      id: 2,
      type: 'redeemed',
      amount: '-$25.00',
      description: 'Eco Store Purchase',
      date: 'Yesterday',
      icon: 'remove-circle',
      color: '#FF4444'
    },
    {
      id: 3,
      type: 'earned',
      amount: '+$35.00',
      description: 'Park Restoration',
      date: '2 days ago',
      icon: 'add-circle',
      color: '#90E31C'
    },
    {
      id: 4,
      type: 'bonus',
      amount: '+$15.00',
      description: 'Referral Bonus',
      date: '3 days ago',
      icon: 'gift',
      color: '#FFD700'
    }
  ];

  // Info Row Component
  const InfoRow: React.FC<{
    label: string; 
    value: string; 
    icon: string;
    color?: string;
  }> = ({ label, value, icon, color = '#90E31C' }) => (
    <View style={styles.infoRow}>
      <View style={styles.infoLeft}>
        <View style={[styles.iconContainer, { backgroundColor: `${color}20` }]}>
          <Ionicons name={icon as any} size={16} color={color} />
        </View>
        <Text style={styles.infoLabel}>{label}</Text>
      </View>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  );

  // Transaction Row Component
  const TransactionRow: React.FC<{
    transaction: any;
  }> = ({ transaction }) => (
    <View style={styles.transactionRow}>
      <View style={styles.transactionLeft}>
        <View style={[styles.transactionIcon, { backgroundColor: `${transaction.color}20` }]}>
          <Ionicons name={transaction.icon as any} size={16} color={transaction.color} />
        </View>
        <View style={styles.transactionDetails}>
          <Text style={styles.transactionDescription}>{transaction.description}</Text>
          <Text style={styles.transactionDate}>{transaction.date}</Text>
        </View>
      </View>
      <Text style={[styles.transactionAmount, { color: transaction.color }]}>
        {transaction.amount}
      </Text>
    </View>
  );

  return (
    <View style={styles.screenContainer}>
      {/* Fixed Header */}
      <View style={styles.fixedHeader}>
        <UnifiedHeader
          onMenuPress={() => setShowMenu(true)}
          role={userRole}
          onNotificationPress={() => navigation.navigate('Notifications')}
          onProfilePress={() => navigation.navigate('ProfileScreen', { 
            role: userRole,
            onSignOut: () => navigation.navigate('Login')
          })}
        />
      </View>

      {/* Scrollable Content */}
      <ScrollView 
        style={styles.scrollableContent}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Wallet Overview Card */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Ionicons name="wallet-outline" size={20} color="#666" />
            <Text style={styles.cardTitle}>Wallet Overview</Text>
          </View>
          
          <View style={styles.walletOverview}>
            <View style={styles.balanceSection}>
              <Text style={styles.balanceLabel}>Current Balance</Text>
              <Text style={styles.balanceAmount}>{walletData.balance}</Text>
            </View>
            
            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{walletData.ecoPoints}</Text>
                <Text style={styles.statLabel}>Eco Points</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>Level {walletData.level}</Text>
                <Text style={styles.statLabel}>Current Level</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{walletData.xp.toLocaleString()}</Text>
                <Text style={styles.statLabel}>Total XP</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Account Info Card */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Ionicons name="person-outline" size={20} color="#666" />
            <Text style={styles.cardTitle}>Account Info</Text>
          </View>
          
          <View style={styles.infoContainer}>
            <InfoRow 
              label="Name"
              value={userData.name}
              icon="person"
            />
            <InfoRow 
              label="Username"
              value={userData.username}
              icon="at"
            />
            <InfoRow 
              label="Email"
              value={userData.email}
              icon="mail"
            />
            <InfoRow 
              label="Phone"
              value={userData.phone}
              icon="call"
            />
          </View>
        </View>

        {/* Wallet Details Card */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Ionicons name="card-outline" size={20} color="#666" />
            <Text style={styles.cardTitle}>Wallet Details</Text>
          </View>
          
          <View style={styles.infoContainer}>
            <InfoRow 
              label="Wallet ID"
              value={walletData.walletId}
              icon="card"
              color="#007bff"
            />
            <InfoRow 
              label="Status"
              value={walletData.verified ? "PEAR Verified" : "Pending"}
              icon="checkmark-circle"
              color={walletData.verified ? "#90E31C" : "#FF9800"}
            />
            <InfoRow 
              label="Member Since"
              value="January 2024"
              icon="calendar"
              color="#666"
            />
          </View>
        </View>

        {/* Quick Actions Card */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Ionicons name="flash-outline" size={20} color="#666" />
            <Text style={styles.cardTitle}>Quick Actions</Text>
          </View>
          
          <View style={styles.quickActionsContainer}>
            <TouchableOpacity style={styles.quickActionButton}>
              <Ionicons name="add-circle-outline" size={24} color={getRoleColor(userRole)} />
              <Text style={styles.quickActionText}>Earn Money</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.quickActionButton}>
              <Ionicons name="storefront-outline" size={24} color={getRoleColor(userRole)} />
              <Text style={styles.quickActionText}>Redeem Points</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.quickActionButton}>
              <Ionicons name="analytics-outline" size={24} color={getRoleColor(userRole)} />
              <Text style={styles.quickActionText}>View Analytics</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.quickActionButton}>
              <Ionicons name="settings-outline" size={24} color={getRoleColor(userRole)} />
              <Text style={styles.quickActionText}>Settings</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Recent Transactions Card */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Ionicons name="time-outline" size={20} color="#666" />
            <Text style={styles.cardTitle}>Recent Transactions</Text>
          </View>
          
          <View style={styles.transactionsContainer}>
            {recentTransactions.map((transaction) => (
              <TransactionRow key={transaction.id} transaction={transaction} />
            ))}
          </View>
        </View>
        
      </ScrollView>

      {/* Menu Modal */}
      <MenuModal
        visible={showMenu}
        onClose={() => setShowMenu(false)}
        userRole={userRole}
        userName={user?.name || 'TrashHero Pro'}
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
    </View>
  );
};

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    backgroundColor: 'white',
  },
  fixedHeader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
    backgroundColor: 'white',
  },
  scrollableContent: {
    flex: 1,
    paddingTop: 100, // Adjust based on header height
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 100, // Ensure content is visible above bottom navigation
    paddingHorizontal: 20, // Consistent horizontal padding
  },

  // Card Styles
  card: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginLeft: 8,
  },

  // Wallet Overview Styles
  walletOverview: {
    gap: 16,
  },
  balanceSection: {
    alignItems: 'center',
    paddingVertical: 16,
    backgroundColor: '#f9fafb',
    borderRadius: 8,
  },
  balanceLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  balanceAmount: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
  },

  // Info Row Styles
  infoContainer: {
    gap: 8,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 6,
  },
  infoLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  infoLabel: {
    fontSize: 14,
    color: '#666',
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
  },

  // Quick Actions Styles
  quickActionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  quickActionButton: {
    flex: 1,
    minWidth: '45%',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 12,
    backgroundColor: '#f9fafb',
    borderRadius: 8,
    marginBottom: 8,
  },
  quickActionText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
    marginLeft: 8,
  },

  // Transaction Styles
  transactionsContainer: {
    gap: 8,
  },
  transactionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  transactionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  transactionIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  transactionDetails: {
    flex: 1,
  },
  transactionDescription: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
    marginBottom: 2,
  },
  transactionDate: {
    fontSize: 12,
    color: '#666',
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: '600',
  },
});

export default WalletScreen;