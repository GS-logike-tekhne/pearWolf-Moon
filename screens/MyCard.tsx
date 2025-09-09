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
import { isUserVerified, getVerificationBadgeText } from '../utils/verification';
import { useTheme } from '../context/ThemeContext';
import { useXP } from '../context/XPContext';
import { useAuth } from '../context/AuthContext';

const { width } = Dimensions.get('window');

interface MyCardProps {
  navigation: any;
  route: any;
}

const MyCard: React.FC<MyCardProps> = ({ navigation, route }) => {
  const { theme } = useTheme();
  const { state: xpState } = useXP();
  const { user } = useAuth();
  const role = route?.params?.role || 'business';
  const [selectedAttribute, setSelectedAttribute] = useState<string | null>(null);
  
  // Role configuration with exact colors and data
  const getRoleConfig = () => {
    switch (role) {
      case 'trash-hero':
        return {
          title: 'TrashHero Pro',
          subtitle: 'Professional Cleaner',
          color: getRoleColor('trash-hero'),
          level: 6,
          points: 2450,
          progress: 85,
          nextLevelPoints: 150,
          badge: 'Elite Cleaner',
          badgeIcon: '🎯',
          badgeDescription: 'Professional Environmental Services',
          nextRank: 'Master Hero',
          avatar: 'TH',
        };
      case 'impact-warrior':
        return {
          title: 'Impact Warrior',
          subtitle: 'Community Volunteer',
          color: getRoleColor('impact-warrior'),
          level: 4,
          points: 1680,
          progress: 72,
          nextLevelPoints: 320,
          badge: 'Community Champion',
          badgeIcon: '❤️',
          badgeDescription: 'Leading Community Environmental Action',
          nextRank: 'Eco Guardian',
          avatar: 'IW',
        };
      case 'business':
        return {
          title: 'EcoDefender Corp',
          subtitle: 'EcoDefender',
          color: getRoleColor('business'),
          level: 6,
          points: 3450,
          progress: 93,
          nextLevelPoints: 150,
          badge: 'Green Pioneer',
          badgeIcon: '🌱',
          badgeDescription: 'Investing in Environmental Impact',
          nextRank: 'Impact Investor',
          avatar: 'EC',
        };
      case 'admin':
        return {
          title: 'Platform Admin',
          subtitle: 'System Administrator',
          color: '#fd7e14',
          level: 8,
          points: 5200,
          progress: 100,
          nextLevelPoints: 0,
          badge: 'Platform Guardian',
          badgeIcon: '🛡️',
          badgeDescription: 'Maintaining System Excellence',
          nextRank: 'System Master',
          avatar: 'PA',
        };
      default:
        return {
          title: 'EcoDefender Corp',
          subtitle: 'EcoDefender',
          color: getRoleColor('business'),
          level: 6,
          points: 3450,
          progress: 93,
          nextLevelPoints: 150,
          badge: 'Green Pioneer',
          badgeIcon: '🌱',
          badgeDescription: 'Investing in Environmental Impact',
          nextRank: 'Impact Investor',
          avatar: 'EC',
        };
    }
  };

  // Role-specific 6-metric layout
  const getMetrics = () => {
    switch (role) {
      case 'trash-hero':
        return [
          { label: 'Jobs Completed', value: '47', icon: 'briefcase', color: '#007bff' },
          { label: 'Total Earned', value: '$2,340', icon: 'card', color: '#007bff' },
          { label: 'Impact Radius', value: '12.3 km²', icon: 'location', color: '#007bff' },
          { label: 'Success Rate', value: '97%', icon: 'shield-checkmark', color: '#28A745' },
          { label: 'Hours Worked', value: '156h', icon: 'time', color: '#28A745' },
          { label: 'Eco Rating', value: '4.8★', icon: 'trophy', color: '#8b5cf6' },
        ];
      case 'impact-warrior':
        return [
          { label: 'Events Joined', value: '34', icon: 'people', color: '#007bff' },
          { label: 'Impact Points', value: '1,680', icon: 'star', color: '#007bff' },
          { label: 'Community Radius', value: '8.7 km²', icon: 'location', color: '#007bff' },
          { label: 'Cleanups Led', value: '12', icon: 'people-circle', color: '#28A745' },
          { label: 'Volunteer Hours', value: '128h', icon: 'time', color: '#28A745' },
          { label: 'Community Rank', value: '#23', icon: 'trophy', color: '#8b5cf6' },
        ];
      case 'business':
        return [
          { label: 'Funded Jobs', value: '12', icon: 'briefcase', color: '#007bff' },
          { label: 'Total Investment', value: '$3,240', icon: 'card', color: '#007bff' },
          { label: 'Impact Radius', value: '8.5 km²', icon: 'location', color: '#007bff' },
          { label: 'Jobs Created', value: '47', icon: 'people', color: '#28A745' },
          { label: 'CO₂ Offset', value: '850 kg', icon: 'leaf', color: '#28A745' },
          { label: 'ESG Rank', value: '#8', icon: 'trophy', color: '#8b5cf6' },
        ];
      case 'admin':
        return [
          { label: 'Users Managed', value: '1,247', icon: 'people', color: '#007bff' },
          { label: 'System Uptime', value: '99.8%', icon: 'speedometer', color: '#007bff' },
          { label: 'Platform Reach', value: '15 cities', icon: 'location', color: '#007bff' },
          { label: 'Issues Resolved', value: '156', icon: 'checkmark-circle', color: '#28A745' },
          { label: 'Jobs Overseen', value: '892', icon: 'eye', color: '#28A745' },
          { label: 'Admin Level', value: 'Master', icon: 'shield-checkmark', color: '#8b5cf6' },
        ];
      default:
        return [
          { label: 'Funded Jobs', value: '12', icon: 'briefcase', color: '#007bff' },
          { label: 'Total Investment', value: '$3,240', icon: 'card', color: '#007bff' },
          { label: 'Impact Radius', value: '8.5 km²', icon: 'location', color: '#007bff' },
          { label: 'Jobs Created', value: '47', icon: 'people', color: '#28A745' },
          { label: 'CO₂ Offset', value: '850 kg', icon: 'leaf', color: '#28A745' },
          { label: 'ESG Rank', value: '#8', icon: 'trophy', color: '#8b5cf6' },
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
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
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
          
          {/* Progress Section */}
          {roleConfig.progress < 100 && (
            <View style={styles.progressSection}>
              <View style={styles.progressHeader}>
                <Text style={[styles.progressTitle, { color: theme.textColor }]}>
                  Progress to 🏆 {roleConfig.nextRank}
                </Text>
                <View style={[styles.evolutionBadge, { backgroundColor: '#007bff' }]}>
                  <Ionicons name="trending-up" size={12} color="white" />
                  <Text style={styles.evolutionText}>Evolution</Text>
                </View>
              </View>
              
              <View style={[styles.progressBarContainer, { backgroundColor: 'rgba(0,123,255,0.2)' }]}>
                <View
                  style={[
                    styles.progressBarFill,
                    { backgroundColor: '#007bff', width: `${roleConfig.progress}%` }
                  ]}
                />
              </View>
              
              <View style={styles.progressFooter}>
                <Text style={[styles.progressPercentage, { color: theme.textColor }]}>{roleConfig.progress}%</Text>
                <Text style={[styles.progressRemaining, { color: theme.secondaryText }]}>{roleConfig.nextLevelPoints} pts to go</Text>
              </View>
            </View>
          )}
          
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
                color={roleConfig.color}
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
                horizontal={true} 
                showsHorizontalScrollIndicator={false} 
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
  },
  backButton: {},
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    flex: 1,
    textAlign: 'center',
    marginRight: 32, // Compensate for back button
  },
  pearBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pearIcon: {
    fontSize: 16,
    textAlign: 'center',
  },
  verificationSection: {
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  verifiedText: {
    fontSize: 12,
    fontWeight: '600',
  },
  content: {
    flex: 1,
  },
  myCard: {
    margin: 16,
    marginTop: 8,
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  profileAvatar: {
    position: 'relative',
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  avatarText: {
    color: 'white',
    fontSize: 18,
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
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 2,
  },
  profileRole: {
    fontSize: 14,
    marginBottom: 6,
  },
  badgeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 4,
  },
  badgeEmoji: {
    fontSize: 14,
  },
  badgeText: {
    fontSize: 14,
    fontWeight: '600',
  },
  badgeDescription: {
    fontSize: 12,
    fontStyle: 'italic',
  },
  progressSection: {
    marginBottom: 20,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  progressTitle: {
    fontSize: 14,
    fontWeight: '600',
  },
  evolutionBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  evolutionText: {
    color: 'white',
    fontSize: 10,
    fontWeight: '600',
  },
  progressBarContainer: {
    height: 8,
    borderRadius: 4,
    marginBottom: 8,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 4,
  },
  progressFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  progressPercentage: {
    fontSize: 14,
    fontWeight: '600',
  },
  progressRemaining: {
    fontSize: 12,
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
    paddingVertical: 12,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  metricIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  metricValue: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 2,
  },
  metricLabel: {
    fontSize: 10,
    textAlign: 'center',
  },
  bottomSpacing: {
    height: 40,
  },
  // Dynamic Attributes Styles
  attributesSection: {
    marginBottom: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
  },
  liveBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
  },
  liveText: {
    color: 'white',
    fontSize: 10,
    fontWeight: '700',
  },
  attributesList: {
    gap: 12,
  },
  attributeContainer: {
    paddingVertical: 8,
  },
  attributeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  attributeLabel: {
    fontSize: 14,
    fontWeight: '600',
  },
  attributeValueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  attributeValue: {
    fontSize: 14,
    fontWeight: '700',
  },
  attributeGlow: {
    fontSize: 12,
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
    fontSize: 12,
    marginTop: 4,
    fontStyle: 'italic',
  },
  // Achievements Styles
  achievementsSection: {
    marginBottom: 20,
  },
  achievementsList: {
    marginTop: 8,
  },
  achievementCard: {
    width: 120,
    padding: 12,
    borderRadius: 12,
    marginRight: 8,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  achievementIcon: {
    fontSize: 24,
    marginBottom: 4,
  },
  achievementName: {
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 2,
  },
  achievementDesc: {
    fontSize: 10,
    textAlign: 'center',
    marginTop: 4,
  },
  getVerifiedButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderWidth: 1,
    borderRadius: 20,
  },
  getVerifiedText: {
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 4,
  },
});

export default MyCard;