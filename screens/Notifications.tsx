import React from 'react';
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
import UnifiedHeader from '../components/UnifiedHeader';
import MenuModal from '../components/MenuModal';

const Notifications = ({ navigation, route }: { navigation: any; route: any }) => {
  const { theme } = useTheme();
  const { role = 'impact-warrior' } = route.params || {};
  const [showMenu, setShowMenu] = React.useState(false);

  const notifications = [
    {
      id: 1,
      title: 'New Mission Available',
      message: 'Beach cleanup mission posted near your location',
      time: '2 hours ago',
      type: 'mission',
      unread: true
    },
    {
      id: 2,
      title: 'Payment Processed',
      message: 'Your earnings of $85 have been processed',
      time: '1 day ago',
      type: 'payment',
      unread: true
    },
    {
      id: 3,
      title: 'Achievement Unlocked',
      message: 'You earned the "Eco Champion" badge!',
      time: '2 days ago',
      type: 'achievement',
      unread: false
    },
    {
      id: 4,
      title: 'Mission Completed',
      message: 'Park cleanup mission successfully completed',
      time: '3 days ago',
      type: 'mission',
      unread: false
    },
  ];

  const NotificationCard = ({ notification }: { notification: any }) => (
    <TouchableOpacity 
      style={[
        styles.notificationCard, 
        { 
          backgroundColor: theme.cardBackground, 
          borderColor: theme.borderColor,
          opacity: notification.unread ? 1 : 0.7
        }
      ]}
    >
      <View style={styles.notificationIcon}>
        <Ionicons 
          name={
            notification.type === 'mission' ? 'briefcase' :
            notification.type === 'payment' ? 'cash' :
            notification.type === 'achievement' ? 'trophy' : 'information-circle'
          } 
          size={24} 
          color={theme.primary} 
        />
      </View>
      <View style={styles.notificationContent}>
        <Text style={[styles.notificationTitle, { color: theme.textColor }]}>
          {notification.title}
        </Text>
        <Text style={[styles.notificationMessage, { color: theme.secondaryText }]}>
          {notification.message}
        </Text>
        <Text style={[styles.notificationTime, { color: theme.secondaryText }]}>
          {notification.time}
        </Text>
      </View>
      {notification.unread && (
        <View style={[styles.unreadDot, { backgroundColor: theme.primary }]} />
      )}
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <UnifiedHeader
        onMenuPress={() => setShowMenu(true)}
        role={role}
        points={role === 'admin' ? 0 : 1240}
        onNotificationPress={() => {}}
        onProfilePress={() => navigation.navigate('ProfileScreen', { 
          role,
          onSignOut: () => navigation.navigate('Login')
        })}
      />
      
      {/* Page Header */}
      <View style={[styles.pageHeader, { backgroundColor: theme.cardBackground }]}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color={getRoleColor(role)} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.textColor }]}>
          Notifications
        </Text>
        <View style={{ width: 32, height: 32 }} />
      </View>
      
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.headerSection}>
          <View style={styles.titleContainer}>
            <Ionicons name="notifications" size={32} color={theme.primary} />
            <View style={styles.titleText}>
              <Text style={[styles.screenTitle, { color: theme.textColor }]}>Notifications</Text>
              <Text style={[styles.screenSubtitle, { color: theme.secondaryText }]}>
                Stay updated with your latest activities
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.notificationsSection}>
          {notifications.map((notification) => (
            <NotificationCard key={notification.id} notification={notification} />
          ))}
        </View>

        <View style={styles.bottomSpacing} />
      </ScrollView>
      <MenuModal
        visible={showMenu}
        onClose={() => setShowMenu(false)}
        userRole={role === 'admin' ? 'ADMIN' : role === 'business' ? 'BUSINESS' : role === 'trash-hero' ? 'TRASH_HERO' : 'VOLUNTEER'}
        onNavigate={(screen, params) => navigation.navigate(screen, params)}
        onSignOut={() => navigation.navigate('Login')}
      />
    </View>
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
    paddingTop: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  backButton: {},
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  headerSection: {
    marginBottom: 24,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  titleText: {
    marginLeft: 12,
    flex: 1,
  },
  screenTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  screenSubtitle: {
    fontSize: 14,
    fontWeight: '500',
  },
  notificationsSection: {
    marginBottom: 20,
  },
  notificationCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  notificationIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(0,0,0,0.05)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  notificationContent: {
    flex: 1,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  notificationMessage: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 4,
  },
  notificationTime: {
    fontSize: 12,
    fontWeight: '500',
  },
  unreadDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  bottomSpacing: {
    height: 20,
  },
});

export default Notifications;