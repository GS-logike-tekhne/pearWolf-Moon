import React from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../contexts/AuthContext';
import { useXP } from '../contexts/XPContext';
import { useTheme } from '../contexts/ThemeContext';
import { Text, Card, ProgressBar, Button } from '../components/ui';
import { roleColors } from '../constants/theme';

const DashboardScreen: React.FC = () => {
  const { user, currentRole } = useAuth();
  const { xpData, addXP } = useXP();
  const { theme } = useTheme();
  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    // Simulate refresh
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  }, []);

  const handleAddXP = () => {
    addXP(50, 'demo_action');
  };

  const roleColor = roleColors[currentRole];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Header */}
        <View style={[styles.header, { backgroundColor: roleColor }]}>
          <Text variant="h2" color="primary" style={styles.welcomeText}>
            Welcome back, {user?.name}!
          </Text>
          <Text variant="body" color="textSecondary" style={styles.roleText}>
            {currentRole.replace('_', ' ')}
          </Text>
        </View>

        {/* XP Progress */}
        <Card style={styles.xpCard}>
          <View style={styles.xpHeader}>
            <Text variant="h3">Level Progress</Text>
            <Text variant="caption" color="textSecondary">
              Level {xpData.currentLevel}
            </Text>
          </View>
          
          <Text variant="h2" color="primary" style={styles.levelTitle}>
            {xpData.levelTitle}
          </Text>
          
          <View style={styles.progressContainer}>
            <ProgressBar
              progress={xpData.progressPercent}
              color={roleColor}
              height={12}
            />
            <View style={styles.progressText}>
              <Text variant="caption" color="textSecondary">
                {xpData.xpInCurrentLevel} / {xpData.xpForNextLevel} XP
              </Text>
              <Text variant="caption" color="textSecondary">
                {xpData.totalXP} total XP
              </Text>
            </View>
          </View>

          <Button
            title="Add Demo XP"
            onPress={handleAddXP}
            variant="outline"
            size="small"
            style={styles.demoButton}
          />
        </Card>

        {/* Stats Cards */}
        <View style={styles.statsContainer}>
          <Card style={styles.statCard}>
            <Text variant="h2" color="primary">
              {user?.ecoPoints || 0}
            </Text>
            <Text variant="caption" color="textSecondary">
              Eco Points
            </Text>
          </Card>
          
          <Card style={styles.statCard}>
            <Text variant="h2" color="primary">
              {xpData.weeklyXP}
            </Text>
            <Text variant="caption" color="textSecondary">
              This Week
            </Text>
          </Card>
          
          <Card style={styles.statCard}>
            <Text variant="h2" color="primary">
              {xpData.streak}
            </Text>
            <Text variant="caption" color="textSecondary">
              Day Streak
            </Text>
          </Card>
        </View>

        {/* Recent Badges */}
        <Card style={styles.badgesCard}>
          <Text variant="h3" style={styles.sectionTitle}>
            Recent Badges
          </Text>
          
          <View style={styles.badgesContainer}>
            {xpData.badges.slice(0, 3).map((badge) => (
              <View key={badge.id} style={styles.badgeItem}>
                <Text variant="h2" style={styles.badgeIcon}>
                  {badge.icon}
                </Text>
                <Text variant="caption" color="textSecondary" align="center">
                  {badge.name}
                </Text>
              </View>
            ))}
          </View>
        </Card>

        {/* Quick Actions */}
        <Card style={styles.actionsCard}>
          <Text variant="h3" style={styles.sectionTitle}>
            Quick Actions
          </Text>
          
          <View style={styles.actionsContainer}>
            <Button
              title="Find Missions"
              onPress={() => {}}
              style={styles.actionButton}
            />
            <Button
              title="View Map"
              onPress={() => {}}
              variant="outline"
              style={styles.actionButton}
            />
          </View>
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
    paddingTop: 10,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  welcomeText: {
    color: 'white',
    marginBottom: 4,
  },
  roleText: {
    color: 'white',
    opacity: 0.9,
    textTransform: 'capitalize',
  },
  xpCard: {
    margin: 16,
    marginTop: 20,
  },
  xpHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  levelTitle: {
    marginBottom: 16,
  },
  progressContainer: {
    marginBottom: 16,
  },
  progressText: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  demoButton: {
    alignSelf: 'flex-start',
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  statCard: {
    flex: 1,
    marginHorizontal: 4,
    alignItems: 'center',
    paddingVertical: 16,
  },
  badgesCard: {
    margin: 16,
    marginTop: 0,
  },
  sectionTitle: {
    marginBottom: 16,
  },
  badgesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  badgeItem: {
    alignItems: 'center',
  },
  badgeIcon: {
    marginBottom: 8,
  },
  actionsCard: {
    margin: 16,
    marginTop: 0,
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    flex: 1,
    marginHorizontal: 4,
  },
});

export default DashboardScreen;
