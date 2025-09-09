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
import DonationButton from '../components/DonationButton';
import DonationProgress from '../components/DonationProgress';

const PearVerifiedMissions = ({ navigation }: { navigation: any }) => {
  const { theme } = useTheme();
  const [fundData, setFundData] = useState({
    totalRaised: 15420,
    monthlyGoal: 25000,
    activeCleanups: 12,
    donorCount: 247,
  });

  const [featuredCleanups, setFeaturedCleanups] = useState([
    {
      id: 1,
      title: 'Beach Cleanup Marathon',
      location: 'Santa Monica Beach',
      raised: 1200,
      goal: 2000,
      donors: 34,
      urgency: 'high',
    },
    {
      id: 2,
      title: 'Park Restoration Project',
      location: 'Central Park',
      raised: 800,
      goal: 1500,
      donors: 18,
      urgency: 'medium',
    },
    {
      id: 3,
      title: 'River Trail Cleanup',
      location: 'LA River Trail',
      raised: 450,
      goal: 1000,
      donors: 12,
      urgency: 'low',
    },
  ]);

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
            borderColor: theme.borderColor 
          }
        ]}>
          <Text style={[styles.fundTitle, { color: theme.textColor }]}>
            PEAR Verified Missions
          </Text>
          <Text style={[styles.fundDescription, { color: theme.secondaryText }]}>
            Support admin-verified environmental missions with measurable impact
          </Text>
          
          <DonationProgress 
            raised={fundData.totalRaised}
            goal={fundData.monthlyGoal as any}
            donorCount={fundData.donorCount}
            showPercentage={true}
            accentColor={theme.primary}
            onUpdate={refreshFundData}
          />
          
          <DonationButton 
            cleanupId="community-fund"
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
                borderColor: theme.borderColor 
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
                borderColor: theme.borderColor 
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
                  borderColor: theme.borderColor 
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
                raised={cleanup.raised}
                goal={cleanup.goal as any}
                donorCount={cleanup.donors}
                showPercentage={true}
                accentColor={theme.success}
              />
              
              <View style={styles.cleanupActions}>
                <TouchableOpacity 
                  style={[
                    styles.viewButton,
                    { borderColor: theme.borderColor }
                  ]}
                  onPress={() => navigation.navigate('ImpactWarriorMissions')}
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
    padding: 20,
    margin: 16,
    borderRadius: 12,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  fundTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  fundDescription: {
    fontSize: 16,
    marginBottom: 16,
  },
  statsContainer: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    marginHorizontal: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: 4,
  },
  statLabel: {
    fontSize: 12,
    textAlign: 'center',
  },
  section: {
    margin: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  seeAllText: {
    fontSize: 14,
    fontWeight: '600',
  },
  cleanupCard: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 12,
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
    marginBottom: 8,
  },
  cleanupTitle: {
    fontSize: 18,
    fontWeight: '600',
    flex: 1,
  },
  urgentBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  urgentText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  cleanupLocation: {
    fontSize: 14,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  cleanupActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
  },
  viewButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
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