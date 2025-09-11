import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { walletAPI, Transaction, apiUtils } from '../services/api';

interface TransactionHistoryProps {
  userId?: string;
  onTransactionPress?: (transaction: Transaction) => void;
}

const TransactionHistory: React.FC<TransactionHistoryProps> = ({
  userId,
  onTransactionPress,
}) => {
  const { theme } = useTheme();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState<'all' | 'earned' | 'spent' | 'donated' | 'withdrawn'>('all');

  // Mock data for development
  const mockTransactions: Transaction[] = [
    {
      id: '1',
      userId: '1',
      type: 'earned',
      amount: 150,
      currency: 'ecoPoints',
      description: 'Completed Beach Cleanup Mission',
      missionId: 'mission_1',
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
    },
    {
      id: '2',
      userId: '1',
      type: 'earned',
      amount: 75,
      currency: 'xp',
      description: 'Daily Quest: Clean up 2 trash bags',
      createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(), // 4 hours ago
    },
    {
      id: '3',
      userId: '1',
      type: 'donated',
      amount: 50,
      currency: 'ecoPoints',
      description: 'Donated to River Cleanup Initiative',
      missionId: 'mission_2',
      createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
    },
    {
      id: '4',
      userId: '1',
      type: 'earned',
      amount: 200,
      currency: 'ecoPoints',
      description: 'Completed Park Restoration Project',
      missionId: 'mission_3',
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
    },
    {
      id: '5',
      userId: '1',
      type: 'withdrawn',
      amount: 25.50,
      currency: 'usd',
      description: 'Withdrawal to Bank Account',
      createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
    },
    {
      id: '6',
      userId: '1',
      type: 'earned',
      amount: 100,
      currency: 'ecoPoints',
      description: 'Completed Urban Park Cleanup',
      missionId: 'mission_4',
      createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days ago
    },
    {
      id: '7',
      userId: '1',
      type: 'spent',
      amount: 30,
      currency: 'ecoPoints',
      description: 'Purchased Premium Badge',
      createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 1 week ago
    },
  ];

  const loadTransactions = async () => {
    try {
      setIsLoading(true);
      
      // Try API first, fallback to mock data
      try {
        const response = await walletAPI.getTransactions({
          type: filter === 'all' ? undefined : filter,
          limit: 50,
        });
        
        if (response.success && response.data) {
          setTransactions(response.data);
          return;
        }
      } catch (apiError) {
        console.log('API failed, using mock data:', apiUtils.handleError(apiError));
      }
      
      // Use mock data
      const filteredMockData = filter === 'all' 
        ? mockTransactions 
        : mockTransactions.filter(t => t.type === filter);
      
      setTransactions(filteredMockData);
    } catch (error) {
      console.error('Error loading transactions:', error);
      setTransactions([]);
    } finally {
      setIsLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadTransactions();
    setRefreshing(false);
  };

  useEffect(() => {
    loadTransactions();
  }, [filter]);

  const getTransactionIcon = (type: Transaction['type']) => {
    switch (type) {
      case 'earned':
        return { name: 'add-circle', color: '#28A745' };
      case 'spent':
        return { name: 'remove-circle', color: '#dc3545' };
      case 'donated':
        return { name: 'heart', color: '#e91e63' };
      case 'withdrawn':
        return { name: 'arrow-up-circle', color: '#ffc107' };
      default:
        return { name: 'help-circle', color: theme.secondaryText };
    }
  };

  const getTransactionTypeLabel = (type: Transaction['type']) => {
    switch (type) {
      case 'earned':
        return 'Earned';
      case 'spent':
        return 'Spent';
      case 'donated':
        return 'Donated';
      case 'withdrawn':
        return 'Withdrawn';
      default:
        return 'Transaction';
    }
  };

  const formatAmount = (amount: number, currency: Transaction['currency']) => {
    const sign = ['earned', 'donated'].includes(transactions.find(t => t.amount === amount)?.type || '') ? '+' : '-';
    
    switch (currency) {
      case 'ecoPoints':
        return `${sign}${amount} EP`;
      case 'xp':
        return `${sign}${amount} XP`;
      case 'usd':
        return `${sign}$${amount.toFixed(2)}`;
      default:
        return `${sign}${amount}`;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) {
      return 'Just now';
    } else if (diffInHours < 24) {
      return `${diffInHours}h ago`;
    } else if (diffInHours < 48) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString();
    }
  };

  const filters = [
    { id: 'all', label: 'All', icon: 'list' },
    { id: 'earned', label: 'Earned', icon: 'trending-up' },
    { id: 'spent', label: 'Spent', icon: 'trending-down' },
    { id: 'donated', label: 'Donated', icon: 'heart' },
    { id: 'withdrawn', label: 'Withdrawn', icon: 'arrow-up' },
  ] as const;

  const FilterChip = ({ filterItem }: { filterItem: typeof filters[number] }) => (
    <TouchableOpacity
      style={[
        styles.filterChip,
        { borderColor: theme.borderColor },
        filter === filterItem.id && {
          backgroundColor: theme.primary,
          borderColor: theme.primary,
        },
      ]}
      onPress={() => setFilter(filterItem.id as any)}
    >
      <Ionicons
        name={filterItem.icon}
        size={16}
        color={filter === filterItem.id ? 'white' : theme.primary}
      />
      <Text
        style={[
          styles.filterText,
          { color: theme.secondaryText },
          filter === filterItem.id && { color: 'white' },
        ]}
      >
        {filterItem.label}
      </Text>
    </TouchableOpacity>
  );

  const TransactionItem = ({ transaction }: { transaction: Transaction }) => {
    const icon = getTransactionIcon(transaction.type);
    const typeLabel = getTransactionTypeLabel(transaction.type);
    
    return (
      <TouchableOpacity
        style={[styles.transactionItem, { backgroundColor: theme.cardBackground }]}
        onPress={() => onTransactionPress?.(transaction)}
        activeOpacity={0.7}
      >
        <View style={styles.transactionLeft}>
          <View style={[styles.transactionIcon, { backgroundColor: icon.color }]}>
            <Ionicons name={icon.name} size={20} color="white" />
          </View>
          <View style={styles.transactionInfo}>
            <Text style={[styles.transactionDescription, { color: theme.textColor }]}>
              {transaction.description}
            </Text>
            <Text style={[styles.transactionType, { color: theme.secondaryText }]}>
              {typeLabel} • {formatDate(transaction.createdAt)}
            </Text>
          </View>
        </View>
        
        <View style={styles.transactionRight}>
          <Text
            style={[
              styles.transactionAmount,
              {
                color: ['earned', 'donated'].includes(transaction.type)
                  ? '#28A745'
                  : '#dc3545',
              },
            ]}
          >
            {formatAmount(transaction.amount, transaction.currency)}
          </Text>
          {transaction.missionId && (
            <Ionicons name="chevron-forward" size={16} color={theme.secondaryText} />
          )}
        </View>
      </TouchableOpacity>
    );
  };

  if (isLoading && !refreshing) {
    return (
      <View style={[styles.container, { backgroundColor: theme.cardBackground }]}>
        <Text style={[styles.loadingText, { color: theme.textColor }]}>
          Loading transaction history...
        </Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.cardBackground }]}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.textColor }]}>Transaction History</Text>
        <Text style={[styles.subtitle, { color: theme.secondaryText }]}>
          {transactions.length} transactions
        </Text>
      </View>

      {/* Filter Chips */}
      <ScrollView
        showsHorizontalScrollIndicator={false}
        style={styles.filterContainer}
      >
        {filters.map((filterItem) => (
          <FilterChip key={filterItem.id} filterItem={filterItem} />
        ))}
      </ScrollView>

      {/* Transaction List */}
      <ScrollView
        style={styles.transactionList}
        showsVerticalScrollIndicator={false}
      >
        {transactions.length > 0 ? (
          transactions.map((transaction) => (
            <TransactionItem key={transaction.id} transaction={transaction} />
          ))
        ) : (
          <View style={styles.emptyState}>
            <Ionicons name="receipt-outline" size={48} color={theme.secondaryText} />
            <Text style={[styles.emptyTitle, { color: theme.textColor }]}>
              No transactions found
            </Text>
            <Text style={[styles.emptyDescription, { color: theme.secondaryText }]}>
              {filter === 'all'
                ? 'Complete missions to start earning rewards!'
                : `No ${filter} transactions found.`}
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderRadius: 16,
    padding: 16,
    margin: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  header: {
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
  },
  filterContainer: {
    marginBottom: 16,
    paddingRight: 16,
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: 'transparent',
    borderRadius: 16,
    marginRight: 8,
    gap: 4,
    borderWidth: 1,
  },
  filterText: {
    fontSize: 12,
    fontWeight: '600',
  },
  transactionList: {
    flex: 1,
  },
  transactionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    borderRadius: 12,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  transactionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 12,
  },
  transactionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  transactionInfo: {
    flex: 1,
  },
  transactionDescription: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 2,
  },
  transactionType: {
    fontSize: 12,
  },
  transactionRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  transactionAmount: {
    fontSize: 14,
    fontWeight: '700',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 12,
    marginBottom: 4,
  },
  emptyDescription: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
  loadingText: {
    textAlign: 'center',
    padding: 20,
    fontSize: 16,
  },
});

export default TransactionHistory;
