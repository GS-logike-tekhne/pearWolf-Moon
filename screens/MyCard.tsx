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
import { isUserVerified, getVerificationBadgeText } from '../utils/verification';
import { useTheme } from '../context/ThemeContext';
import { THEME } from '../styles/theme';
import ScreenLayout from '../components/ScreenLayout';
import { useXP } from '../context/XPContext';
import { useXP as useXPHook } from '../hooks/useXP';
import { XPProgressBar } from '../components/XPProgressBar';
import { useAuth } from '../context/AuthContext';
import LabProgressCard from '../components/LabProgressCard';
import { formatCO2Offset } from '../utils/weightUtils';
import { getUserStatsByRole } from '../utils/mockData';
import { EvolutionAnimation } from '../components/EvolutionAnimation';
import { getCurrentUser, UserRole } from '../data/userStats';

const { width } = Dimensions.get('window');

interface MyCardProps {
  navigation: any;
  route: any;
}

const MyCard: React.FC<MyCardProps> = ({ navigation, route }) => {
  const { theme } = useTheme();
  const { state: xpState } = useXP();
  const { user } = useAuth();
  const role = (route?.params?.role || 'trash-hero') as UserRole;
  const [selectedAttribute, setSelectedAttribute] = useState<string | null>(null);
  
  // Get dynamic user data
  const currentUser = getCurrentUser(role);
  const { profile, stats, levelData } = currentUser;
  
  // Use the new enhanced XP system with dynamic data
  const enhancedXP = useXPHook(stats.totalXP);
  const { 
    currentLevel, 
    nextLevel, 
    xpToNext, 
    progressPercent, 
    addXP, 
    getXPSummary,
    levelUpHistory 
  } = enhancedXP;
  
  // Evolution animation state
  const [showEvolutionAnimation, setShowEvolutionAnimation] = useState(false);
  const [evolutionData, setEvolutionData] = useState<{
    currentLevel: any;
    newLevel: any;
  } | null>(null);

  // Check for level up and trigger animation
  useEffect(() => {
    if (levelUpHistory.length > 0) {
      const latestLevelUp = levelUpHistory[levelUpHistory.length - 1];
      const previousLevel = levelUpHistory.length > 1 ? levelUpHistory[levelUpHistory.length - 2] : currentLevel;
      
      setEvolutionData({
        currentLevel: previousLevel,
        newLevel: latestLevelUp,
      });
      setShowEvolutionAnimation(true);
    }
  }, [levelUpHistory]);
  
  // Role configuration using dynamic data
  const getRoleConfig = () => {
    const latestBadge = stats.badges[stats.badges.length - 1];
    
    return {
      title: profile.name,
      subtitle: getRoleSubtitle(role),
      color: getRoleColor(role),
      level: currentLevel.level,
      points: stats.totalXP,
      progress: progressPercent / 100,
      nextLevelPoints: xpToNext,
      badge: latestBadge?.name || 'New Hero',
      badgeIcon: latestBadge?.icon || '🌟',
      badgeDescription: latestBadge?.description || 'Making an impact!',
      nextRank: nextLevel?.title || 'Max Level',
      avatar: profile.avatar || 'U',
    };
  };

  const getRoleSubtitle = (userRole: UserRole): string => {
    switch (userRole) {
      case 'trash-hero': return 'Professional Cleaner';
      case 'impact-warrior': return 'Community Volunteer';
      case 'eco-defender': return 'Environmental Investor';
      case 'admin': return 'System Administrator';
      default: return 'PEAR User';
    }
  };

  // Role-specific 6-metric layout using dynamic stats
  const getMetrics = () => {
    switch (role) {
      case 'trash-hero':
        return [
          { label: 'Jobs Completed', value: stats.jobsCompleted?.toString() || '0', icon: 'briefcase', color: theme.primary },
          { label: 'Total Earned', value: stats.totalEarned || '$0', icon: 'card', color: theme.primary },
          { label: 'Impact Radius', value: stats.impactRadius, icon: 'location', color: theme.primary },
          { label: 'Success Rate', value: stats.successRate || '100%', icon: 'shield-checkmark', color: theme.primary },
          { label: 'Hours Worked', value: stats.hoursWorked || '0h', icon: 'time', color: theme.primary },
          { label: 'Verified Events', value: stats.verifiedEvents.toString(), icon: 'shield-checkmark', color: '#10b981' },
        ];
      case 'impact-warrior':
        return [
          { label: 'Events Joined', value: stats.eventsJoined?.toString() || '0', icon: 'people', color: theme.primary },
          { label: 'Impact Points', value: stats.impactPoints || '0', icon: 'star', color: theme.primary },
          { label: 'Community Radius', value: stats.communityRadius || '0km', icon: 'location', color: theme.primary },
          { label: 'Cleanups Led', value: stats.cleanupsLed?.toString() || '0', icon: 'people-circle', color: theme.primary },
          { label: 'Volunteer Hours', value: stats.volunteerHours || '0h', icon: 'time', color: theme.primary },
          { label: 'Verified Events', value: stats.verifiedEvents.toString(), icon: 'shield-checkmark', color: '#10b981' },
        ];
      case 'eco-defender':
        return [
          { label: 'Funded Jobs', value: stats.fundedJobs?.toString() || '0', icon: 'briefcase', color: theme.primary },
          { label: 'Total Investment', value: stats.totalInvestment || '$0', icon: 'card', color: theme.primary },
          { label: 'Impact Radius', value: stats.impactRadius, icon: 'location', color: theme.primary },
          { label: 'Jobs Created', value: stats.jobsCreated?.toString() || '0', icon: 'people', color: theme.primary },
          { label: 'CO₂ Offset', value: stats.co2Offset || '0 tons', icon: 'leaf', color: theme.primary },
          { label: 'Verified Events', value: stats.verifiedEvents.toString(), icon: 'shield-checkmark', color: '#10b981' },
        ];
      case 'admin':
        return [
          { label: 'Users Managed', value: stats.usersManaged?.toString() || '0', icon: 'people', color: theme.primary },
          { label: 'System Uptime', value: stats.systemUptime || '100%', icon: 'speedometer', color: theme.primary },
          { label: 'Platform Reach', value: stats.platformReach || 'Global', icon: 'location', color: theme.primary },
          { label: 'Issues Resolved', value: stats.issuesResolved?.toString() || '0', icon: 'checkmark-circle', color: theme.primary },
          { label: 'Jobs Overseen', value: stats.jobsOverseen?.toString() || '0', icon: 'eye', color: theme.primary },
          { label: 'Verified Events', value: stats.verifiedEvents.toString(), icon: 'shield-checkmark', color: '#10b981' },
        ];
      default:
        return [
          { label: 'XP Points', value: stats.totalXP.toString(), icon: 'star', color: theme.primary },
          { label: 'Current Level', value: currentLevel.level.toString(), icon: 'trending-up', color: theme.primary },
          { label: 'Impact Radius', value: stats.impactRadius, icon: 'location', color: theme.primary },
          { label: 'Badges Earned', value: stats.badges.length.toString(), icon: 'trophy', color: theme.primary },
          { label: 'Streak', value: `${stats.streak} days`, icon: 'flame', color: theme.primary },
          { label: 'Verified Events', value: stats.verifiedEvents.toString(), icon: 'shield-checkmark', color: '#10b981' },
        ];
    }
  };

  const roleConfig = getRoleConfig();
  const metrics = getMetrics();

  // Get attributes based on XP and achievements
  const attributes = {
    efficiency: Math.min(100, 65 + Math.floor((xpState.totalXP || 0) / 100) * 2),
    impact: Math.min(100, 78 + (xpState.badges?.length || 0) * 3),
    reliability: Math.min(100, 92 + (xpState.streak || 1) * 2),
    speed: Math.min(100, 73 + Math.floor((xpState.totalXP || 0) / 100) * 2),
  };

  const AttributeBar = ({ label, value, color }: { label: string; value: number; color: string; animationKey?: string }) => (
    <TouchableOpacity 
      style={styles.attributeContainer}
      onPress={() => setSelectedAttribute(selectedAttribute === label ? null : label)}
      activeOpacity={0.7}
    >
      <View style={styles.attributeHeader}>
        <Text style={[styles.attributeLabel, { color: theme.textColor }]}>{label}</Text>
        <View style={styles.attributeValueContainer}>
          <Text style={[styles.attributeValue, { color: color }]}>{value}</Text>
          {value >= 90 && <Text style={styles.attributeGlow}>✨</Text>}
        </View>
      </View>
      <View style={[styles.attributeBarBg, { backgroundColor: `${color}20` }]}>
        <View 
          style={[styles.attributeBarFill, { backgroundColor: color, width: `${value}%` }]}
        />
      </View>
      {selectedAttribute === label && (
        <Text style={[styles.attributeDescription, { color: theme.secondaryText }]}>
          {getAttributeDescription(label)}
        </Text>
      )}
    </TouchableOpacity>
  );

  const getAttributeDescription = (attribute: string): string => {
    const descriptions: { [key: string]: string } = {
      'Efficiency': 'How quickly and effectively you complete missions',
      'Impact': 'Your overall environmental contribution score', 
      'Reliability': 'Consistency in completing assigned missions',
      'Speed': 'Average time to complete missions compared to others',
    };
    return descriptions[attribute] || 'Mission performance attribute';
  };

  const MetricCard = ({ metric }: any) => (
    <View style={[styles.metricCard, { backgroundColor: theme.cardBackground }]}>
      <View style={[styles.metricIcon, { backgroundColor: metric.color }]}>
        <Ionicons name={metric.icon} size={16} color="white" />
      </View>
      <Text style={[styles.metricValue, { color: theme.textColor }]}>{metric.value}</Text>
      <Text style={[styles.metricLabel, { color: theme.secondaryText }]}>{metric.label}</Text>
    </View>
  );

  return (
    <ScreenLayout>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: theme.background }]}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color={roleConfig.color} />
        </TouchableOpacity>
        
        <Text style={[styles.headerTitle, { color: theme.textColor }]}>My PEAR Card</Text>
        
        <View style={[styles.pearBadge, { backgroundColor: roleConfig.color }]}>
          <Text style={styles.pearIcon}>🍐</Text>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Verification Badge Section */}
        <View style={styles.verificationSection}>
          {user && isUserVerified(user) ? (
            <View style={styles.verifiedBadge}>
              <Ionicons name="checkmark-circle" size={16} color={getRoleColor(role)} />
              <Text style={[styles.verifiedText, { color: getRoleColor(role) }]}>
                {getVerificationBadgeText(user)}
              </Text>
            </View>
          ) : (
            <TouchableOpacity style={[styles.getVerifiedButton, { borderColor: getRoleColor(role) }]}>
              <Ionicons name="shield-outline" size={16} color={getRoleColor(role)} />
              <Text style={[styles.getVerifiedText, { color: getRoleColor(role) }]}>Get Verified</Text>
            </TouchableOpacity>
          )}
        </View>
        {/* My Card Section */}
        <View style={[styles.myCard, { backgroundColor: theme.cardBackground }]}>
          {/* Profile Section */}
          <View style={styles.profileSection}>
            <View style={[styles.profileAvatar, { backgroundColor: roleConfig.color }]}>
              <Text style={styles.avatarText}>{roleConfig.avatar}</Text>
              <View style={styles.avatarBadge}>
                <Ionicons name="checkmark" size={12} color="white" />
              </View>
            </View>
            
            <View style={styles.profileInfo}>
              <Text style={[styles.profileName, { color: theme.textColor }]}>{roleConfig.title}</Text>
              <Text style={[styles.profileRole, { color: theme.secondaryText }]}>{roleConfig.subtitle}</Text>
              <View style={styles.badgeContainer}>
                <Text style={styles.badgeEmoji}>{roleConfig.badgeIcon}</Text>
                <Text style={[styles.badgeText, { color: roleConfig.color }]}>{roleConfig.badge}</Text>
              </View>
              <Text style={[styles.badgeDescription, { color: theme.secondaryText }]}>
                {roleConfig.badgeDescription}
              </Text>
            </View>
            
          </View>
          
          {/* XP Progress Section */}
          <View style={styles.progressSection}>
            <View style={styles.progressHeader}>
              <Text style={[styles.progressTitle, { color: theme.textColor }]}>
                Progress to 🏆 {roleConfig.nextRank}
              </Text>
              <View style={[styles.evolutionBadge, { backgroundColor: roleConfig.color }]}>
                <Ionicons name="trending-up" size={12} color="white" />
                <Text style={styles.evolutionText}>Evolution</Text>
              </View>
            </View>
            
            <XPProgressBar 
              progress={progressPercent / 100} 
              level={currentLevel.level}
              levelTitle={currentLevel.title}
              nextXP={xpToNext}
              color={roleConfig.color}
              showLabel={false}
              showXPText={true}
            />
            
            <View style={styles.progressFooter}>
              <Text style={[styles.progressPercentage, { color: theme.textColor }]}>
                {progressPercent}%
              </Text>
              <Text style={[styles.progressRemaining, { color: theme.secondaryText }]}>
                {xpToNext} XP to {nextLevel?.title || 'Max Level'}
              </Text>
            </View>
            
            {/* Demo XP Gain Button */}
            <TouchableOpacity 
              style={[styles.xpButton, { backgroundColor: roleConfig.color }]}
              onPress={() => addXP(50, 'demo_gain')}
              activeOpacity={0.8}
            >
              <Ionicons name="add-circle" size={16} color="white" />
              <Text style={styles.xpButtonText}>Gain 50 XP</Text>
            </TouchableOpacity>
          </View>
          
          {/* Dynamic Attributes Section */}
          <View style={styles.attributesSection}>
            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionTitle, { color: theme.textColor }]}>⚡ Dynamic Attributes</Text>
              <View style={[styles.liveBadge, { backgroundColor: roleConfig.color }]}>
                <Text style={styles.liveText}>LIVE</Text>
              </View>
            </View>
            
            <View style={styles.attributesList}>
              <AttributeBar 
                label="Efficiency" 
                value={attributes.efficiency} 
                color={roleConfig.color || theme.primary}
                animationKey="efficiency"
              />
              <AttributeBar 
                label="Impact" 
                value={attributes.impact} 
                color="#28A745"
                animationKey="impact"
              />
              <AttributeBar 
                label="Reliability" 
                value={attributes.reliability} 
                color="#007bff"
                animationKey="reliability"
              />
              <AttributeBar 
                label="Speed" 
                value={attributes.speed} 
                color="#8b5cf6"
                animationKey="speed"
              />
            </View>
          </View>

          {/* Recent Achievements */}
          {xpState.badges && xpState.badges.length > 0 && (
            <View style={styles.achievementsSection}>
              <Text style={[styles.sectionTitle, { color: theme.textColor }]}>🏆 Recent Achievements</Text>
              <ScrollView 
                {...({ horizontal: true, showsHorizontalScrollIndicator: false } as any)}
                style={styles.achievementsList}
              >
                {xpState.badges.slice(0, 5).map((badge, index) => (
                  <TouchableOpacity 
                    key={badge.id} 
                    style={[styles.achievementCard, { backgroundColor: theme.cardBackground }]}
                    onPress={() => setSelectedAttribute(selectedAttribute === badge.id ? null : badge.id)}
                  >
                    <Text style={styles.achievementIcon}>{badge.icon}</Text>
                    <Text style={[styles.achievementName, { color: theme.textColor }]}>{badge.name}</Text>
                    {selectedAttribute === badge.id && (
                      <Text style={[styles.achievementDesc, { color: theme.secondaryText }]}>
                        {badge.description}
                      </Text>
                    )}
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          )}

          {/* 6-Metric Grid */}
          <View style={styles.metricsContainer}>
            <View style={styles.metricsRow}>
              {metrics.slice(0, 3).map((metric, index) => (
                <MetricCard key={index} metric={metric} />
              ))}
            </View>
            <View style={styles.metricsRow}>
              {metrics.slice(3, 6).map((metric, index) => (
                <MetricCard key={index + 3} metric={metric} />
              ))}
            </View>
          </View>
        </View>

        {/* Park Restoration Lab Progress - Only for Impact Warriors */}
        {role === 'impact-warrior' && (
          <LabProgressCard
            progress={{
              totalQuests: 12,
              completedQuests: 3,
              currentStreak: 5,
              totalTreesPlanted: 15,
              totalParksRestored: 2,
              labLevel: 2,
              nextLevelXP: 250,
            }}
            onPress={() => navigation.navigate('ParkRestorationLab')}
          />
        )}

        <View style={styles.bottomSpacing} />
      </ScrollView>

      {/* Evolution Animation */}
      {evolutionData && (
        <EvolutionAnimation
          visible={showEvolutionAnimation}
          currentLevel={evolutionData.currentLevel}
          newLevel={evolutionData.newLevel}
          onComplete={() => setShowEvolutionAnimation(false)}
          roleColor={roleConfig.color}
        />
      )}
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
  backButton: {},
  headerTitle: {
    fontSize: THEME.TYPOGRAPHY.fontSize.lg,
    fontWeight: '700',
    flex: 1,
    textAlign: 'center',
    marginRight: THEME.SPACING.xl, // Compensate for back button
  },
  pearBadge: {
    width: 32,
    height: 32,
    borderRadius: THEME.BORDER_RADIUS.xl,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pearIcon: {
    fontSize: THEME.TYPOGRAPHY.fontSize.base,
    textAlign: 'center',
  },
  verificationSection: {
    alignItems: 'center',
    paddingHorizontal: THEME.SPACING.md,
    paddingVertical: THEME.SPACING.sm,
  },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  verifiedText: {
    fontSize: THEME.TYPOGRAPHY.fontSize.xs,
    fontWeight: '600',
  },
  content: {
    flex: 1,
  },
  myCard: {
    margin: THEME.SPACING.md,
    marginTop: THEME.SPACING.sm,
    borderRadius: THEME.BORDER_RADIUS.xl,
    padding: THEME.SPACING.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: THEME.SPACING.md + 4,
  },
  profileAvatar: {
    position: 'relative',
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: THEME.SPACING.md,
  },
  avatarText: {
    // color: theme.background,
    fontSize: THEME.TYPOGRAPHY.fontSize.lg,
    fontWeight: '700',
  },
  avatarBadge: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    backgroundColor: '#28a745',
    borderRadius: 10,
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: THEME.TYPOGRAPHY.fontSize.lg,
    fontWeight: '700',
    marginBottom: 2,
  },
  profileRole: {
    fontSize: THEME.TYPOGRAPHY.fontSize.sm,
    marginBottom: 6,
  },
  badgeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: THEME.SPACING.xs,
  },
  badgeEmoji: {
    fontSize: THEME.TYPOGRAPHY.fontSize.sm,
  },
  badgeText: {
    fontSize: THEME.TYPOGRAPHY.fontSize.sm,
    fontWeight: '600',
  },
  badgeDescription: {
    fontSize: THEME.TYPOGRAPHY.fontSize.xs,
    fontStyle: 'italic',
  },
  progressSection: {
    marginBottom: THEME.SPACING.md + 4,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: THEME.SPACING.sm,
  },
  progressTitle: {
    fontSize: THEME.TYPOGRAPHY.fontSize.sm,
    fontWeight: '600',
  },
  evolutionBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: THEME.SPACING.sm,
    paddingVertical: THEME.SPACING.xs,
    borderRadius: THEME.BORDER_RADIUS.lg,
    gap: 4,
  },
  evolutionText: {
    // color: theme.background,
    fontSize: THEME.TYPOGRAPHY.fontSize.xs,
    fontWeight: '600',
  },
  progressBarContainer: {
    height: 8,
    borderRadius: THEME.BORDER_RADIUS.sm,
    marginBottom: THEME.SPACING.sm,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: THEME.BORDER_RADIUS.sm,
  },
  progressFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  progressPercentage: {
    fontSize: THEME.TYPOGRAPHY.fontSize.sm,
    fontWeight: '600',
  },
  progressRemaining: {
    fontSize: THEME.TYPOGRAPHY.fontSize.xs,
  },
  metricsContainer: {
    gap: 12,
  },
  metricsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  metricCard: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: THEME.SPACING.sm + 4,
    borderRadius: THEME.BORDER_RADIUS.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  metricIcon: {
    width: 32,
    height: 32,
    borderRadius: THEME.BORDER_RADIUS.xl,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: THEME.SPACING.sm,
  },
  metricValue: {
    fontSize: THEME.TYPOGRAPHY.fontSize.sm,
    fontWeight: '700',
    marginBottom: 2,
  },
  metricLabel: {
    fontSize: THEME.TYPOGRAPHY.fontSize.xs,
    textAlign: 'center',
  },
  bottomSpacing: {
    height: 40,
  },
  // Dynamic Attributes Styles
  attributesSection: {
    marginBottom: THEME.SPACING.md + 4,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: THEME.SPACING.sm + 4,
  },
  sectionTitle: {
    fontSize: THEME.TYPOGRAPHY.fontSize.base,
    fontWeight: '700',
  },
  liveBadge: {
    paddingHorizontal: THEME.SPACING.sm,
    paddingVertical: THEME.SPACING.xs,
    borderRadius: 10,
  },
  liveText: {
    // color: theme.background,
    fontSize: THEME.TYPOGRAPHY.fontSize.xs,
    fontWeight: '700',
  },
  attributesList: {
    gap: 12,
  },
  attributeContainer: {
    paddingVertical: THEME.SPACING.sm,
  },
  attributeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  attributeLabel: {
    fontSize: THEME.TYPOGRAPHY.fontSize.sm,
    fontWeight: '600',
  },
  attributeValueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  attributeValue: {
    fontSize: THEME.TYPOGRAPHY.fontSize.sm,
    fontWeight: '700',
  },
  attributeGlow: {
    fontSize: THEME.TYPOGRAPHY.fontSize.xs,
  },
  attributeBarBg: {
    height: 6,
    borderRadius: 3,
    overflow: 'hidden',
  },
  attributeBarFill: {
    height: '100%',
    borderRadius: 3,
    minWidth: 2,
  },
  attributeDescription: {
    fontSize: THEME.TYPOGRAPHY.fontSize.xs,
    marginTop: THEME.SPACING.xs,
    fontStyle: 'italic',
  },
  // Achievements Styles
  achievementsSection: {
    marginBottom: THEME.SPACING.md + 4,
  },
  achievementsList: {
    marginTop: THEME.SPACING.sm,
  },
  achievementCard: {
    width: 120,
    padding: THEME.SPACING.sm + 4,
    borderRadius: THEME.BORDER_RADIUS.lg,
    marginRight: THEME.SPACING.sm,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  achievementIcon: {
    fontSize: THEME.TYPOGRAPHY.fontSize["2xl"],
    marginBottom: THEME.SPACING.xs,
  },
  achievementName: {
    fontSize: THEME.TYPOGRAPHY.fontSize.xs,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 2,
  },
  achievementDesc: {
    fontSize: THEME.TYPOGRAPHY.fontSize.xs,
    textAlign: 'center',
    marginTop: THEME.SPACING.xs,
  },
  getVerifiedButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: THEME.SPACING.sm + 4,
    paddingVertical: 6,
    borderWidth: 1,
    borderRadius: 20,
  },
  getVerifiedText: {
    fontSize: THEME.TYPOGRAPHY.fontSize.sm,
    fontWeight: '600',
    marginLeft: THEME.SPACING.xs,
  },
  xpButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: THEME.SPACING.sm,
    paddingHorizontal: THEME.SPACING.md,
    borderRadius: 20,
    marginTop: THEME.SPACING.sm + 4,
    gap: 6,
  },
  xpButtonText: {
    // color: theme.background,
    fontSize: THEME.TYPOGRAPHY.fontSize.sm,
    fontWeight: '600',
  },
});

export default MyCard;