import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getRoleColor } from '../utils/roleColors';
import { useTheme } from '../context/ThemeContext';
import CustomBarChart from '../components/CustomBarChart';
import CustomLineChart from '../components/CustomLineChart';

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
    { month: 'Jan', investment: 2100, impact: 340, heroes: 8 },
    { month: 'Feb', investment: 1800, impact: 420, heroes: 6 },
    { month: 'Mar', investment: 2400, impact: 510, heroes: 12 },
    { month: 'Apr', investment: 1950, impact: 380, heroes: 9 },
    { month: 'May', investment: 2200, impact: 470, heroes: 11 },
    { month: 'Jun', investment: 2400, impact: 520, heroes: 14 },
  ];

  const categoryData = [
    { category: 'Beach Cleanup', jobs: 18, investment: 4200 },
    { category: 'Park Restoration', jobs: 12, investment: 3800 },
    { category: 'River Cleanup', jobs: 8, investment: 2400 },
    { category: 'Urban Cleanup', jobs: 6, investment: 1800 },
    { category: 'Education', jobs: 3, investment: 650 },
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
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
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
              primaryKey="investment"
              secondaryKey="impact"
              height={200}
              primaryColor={ecoDefenderColor}
              secondaryColor="#28a745"
              primaryLabel="Investment ($)"
              secondaryLabel="Impact Score"
            />
          </View>
        </MetricSection>

        {/* Category Breakdown */}
        <MetricSection title="Investment by Category">
          <View style={[styles.chartContainer, { backgroundColor: theme.cardBackground }]}>
            <CustomBarChart
              data={categoryData}
              dataKey="investment"
              height={200}
              color={ecoDefenderColor}
              labelKey="category"
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
              <Text style={[styles.businessValue, { color: '#fd7e14' }]}>
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
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  shareButton: {
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
  metricSection: {
    marginVertical: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginHorizontal: 16,
    marginBottom: 12,
  },
  sectionContent: {
    paddingHorizontal: 16,
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
    padding: 12,
    borderRadius: 12,
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
    marginRight: 12,
  },
  impactContent: {
    flex: 1,
  },
  impactValue: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 2,
  },
  impactTitle: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 2,
  },
  impactSubtitle: {
    fontSize: 10,
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
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  envValue: {
    fontSize: 16,
    fontWeight: '700',
    marginVertical: 8,
  },
  envLabel: {
    fontSize: 12,
    textAlign: 'center',
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
  businessGrid: {
    gap: 12,
  },
  businessCard: {
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  businessHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 8,
  },
  businessTitle: {
    fontSize: 14,
    fontWeight: '600',
  },
  businessValue: {
    fontSize: 24,
    fontWeight: '800',
    marginBottom: 4,
  },
  businessSubtitle: {
    fontSize: 12,
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

export default EcoDefenderImpact;