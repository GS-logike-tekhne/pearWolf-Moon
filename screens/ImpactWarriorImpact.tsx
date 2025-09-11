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

const { width } = Dimensions.get('window');

interface ImpactWarriorImpactProps {
  navigation: any;
}

const ImpactWarriorImpact: React.FC<ImpactWarriorImpactProps> = ({ navigation }) => {
  const { theme } = useTheme();
  const impactWarriorColor = getRoleColor('impact-warrior');
  
  const [timeframe, setTimeframe] = useState<'week' | 'month' | 'quarter' | 'year'>('month');
  
  // Impact Warrior metrics
  const impactMetrics = {
    personalImpact: {
      totalActivities: 34,
      hoursContributed: 128,
      ecoPointsEarned: 2450,
      currentStreak: 12,
    },
    environmentalImpact: {
      wasteCollected: 890, // kg
      treesPlanted: 23,
      carbonFootprintReduced: 340, // kg CO2
      waterConserved: 560, // liters
    },
    communityImpact: {
      eventsJoined: 18,
      teamCollaborations: 7,
      newVolunteersRecruited: 5,
      communitiesServed: 4,
    },
    achievements: {
      badgesEarned: 12,
      milestonesReached: 8,
      leaderboardRank: 15,
      impactScore: 2847,
    }
  };

  const monthlyData = [
    { month: 'Jan', activities: 4, hours: 18, impact: 420 },
    { month: 'Feb', activities: 6, hours: 22, impact: 510 },
    { month: 'Mar', activities: 5, hours: 19, impact: 380 },
    { month: 'Apr', activities: 8, hours: 28, impact: 640 },
    { month: 'May', activities: 7, hours: 25, impact: 590 },
    { month: 'Jun', activities: 6, hours: 21, impact: 470 },
  ];

  const activityData = [
    { activity: 'Beach Cleanup', count: 12, hours: 48 },
    { activity: 'Park Restoration', count: 8, hours: 32 },
    { activity: 'River Cleanup', count: 6, hours: 24 },
    { activity: 'Tree Planting', count: 5, hours: 15 },
    { activity: 'Education Events', count: 3, hours: 9 },
  ];

  const ImpactCard = ({ title, value, subtitle, icon, color, trend }: any) => (
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
        {trend && (
          <View style={styles.trendContainer}>
            <Ionicons 
              name={trend > 0 ? "trending-up" : "trending-down"} 
              size={12} 
              color={trend > 0 ? getRoleColor('trash-hero') : getRoleColor('impact-warrior')} 
            />
            <Text style={[styles.trendText, { color: trend > 0 ? getRoleColor('trash-hero') : getRoleColor('impact-warrior') }]}>
              {Math.abs(trend)}% vs last month
            </Text>
          </View>
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

  const AchievementBadge = ({ title, icon, color, isEarned }: any) => (
    <View style={[styles.badgeContainer, { opacity: isEarned ? 1 : 0.5 }]}>
      <View style={[styles.badge, { backgroundColor: isEarned ? color : '#6c757d' }]}>
        <Ionicons name={icon} size={16} color="white" />
      </View>
      <Text style={[styles.badgeTitle, { color: theme.textColor }]}>{title}</Text>
    </View>
  );

  return (
    <ScreenLayout>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: theme.cardBackground }]}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color={getRoleColor('impact-warrior')} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.textColor }]}>
          My Impact Dashboard
        </Text>
        <TouchableOpacity
          style={styles.shareButton}
          onPress={() => {/* Share impact story */}}
        >
          <Ionicons name="share" size={24} color={impactWarriorColor} />
        </TouchableOpacity>
      </View>

      {/* Timeframe Selector */}
      <View style={styles.timeframeContainer}>
        {['week', 'month', 'quarter', 'year'].map(period => (
          <TouchableOpacity
            key={period}
            style={[
              styles.timeframeButton,
              { backgroundColor: timeframe === period ? impactWarriorColor : theme.cardBackground }
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
        {/* Personal Impact Summary */}
        <MetricSection title="Personal Impact Summary">
          <View style={styles.summaryGrid}>
            <ImpactCard
              title="Activities Joined"
              value={impactMetrics.personalImpact.totalActivities}
              subtitle="This month"
              icon="leaf"
              color={impactWarriorColor}
              trend={15}
            />
            <ImpactCard
              title="Hours Contributed"
              value={`${impactMetrics.personalImpact.hoursContributed}h`}
              subtitle="Volunteering time"
              icon="time"
              color="#28a745"
              trend={8}
            />
            <ImpactCard
              title="Eco Points"
              value={impactMetrics.personalImpact.ecoPointsEarned}
              subtitle="Total earned"
              icon="star"
              color="#ffc107"
              trend={22}
            />
            <ImpactCard
              title="Current Streak"
              value={`${impactMetrics.personalImpact.currentStreak} days`}
              subtitle="Keep it up!"
              icon="flame"
              color={getRoleColor('admin')}
              trend={0}
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
                {impactMetrics.environmentalImpact.carbonFootprintReduced} kg
              </Text>
              <Text style={[styles.envLabel, { color: theme.secondaryText }]}>CO₂ Reduced</Text>
            </View>
            <View style={[styles.envCard, { backgroundColor: theme.cardBackground }]}>
              <Ionicons name="water" size={24} color="#0dcaf0" />
              <Text style={[styles.envValue, { color: theme.textColor }]}>
                {impactMetrics.environmentalImpact.waterConserved} L
              </Text>
              <Text style={[styles.envLabel, { color: theme.secondaryText }]}>Water Conserved</Text>
            </View>
          </View>
        </MetricSection>

        {/* Activity Trends */}
        <MetricSection title="Monthly Activity & Impact">
          <View style={[styles.chartContainer, { backgroundColor: theme.cardBackground }]}>
            <CustomLineChart
              data={monthlyData}
              primaryKey="activities"
              secondaryKey="impact"
              height={200}
              primaryColor={impactWarriorColor}
              secondaryColor="#28a745"
              primaryLabel="Activities"
              secondaryLabel="Impact Score"
            />
          </View>
        </MetricSection>

        {/* Activity Breakdown */}
        <MetricSection title="Activity Breakdown">
          <View style={[styles.chartContainer, { backgroundColor: theme.cardBackground }]}>
            <CustomBarChart
              data={activityData}
              dataKey="count"
              height={200}
              color={impactWarriorColor}
              labelKey="activity"
            />
          </View>
        </MetricSection>

        {/* Community Impact */}
        <MetricSection title="Community Engagement">
          <View style={styles.communityGrid}>
            <View style={[styles.communityCard, { backgroundColor: theme.cardBackground }]}>
              <View style={styles.communityHeader}>
                <Ionicons name="people" size={20} color={impactWarriorColor} />
                <Text style={[styles.communityTitle, { color: theme.textColor }]}>Events Joined</Text>
              </View>
              <Text style={[styles.communityValue, { color: impactWarriorColor }]}>
                {impactMetrics.communityImpact.eventsJoined}
              </Text>
              <Text style={[styles.communitySubtitle, { color: theme.secondaryText }]}>
                Community cleanups
              </Text>
            </View>
            
            <View style={[styles.communityCard, { backgroundColor: theme.cardBackground }]}>
              <View style={styles.communityHeader}>
                <Ionicons name="hand-left" size={20} color="#28a745" />
                <Text style={[styles.communityTitle, { color: theme.textColor }]}>Team Collaborations</Text>
              </View>
              <Text style={[styles.communityValue, { color: '#28a745' }]}>
                {impactMetrics.communityImpact.teamCollaborations}
              </Text>
              <Text style={[styles.communitySubtitle, { color: theme.secondaryText }]}>
                Group activities
              </Text>
            </View>
            
            <View style={[styles.communityCard, { backgroundColor: theme.cardBackground }]}>
              <View style={styles.communityHeader}>
                <Ionicons name="person-add" size={20} color="#8b5cf6" />
                <Text style={[styles.communityTitle, { color: theme.textColor }]}>Volunteers Recruited</Text>
              </View>
              <Text style={[styles.communityValue, { color: '#8b5cf6' }]}>
                {impactMetrics.communityImpact.newVolunteersRecruited}
              </Text>
              <Text style={[styles.communitySubtitle, { color: theme.secondaryText }]}>
                New members
              </Text>
            </View>
            
            <View style={[styles.communityCard, { backgroundColor: theme.cardBackground }]}>
              <View style={styles.communityHeader}>
                <Ionicons name="location" size={20} color={getRoleColor('admin')} />
                <Text style={[styles.communityTitle, { color: theme.textColor }]}>Communities Served</Text>
              </View>
              <Text style={[styles.communityValue, { color: getRoleColor('admin') }]}>
                {impactMetrics.communityImpact.communitiesServed}
              </Text>
              <Text style={[styles.communitySubtitle, { color: theme.secondaryText }]}>
                Different areas
              </Text>
            </View>
          </View>
        </MetricSection>

        {/* Achievements & Badges */}
        <MetricSection title="Achievements & Badges">
          <View style={styles.achievementStats}>
            <View style={[styles.achievementCard, { backgroundColor: theme.cardBackground }]}>
              <Text style={[styles.achievementValue, { color: impactWarriorColor }]}>
                {impactMetrics.achievements.badgesEarned}
              </Text>
              <Text style={[styles.achievementLabel, { color: theme.textColor }]}>Badges Earned</Text>
            </View>
            <View style={[styles.achievementCard, { backgroundColor: theme.cardBackground }]}>
              <Text style={[styles.achievementValue, { color: '#28a745' }]}>
                #{impactMetrics.achievements.leaderboardRank}
              </Text>
              <Text style={[styles.achievementLabel, { color: theme.textColor }]}>Leaderboard</Text>
            </View>
            <View style={[styles.achievementCard, { backgroundColor: theme.cardBackground }]}>
              <Text style={[styles.achievementValue, { color: theme.warning }]}>
                {impactMetrics.achievements.impactScore}
              </Text>
              <Text style={[styles.achievementLabel, { color: theme.textColor }]}>Impact Score</Text>
            </View>
          </View>
          
          <View style={styles.badgesGrid}>
            <AchievementBadge title="First Cleanup" icon="medal" color="#ffc107" isEarned={true} />
            <AchievementBadge title="Week Warrior" icon="calendar" color="#28a745" isEarned={true} />
            <AchievementBadge title="Team Player" icon="people" color={getRoleColor('business')} isEarned={true} />
            <AchievementBadge title="Eco Champion" icon="leaf" color="#20c997" isEarned={true} />
            <AchievementBadge title="Streak Master" icon="flame" color={getRoleColor('admin')} isEarned={true} />
            <AchievementBadge title="Community Leader" icon="star" color="#8b5cf6" isEarned={false} />
          </View>
        </MetricSection>

        {/* Action Buttons */}
        <View style={styles.actionSection}>
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: impactWarriorColor }]}
            onPress={() => navigation.navigate('ImpactWarriorMissions')}
          >
            <Ionicons name="leaf" size={20} color="white" />
            <Text style={styles.actionButtonText}>Join Mission</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: '#28a745' }]}
            onPress={() => navigation.navigate('BadgeSystem', { userRole: 'VOLUNTEER' })}
          >
            <Ionicons name="medal" size={20} color="white" />
            <Text style={styles.actionButtonText}>View Badges</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.bottomSpacing} />
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
  summaryGrid: {
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
    fontSize: THEME.TYPOGRAPHY.fontSize.base,
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
    marginBottom: THEME.SPACING.xs,
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
  communityGrid: {
    gap: 12,
  },
  communityCard: {
    padding: THEME.SPACING.md,
    borderRadius: THEME.BORDER_RADIUS.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  communityHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: THEME.SPACING.sm,
    gap: 8,
  },
  communityTitle: {
    fontSize: THEME.TYPOGRAPHY.fontSize.sm,
    fontWeight: '600',
  },
  communityValue: {
    fontSize: THEME.TYPOGRAPHY.fontSize["2xl"],
    fontWeight: '800',
    marginBottom: THEME.SPACING.xs,
  },
  communitySubtitle: {
    fontSize: THEME.TYPOGRAPHY.fontSize.xs,
  },
  achievementStats: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: THEME.SPACING.md,
  },
  achievementCard: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: THEME.SPACING.sm + 4,
    borderRadius: THEME.BORDER_RADIUS.md,
  },
  achievementValue: {
    fontSize: THEME.TYPOGRAPHY.fontSize.lg,
    fontWeight: '700',
    marginBottom: 2,
  },
  achievementLabel: {
    fontSize: THEME.TYPOGRAPHY.fontSize.xs,
  },
  badgesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  badgeContainer: {
    alignItems: 'center',
    minWidth: '30%',
  },
  badge: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: THEME.SPACING.xs,
  },
  badgeTitle: {
    fontSize: THEME.TYPOGRAPHY.fontSize.xs,
    textAlign: 'center',
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

export default ImpactWarriorImpact;