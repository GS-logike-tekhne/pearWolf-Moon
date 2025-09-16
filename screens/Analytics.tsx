import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getRoleColor } from '../utils/roleColors';
import { useTheme } from '../context/ThemeContext';
import { THEME } from '../styles/theme';
import ScreenLayout from '../components/ScreenLayout';
import MenuModal from '../components/MenuModal';

const { width } = Dimensions.get('window');

const Analytics = ({ navigation }: { navigation: any }) => {
  const { theme } = useTheme();
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [showMenu, setShowMenu] = useState(false);

  // Comprehensive platform analytics for admin oversight
  const platformMetrics = [
    { 
      label: 'Total Platform Revenue', 
      value: '$127.8K', 
      change: '+24%', 
      icon: 'trending-up', 
      color: '#10b981',
      detail: 'Monthly recurring revenue growth'
    },
    { 
      label: 'Active User Base', 
      value: '2,847', 
      change: '+15%', 
      icon: 'people', 
      color: '#f97316',
      detail: '89% user retention rate'
    },
    { 
      label: 'Mission Completion Rate', 
      value: '94.2%', 
      change: '+3%', 
      icon: 'checkmark-circle', 
      color: '#3b82f6',
      detail: 'Above industry standard of 87%'
    },
    { 
      label: 'Platform Efficiency', 
      value: '98.7%', 
      change: '+1%', 
      icon: 'speedometer', 
      color: '#8b5cf6',
      detail: 'System uptime and performance'
    },
  ];

  // Business intelligence metrics
  const businessMetrics = [
    { 
      category: 'User Growth',
      metrics: [
        { label: 'New Registrations', value: '156', period: 'This Week' },
        { label: 'User Acquisition Cost', value: '$12.50', period: 'Average' },
        { label: 'Conversion Rate', value: '23.4%', period: 'Sign-up to Active' },
      ]
    },
    { 
      category: 'Financial Performance',
      metrics: [
        { label: 'Transaction Volume', value: '$89.2K', period: 'This Month' },
        { label: 'Average Order Value', value: '$47.30', period: 'Per Mission' },
        { label: 'Platform Fee Revenue', value: '$8.9K', period: 'Monthly' },
      ]
    },
    { 
      category: 'Operational Efficiency',
      metrics: [
        { label: 'Mission Success Rate', value: '94.2%', period: 'All Time' },
        { label: 'Average Response Time', value: '1.2 hrs', period: 'Support Tickets' },
        { label: 'System Performance', value: '99.1%', period: 'Uptime' },
      ]
    },
  ];

  // Environmental impact aggregated across platform
  const environmentalImpact = [
    { label: 'Total Trash Collected', value: '47.8 tons', icon: 'trash', color: '#10b981' },
    { label: 'CO₂ Emissions Prevented', value: '125.4 tons', icon: 'leaf', color: '#059669' },
    { label: 'Water Bodies Protected', value: '234', icon: 'water', color: '#0d9488' },
    { label: 'Communities Served', value: '89', icon: 'location', color: '#0891b2' },
  ];

  // User role distribution and activity
  const userAnalytics = [
    { 
      role: 'Trash Heroes', 
      count: 456, 
      percentage: 34, 
      avgEarnings: '$1,234',
      activityRate: '87%',
      color: getRoleColor('trash-hero') 
    },
    { 
      role: 'Impact Warriors', 
      count: 1234, 
      percentage: 52, 
      avgPoints: '1,567',
      activityRate: '79%',
      color: getRoleColor('impact-warrior') 
    },
    { 
      role: 'EcoDefenders', 
      count: 89, 
      percentage: 12, 
      avgInvestment: '$8.9K',
      activityRate: '95%',
      color: getRoleColor('business') 
    },
    { 
      role: 'Admins', 
      count: 12, 
      percentage: 2, 
      avgActions: '234/day',
      activityRate: '100%',
      color: '#f97316' 
    },
  ];

  // Geographic and demographic insights
  const geographicData = [
    { region: 'North America', users: 1456, missions: 234, revenue: '$45.2K' },
    { region: 'Europe', users: 892, missions: 156, revenue: '$28.9K' },
    { region: 'Asia Pacific', users: 345, missions: 89, revenue: '$12.7K' },
    { region: 'Other Regions', users: 154, missions: 34, revenue: '$5.3K' },
  ];

  const exportData = () => {
    Alert.alert(
      'Export Analytics Data',
      'Choose export format:',
      [
        { text: 'Executive Summary PDF', onPress: () => exportExecutiveSummary() },
        { text: 'Detailed CSV Report', onPress: () => exportDetailedReport() },
        { text: 'Financial Analytics', onPress: () => exportFinancialData() },
        { text: 'Performance Dashboard', onPress: () => exportPerformanceData() },
        { text: 'Cancel', style: 'cancel' }
      ]
    );
  };

  const exportExecutiveSummary = () => {
    Alert.alert('Success', 'Executive summary PDF exported for stakeholder review');
  };

  const exportDetailedReport = () => {
    Alert.alert('Success', 'Detailed analytics CSV exported for analysis');
  };

  const exportFinancialData = () => {
    Alert.alert('Success', 'Financial analytics exported for accounting department');
  };

  const exportPerformanceData = () => {
    Alert.alert('Success', 'Platform performance data exported for technical review');
  };

  const MetricCard = ({ metric }: { metric: any }) => (
    <View style={[styles.metricCard, { backgroundColor: theme.cardBackground, borderColor: theme.borderColor }]}>
      <View style={styles.metricHeader}>
        <View style={[styles.metricIcon, { backgroundColor: metric.color }]}>
          <Ionicons name={metric.icon} size={24} color="white" />
        </View>
        <Text style={[styles.metricChange, { 
          color: metric.change.startsWith('+') ? '#10b981' : '#dc2626' 
        }]}>{metric.change}</Text>
      </View>
      <Text style={[styles.metricValue, { color: theme.textColor }]}>{metric.value}</Text>
      <Text style={[styles.metricLabel, { color: theme.textColor }]}>{metric.label}</Text>
      <Text style={[styles.metricDetail, { color: theme.secondaryText }]}>{metric.detail}</Text>
    </View>
  );

  const BusinessMetricSection = ({ section }: { section: any }) => (
    <View style={[styles.businessCard, { backgroundColor: theme.cardBackground, borderColor: theme.borderColor }]}>
      <Text style={[styles.businessSectionTitle, { color: theme.textColor }]}>{section.category}</Text>
      {section.metrics.map((metric: any, index: number) => (
        <View key={index} style={styles.businessMetricRow}>
          <View style={styles.businessMetricInfo}>
            <Text style={[styles.businessMetricLabel, { color: theme.textColor }]}>{metric.label}</Text>
            <Text style={[styles.businessMetricPeriod, { color: theme.secondaryText }]}>{metric.period}</Text>
          </View>
          <Text style={[styles.businessMetricValue, { color: theme.primary }]}>{metric.value}</Text>
        </View>
      ))}
    </View>
  );

  const UserRoleCard = ({ role }: { role: any }) => (
    <View style={[styles.userRoleCard, { backgroundColor: theme.cardBackground, borderColor: theme.borderColor }]}>
      <View style={styles.userRoleHeader}>
        <View style={[styles.userRoleIcon, { backgroundColor: role.color }]}>
          <Text style={styles.userRoleCount}>{role.count}</Text>
        </View>
        <View style={styles.userRoleInfo}>
          <Text style={[styles.userRoleName, { color: theme.textColor }]}>{role.role}</Text>
          <Text style={[styles.userRolePercentage, { color: theme.secondaryText }]}>
            {role.percentage}% of user base
          </Text>
        </View>
      </View>
      <View style={styles.userRoleMetrics}>
        <View style={styles.userRoleMetric}>
          <Text style={[styles.userRoleMetricLabel, { color: theme.secondaryText }]}>
            {role.avgEarnings ? 'Avg Earnings' : role.avgPoints ? 'Avg Points' : role.avgInvestment ? 'Avg Investment' : 'Daily Actions'}
          </Text>
          <Text style={[styles.userRoleMetricValue, { color: theme.textColor }]}>
            {role.avgEarnings || role.avgPoints || role.avgInvestment || role.avgActions}
          </Text>
        </View>
        <View style={styles.userRoleMetric}>
          <Text style={[styles.userRoleMetricLabel, { color: theme.secondaryText }]}>Activity Rate</Text>
          <Text style={[styles.userRoleMetricValue, { color: '#10b981' }]}>{role.activityRate}</Text>
        </View>
      </View>
    </View>
  );

  const EnvironmentalCard = ({ impact }: { impact: any }) => (
    <View style={[styles.environmentalCard, { backgroundColor: theme.cardBackground, borderColor: theme.borderColor }]}>
      <Ionicons name={impact.icon} size={32} color={impact.color} />
      <Text style={[styles.environmentalValue, { color: theme.textColor }]}>{impact.value}</Text>
      <Text style={[styles.environmentalLabel, { color: theme.secondaryText }]}>{impact.label}</Text>
    </View>
  );

  const GeographicCard = ({ region }: { region: any }) => (
    <View style={[styles.geographicCard, { backgroundColor: theme.cardBackground, borderColor: theme.borderColor }]}>
      <Text style={[styles.geographicRegion, { color: theme.textColor }]}>{region.region}</Text>
      <View style={styles.geographicMetrics}>
        <View style={styles.geographicMetric}>
          <Text style={[styles.geographicMetricValue, { color: theme.primary }]}>{region.users}</Text>
          <Text style={[styles.geographicMetricLabel, { color: theme.secondaryText }]}>Users</Text>
        </View>
        <View style={styles.geographicMetric}>
          <Text style={[styles.geographicMetricValue, { color: theme.primary }]}>{region.missions}</Text>
          <Text style={[styles.geographicMetricLabel, { color: theme.secondaryText }]}>Missions</Text>
        </View>
        <View style={styles.geographicMetric}>
          <Text style={[styles.geographicMetricValue, { color: '#10b981' }]}>{region.revenue}</Text>
          <Text style={[styles.geographicMetricLabel, { color: theme.secondaryText }]}>Revenue</Text>
        </View>
      </View>
    </View>
  );

  const PeriodButton = ({ period, title }: { period: string; title: string }) => (
    <TouchableOpacity
      style={[
        styles.periodButton,
        { 
          backgroundColor: selectedPeriod === period ? theme.primary : theme.cardBackground,
          borderColor: theme.borderColor, 
        }
      ]}
      onPress={() => setSelectedPeriod(period)}
    >
      <Text style={[
        styles.periodText,
        { color: selectedPeriod === period ? 'white' : theme.textColor }
      ]}>
        {title}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      
      {/* Page Header */}
      <View style={[styles.pageHeader, { backgroundColor: theme.cardBackground }]}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#fd7e14" />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.textColor }]}>
          Analytics Dashboard
        </Text>
        <View style={{ width: 32, height: 32 }} />
      </View>
      
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Header Section */}
        <View style={styles.headerSection}>
          <View style={styles.titleContainer}>
            <Ionicons name="analytics" size={32} color={theme.primary} />
            <View style={styles.titleText}>
              <Text style={[styles.screenTitle, { color: theme.textColor }]}>Platform Analytics</Text>
              <Text style={[styles.screenSubtitle, { color: theme.secondaryText }]}>
                Comprehensive business intelligence and performance metrics
              </Text>
            </View>
          </View>
          
          <TouchableOpacity 
            style={[styles.exportButton, { backgroundColor: theme.primary }]}
            onPress={exportData}
          >
            <Ionicons name="download-outline" size={20} color="white" />
            <Text style={styles.exportButtonText}>Export</Text>
          </TouchableOpacity>
        </View>

        {/* Time Period Selector */}
        <View style={styles.periodSelector}>
          <View style={styles.periodButtons}>
            <PeriodButton period="week" title="7 Days" />
            <PeriodButton period="month" title="30 Days" />
            <PeriodButton period="quarter" title="90 Days" />
            <PeriodButton period="year" title="1 Year" />
          </View>
        </View>

        {/* Key Platform Metrics */}
        <View style={styles.metricsSection}>
          <Text style={[styles.sectionTitle, { color: theme.textColor }]}>Key Performance Indicators</Text>
          <View style={styles.metricsGrid}>
            {platformMetrics.map((metric, index) => (
              <MetricCard key={index} metric={metric} />
            ))}
          </View>
        </View>

        {/* Business Intelligence */}
        <View style={styles.businessSection}>
          <Text style={[styles.sectionTitle, { color: theme.textColor }]}>Business Intelligence</Text>
          {businessMetrics.map((section, index) => (
            <BusinessMetricSection key={index} section={section} />
          ))}
        </View>

        {/* User Analytics */}
        <View style={styles.userAnalyticsSection}>
          <Text style={[styles.sectionTitle, { color: theme.textColor }]}>User Base Analysis</Text>
          {userAnalytics.map((role, index) => (
            <UserRoleCard key={index} role={role} />
          ))}
        </View>

        {/* Environmental Impact */}
        <View style={styles.environmentalSection}>
          <Text style={[styles.sectionTitle, { color: theme.textColor }]}>Platform Environmental Impact</Text>
          <View style={styles.environmentalGrid}>
            {environmentalImpact.map((impact, index) => (
              <EnvironmentalCard key={index} impact={impact} />
            ))}
          </View>
        </View>

        {/* Geographic Distribution */}
        <View style={styles.geographicSection}>
          <Text style={[styles.sectionTitle, { color: theme.textColor }]}>Geographic Distribution</Text>
          {geographicData.map((region, index) => (
            <GeographicCard key={index} region={region} />
          ))}
        </View>

        {/* System Health Summary */}
        <View style={styles.systemHealthSection}>
          <View style={[styles.systemHealthCard, { backgroundColor: theme.cardBackground, borderColor: theme.borderColor }]}>
            <View style={styles.systemHealthHeader}>
              <Ionicons name="pulse" size={24} color="#10b981" />
              <Text style={[styles.systemHealthTitle, { color: theme.textColor }]}>System Health Status</Text>
            </View>
            <View style={styles.systemHealthMetrics}>
              <View style={styles.systemHealthItem}>
                <Text style={[styles.systemHealthLabel, { color: theme.secondaryText }]}>Server Uptime</Text>
                <Text style={[styles.systemHealthValue, { color: '#10b981' }]}>99.8%</Text>
              </View>
              <View style={styles.systemHealthItem}>
                <Text style={[styles.systemHealthLabel, { color: theme.secondaryText }]}>Response Time</Text>
                <Text style={[styles.systemHealthValue, { color: '#10b981' }]}>142ms</Text>
              </View>
              <View style={styles.systemHealthItem}>
                <Text style={[styles.systemHealthLabel, { color: theme.secondaryText }]}>Error Rate</Text>
                <Text style={[styles.systemHealthValue, { color: '#10b981' }]}>0.02%</Text>
              </View>
              <View style={styles.systemHealthItem}>
                <Text style={[styles.systemHealthLabel, { color: theme.secondaryText }]}>Database Performance</Text>
                <Text style={[styles.systemHealthValue, { color: '#10b981' }]}>Optimal</Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.bottomSpacing} />
      </ScrollView>
      <MenuModal
        visible={showMenu}
        onClose={() => setShowMenu(false)}
        userRole="ADMIN"
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
    paddingHorizontal: THEME.SPACING.md,
    paddingVertical: THEME.SPACING.sm + 4,
    paddingTop: THEME.SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  backButton: {},
  headerTitle: {
    fontSize: THEME.TYPOGRAPHY.fontSize.lg,
    fontWeight: '700',
  },
  content: {
    flex: 1,
    padding: THEME.SPACING.md + 4,
  },
  headerSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: THEME.SPACING.lg,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  titleText: {
    marginLeft: THEME.SPACING.sm + 4,
    flex: 1,
  },
  screenTitle: {
    fontSize: THEME.TYPOGRAPHY.fontSize["2xl"],
    fontWeight: '700',
    marginBottom: THEME.SPACING.xs,
  },
  screenSubtitle: {
    fontSize: THEME.TYPOGRAPHY.fontSize.sm,
    fontWeight: '500',
  },
  exportButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: THEME.SPACING.md,
    paddingVertical: 10,
    borderRadius: THEME.BORDER_RADIUS.lg,
  },
  exportButtonText: {
    // color: theme.background,
    fontWeight: '600',
    marginLeft: 6,
  },
  periodSelector: {
    marginBottom: THEME.SPACING.lg,
  },
  periodButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  periodButton: {
    paddingHorizontal: THEME.SPACING.md,
    paddingVertical: THEME.SPACING.sm,
    borderRadius: 20,
    borderWidth: 1,
  },
  periodText: {
    fontSize: THEME.TYPOGRAPHY.fontSize.xs,
    fontWeight: '600',
  },
  sectionTitle: {
    fontSize: THEME.TYPOGRAPHY.fontSize.lg,
    fontWeight: '600',
    marginBottom: THEME.SPACING.md,
  },
  metricsSection: {
    marginBottom: THEME.SPACING.lg,
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  metricCard: {
    width: (width - 50) / 2,
    padding: THEME.SPACING.md,
    borderRadius: THEME.BORDER_RADIUS.xl,
    borderWidth: 1,
    marginBottom: THEME.SPACING.sm + 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  metricHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: THEME.SPACING.sm + 4,
  },
  metricIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  metricChange: {
    fontSize: THEME.TYPOGRAPHY.fontSize.xs,
    fontWeight: 'bold',
  },
  metricValue: {
    fontSize: THEME.TYPOGRAPHY.fontSize.xl,
    fontWeight: 'bold',
    marginBottom: THEME.SPACING.xs,
  },
  metricLabel: {
    fontSize: THEME.TYPOGRAPHY.fontSize.xs,
    fontWeight: '600',
    marginBottom: THEME.SPACING.xs,
  },
  metricDetail: {
    fontSize: THEME.TYPOGRAPHY.fontSize.xs,
    fontWeight: '500',
  },
  businessSection: {
    marginBottom: THEME.SPACING.lg,
  },
  businessCard: {
    padding: THEME.SPACING.md,
    borderRadius: THEME.BORDER_RADIUS.xl,
    borderWidth: 1,
    marginBottom: THEME.SPACING.sm + 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  businessSectionTitle: {
    fontSize: THEME.TYPOGRAPHY.fontSize.base,
    fontWeight: 'bold',
    marginBottom: THEME.SPACING.sm + 4,
  },
  businessMetricRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: THEME.SPACING.sm,
  },
  businessMetricInfo: {
    flex: 1,
  },
  businessMetricLabel: {
    fontSize: THEME.TYPOGRAPHY.fontSize.sm,
    fontWeight: '500',
    marginBottom: 2,
  },
  businessMetricPeriod: {
    fontSize: THEME.TYPOGRAPHY.fontSize.xs,
    fontWeight: '500',
  },
  businessMetricValue: {
    fontSize: THEME.TYPOGRAPHY.fontSize.base,
    fontWeight: 'bold',
  },
  userAnalyticsSection: {
    marginBottom: THEME.SPACING.lg,
  },
  userRoleCard: {
    padding: THEME.SPACING.md,
    borderRadius: THEME.BORDER_RADIUS.xl,
    borderWidth: 1,
    marginBottom: THEME.SPACING.sm + 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  userRoleHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: THEME.SPACING.sm + 4,
  },
  userRoleIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: THEME.SPACING.sm + 4,
  },
  userRoleCount: {
    // color: theme.background,
    fontSize: THEME.TYPOGRAPHY.fontSize.base,
    fontWeight: 'bold',
  },
  userRoleInfo: {
    flex: 1,
  },
  userRoleName: {
    fontSize: THEME.TYPOGRAPHY.fontSize.base,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  userRolePercentage: {
    fontSize: THEME.TYPOGRAPHY.fontSize.xs,
    fontWeight: '500',
  },
  userRoleMetrics: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  userRoleMetric: {
    alignItems: 'center',
  },
  userRoleMetricLabel: {
    fontSize: THEME.TYPOGRAPHY.fontSize.xs,
    fontWeight: '500',
    marginBottom: THEME.SPACING.xs,
  },
  userRoleMetricValue: {
    fontSize: THEME.TYPOGRAPHY.fontSize.sm,
    fontWeight: 'bold',
  },
  environmentalSection: {
    marginBottom: THEME.SPACING.lg,
  },
  environmentalGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  environmentalCard: {
    width: (width - 50) / 2,
    padding: THEME.SPACING.md,
    borderRadius: THEME.BORDER_RADIUS.xl,
    borderWidth: 1,
    alignItems: 'center',
    marginBottom: THEME.SPACING.sm + 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  environmentalValue: {
    fontSize: THEME.TYPOGRAPHY.fontSize.lg,
    fontWeight: 'bold',
    marginTop: THEME.SPACING.sm,
    marginBottom: THEME.SPACING.xs,
  },
  environmentalLabel: {
    fontSize: THEME.TYPOGRAPHY.fontSize.xs,
    fontWeight: '500',
    textAlign: 'center',
  },
  geographicSection: {
    marginBottom: THEME.SPACING.lg,
  },
  geographicCard: {
    padding: THEME.SPACING.md,
    borderRadius: THEME.BORDER_RADIUS.xl,
    borderWidth: 1,
    marginBottom: THEME.SPACING.sm + 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  geographicRegion: {
    fontSize: THEME.TYPOGRAPHY.fontSize.base,
    fontWeight: 'bold',
    marginBottom: THEME.SPACING.sm + 4,
  },
  geographicMetrics: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  geographicMetric: {
    alignItems: 'center',
  },
  geographicMetricValue: {
    fontSize: THEME.TYPOGRAPHY.fontSize.base,
    fontWeight: 'bold',
    marginBottom: THEME.SPACING.xs,
  },
  geographicMetricLabel: {
    fontSize: THEME.TYPOGRAPHY.fontSize.xs,
    fontWeight: '500',
  },
  systemHealthSection: {
    marginBottom: THEME.SPACING.lg,
  },
  systemHealthCard: {
    padding: THEME.SPACING.md + 4,
    borderRadius: THEME.BORDER_RADIUS.xl,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  systemHealthHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: THEME.SPACING.md,
  },
  systemHealthTitle: {
    fontSize: THEME.TYPOGRAPHY.fontSize.base,
    fontWeight: 'bold',
    marginLeft: THEME.SPACING.sm,
  },
  systemHealthMetrics: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  systemHealthItem: {
    width: (width - 80) / 2,
    marginBottom: THEME.SPACING.sm + 4,
  },
  systemHealthLabel: {
    fontSize: THEME.TYPOGRAPHY.fontSize.xs,
    fontWeight: '500',
    marginBottom: THEME.SPACING.xs,
  },
  systemHealthValue: {
    fontSize: THEME.TYPOGRAPHY.fontSize.base,
    fontWeight: 'bold',
  },
  bottomSpacing: {
    height: 20,
  },
});

export default Analytics;