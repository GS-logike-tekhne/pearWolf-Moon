import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
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
  const role = currentRole ? currentRole.toLowerCase().replace('_', '-') : 'impact-warrior';

  // Generate wallet ID based on user and role
  const walletId = generateWalletId(user?.id || 1, role);


  // Sample registration data - in real app this would come from user context/API
  const registrationData = {
    walletId: walletId,
    name: user?.name || 'John Doe',
    dateOfBirth: '1995-03-15',
    email: user?.email || 'john.doe@email.com',
    phoneNumber: '+1 (555) 123-4567',
    verificationStatus: 'approved' // 'pending' or 'approved'
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const InfoRow = ({ label, value, icon, status }: { 
    label: string; 
    value: string; 
    icon: string; 
    status?: 'pending' | 'approved' 
  }) => (
    <View style={[styles.infoRow, { backgroundColor: theme.cardBackground }]}>
      <View style={styles.infoLeft}>
        <View style={[styles.iconContainer, { backgroundColor: `${getRoleColor(role)}20` }]}>
          <Ionicons name={icon as any} size={20} color={getRoleColor(role)} />
        </View>
        <View style={styles.infoContent}>
          <Text style={[styles.infoLabel, { color: theme.secondaryText }]}>{label}</Text>
          <Text style={[styles.infoValue, { color: theme.textColor }]}>{value}</Text>
        </View>
      </View>
      {status && (
        <View style={[
          styles.statusBadge, 
          { backgroundColor: status === 'approved' ? theme.success : theme.warning }
        ]}>
          <Ionicons 
            name={status === 'approved' ? 'checkmark' : 'time'} 
            size={12} 
            color="white" 
          />
          <Text style={styles.statusText}>
            {status === 'approved' ? 'Verified' : 'Pending'}
          </Text>
        </View>
      )}
    </View>
  );

  return (
    <PEARScreen
      title="Profile Information"
      role={role.toUpperCase().replace('-', '_') as any}
      showHeader={false}
      showScroll={true}
      enableRefresh={true}
      onRefresh={() => {
        console.log('Refreshing profile...');
      }}
      refreshing={false}
      navigation={navigation}
      backgroundColor="white"
    >
      {/* Unified Header */}
      <UnifiedHeader
        onMenuPress={() => setShowMenu(true)}
        role={role.toUpperCase().replace('-', '_') as any}
        onNotificationPress={() => navigation.navigate('Notifications')}
        onProfilePress={() => navigation.goBack()}
      />

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Profile Card */}
        <View style={[styles.profileCard, { backgroundColor: theme.cardBackground }]}>
          <View style={[styles.profileHeader, { borderBottomColor: theme.borderColor }]}>
            <View style={[styles.avatarContainer, { backgroundColor: getRoleColor(role) }]}>
              <Ionicons 
                name="person" 
                size={32} 
                color="white" 
              />
            </View>
            <View style={styles.profileInfo}>
              <Text style={[styles.profileName, { color: theme.textColor }]}>
                {registrationData.name}
              </Text>
              <Text style={[styles.profileRole, { color: theme.secondaryText }]}>
                {role === 'admin' ? 'Platform Administrator' :
                 role === 'trash-hero' ? 'Trash Hero Professional' :
                 role === 'business' ? 'EcoDefender Business' :
                 'Impact Warrior Volunteer'}
              </Text>
            </View>
          </View>
        </View>

        {/* Registration Information */}
        <View style={styles.sectionContainer}>
          <Text style={[styles.sectionTitle, { color: theme.textColor }]}>
            Registration Information
          </Text>
          
          <View style={styles.infoContainer}>
            <InfoRow 
              label="Wallet ID"
              value={registrationData.walletId}
              icon="card"
            />
            
            <InfoRow 
              label="Full Name"
              value={registrationData.name}
              icon="person"
            />
            
            <InfoRow 
              label="Date of Birth"
              value={formatDate(registrationData.dateOfBirth)}
              icon="calendar"
            />
            
            <InfoRow 
              label="Email Address"
              value={registrationData.email}
              icon="mail"
              status={registrationData.verificationStatus as 'pending' | 'approved'}
            />
            
            <InfoRow 
              label="Phone Number"
              value={registrationData.phoneNumber}
              icon="call"
              status={registrationData.verificationStatus as 'pending' | 'approved'}
            />
          </View>
        </View>

        <View style={styles.bottomSpacing} />
      </ScrollView>

      {/* Menu Modal */}
      <MenuModal
        visible={showMenu}
        onClose={() => setShowMenu(false)}
        userRole={role.toUpperCase().replace('-', '_') as any}
        userName={registrationData.name}
        userLevel={6}
        onNavigate={(screen, params) => {
          navigation.navigate(screen, params);
        }}
        onSignOut={() => {
          if (onSignOut) {
            onSignOut();
          } else {
            navigation.navigate('Login');
          }
        }}
      />
    </PEARScreen>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: THEME.SPACING.md,
  },
  profileCard: {
    borderRadius: THEME.BORDER_RADIUS.xl,
    padding: THEME.SPACING.md,
    marginBottom: THEME.SPACING.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: THEME.SPACING.md,
    borderBottomWidth: 1,
  },
  avatarContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: THEME.SPACING.md,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: THEME.TYPOGRAPHY.fontSize.xl,
    fontWeight: '700',
    marginBottom: THEME.SPACING.xs,
  },
  profileRole: {
    fontSize: THEME.TYPOGRAPHY.fontSize.sm,
    fontWeight: '500',
  },
  sectionContainer: {
    marginBottom: THEME.SPACING.lg,
  },
  sectionTitle: {
    fontSize: THEME.TYPOGRAPHY.fontSize.lg,
    fontWeight: '600',
    marginBottom: THEME.SPACING.md,
  },
  infoContainer: {
    gap: 12,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: THEME.SPACING.md,
    borderRadius: THEME.BORDER_RADIUS.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  infoLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: THEME.SPACING.sm + 4,
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: THEME.TYPOGRAPHY.fontSize.xs,
    fontWeight: '500',
    marginBottom: 2,
  },
  infoValue: {
    fontSize: THEME.TYPOGRAPHY.fontSize.base,
    fontWeight: '600',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: THEME.SPACING.sm,
    paddingVertical: THEME.SPACING.xs,
    borderRadius: THEME.BORDER_RADIUS.lg,
    gap: 4,
  },
  statusText: {
    // color: theme.background,
    fontSize: THEME.TYPOGRAPHY.fontSize.xs,
    fontWeight: '600',
  },
  bottomSpacing: {
    height: 40,
  },
});

export default ProfileScreen;