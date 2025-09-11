import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { THEME } from '../styles/theme';
import ScreenLayout from '../components/ScreenLayout';
import DonationButton from '../components/DonationButton';
import DonationProgress from '../components/DonationProgress';
import Leaderboard from '../components/verified/Leaderboard';
import { 
  mockFeaturedCleanups, 
  mockTopContributors, 
  mockFundData 
} from '../utils/mockData';

const PearVerifiedMissions = ({ navigation }: { navigation: any }) => {
  const { theme } = useTheme();
  const [fundData, setFundData] = useState(mockFundData);
  const [featuredCleanups, setFeaturedCleanups] = useState(mockFeaturedCleanups);

  const refreshFundData = () => {
    // Simulate data refresh
    setFundData(prev => ({
      ...prev,
      totalRaised: prev.totalRaised + Math.floor(Math.random() * 100),
      donorCount: prev.donorCount + 1,
    }));
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Fund Overview */}
        <View style={[
          styles.fundOverview, 
          { 
            backgroundColor: theme.cardBackground,
            borderColor: theme.borderColor, 
          }
        ]}>
          <Text style={[styles.fundTitle, { color: theme.textColor }]}>
            PEAR Verified Missions
          </Text>
          <Text style={[styles.fundDescription, { color: theme.secondaryText }]}>
            Support PEAR-verified environmental missions with measurable impact and real community change
          </Text>
          
          <DonationProgress 
            goal={{
              id: 'monthly-fund',
              title: 'PEAR Verified Missions Fund',
              description: 'Supporting impact-verified environmental missions',
              targetAmount: fundData.monthlyGoal,
              currentAmount: fundData.totalRaised,
              supporters: fundData.donorCount,
              deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
              category: 'cleanup'
            }}
            onDonate={() => {}}
            onViewDetails={() => {}}
            showActions={true}
            compact={false}
          />
          
          <DonationButton 
            cleanupId="pear-verified-fund"
            cleanupTitle="PEAR Verified Missions"
            onDonationSuccess={refreshFundData}
            style={{}}
          />
        </View>

        {/* Stats Cards */}
        <View style={styles.statsContainer}>
          <View style={styles.statsRow}>
            <View style={[
              styles.statCard, 
              { 
                backgroundColor: theme.cardBackground,
                borderColor: theme.borderColor, 
              }
            ]}>
              <Ionicons name="leaf" size={24} color={theme.success} />
              <Text style={[styles.statValue, { color: theme.success }]}>
                {fundData.activeCleanups}
              </Text>
              <Text style={[styles.statLabel, { color: theme.secondaryText }]}>
                Active Cleanups
              </Text>
            </View>
            
            <View style={[
              styles.statCard, 
              { 
                backgroundColor: theme.cardBackground,
                borderColor: theme.borderColor, 
              }
            ]}>
              <Ionicons name="people" size={24} color={theme.primary} />
              <Text style={[styles.statValue, { color: theme.primary }]}>
                {fundData.donorCount}
              </Text>
              <Text style={[styles.statLabel, { color: theme.secondaryText }]}>
                Total Donors
              </Text>
            </View>
          </View>
        </View>

        {/* Featured Cleanups */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: theme.textColor }]}>
              Featured Cleanups
            </Text>
            <TouchableOpacity>
              <Text style={[styles.seeAllText, { color: theme.primary }]}>
                See All
              </Text>
            </TouchableOpacity>
          </View>
          
          {featuredCleanups.map((cleanup) => (
            <View 
              key={cleanup.id} 
              style={[
                styles.cleanupCard,
                { 
                  backgroundColor: theme.cardBackground,
                  borderColor: theme.borderColor, 
                }
              ]}
            >
              <View style={styles.cleanupHeader}>
                <Text style={[styles.cleanupTitle, { color: theme.textColor }]}>
                  {cleanup.title}
                </Text>
                {cleanup.urgency === 'high' && (
                  <View style={[styles.urgentBadge, { backgroundColor: theme.error }]}>
                    <Text style={styles.urgentText}>URGENT</Text>
                  </View>
                )}
              </View>
              
              <Text style={[styles.cleanupLocation, { color: theme.secondaryText }]}>
                <Ionicons name="location-outline" size={14} color={theme.secondaryText} />
                {' '}{cleanup.location}
              </Text>
              
              <DonationProgress 
                goal={{
                  id: cleanup.id.toString(),
                  title: cleanup.title,
                  description: 'PEAR-verified environmental mission',
                  targetAmount: cleanup.goal,
                  currentAmount: cleanup.raised,
                  supporters: cleanup.donors,
                  deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
                  category: 'cleanup'
                }}
                onDonate={() => {}}
                onViewDetails={() => {}}
                showActions={true}
                compact={true}
              />
              
              <View style={styles.cleanupActions}>
                <TouchableOpacity 
                  style={[
                    styles.viewButton,
                    { borderColor: theme.borderColor }
                  ]}
                  onPress={() => navigation.navigate('PearVerifiedMissionDetail', { 
                    mission: {
                      ...cleanup,
                      description: 'Join this verified environmental cleanup mission and make a real impact in your community.',
                      startDate: '2024-01-15',
                      endDate: '2024-01-22',
                      organizer: 'PEAR Community',
                      participants: 25
                    }
                  })}
                >
                  <Text style={[styles.viewButtonText, { color: theme.secondaryText }]}>
                    View Details
                  </Text>
                </TouchableOpacity>
                
                <DonationButton 
                  cleanupId={cleanup.id}
                  cleanupTitle={cleanup.title}
                  onDonationSuccess={() => {
                    // Update this specific cleanup
                    setFeaturedCleanups(prev => 
                      prev.map(c => 
                        c.id === cleanup.id 
                          ? { ...c, raised: c.raised + Math.floor(Math.random() * 50), donors: c.donors + 1 }
                          : c
                      )
                    );
                  }}
                  style={{}}
                />
              </View>
            </View>
          ))}
        </View>

        {/* Top Contributors */}
        <View style={styles.section}>
          <Leaderboard 
            type="contributors"
            data={mockTopContributors}
            maxItems={5}
            onViewAll={() => {
              // Navigate to full leaderboard screen
              console.log('View all contributors');
            }}
          />
        </View>

        {/* Bottom Spacing */}
        <View style={styles.bottomSpacing} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  fundOverview: {
    padding: THEME.SPACING.md + 4,
    margin: THEME.SPACING.md,
    borderRadius: THEME.BORDER_RADIUS.lg,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  fundTitle: {
    fontSize: THEME.TYPOGRAPHY.fontSize["2xl"],
    fontWeight: 'bold',
    marginBottom: THEME.SPACING.sm,
  },
  fundDescription: {
    fontSize: THEME.TYPOGRAPHY.fontSize.base,
    marginBottom: THEME.SPACING.md,
  },
  statsContainer: {
    paddingHorizontal: THEME.SPACING.md,
    marginBottom: THEME.SPACING.md,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    padding: THEME.SPACING.md,
    borderRadius: THEME.BORDER_RADIUS.lg,
    borderWidth: 1,
    marginHorizontal: THEME.SPACING.xs,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  statValue: {
    fontSize: THEME.TYPOGRAPHY.fontSize.xl,
    fontWeight: 'bold',
    marginVertical: THEME.SPACING.xs,
  },
  statLabel: {
    fontSize: THEME.TYPOGRAPHY.fontSize.xs,
    textAlign: 'center',
  },
  section: {
    margin: THEME.SPACING.md,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: THEME.SPACING.md,
  },
  sectionTitle: {
    fontSize: THEME.TYPOGRAPHY.fontSize.xl,
    fontWeight: 'bold',
  },
  seeAllText: {
    fontSize: THEME.TYPOGRAPHY.fontSize.sm,
    fontWeight: '600',
  },
  cleanupCard: {
    padding: THEME.SPACING.md,
    borderRadius: THEME.BORDER_RADIUS.lg,
    borderWidth: 1,
    marginBottom: THEME.SPACING.sm + 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  cleanupHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: THEME.SPACING.sm,
  },
  cleanupTitle: {
    fontSize: THEME.TYPOGRAPHY.fontSize.lg,
    fontWeight: '600',
    flex: 1,
  },
  urgentBadge: {
    paddingHorizontal: THEME.SPACING.sm,
    paddingVertical: THEME.SPACING.xs,
    borderRadius: THEME.BORDER_RADIUS.sm,
  },
  urgentText: {
    fontSize: THEME.TYPOGRAPHY.fontSize.xs,
    fontWeight: 'bold',
  },
  cleanupLocation: {
    fontSize: THEME.TYPOGRAPHY.fontSize.sm,
    marginBottom: THEME.SPACING.sm + 4,
    flexDirection: 'row',
    alignItems: 'center',
  },
  cleanupActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: THEME.SPACING.sm + 4,
  },
  viewButton: {
    paddingHorizontal: THEME.SPACING.md,
    paddingVertical: THEME.SPACING.sm,
    borderRadius: 20,
    borderWidth: 1,
  },
  viewButtonText: {
    fontWeight: '600',
  },
  bottomSpacing: {
    height: 20,
  },
});

export default PearVerifiedMissions;