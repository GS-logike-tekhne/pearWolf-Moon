import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getRoleColor } from '../utils/roleColors';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import UnifiedHeader from '../components/UnifiedHeader';
import MenuModal from '../components/MenuModal';
import { generateWalletId } from '../utils/generateWalletId';

const ProfileScreen = ({ navigation, route }: { navigation: any; route: any }) => {
  const { theme } = useTheme();
  const { user } = useAuth();
  const { role = 'impact-warrior', onSignOut } = route.params || {};
  const [showMenu, setShowMenu] = useState(false);

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
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <UnifiedHeader
        onMenuPress={() => setShowMenu(true)}
        role={role === 'admin' ? 'ADMIN' : role === 'business' ? 'BUSINESS' : role === 'trash-hero' ? 'TRASH_HERO' : 'VOLUNTEER'}
        points={role === 'admin' ? 0 : (role === 'trash-hero' ? 1240 : (role === 'business' ? 3450 : 2450))}
        onNotificationPress={() => navigation.navigate('Notifications')}
        onProfilePress={() => {}}
      />
      
      {/* Page Header */}
      <View style={styles.pageHeader}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color={getRoleColor(role)} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.textColor }]}>
          Profile Information
        </Text>
        <View style={{ width: 40 }} />
      </View>

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
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  pageHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backButton: {},
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  profileCard: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: 16,
    borderBottomWidth: 1,
  },
  avatarContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 4,
  },
  profileRole: {
    fontSize: 14,
    fontWeight: '500',
  },
  sectionContainer: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  infoContainer: {
    gap: 12,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 12,
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
    marginRight: 12,
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 12,
    fontWeight: '500',
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: '600',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  statusText: {
    color: 'white',
    fontSize: 10,
    fontWeight: '600',
  },
  bottomSpacing: {
    height: 40,
  },
});

export default ProfileScreen;