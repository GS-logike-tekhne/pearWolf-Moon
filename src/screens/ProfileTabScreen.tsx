import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { Text, Card, Button } from '../components/ui';
import { roleColors } from '../constants/theme';

const ProfileTabScreen: React.FC = () => {
  const { user, currentRole, logout } = useAuth();
  const { theme, isDark, toggleTheme } = useTheme();

  const roleColor = roleColors[currentRole];

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <Text variant="h1" color="primary">
            Profile
          </Text>
        </View>

        {/* User Info */}
        <Card style={styles.userCard}>
          <View style={styles.userHeader}>
            <View style={[styles.avatar, { backgroundColor: roleColor }]}>
              <Text variant="h2" color="primary" style={styles.avatarText}>
                {user?.name?.charAt(0) || 'U'}
              </Text>
            </View>
            <View style={styles.userInfo}>
              <Text variant="h3">{user?.name}</Text>
              <Text variant="body" color="textSecondary">
                @{user?.username}
              </Text>
              <View style={[styles.roleBadge, { backgroundColor: roleColor }]}>
                <Text variant="caption" color="primary" style={styles.roleText}>
                  {currentRole.replace('_', ' ')}
                </Text>
              </View>
            </View>
          </View>
        </Card>

        {/* Stats */}
        <Card style={styles.statsCard}>
          <Text variant="h3" style={styles.cardTitle}>
            Your Stats
          </Text>
          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <Text variant="h2" color="primary">
                {user?.ecoPoints || 0}
              </Text>
              <Text variant="caption" color="textSecondary">
                Eco Points
              </Text>
            </View>
            <View style={styles.statItem}>
              <Text variant="h2" color="primary">
                {user?.verificationLevel === 'background_check' ? '✓' : '○'}
              </Text>
              <Text variant="caption" color="textSecondary">
                Verified
              </Text>
            </View>
            <View style={styles.statItem}>
              <Text variant="h2" color="primary">
                {user?.email ? '✓' : '○'}
              </Text>
              <Text variant="caption" color="textSecondary">
                Email
              </Text>
            </View>
          </View>
        </Card>

        {/* Settings */}
        <Card style={styles.settingsCard}>
          <Text variant="h3" style={styles.cardTitle}>
            Settings
          </Text>
          
          <View style={styles.settingItem}>
            <Text variant="body">Dark Mode</Text>
            <Button
              title={isDark ? 'On' : 'Off'}
              variant={isDark ? 'primary' : 'outline'}
              size="small"
              onPress={toggleTheme}
            />
          </View>
          
          <View style={styles.settingItem}>
            <Text variant="body">Notifications</Text>
            <Button
              title="Manage"
              variant="outline"
              size="small"
              onPress={() => {}}
            />
          </View>
          
          <View style={styles.settingItem}>
            <Text variant="body">Privacy</Text>
            <Button
              title="Settings"
              variant="outline"
              size="small"
              onPress={() => {}}
            />
          </View>
        </Card>

        {/* Actions */}
        <Card style={styles.actionsCard}>
          <Text variant="h3" style={styles.cardTitle}>
            Account Actions
          </Text>
          
          <Button
            title="Edit Profile"
            variant="outline"
            fullWidth
            style={styles.actionButton}
            onPress={() => {}}
          />
          
          <Button
            title="Sign Out"
            variant="outline"
            fullWidth
            style={[styles.actionButton, styles.logoutButton]}
            onPress={handleLogout}
          />
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    padding: 20,
    paddingBottom: 10,
  },
  userCard: {
    margin: 16,
    marginTop: 0,
  },
  userHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  avatarText: {
    color: 'white',
    fontWeight: 'bold',
  },
  userInfo: {
    flex: 1,
  },
  roleBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
    marginTop: 4,
  },
  roleText: {
    color: 'white',
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  statsCard: {
    margin: 16,
    marginTop: 0,
  },
  cardTitle: {
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  settingsCard: {
    margin: 16,
    marginTop: 0,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  actionsCard: {
    margin: 16,
    marginTop: 0,
    marginBottom: 20,
  },
  actionButton: {
    marginBottom: 12,
  },
  logoutButton: {
    borderColor: '#F44336',
  },
});

export default ProfileTabScreen;
