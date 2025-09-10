import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { getRoleColor } from '../utils/roleColors';
import { useTheme } from '../context/ThemeContext';
import CustomBarChart from '../components/CustomBarChart';
import CustomLineChart from '../components/CustomLineChart';

const { width } = Dimensions.get('window');

interface Earning {
  id: string;
  jobTitle: string;
  jobType: 'cleanup' | 'monitoring' | 'recycling' | 'education';
  amount: number;
  status: 'pending' | 'processing' | 'paid' | 'disputed';
  completedDate: string;
  paymentDate?: string;
  location: string;
  hours: number;
  bonuses?: {
    type: string;
    amount: number;
  }[];
}

interface TrashHeroEarningsProps {
  navigation: any;
}

const TrashHeroEarnings: React.FC<TrashHeroEarningsProps> = ({ navigation }) => {
  const { theme } = useTheme();
  const trashHeroColor = getRoleColor('trash-hero');
  
  const [timeframe, setTimeframe] = useState<'week' | 'month' | 'quarter' | 'year'>('month');
  const [earnings] = useState<Earning[]>([
    {
      id: '1',
      jobTitle: 'Downtown River Cleanup',
      jobType: 'cleanup',
      amount: 150,
      status: 'paid',
      completedDate: '2024-03-01T10:00:00Z',
      paymentDate: '2024-03-02T14:30:00Z',
      location: 'Downtown River Park',
      hours: 4,
      bonuses: [
        { type: 'Quality Bonus', amount: 25 },
        { type: 'Early Completion', amount: 15 },
      ],
    },
    {
      id: '2',
      jobTitle: 'Beach Plastic Collection',
      jobType: 'cleanup',
      amount: 120,
      status: 'processing',
      completedDate: '2024-03-03T08:00:00Z',
      location: 'Sunset Beach',
      hours: 3,
    },
    {
      id: '3',
      jobTitle: 'Industrial Site Assessment',
      jobType: 'monitoring',
      amount: 200,
      status: 'pending',
      completedDate: '2024-03-04T07:00:00Z',
      location: 'Industrial District',
      hours: 5,
      bonuses: [
        { type: 'Hazard Pay', amount: 50 },
      ],
    },
    {
      id: '4',
      jobTitle: 'Community Recycling Drive',
      jobType: 'recycling',
      amount: 80,
      status: 'paid',
      completedDate: '2024-02-28T10:00:00Z',
      paymentDate: '2024-03-01T12:00:00Z',
      location: 'Community Center',
      hours: 2,
    },
  ]);
  
  // Earnings summary
  const earningsSummary = {
    totalEarnings: earnings.reduce((sum, earning) => sum + (earning.amount || 0) + (earning.bonuses?.reduce((bonusSum, bonus) => bonusSum + (bonus.amount || 0), 0) || 0), 0),
    pendingPayments: earnings.filter(e => e.status === 'pending' || e.status === 'processing').reduce((sum, earning) => sum + (earning.amount || 0) + (earning.bonuses?.reduce((bonusSum, bonus) => bonusSum + (bonus.amount || 0), 0) || 0), 0),
    thisMonthEarnings: 470, // Current month
    totalHours: earnings.reduce((sum, earning) => sum + (earning.hours || 0), 0),
    averageHourlyRate: 0,
    completedJobs: earnings.length,
  };
  
  earningsSummary.averageHourlyRate = earningsSummary.totalHours > 0 ? earningsSummary.totalEarnings / earningsSummary.totalHours : 0;

  const monthlyData = [
    { month: 'Jan', earnings: 890, jobs: 8, hours: 32 },
    { month: 'Feb', earnings: 1120, jobs: 12, hours: 45 },
    { month: 'Mar', earnings: 950, jobs: 9, hours: 38 },
    { month: 'Apr', earnings: 1340, jobs: 15, hours: 52 },
    { month: 'May', earnings: 1180, jobs: 11, hours: 43 },
    { month: 'Jun', earnings: 1050, jobs: 10, hours: 40 },
  ];

  const jobTypeData = [
    { type: 'Cleanup', earnings: 1850, count: 28 },
    { type: 'Monitoring', earnings: 1200, count: 8 },
    { type: 'Recycling', earnings: 680, count: 12 },
    { type: 'Education', earnings: 450, count: 6 },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return '#ffc107';
      case 'processing': return '#007bff';
      case 'paid': return '#28a745';
      case 'disputed': return '#dc3545';
      default: return theme.secondaryText;
    }
  };

  const getJobTypeIcon = (type: string) => {
    switch (type) {
      case 'cleanup': return 'trash-bin';
      case 'monitoring': return 'analytics';
      case 'recycling': return 'refresh';
      case 'education': return 'school';
      default: return 'briefcase';
    }
  };

  const EarningsCard = ({ title, value, subtitle, icon, color, trend }: any) => (
    <View style={[styles.earningsCard, { backgroundColor: theme.cardBackground }]}>
      <View style={[styles.earningsIcon, { backgroundColor: color }]}>
        <Ionicons name={icon} size={20} color="white" />
      </View>
      <View style={styles.earningsContent}>
        <Text style={[styles.earningsValue, { color: theme.textColor }]}>{value}</Text>
        <Text style={[styles.earningsTitle, { color: theme.textColor }]}>{title}</Text>
        {subtitle && (
          <Text style={[styles.earningsSubtitle, { color: theme.secondaryText }]}>{subtitle}</Text>
        )}
        {trend !== undefined && trend !== null && (
          <View style={styles.trendContainer}>
            <Ionicons 
              name={trend > 0 ? "trending-up" : "trending-down"} 
              size={12} 
              color={trend > 0 ? trashHeroColor : "#dc3545"} 
            />
            <Text style={[styles.trendText, { color: trend > 0 ? trashHeroColor : "#dc3545" }]}>
              {Math.abs(trend)}% vs last month
            </Text>
          </View>
        )}
      </View>
    </View>
  );

  const EarningItem = ({ earning }: { earning: Earning }) => {
    const totalAmount = (earning.amount || 0) + (earning.bonuses?.reduce((sum, bonus) => sum + (bonus.amount || 0), 0) || 0);
    
    return (
      <View style={[styles.earningItem, { backgroundColor: theme.cardBackground }]}>
        <View style={styles.earningHeader}>
          <View style={styles.earningInfo}>
            <Text style={[styles.earningTitle, { color: theme.textColor }]}>{earning.jobTitle}</Text>
            <Text style={[styles.earningLocation, { color: theme.secondaryText }]}>
              <Ionicons name="location" size={12} color={theme.secondaryText} /> {earning.location}
            </Text>
          </View>
          <View style={styles.earningAmount}>
            <Text style={[styles.amount, { color: trashHeroColor }]}>${totalAmount || 0}</Text>
            <View style={[styles.statusBadge, { backgroundColor: getStatusColor(earning.status) }]}>
              <Text style={styles.statusText}>{earning.status}</Text>
            </View>
          </View>
        </View>

        <View style={styles.earningMeta}>
          <View style={styles.metaItem}>
            <Ionicons name={getJobTypeIcon(earning.jobType) as any} size={14} color={theme.secondaryText} />
            <Text style={[styles.metaText, { color: theme.secondaryText }]}>{earning.jobType}</Text>
          </View>
          <View style={styles.metaItem}>
            <Ionicons name="time" size={14} color={theme.secondaryText} />
            <Text style={[styles.metaText, { color: theme.secondaryText }]}>{earning.hours}h</Text>
          </View>
          <View style={styles.metaItem}>
            <Ionicons name="calendar" size={14} color={theme.secondaryText} />
            <Text style={[styles.metaText, { color: theme.secondaryText }]}>
              {new Date(earning.completedDate).toLocaleDateString() || earning.completedDate}
            </Text>
          </View>
          <View style={styles.metaItem}>
            <Ionicons name="cash" size={14} color={theme.secondaryText} />
            <Text style={[styles.metaText, { color: theme.secondaryText }]}>
              ${earning.hours > 0 ? (earning.amount / earning.hours).toFixed(0) : '0'}/h
            </Text>
          </View>
        </View>

        {earning.bonuses && earning.bonuses.length > 0 && (
          <View style={styles.bonusSection}>
            <Text style={[styles.bonusLabel, { color: theme.textColor }]}>Bonuses:</Text>
            {earning.bonuses.map((bonus, index) => (
              <View key={index} style={styles.bonusItem}>
                <Text style={[styles.bonusType, { color: theme.secondaryText }]}>{bonus.type}</Text>
                <Text style={[styles.bonusAmount, { color: trashHeroColor }]}>+${bonus.amount || 0}</Text>
              </View>
            ))}
          </View>
        )}

        {earning.paymentDate && (
          <View style={styles.paymentInfo}>
            <Ionicons name="checkmark-circle" size={14} color={trashHeroColor} />
            <Text style={[styles.paymentText, { color: theme.secondaryText }]}>
              Paid on {new Date(earning.paymentDate).toLocaleDateString()}
            </Text>
          </View>
        )}
      </View>
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: theme.cardBackground }]}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#28A745" />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.textColor }]}>
          Earnings Dashboard
        </Text>
        <TouchableOpacity
          style={styles.withdrawButton}
          onPress={() => navigation.navigate('WithdrawEarnings')}
        >
          <Ionicons name="card" size={24} color={trashHeroColor} />
        </TouchableOpacity>
      </View>

      {/* Timeframe Selector */}
      <View style={styles.timeframeContainer}>
        {['week', 'month', 'quarter', 'year'].map(period => (
          <TouchableOpacity
            key={period}
            style={[
              styles.timeframeButton,
              { backgroundColor: timeframe === period ? trashHeroColor : theme.cardBackground }
            ]}
            onPress={() => setTimeframe(period as any)}
          >
            <Text style={[
              styles.timeframeText,
              { color: timeframe === period ? 'white' : theme.textColor }
            ]}>
              {period.charAt(0).toUpperCase() + period.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Earnings Summary */}
        <View style={styles.summarySection}>
          <Text style={[styles.sectionTitle, { color: theme.textColor }]}>Earnings Overview</Text>
          <View style={styles.summaryGrid}>
            <EarningsCard
              title="Total Earnings"
              value={`$${(earningsSummary.totalEarnings || 0).toLocaleString()}`}
              subtitle="All time"
              icon="wallet"
              color={trashHeroColor}
              trend={15}
            />
            <EarningsCard
              title="Pending Payments"
              value={`$${(earningsSummary.pendingPayments || 0).toLocaleString()}`}
              subtitle="Processing"
              icon="hourglass"
              color="#ffc107"
              trend={0}
            />
            <EarningsCard
              title="This Month"
              value={`$${earningsSummary.thisMonthEarnings || 0}`}
              subtitle="Current earnings"
              icon="calendar"
              color="#007bff"
              trend={22}
            />
            <EarningsCard
              title="Hourly Rate"
              value={`$${Math.round(earningsSummary.averageHourlyRate || 0)}`}
              subtitle="Average rate"
              icon="time"
              color="#8b5cf6"
              trend={8}
            />
          </View>
        </View>

        {/* Monthly Earnings Chart */}
        <View style={styles.chartSection}>
          <Text style={[styles.sectionTitle, { color: theme.textColor }]}>Monthly Earnings Trend</Text>
          <View style={[styles.chartContainer, { backgroundColor: theme.cardBackground }]}>
            <CustomLineChart
              data={monthlyData}
              primaryKey="earnings"
              secondaryKey="jobs"
              height={200}
              primaryColor={trashHeroColor}
              secondaryColor="#007bff"
              primaryLabel="Earnings ($)"
              secondaryLabel="Jobs Completed"
            />
          </View>
        </View>

        {/* Job Type Breakdown */}
        <View style={styles.chartSection}>
          <Text style={[styles.sectionTitle, { color: theme.textColor }]}>Earnings by Job Type</Text>
          <View style={[styles.chartContainer, { backgroundColor: theme.cardBackground }]}>
            <CustomBarChart
              data={jobTypeData}
              dataKey="earnings"
              height={200}
              color={trashHeroColor}
              labelKey="type"
            />
          </View>
        </View>

        {/* Performance Metrics */}
        <View style={styles.metricsSection}>
          <Text style={[styles.sectionTitle, { color: theme.textColor }]}>Performance Metrics</Text>
          <View style={styles.metricsGrid}>
            <View style={[styles.metricCard, { backgroundColor: theme.cardBackground }]}>
              <Ionicons name="briefcase" size={20} color={trashHeroColor} />
              <Text style={[styles.metricValue, { color: theme.textColor }]}>
                {earningsSummary.completedJobs}
              </Text>
              <Text style={[styles.metricLabel, { color: theme.secondaryText }]}>Jobs Completed</Text>
            </View>
            
            <View style={[styles.metricCard, { backgroundColor: theme.cardBackground }]}>
              <Ionicons name="time" size={20} color="#007bff" />
              <Text style={[styles.metricValue, { color: theme.textColor }]}>
                {earningsSummary.totalHours}h
              </Text>
              <Text style={[styles.metricLabel, { color: theme.secondaryText }]}>Total Hours</Text>
            </View>
            
            <View style={[styles.metricCard, { backgroundColor: theme.cardBackground }]}>
              <Ionicons name="trophy" size={20} color="#ffc107" />
              <Text style={[styles.metricValue, { color: theme.textColor }]}>
                ${(earnings.reduce((sum, e) => sum + (e.bonuses?.reduce((bonusSum, bonus) => bonusSum + bonus.amount, 0) || 0), 0))}
              </Text>
              <Text style={[styles.metricLabel, { color: theme.secondaryText }]}>Total Bonuses</Text>
            </View>
          </View>
        </View>

        {/* Recent Earnings */}
        <View style={styles.earningsSection}>
          <Text style={[styles.sectionTitle, { color: theme.textColor }]}>Recent Earnings</Text>
          <View style={styles.earningsList}>
            {earnings.map(earning => (
              <EarningItem key={earning.id} earning={earning} />
            ))}
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionSection}>
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: trashHeroColor }]}
            onPress={() => navigation.navigate('WithdrawEarnings')}
          >
            <Ionicons name="card" size={20} color="white" />
            <Text style={styles.actionButtonText}>Withdraw Funds</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: '#007bff' }]}
            onPress={() => navigation.navigate('EarningsReport')}
          >
            <Ionicons name="document-text" size={20} color="white" />
            <Text style={styles.actionButtonText}>Tax Report</Text>
          </TouchableOpacity>
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
  backButton: {},
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  withdrawButton: {
    padding: 8,
  },
  timeframeContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
  },
  timeframeButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  timeframeText: {
    fontSize: 14,
    fontWeight: '600',
  },
  content: {
    flex: 1,
  },
  summarySection: {
    marginVertical: 12,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 12,
  },
  summaryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  earningsCard: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    minWidth: '45%',
    padding: 12,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  earningsIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  earningsContent: {
    flex: 1,
  },
  earningsValue: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 2,
  },
  earningsTitle: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 2,
  },
  earningsSubtitle: {
    fontSize: 10,
    marginBottom: 4,
  },
  trendContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  trendText: {
    fontSize: 9,
    fontWeight: '500',
  },
  chartSection: {
    marginVertical: 12,
    paddingHorizontal: 16,
  },
  chartContainer: {
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  metricsSection: {
    marginVertical: 12,
    paddingHorizontal: 16,
  },
  metricsGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  metricCard: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 16,
    borderRadius: 8,
  },
  metricValue: {
    fontSize: 16,
    fontWeight: '700',
    marginVertical: 4,
  },
  metricLabel: {
    fontSize: 12,
    textAlign: 'center',
  },
  earningsSection: {
    marginVertical: 12,
    paddingHorizontal: 16,
  },
  earningsList: {
    gap: 12,
  },
  earningItem: {
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  earningHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  earningInfo: {
    flex: 1,
    marginRight: 12,
  },
  earningTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  earningLocation: {
    fontSize: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  earningAmount: {
    alignItems: 'flex-end',
  },
  amount: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 4,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: 'white',
    fontSize: 10,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  earningMeta: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 8,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontSize: 11,
    textTransform: 'capitalize',
  },
  bonusSection: {
    marginVertical: 8,
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.1)',
  },
  bonusLabel: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 4,
  },
  bonusItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 2,
  },
  bonusType: {
    fontSize: 11,
  },
  bonusAmount: {
    fontSize: 11,
    fontWeight: '600',
  },
  paymentInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 8,
  },
  paymentText: {
    fontSize: 11,
  },
  actionSection: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 20,
    gap: 12,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    gap: 8,
  },
  actionButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  bottomSpacing: {
    height: 40,
  },
});

export default TrashHeroEarnings;