import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  TextInput,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getRoleColor } from '../utils/roleColors';
import { useTheme } from '../context/ThemeContext';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'TRASH_HERO' | 'VOLUNTEER' | 'BUSINESS' | 'ADMIN';
  status: 'active' | 'suspended' | 'pending';
  joinDate: string;
  totalJobs: number;
  earnings?: number;
}

interface UserManagementProps {
  navigation: any;
}

const UserManagement: React.FC<UserManagementProps> = ({ navigation }) => {
  const { theme } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [users] = useState<User[]>([
    {
      id: '1',
      name: 'John Smith',
      email: 'john@example.com',
      role: 'TRASH_HERO',
      status: 'active',
      joinDate: '2024-01-15',
      totalJobs: 24,
      earnings: 1240,
    },
    {
      id: '2',
      name: 'Sarah Johnson',
      email: 'sarah@example.com',
      role: 'VOLUNTEER',
      status: 'active',
      joinDate: '2024-02-20',
      totalJobs: 12,
    },
    {
      id: '3',
      name: 'Mike Wilson',
      email: 'mike@example.com',
      role: 'TRASH_HERO',
      status: 'pending',
      joinDate: '2024-03-01',
      totalJobs: 0,
    },
    {
      id: '4',
      name: 'EcoClean Corp',
      email: 'contact@ecoclean.com',
      role: 'BUSINESS',
      status: 'active',
      joinDate: '2024-01-10',
      totalJobs: 45,
    },
  ]);

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'TRASH_HERO': return '#28A745';
      case 'VOLUNTEER': return '#007bff';
      case 'BUSINESS': return '#8b5cf6';
      case 'ADMIN': return '#dc3545';
      default: return theme.primary;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return '#28a745';
      case 'pending': return '#ffc107';
      case 'suspended': return '#dc3545';
      default: return theme.secondaryText;
    }
  };

  const handleUserAction = (user: User, action: string) => {
    Alert.alert(
      'Confirm Action',
      `Are you sure you want to ${action} ${user.name}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Confirm',
          onPress: () => {
            // Handle user action
            Alert.alert('Success', `User ${action} successfully`);
          },
        },
      ]
    );
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = selectedFilter === 'all' || user.status === selectedFilter || user.role === selectedFilter;
    return matchesSearch && matchesFilter;
  });

  const UserCard = ({ user }: { user: User }) => (
    <View style={[styles.userCard, { backgroundColor: theme.cardBackground }]}>
      <View style={styles.userHeader}>
        <View style={styles.userInfo}>
          <Text style={[styles.userName, { color: theme.textColor }]}>{user.name}</Text>
          <Text style={[styles.userEmail, { color: theme.secondaryText }]}>{user.email}</Text>
        </View>
        <View style={styles.badges}>
          <View style={[styles.roleBadge, { backgroundColor: getRoleColor(user.role) }]}>
            <Text style={styles.badgeText}>{user.role}</Text>
          </View>
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor(user.status) }]}>
            <Text style={styles.badgeText}>{user.status}</Text>
          </View>
        </View>
      </View>

      <View style={styles.userStats}>
        <View style={styles.stat}>
          <Text style={[styles.statValue, { color: theme.textColor }]}>{user.totalJobs}</Text>
          <Text style={[styles.statLabel, { color: theme.secondaryText }]}>Jobs</Text>
        </View>
        {user.earnings && (
          <View style={styles.stat}>
            <Text style={[styles.statValue, { color: theme.textColor }]}>${user.earnings}</Text>
            <Text style={[styles.statLabel, { color: theme.secondaryText }]}>Earnings</Text>
          </View>
        )}
        <View style={styles.stat}>
          <Text style={[styles.statValue, { color: theme.textColor }]}>
            {new Date(user.joinDate).toLocaleDateString()}
          </Text>
          <Text style={[styles.statLabel, { color: theme.secondaryText }]}>Joined</Text>
        </View>
      </View>

      <View style={styles.userActions}>
        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: '#007bff' }]}
          onPress={() => navigation.navigate('UserProfile', { userId: user.id })}
        >
          <Ionicons name="person" size={16} color="white" />
          <Text style={styles.actionButtonText}>View</Text>
        </TouchableOpacity>
        
        {user.status === 'pending' && (
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: '#28a745' }]}
            onPress={() => handleUserAction(user, 'approve')}
          >
            <Ionicons name="checkmark" size={16} color="white" />
            <Text style={styles.actionButtonText}>Approve</Text>
          </TouchableOpacity>
        )}
        
        {user.status === 'active' && (
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: '#ffc107' }]}
            onPress={() => handleUserAction(user, 'suspend')}
          >
            <Ionicons name="pause" size={16} color="white" />
            <Text style={styles.actionButtonText}>Suspend</Text>
          </TouchableOpacity>
        )}
        
        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: '#dc3545' }]}
          onPress={() => handleUserAction(user, 'delete')}
        >
          <Ionicons name="trash" size={16} color="white" />
          <Text style={styles.actionButtonText}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: theme.cardBackground }]}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#fd7e14" />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.textColor }]}>
          User Management
        </Text>
        <TouchableOpacity style={styles.addButton}>
          <Ionicons name="add" size={24} color={theme.textColor} />
        </TouchableOpacity>
      </View>

      {/* Search and Filters */}
      <View style={styles.searchSection}>
        <View style={[styles.searchContainer, { backgroundColor: theme.cardBackground }]}>
          <Ionicons name="search" size={20} color={theme.secondaryText} />
          <TextInput
            style={[styles.searchInput, { color: theme.textColor }]}
            placeholder="Search users..."
            placeholderTextColor={theme.secondaryText}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
        
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filtersContainer}>
          {['all', 'active', 'pending', 'suspended', 'TRASH_HERO', 'VOLUNTEER', 'BUSINESS'].map(filter => (
            <TouchableOpacity
              key={filter}
              style={[
                styles.filterButton,
                { backgroundColor: selectedFilter === filter ? theme.primary : theme.cardBackground }
              ]}
              onPress={() => setSelectedFilter(filter)}
            >
              <Text style={[
                styles.filterText,
                { color: selectedFilter === filter ? 'white' : theme.textColor }
              ]}>
                {filter.replace('_', ' ').toLowerCase()}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Users List */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.usersContainer}>
          {filteredUsers.map(user => (
            <UserCard key={user.id} user={user} />
          ))}
        </View>
        <View style={styles.bottomSpacing} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingTop: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  addButton: {
    padding: 8,
  },
  searchSection: {
    padding: 16,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    marginBottom: 12,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
  },
  filtersContainer: {
    flexDirection: 'row',
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
  },
  filterText: {
    fontSize: 14,
    fontWeight: '500',
    textTransform: 'capitalize',
  },
  content: {
    flex: 1,
  },
  usersContainer: {
    paddingHorizontal: 16,
  },
  userCard: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  userHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
  },
  badges: {
    alignItems: 'flex-end',
    gap: 4,
  },
  roleBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeText: {
    color: 'white',
    fontSize: 10,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  userStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  stat: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 12,
  },
  userActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    gap: 8,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    gap: 4,
  },
  actionButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  bottomSpacing: {
    height: 40,
  },
});

export default UserManagement;