import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getRoleColor } from '../utils/roleColors';
import { useTheme } from '../context/ThemeContext';
import { THEME } from '../styles/theme';
import ScreenLayout from '../components/ScreenLayout';
import { useAuth } from '../context/AuthContext';
import { generateWalletId } from '../utils/generateWalletId';
import { UserRole } from '../types/roles';
import UnifiedHeader from '../components/UnifiedHeader';
import MenuModal from '../components/MenuModal';

const { width } = Dimensions.get('window');

interface WalletScreenProps {
  navigation: any;
  route: any;
}

const WalletScreen: React.FC<WalletScreenProps> = ({ navigation, route }) => {
  const { theme } = useTheme();
  const { user, currentRole } = useAuth();
  const [showMenu, setShowMenu] = useState(false);
  
  // Use current role from auth context, fallback to route params, then to user role
  const userRole = route?.params?.role || 
                   (currentRole ? currentRole.toLowerCase().replace('_', '-') : 'trash-hero') ||
                   (user?.role ? user.role.toLowerCase().replace('_', '-') : 'trash-hero');

  // Debug logging to help identify the issue
  console.log('WalletScreen Debug:', {
    routeParams: route?.params?.role,
    currentRole,
    userRole: user?.role,
    finalUserRole: userRole
  });

  // Generate wallet ID based on current user and role
  const walletId = generateWalletId(user?.id || 1, userRole);
  console.log('Generated Wallet ID:', walletId, 'for user:', user?.id, 'role:', userRole);

  // Get role-specific configuration
  const getRoleConfig = () => {
    switch (userRole) {
      case 'trash-hero':
        return {
          title: 'TrashHero Pro',
          subtitle: 'Professional Cleaner',
          color: getRoleColor('trash-hero'),
          icon: 'cash',
          primaryBalance: '$580.00',
          primaryLabel: 'Cash Earnings',
          secondaryBalance: '1,240',
          secondaryLabel: 'Eco Points',
        };
      case 'impact-warrior':
        return {
          title: 'Impact Warrior',
          subtitle: 'Environmental Volunteer',
          // color: theme.error,
          icon: 'heart',
          primaryBalance: '850',
          primaryLabel: 'Eco Points',
          secondaryBalance: null,
          secondaryLabel: null,
        };
      case 'business':
        return {
          title: 'EcoDefender Corp',
          subtitle: 'Environmental Sponsor',
          color: theme.primary,
          icon: 'business',
          primaryBalance: '$12,450.00',
          primaryLabel: 'Business Wallet',
          secondaryBalance: null,
          secondaryLabel: null,
        };
      case 'admin':
        return {
          title: 'Administrator',
          subtitle: 'Platform Manager',
          color: getRoleColor('admin'),
          icon: 'shield',
          primaryBalance: '2,450',
          primaryLabel: 'Admin Points',
          secondaryBalance: null,
          secondaryLabel: null,
        };
      default:
        return {
          title: 'User',
          subtitle: 'Member',
          color: theme.primary,
          icon: 'person',
          primaryBalance: '0',
          primaryLabel: 'Balance',
          secondaryBalance: null,
          secondaryLabel: null,
        };
    }
  };

  // Get recent transactions based on role
  const getTransactions = () => {
    switch (userRole) {
      case 'trash-hero':
        return [
          { id: 1, type: 'earned', amount: '+$45', description: 'Beach Cleanup Mission', date: 'Today', icon: 'add-circle' },
          { id: 2, type: 'earned', amount: '+$60', description: 'Park Restoration Mission', date: '2 days ago', icon: 'add-circle' },
          { id: 3, type: 'earned', amount: '+25 pts', description: 'Community Volunteer Bonus', date: '3 days ago', icon: 'trophy' },
          { id: 4, type: 'transfer', amount: '-$20', description: 'Donation to Ocean Cleanup', date: '1 week ago', icon: 'heart' },
        ];
      case 'impact-warrior':
        return [
          { id: 1, type: 'earned', amount: '+120 pts', description: 'Community Beach Day', date: 'Today', icon: 'add-circle' },
          { id: 2, type: 'earned', amount: '+95 pts', description: 'Forest Restoration Mission', date: 'Yesterday', icon: 'add-circle' },
          { id: 3, type: 'transfer', amount: '-50 pts', description: 'Donated to River Cleanup', date: '2 days ago', icon: 'heart' },
          { id: 4, type: 'earned', amount: '+75 pts', description: 'Neighborhood Cleanup Drive', date: '4 days ago', icon: 'add-circle' },
        ];
      case 'business':
        return [
          { id: 1, type: 'spent', amount: '-$450', description: 'Beach Cleanup Mission Fund', date: 'Today', icon: 'remove-circle' },
          { id: 2, type: 'added', amount: '+$2,000', description: 'Wallet Top-up', date: 'Yesterday', icon: 'card' },
          { id: 3, type: 'spent', amount: '-$320', description: 'Park Restoration Mission', date: '2 days ago', icon: 'remove-circle' },
          { id: 4, type: 'transfer', amount: '-$100', description: 'PEAR Verified Mission Donation', date: '3 days ago', icon: 'heart' },
        ];
      case 'admin':
        return [
          { id: 1, type: 'earned', amount: '+200 pts', description: 'Platform Management Bonus', date: 'Today', icon: 'shield' },
          { id: 2, type: 'earned', amount: '+150 pts', description: 'Mission Approval Rewards', date: 'Yesterday', icon: 'checkmark-circle' },
          { id: 3, type: 'transfer', amount: '-100 pts', description: 'PEAR Verified Mission Donation', date: '2 days ago', icon: 'heart' },
          { id: 4, type: 'earned', amount: '+300 pts', description: 'Weekly Admin Rewards', date: '1 week ago', icon: 'star' },
        ];
      default:
        return [];
    }
  };

  const roleConfig = getRoleConfig();
  const transactions = getTransactions();


  const getTransactionColor = (type: string) => {
    switch (type) {
      case 'earned': return '#28a745';
      case 'added': return '#007bff';
      case 'spent': return '#dc3545';
      case 'transfer': return '#ffc107';
      default: return theme.secondaryText;
    }
  };

  const TransactionCard = ({ transaction }: any) => (
    <View style={[styles.transactionCard, { backgroundColor: theme.cardBackground }]}>
      <View style={[styles.transactionIcon, { backgroundColor: getTransactionColor(transaction.type) }]}>
        <Ionicons 
          name={transaction.icon as any} 
          size={18} 
          color="white" 
        />
      </View>
      <View style={styles.transactionDetails}>
        <Text style={[styles.transactionDescription, { color: theme.textColor }]}>
          {transaction.description}
        </Text>
        <Text style={[styles.transactionDate, { color: theme.secondaryText }]}>
          {transaction.date}
        </Text>
      </View>
      <Text style={[styles.transactionAmount, { color: getTransactionColor(transaction.type) }]}>
        {transaction.amount}
      </Text>
    </View>
  );

  return (
    <ScreenLayout>
      <UnifiedHeader
        onMenuPress={() => setShowMenu(true)}
        role={userRole}
        onNotificationPress={() => navigation.navigate('Notifications')}
        onProfilePress={() => navigation.navigate('ProfileScreen', { 
          role: userRole,
          onSignOut: () => navigation.navigate('Login')
        })}
      />

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={[styles.header, { backgroundColor: theme.background }]}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color={roleConfig.color} />
          </TouchableOpacity>
          
          <Text style={[styles.headerTitle, { color: theme.textColor }]}>Wallet</Text>
          
          <View style={[styles.walletIcon, { backgroundColor: roleConfig.color }]}>
            <Ionicons name="wallet" size={16} color="white" />
          </View>
        </View>

        {/* Digital Wallet Card */}
        <View style={[styles.walletCard, { backgroundColor: theme.cardBackground }]}>
          <View style={[styles.cardGradient, { backgroundColor: roleConfig.color }]}>
            <View style={styles.cardHeader}>
              <View style={styles.cardTitle}>
                <Text style={styles.cardTitleText}>{roleConfig.title}</Text>
                <Text style={styles.cardSubtitleText}>{roleConfig.subtitle}</Text>
                <Text style={styles.walletIdText}>ID: {walletId}</Text>
              </View>
              <View style={styles.cardIcon}>
                <Ionicons name={roleConfig.icon as any} size={24} color="white" />
              </View>
            </View>
            
            <View style={styles.cardBalance}>
              <Text style={styles.balanceLabel}>{roleConfig.primaryLabel}</Text>
              <Text style={styles.balanceAmount}>{roleConfig.primaryBalance}</Text>
              {roleConfig.secondaryBalance && (
                <Text style={styles.secondaryBalance}>
                  {roleConfig.secondaryBalance} {roleConfig.secondaryLabel}
                </Text>
              )}
            </View>
            
            <View style={styles.cardFooter}>
              <View style={styles.cardChip} />
              <Text style={styles.cardNumber}>{walletId}</Text>
            </View>
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <TouchableOpacity style={[styles.actionButton, { backgroundColor: roleConfig.color }]}>
            <Ionicons name="add" size={20} color="white" />
            <Text style={styles.actionText}>
              {userRole === 'business' ? 'Add Funds' : 'Earn More'}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.actionButton, styles.secondaryAction]}>
            <Ionicons name="chevron-forward" size={24} color={roleConfig.color} />
            <Text style={[styles.actionText, { color: roleConfig.color }]}>
              {userRole === 'business' ? 'Transfer' : 'Redeem'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Recent Transactions */}
        <View style={styles.transactionsSection}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: theme.textColor }]}>
              Recent Transactions
            </Text>
            <TouchableOpacity>
              <Text style={[styles.viewAll, { color: roleConfig.color }]}>
                View All
              </Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.transactionsList}>
            {transactions.map((transaction) => (
              <TransactionCard key={transaction.id} transaction={transaction} />
            ))}
          </View>
        </View>

        <View style={styles.bottomSpacing} />
      </ScrollView>

      {/* Menu Modal */}
      <MenuModal
        visible={showMenu}
        onClose={() => setShowMenu(false)}
        userRole={userRole.toUpperCase().replace('-', '_') as any}
        userName={roleConfig.title}
        userLevel={6}
        onNavigate={(screen, params) => {
          navigation.navigate(screen, params);
        }}
        onSignOut={() => {
          navigation.navigate('Login');
        }}
      />
    </ScreenLayout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: THEME.SPACING.md,
    paddingVertical: THEME.SPACING.sm + 4,
    paddingTop: THEME.SPACING.sm,
  },
  backButton: {},
  headerTitle: {
    fontSize: THEME.TYPOGRAPHY.fontSize.lg,
    fontWeight: '700',
    flex: 1,
    textAlign: 'center',
    marginRight: THEME.SPACING.xl, // Compensate for wallet icon
  },
  walletIcon: {
    width: 32,
    height: 32,
    borderRadius: THEME.BORDER_RADIUS.xl,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Digital Wallet Card Styles (Similar to My Card Preview)
  walletCard: {
    margin: THEME.SPACING.md,
    marginTop: THEME.SPACING.sm,
    borderRadius: THEME.BORDER_RADIUS.xl,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  cardGradient: {
    padding: THEME.SPACING.md,
    minHeight: 200,
    position: 'relative',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: THEME.SPACING.md,
  },
  cardTitle: {
    flex: 1,
  },
  cardTitleText: {
    // color: theme.background,
    fontSize: THEME.TYPOGRAPHY.fontSize.lg,
    fontWeight: '700',
    marginBottom: 2,
  },
  cardSubtitleText: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: THEME.TYPOGRAPHY.fontSize.sm,
  },
  walletIdText: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: THEME.TYPOGRAPHY.fontSize.xs,
    marginTop: 2,
  },
  cardIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardBalance: {
    marginBottom: THEME.SPACING.md,
  },
  balanceLabel: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: THEME.TYPOGRAPHY.fontSize.sm,
    marginBottom: THEME.SPACING.sm,
  },
  balanceAmount: {
    // color: theme.background,
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: THEME.SPACING.sm,
  },
  secondaryBalance: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: THEME.TYPOGRAPHY.fontSize.base,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardChip: {
    width: 32,
    height: 24,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: THEME.BORDER_RADIUS.sm,
  },
  cardNumber: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: THEME.TYPOGRAPHY.fontSize.base,
    fontWeight: '500',
  },

  // Quick Actions
  quickActions: {
    flexDirection: 'row',
    paddingHorizontal: THEME.SPACING.md,
    marginBottom: THEME.SPACING.lg,
    gap: 8,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: THEME.SPACING.md,
    borderRadius: THEME.BORDER_RADIUS.lg,
    gap: 8,
  },
  secondaryAction: {
    backgroundColor: 'transparent',
    borderWidth: 2,
  },
  actionText: {
    fontSize: THEME.TYPOGRAPHY.fontSize.base,
    fontWeight: '600',
    // color: theme.background,
  },

  // Transactions Section
  transactionsSection: {
    paddingHorizontal: THEME.SPACING.md,
    marginBottom: THEME.SPACING.md,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: THEME.SPACING.md,
  },
  sectionTitle: {
    fontSize: THEME.TYPOGRAPHY.fontSize.lg,
    fontWeight: '700',
  },
  viewAll: {
    fontSize: THEME.TYPOGRAPHY.fontSize.sm,
    fontWeight: '500',
  },
  transactionsList: {
    gap: 8,
  },
  transactionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: THEME.SPACING.md,
    paddingHorizontal: THEME.SPACING.md,
    borderRadius: THEME.BORDER_RADIUS.lg,
    marginBottom: THEME.SPACING.sm,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  transactionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: THEME.SPACING.sm + 4,
  },
  transactionDetails: {
    flex: 1,
  },
  transactionDescription: {
    fontSize: THEME.TYPOGRAPHY.fontSize.base,
    fontWeight: '600',
    marginBottom: 2,
  },
  transactionDate: {
    fontSize: THEME.TYPOGRAPHY.fontSize.sm,
  },
  transactionAmount: {
    fontSize: THEME.TYPOGRAPHY.fontSize.base,
    fontWeight: '600',
  },
  bottomSpacing: {
    height: 100,
  },
});

export default WalletScreen;