import React, { useState, useEffect } from 'react';
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
import ScreenLayout from '../components/ScreenLayout';
import CustomBarChart from '../components/CustomBarChart';
import CustomLineChart from '../components/CustomLineChart';
import { RoleGuard } from '../components/RoleGuard';

const { width } = Dimensions.get('window');

interface EcoDefenderImpactProps {
  navigation: any;
}

const EcoDefenderImpact: React.FC<EcoDefenderImpactProps> = ({ navigation }) => {
  const { theme } = useTheme();
  const ecoDefenderColor = getRoleColor('business');
  
  const [timeframe, setTimeframe] = useState<'week' | 'month' | 'quarter' | 'year'>('month');
  
  // Business impact metrics
  const impactMetrics = {
    totalJobsPosted: 47,
    totalInvestment: 12850,
    environmentalImpact: {
      wasteCollected: 2340, // kg
      treesPlanted: 156,
      carbonOffset: 890, // kg CO2
      waterSaved: 1250, // liters
    },
    communityEngagement: {
      heroesEmployed: 34,
      volunteersInvolved: 128,
      eventsSponsored: 8,
      communitiesServed: 6,
    },
    businessMetrics: {
      brandVisibility: 85, // percentage
      csrGoalsAchieved: 92, // percentage
      stakeholderSatisfaction: 88, // percentage
      mediaImpressions: 15600,
    }
  };

  const monthlyData = [
    { value: 2100 }, // investment
    { value: 1800 },
    { value: 2400 },
    { value: 1950 },
    { value: 2200 },
    { value: 2400 },
  ];

  const categoryData = [
    { value: 4200, label: 'Beach Cleanup' },
    { value: 3800, label: 'Park Restoration' },
    { value: 2400, label: 'River Cleanup' },
    { value: 1800, label: 'Urban Cleanup' },
    { value: 650, label: 'Education' },
  ];

  const ImpactCard = ({ title, value, subtitle, icon, color }: any) => (
    <View style={[styles.impactCard, { backgroundColor: theme.cardBackground }]}>
      <View style={[styles.impactIcon, { backgroundColor: color }]}>
        <Ionicons name={icon} size={20} color="white" />
      </View>
      <View style={styles.impactContent}>
        <Text style={[styles.impactValue, { color: theme.textColor }]}>{value}</Text>
        <Text style={[styles.impactTitle, { color: theme.textColor }]}>{title}</Text>
        {subtitle && (
          <Text style={[styles.impactSubtitle, { color: theme.secondaryText }]}>{subtitle}</Text>
        )}
      </View>
    </View>
  );

  const MetricSection = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <View style={styles.metricSection}>
      <Text style={[styles.sectionTitle, { color: theme.textColor }]}>{title}</Text>
      <View style={styles.sectionContent}>
        {children}
      </View>
    </View>
  );

  return (
    <RoleGuard allowedRoles={['ECO_DEFENDER']}>
      <ScreenLayout>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: theme.cardBackground }]}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#007bff" />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.textColor }]}>
          Business Impact Dashboard
        </Text>
        <TouchableOpacity
          style={styles.shareButton}
          onPress={() => {/* Share impact report */}}
        >
          <Ionicons name="share" size={24} color={ecoDefenderColor} />
        </TouchableOpacity>
      </View>

      {/* Timeframe Selector */}
      <View style={styles.timeframeContainer}>
        {['week', 'month', 'quarter', 'year'].map(period => (
          <TouchableOpacity
            key={period}
            style={[
              styles.timeframeButton,
              { backgroundColor: timeframe === period ? ecoDefenderColor : theme.cardBackground }
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
        {/* Key Performance Metrics */}
        <MetricSection title="Key Performance Indicators">
          <View style={styles.kpiGrid}>
            <ImpactCard
              title="Jobs Posted"
              value={impactMetrics.totalJobsPosted}
              subtitle="This month"
              icon="briefcase"
              color={ecoDefenderColor}
            />
            <ImpactCard
              title="Total Investment"
              value={`$${impactMetrics.totalInvestment.toLocaleString()}`}
              subtitle="Environmental programs"
              icon="card"
              color="#28a745"
            />
            <ImpactCard
              title="Heroes Employed"
              value={impactMetrics.communityEngagement.heroesEmployed}
              subtitle="Professional cleaners"
              icon="shield"
              color="#28a745"
            />
            <ImpactCard
              title="Volunteers Engaged"
              value={impactMetrics.communityEngagement.volunteersInvolved}
              subtitle="Community participants"
              icon="heart"
              color="#dc3545"
            />
          </View>
        </MetricSection>

        {/* Environmental Impact */}
        <MetricSection title="Environmental Impact">
          <View style={styles.environmentalGrid}>
            <View style={[styles.envCard, { backgroundColor: theme.cardBackground }]}>
              <Ionicons name="trash-bin" size={24} color="#28a745" />
              <Text style={[styles.envValue, { color: theme.textColor }]}>
                {impactMetrics.environmentalImpact.wasteCollected} kg
              </Text>
              <Text style={[styles.envLabel, { color: theme.secondaryText }]}>Waste Collected</Text>
            </View>
            <View style={[styles.envCard, { backgroundColor: theme.cardBackground }]}>
              <Ionicons name="leaf" size={24} color="#20c997" />
              <Text style={[styles.envValue, { color: theme.textColor }]}>
                {impactMetrics.environmentalImpact.treesPlanted}
              </Text>
              <Text style={[styles.envLabel, { color: theme.secondaryText }]}>Trees Planted</Text>
            </View>
            <View style={[styles.envCard, { backgroundColor: theme.cardBackground }]}>
              <Ionicons name="cloud" size={24} color="#6c5ce7" />
              <Text style={[styles.envValue, { color: theme.textColor }]}>
                {impactMetrics.environmentalImpact.carbonOffset} kg
              </Text>
              <Text style={[styles.envLabel, { color: theme.secondaryText }]}>CO₂ Offset</Text>
            </View>
            <View style={[styles.envCard, { backgroundColor: theme.cardBackground }]}>
              <Ionicons name="water" size={24} color="#0dcaf0" />
              <Text style={[styles.envValue, { color: theme.textColor }]}>
                {impactMetrics.environmentalImpact.waterSaved} L
              </Text>
              <Text style={[styles.envLabel, { color: theme.secondaryText }]}>Water Saved</Text>
            </View>
          </View>
        </MetricSection>

        {/* Investment Trends */}
        <MetricSection title="Monthly Investment & Impact">
          <View style={[styles.chartContainer, { backgroundColor: theme.cardBackground }]}>
            <CustomLineChart
              data={monthlyData}
              color={ecoDefenderColor}
              height={200}
            />
          </View>
        </MetricSection>

        {/* Category Breakdown */}
        <MetricSection title="Investment by Category">
          <View style={[styles.chartContainer, { backgroundColor: theme.cardBackground }]}>
            <CustomBarChart
              data={categoryData}
              height={200}
              color={ecoDefenderColor}
              showLabels={true}
            />
          </View>
        </MetricSection>

        {/* Business Value Metrics */}
        <MetricSection title="Business Value & ROI">
          <View style={styles.businessGrid}>
            <View style={[styles.businessCard, { backgroundColor: theme.cardBackground }]}>
              <View style={styles.businessHeader}>
                <Ionicons name="trending-up" size={20} color={ecoDefenderColor} />
                <Text style={[styles.businessTitle, { color: theme.textColor }]}>Brand Visibility</Text>
              </View>
              <Text style={[styles.businessValue, { color: ecoDefenderColor }]}>
                {impactMetrics.businessMetrics.brandVisibility}%
              </Text>
              <Text style={[styles.businessSubtitle, { color: theme.secondaryText }]}>
                Market awareness increase
              </Text>
            </View>
            
            <View style={[styles.businessCard, { backgroundColor: theme.cardBackground }]}>
              <View style={styles.businessHeader}>
                <Ionicons name="checkmark-circle" size={20} color="#28a745" />
                <Text style={[styles.businessTitle, { color: theme.textColor }]}>CSR Goals</Text>
              </View>
              <Text style={[styles.businessValue, { color: '#28a745' }]}>
                {impactMetrics.businessMetrics.csrGoalsAchieved}%
              </Text>
              <Text style={[styles.businessSubtitle, { color: theme.secondaryText }]}>
                Achieved this year
              </Text>
            </View>
            
            <View style={[styles.businessCard, { backgroundColor: theme.cardBackground }]}>
              <View style={styles.businessHeader}>
                <Ionicons name="people" size={20} color="#8b5cf6" />
                <Text style={[styles.businessTitle, { color: theme.textColor }]}>Stakeholder Satisfaction</Text>
              </View>
              <Text style={[styles.businessValue, { color: '#8b5cf6' }]}>
                {impactMetrics.businessMetrics.stakeholderSatisfaction}%
              </Text>
              <Text style={[styles.businessSubtitle, { color: theme.secondaryText }]}>
                Survey rating
              </Text>
            </View>
            
            <View style={[styles.businessCard, { backgroundColor: theme.cardBackground }]}>
              <View style={styles.businessHeader}>
                <Ionicons name="megaphone" size={20} color="#fd7e14" />
                <Text style={[styles.businessTitle, { color: theme.textColor }]}>Media Reach</Text>
              </View>
              <Text style={[styles.businessValue, { color: theme.warning }]}>
                {impactMetrics.businessMetrics.mediaImpressions.toLocaleString()}
              </Text>
              <Text style={[styles.businessSubtitle, { color: theme.secondaryText }]}>
                Total impressions
              </Text>
            </View>
          </View>
        </MetricSection>

        {/* Action Buttons */}
        <View style={styles.actionSection}>
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: ecoDefenderColor }]}
            onPress={() => navigation.navigate('CreateImpactReport')}
          >
            <Ionicons name="document-text" size={20} color="white" />
            <Text style={styles.actionButtonText}>Generate Report</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: '#28a745' }]}
            onPress={() => navigation.navigate('PostJob')}
          >
            <Ionicons name="add-circle" size={20} color="white" />
            <Text style={styles.actionButtonText}>Post New Job</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.bottomSpacing} />
      </ScrollView>
      </ScreenLayout>
    </RoleGuard>
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
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  backButton: {
    padding: THEME.SPACING.sm,
  },
  headerTitle: {
    fontSize: THEME.TYPOGRAPHY.fontSize.lg,
    fontWeight: '700',
  },
  shareButton: {
    padding: THEME.SPACING.sm,
  },
  timeframeContainer: {
    flexDirection: 'row',
    paddingHorizontal: THEME.SPACING.md,
    paddingVertical: THEME.SPACING.sm + 4,
    gap: 8,
  },
  timeframeButton: {
    flex: 1,
    paddingVertical: THEME.SPACING.sm,
    paddingHorizontal: THEME.SPACING.sm + 4,
    borderRadius: THEME.BORDER_RADIUS.md,
    alignItems: 'center',
  },
  timeframeText: {
    fontSize: THEME.TYPOGRAPHY.fontSize.sm,
    fontWeight: '600',
  },
  content: {
    flex: 1,
  },
  metricSection: {
    marginVertical: THEME.SPACING.sm + 4,
  },
  sectionTitle: {
    fontSize: THEME.TYPOGRAPHY.fontSize.lg,
    fontWeight: '700',
    marginHorizontal: THEME.SPACING.md,
    marginBottom: THEME.SPACING.sm + 4,
  },
  sectionContent: {
    paddingHorizontal: THEME.SPACING.md,
  },
  kpiGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  impactCard: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    minWidth: '45%',
    padding: THEME.SPACING.sm + 4,
    borderRadius: THEME.BORDER_RADIUS.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  impactIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: THEME.SPACING.sm + 4,
  },
  impactContent: {
    flex: 1,
  },
  impactValue: {
    fontSize: THEME.TYPOGRAPHY.fontSize.lg,
    fontWeight: '700',
    marginBottom: 2,
  },
  impactTitle: {
    fontSize: THEME.TYPOGRAPHY.fontSize.xs,
    fontWeight: '600',
    marginBottom: 2,
  },
  impactSubtitle: {
    fontSize: THEME.TYPOGRAPHY.fontSize.xs,
  },
  environmentalGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  envCard: {
    flex: 1,
    minWidth: '45%',
    alignItems: 'center',
    padding: THEME.SPACING.md,
    borderRadius: THEME.BORDER_RADIUS.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  envValue: {
    fontSize: THEME.TYPOGRAPHY.fontSize.base,
    fontWeight: '700',
    marginVertical: THEME.SPACING.sm,
  },
  envLabel: {
    fontSize: THEME.TYPOGRAPHY.fontSize.xs,
    textAlign: 'center',
  },
  chartContainer: {
    borderRadius: THEME.BORDER_RADIUS.lg,
    padding: THEME.SPACING.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  businessGrid: {
    gap: 12,
  },
  businessCard: {
    padding: THEME.SPACING.md,
    borderRadius: THEME.BORDER_RADIUS.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  businessHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: THEME.SPACING.sm,
    gap: 8,
  },
  businessTitle: {
    fontSize: THEME.TYPOGRAPHY.fontSize.sm,
    fontWeight: '600',
  },
  businessValue: {
    fontSize: THEME.TYPOGRAPHY.fontSize["2xl"],
    fontWeight: '800',
    marginBottom: THEME.SPACING.xs,
  },
  businessSubtitle: {
    fontSize: THEME.TYPOGRAPHY.fontSize.xs,
  },
  actionSection: {
    flexDirection: 'row',
    paddingHorizontal: THEME.SPACING.md,
    paddingVertical: THEME.SPACING.md + 4,
    gap: 12,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: THEME.SPACING.sm + 4,
    paddingHorizontal: THEME.SPACING.md,
    borderRadius: THEME.BORDER_RADIUS.md,
    gap: 8,
  },
  actionButtonText: {
    // color: theme.background,
    fontSize: THEME.TYPOGRAPHY.fontSize.sm,
    fontWeight: '600',
  },
  bottomSpacing: {
    height: 40,
  },
});

export default EcoDefenderImpact;