import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { THEME } from '../styles/theme';
import { analyticsAPI, Analytics, apiUtils } from '../services/api';
import ScreenLayout from '../components/ScreenLayout';
import CustomLineChart from '../components/CustomLineChart';
import CustomBarChart from '../components/CustomBarChart';

const { width } = Dimensions.get('window');

const AdminAnalytics: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { theme } = useTheme();
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'year'>('month');

  // Mock analytics data
  const mockAnalytics: Analytics = {
    totalUsers: 1247,
    totalMissions: 342,
    totalEcoPointsDistributed: 15680,
    totalCleanupsCompleted: 298,
    topPerformingRoles: [
      {
        role: 'TRASH_HERO',
        missionsCompleted: 156,
        ecoPointsEarned: 7840,
      },
      {
        role: 'IMPACT_WARRIOR',
        missionsCompleted: 89,
        ecoPointsEarned: 4450,
      },
      {
        role: 'ECO_DEFENDER',
        missionsCompleted: 53,
        ecoPointsEarned: 3390,
      },
    ],
    monthlyStats: [
      { month: 'Jan', missions: 28, ecoPoints: 1240, users: 89 },
      { month: 'Feb', missions: 35, ecoPoints: 1560, users: 112 },
      { month: 'Mar', missions: 42, ecoPoints: 1890, users: 134 },
      { month: 'Apr', missions: 38, ecoPoints: 1710, users: 121 },
      { month: 'May', missions: 45, ecoPoints: 2025, users: 145 },
      { month: 'Jun', missions: 52, ecoPoints: 2340, users: 167 },
    ],
  };

  const loadAnalytics = async () => {
    try {
      setIsLoading(true);
      
      // Try API first, fallback to mock data
      try {
        const response = await analyticsAPI.getDashboardStats();
        if (response.success && response.data) {
          setAnalytics(response.data);
          return;
        }
      } catch (apiError) {
        console.log('API failed, using mock data:', apiUtils.handleError(apiError));
      }
      
      // Use mock data
      setAnalytics(mockAnalytics);
    } catch (error) {
      console.error('Error loading analytics:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadAnalytics();
    setRefreshing(false);
  };

  useEffect(() => {
    loadAnalytics();
  }, [selectedPeriod]);

  const StatCard = ({ title, value, icon, color, subtitle }: {
    title: string;
    value: string | number;
    icon: string;
    color: string;
    subtitle?: string;
  }) => (
    <View style={[styles.statCard, { backgroundColor: theme.cardBackground }]}>
      <View style={[styles.statIcon, { backgroundColor: color + '20' }]}>
        <Ionicons name={icon} size={24} color={color} />
      </View>
      <View style={styles.statContent}>
        <Text style={[styles.statValue, { color: theme.textColor }]}>{value}</Text>
        <Text style={[styles.statTitle, { color: theme.secondaryText }]}>{title}</Text>
        {subtitle && (
          <Text style={[styles.statSubtitle, { color: theme.secondaryText }]}>{subtitle}</Text>
        )}
      </View>
    </View>
  );

  if (isLoading) {
    return (
      <ScreenLayout>
        <View style={styles.loadingContainer}>
          <Text style={[styles.loadingText, { color: theme.textColor }]}>Loading analytics...</Text>
        </View>
      </ScreenLayout>
    );
  }

  if (!analytics) {
    return (
      <ScreenLayout>
        <View style={styles.errorContainer}>
          <Text style={[styles.errorText, { color: theme.textColor }]}>Failed to load analytics</Text>
        </View>
      </ScreenLayout>
    );
  }

  return (
    <ScreenLayout>
        <ScrollView 
          style={styles.container}
        >
        {/* Header */}
        <View style={[styles.header, { backgroundColor: theme.background }]}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color={theme.textColor} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: theme.textColor }]}>Analytics</Text>
          <View style={styles.periodSelector}>
            {(['week', 'month', 'year'] as const).map((period) => (
              <TouchableOpacity
                key={period}
                style={[
                  styles.periodButton,
                  { 
                    backgroundColor: selectedPeriod === period ? theme.primary : 'transparent',
                    borderColor: theme.borderColor 
                  }
                ]}
                onPress={() => setSelectedPeriod(period)}
              >
                <Text style={[
                  styles.periodButtonText,
                  { color: selectedPeriod === period ? 'white' : theme.textColor }
                ]}>
                  {period.charAt(0).toUpperCase() + period.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Stats Grid */}
        <View style={styles.statsGrid}>
          <StatCard
            title="Total Users"
            value={analytics.totalUsers.toLocaleString()}
            icon="people"
            color="#007bff"
            subtitle="Active community members"
          />
          <StatCard
            title="Total Missions"
            value={analytics.totalMissions}
            icon="flag"
            color="#28a745"
            subtitle="Missions created"
          />
          <StatCard
            title="Eco Points Distributed"
            value={analytics.totalEcoPointsDistributed.toLocaleString()}
            icon="leaf"
            color="#20c997"
            subtitle="Points awarded"
          />
          <StatCard
            title="Cleanups Completed"
            value={analytics.totalCleanupsCompleted}
            icon="trash"
            color="#fd7e14"
            subtitle="Environmental impact"
          />
        </View>

        {/* Charts Section */}
        <View style={styles.chartsSection}>
          <Text style={[styles.sectionTitle, { color: theme.textColor }]}>Monthly Stats</Text>
          <View style={[styles.chartContainer, { backgroundColor: theme.cardBackground }]}>
            <CustomLineChart
              data={analytics.monthlyStats.map(stat => ({ value: stat.missions }))}
              color={theme.primary}
              height={200}
            />
          </View>
        </View>

        <View style={styles.chartsSection}>
          <Text style={[styles.sectionTitle, { color: theme.textColor }]}>Top Performing Roles</Text>
          <View style={[styles.chartContainer, { backgroundColor: theme.cardBackground }]}>
            <CustomBarChart
              data={analytics.topPerformingRoles.map(role => ({ value: role.missionsCompleted, label: role.role }))}
              color={theme.primary}
              height={200}
              showLabels={true}
            />
          </View>
        </View>
      </ScrollView>
    </ScreenLayout>
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
    paddingHorizontal: THEME.SPACING.md,
    paddingVertical: THEME.SPACING.sm + 4,
    paddingTop: THEME.SPACING.sm,
  },
  backButton: {
    padding: THEME.SPACING.sm,
  },
  headerTitle: {
    fontSize: THEME.TYPOGRAPHY.fontSize.xl,
    fontWeight: '700',
  },
  content: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    fontSize: THEME.TYPOGRAPHY.fontSize.base,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: THEME.SPACING.lg,
  },
  errorText: {
    fontSize: THEME.TYPOGRAPHY.fontSize.lg,
    fontWeight: '500',
    textAlign: 'center',
  },
  periodSelector: {
    flexDirection: 'row',
    margin: THEME.SPACING.md,
    gap: 8,
  },
  periodButton: {
    flex: 1,
    paddingVertical: THEME.SPACING.sm,
    paddingHorizontal: THEME.SPACING.md,
    borderRadius: THEME.BORDER_RADIUS.md,
    borderWidth: 1,
    alignItems: 'center',
  },
  periodButtonText: {
    fontSize: THEME.TYPOGRAPHY.fontSize.sm,
    fontWeight: '600',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: THEME.SPACING.md,
    gap: 12,
  },
  chartsSection: {
    padding: THEME.SPACING.md,
  },
  statCard: {
    width: (width - 44) / 2,
    padding: THEME.SPACING.md,
    borderRadius: THEME.BORDER_RADIUS.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statIcon: {
    width: 48,
    height: 48,
    borderRadius: THEME.BORDER_RADIUS["2xl"],
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: THEME.SPACING.sm + 4,
  },
  statContent: {
    flex: 1,
  },
  statValue: {
    fontSize: THEME.TYPOGRAPHY.fontSize["2xl"],
    fontWeight: '700',
    marginBottom: THEME.SPACING.xs,
  },
  statTitle: {
    fontSize: THEME.TYPOGRAPHY.fontSize.sm,
    fontWeight: '600',
    marginBottom: 2,
  },
  statSubtitle: {
    fontSize: THEME.TYPOGRAPHY.fontSize.xs,
  },
  section: {
    margin: THEME.SPACING.md,
    marginTop: THEME.SPACING.lg,
  },
  sectionTitle: {
    fontSize: THEME.TYPOGRAPHY.fontSize.lg,
    fontWeight: '700',
    marginBottom: THEME.SPACING.md,
  },
  roleCard: {
    padding: THEME.SPACING.md,
    borderRadius: THEME.BORDER_RADIUS.lg,
    marginBottom: THEME.SPACING.sm + 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  roleHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: THEME.SPACING.sm + 4,
  },
  roleRank: {
    width: 32,
    height: 32,
    borderRadius: THEME.BORDER_RADIUS.xl,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: THEME.SPACING.sm + 4,
  },
  rankNumber: {
    fontSize: THEME.TYPOGRAPHY.fontSize.sm,
    fontWeight: '700',
  },
  roleIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: THEME.SPACING.sm + 4,
  },
  roleInfo: {
    flex: 1,
  },
  roleName: {
    fontSize: THEME.TYPOGRAPHY.fontSize.base,
    fontWeight: '600',
    marginBottom: 2,
  },
  roleStats: {
    fontSize: THEME.TYPOGRAPHY.fontSize.xs,
  },
  roleMetrics: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  roleMetric: {
    alignItems: 'center',
  },
  metricValue: {
    fontSize: THEME.TYPOGRAPHY.fontSize.lg,
    fontWeight: '700',
    marginBottom: 2,
  },
  metricLabel: {
    fontSize: THEME.TYPOGRAPHY.fontSize.xs,
  },
  chartCard: {
    margin: THEME.SPACING.md,
    padding: THEME.SPACING.md,
    borderRadius: THEME.BORDER_RADIUS.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  chartTitle: {
    fontSize: THEME.TYPOGRAPHY.fontSize.lg,
    fontWeight: '700',
    marginBottom: THEME.SPACING.md,
  },
  chartContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    height: 120,
    marginBottom: THEME.SPACING.md,
  },
  chartBar: {
    flex: 1,
    alignItems: 'center',
  },
  barContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    height: 100,
    gap: 2,
  },
  missionBar: {
    width: 8,
    borderRadius: THEME.BORDER_RADIUS.sm,
  },
  ecoPointsBar: {
    width: 8,
    borderRadius: THEME.BORDER_RADIUS.sm,
  },
  monthLabel: {
    fontSize: THEME.TYPOGRAPHY.fontSize.xs,
    marginTop: THEME.SPACING.sm,
  },
  chartLegend: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  legendColor: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  legendText: {
    fontSize: THEME.TYPOGRAPHY.fontSize.xs,
  },
  quickActions: {
    flexDirection: 'row',
    margin: THEME.SPACING.md,
    gap: 12,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: THEME.SPACING.sm + 4,
    borderRadius: THEME.BORDER_RADIUS.md,
    gap: 8,
  },
  actionButtonText: {
    fontSize: THEME.TYPOGRAPHY.fontSize.sm,
    fontWeight: '600',
  },
});

export default AdminAnalytics;
