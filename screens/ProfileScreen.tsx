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
import PEARScreen from '../components/PEARScreen';
import UnifiedHeader from '../components/UnifiedHeader';
import { useAuth } from '../context/AuthContext';
import { useRoleManager } from '../hooks/useRoleManager';
import MenuModal from '../components/MenuModal';
import { generateWalletId } from '../utils/generateWalletId';

const ProfileScreen = ({ navigation, route }: { navigation: any; route: any }) => {
  const { theme } = useTheme();
  const { user } = useAuth();
  const { currentRole } = useRoleManager();
  const { onSignOut } = route.params || {};
  const [showMenu, setShowMenu] = useState(false);

  // Use current role from role manager, fallback to route param, then default
  const role = currentRole ? currentRole.toLowerCase().replace('_', '-') : 'trash-hero';

  // Generate wallet ID based on user and role
  const walletId = generateWalletId(user?.id || 1, role);

  // Sample user data - in real app this would come from user context/API
  const userData = {
    walletId: walletId,
    name: user?.name || 'Erin Chen',
    username: 'erinchen',
    email: user?.email || 'erin@example.com',
    phoneNumber: '(123) 456-7890',
    address: '123 Oak Street, Springfield, OH 45502',
    dateOfBirth: 'Sept 18, 1990',
    verificationStatus: 'approved',
    jobsCompleted: 47,
    hoursVolunteered: 128,
    totalEarnings: 480
  };

  const InfoRow = ({ label, value, icon }: { 
    label: string; 
    value: string; 
    icon: string;
  }) => (
    <View style={styles.infoRow}>
      <View style={styles.infoLeft}>
        <View style={[styles.iconContainer, { backgroundColor: `${getRoleColor(role)}20` }]}>
          <Ionicons name={icon as any} size={16} color={getRoleColor(role)} />
        </View>
        <Text style={styles.infoLabel}>{label}</Text>
      </View>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  );

  return (
    <View style={styles.screenContainer}>
      {/* Fixed Header */}
      <View style={styles.fixedHeader}>
        <UnifiedHeader
          onMenuPress={() => setShowMenu(true)}
          role={role.toUpperCase().replace('-', '_') as any}
          onNotificationPress={() => navigation.navigate('Notifications')}
          onProfilePress={() => navigation.goBack()}
        />
      </View>

      {/* Scrollable Content */}
      <ScrollView 
        style={styles.scrollableContent}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Account Info Card */}
        <View style={[styles.card, styles.accountInfoCard]}>
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
              label="Phone Number"
              value={userData.phoneNumber}
              icon="call"
            />
            <InfoRow 
              label="Address"
              value={userData.address}
              icon="location"
            />
            <InfoRow 
              label="Date of Birth"
              value={userData.dateOfBirth}
              icon="calendar"
            />
          </View>
        </View>

        {/* Verification & Security Card */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Ionicons name="shield-checkmark-outline" size={20} color="#666" />
            <Text style={styles.cardTitle}>Verification & Security</Text>
          </View>
          
          <View style={styles.infoContainer}>
            <InfoRow 
              label="PEAR Verified"
              value="✓"
              icon="checkmark-circle"
            />
            <InfoRow 
              label="Wallet ID"
              value={userData.walletId}
              icon="card"
            />
            <InfoRow 
              label="Password"
              value="••••••••"
              icon="lock-closed"
            />
            <View style={styles.infoRow}>
              <View style={styles.infoLeft}>
                <View style={[styles.iconContainer, { backgroundColor: `${getRoleColor(role)}20` }]}>
                  <Ionicons name="shield" size={16} color={getRoleColor(role)} />
                </View>
                <Text style={styles.infoLabel}>Two-Factor Authentication</Text>
              </View>
              <View style={[styles.toggleSwitch, { backgroundColor: getRoleColor(role) }]}>
                <View style={styles.toggleKnob} />
              </View>
            </View>
          </View>
        </View>

        {/* Stats Card */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Ionicons name="bar-chart-outline" size={20} color="#666" />
            <Text style={styles.cardTitle}>Stats</Text>
          </View>
          
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: getRoleColor(role) }]}>{userData.jobsCompleted}</Text>
              <Text style={styles.statLabel}>Jobs Completed</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: getRoleColor(role) }]}>{userData.hoursVolunteered}</Text>
              <Text style={styles.statLabel}>Hours Volunteered</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: getRoleColor(role) }]}>${userData.totalEarnings}</Text>
              <Text style={styles.statLabel}>Total Earnings</Text>
            </View>
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
              <Ionicons name="settings-outline" size={24} color={getRoleColor(role)} />
              <Text style={styles.quickActionText}>Settings</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.quickActionButton}>
              <Ionicons name="help-circle-outline" size={24} color={getRoleColor(role)} />
              <Text style={styles.quickActionText}>Help & Support</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.quickActionButton} onPress={onSignOut}>
              <Ionicons name="log-out-outline" size={24} color="#FF4444" />
              <Text style={[styles.quickActionText, { color: '#FF4444' }]}>Sign Out</Text>
            </TouchableOpacity>
          </View>
        </View>
        
      </ScrollView>

      {/* Menu Modal */}
      <MenuModal
        visible={showMenu}
        onClose={() => setShowMenu(false)}
        userRole={role.toUpperCase().replace('-', '_') as any}
        userName="TrashHero Pro"
        userLevel={6}
        onNavigate={(screen, params) => {
          console.log('Navigating to:', screen, params);
          navigation.navigate(screen, params);
        }}
        onSignOut={onSignOut}
      />
    </View>
  );
};

const { width } = Dimensions.get('window');

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
    paddingBottom: 100, // Increased to ensure content is visible above bottom navigation
    paddingHorizontal: 20, // Increased horizontal padding to bring containers in from edges
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 12, // Reduced from 20 to make cards more compact
    marginBottom: 12, // Reduced from 16 to bring cards closer together
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  accountInfoCard: {
    marginTop: 20, // Push the account info container down
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12, // Reduced from 16
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginLeft: 8,
  },
  infoContainer: {
    gap: 8, // Reduced from 12
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 6, // Reduced from 8
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
    marginRight: 10, // Reduced from 12
  },
  infoLabel: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  infoValue: {
    fontSize: 14,
    color: '#333',
    fontWeight: '400',
    textAlign: 'right',
  },
  toggleSwitch: {
    width: 44,
    height: 24,
    borderRadius: 12,
    padding: 2,
    justifyContent: 'center',
  },
  toggleKnob: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: 'white',
    alignSelf: 'flex-end',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  quickActionsContainer: {
    gap: 8, // Reduced from 12
  },
  quickActionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10, // Reduced from 12
    paddingHorizontal: 12, // Reduced from 16
    borderRadius: 8,
    backgroundColor: '#f8f9fa',
  },
  quickActionText: {
    fontSize: 16,
    color: '#333',
    marginLeft: 10, // Reduced from 12
    fontWeight: '500',
  },
});

export default ProfileScreen;