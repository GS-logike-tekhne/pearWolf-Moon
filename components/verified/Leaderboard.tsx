import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';
import { sharedStyles } from '../../styles/shared';
import { THEME } from '../../styles/theme';
import { Contributor } from '../../utils/mockData';

export type LeaderboardType = 'missions' | 'contributors';

interface LeaderboardProps {
  type: LeaderboardType;
  data: Contributor[];
  title?: string;
  subtitle?: string;
  onViewAll?: () => void;
  maxItems?: number;
}

const Leaderboard: React.FC<LeaderboardProps> = ({ 
  type, 
  data, 
  title, 
  subtitle, 
  onViewAll,
  maxItems = 5 
}) => {
  const { theme } = useTheme();

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1: return 'trophy';
      case 2: return 'medal';
      case 3: return 'ribbon';
      default: return 'star';
    }
  };

  const getRankColor = (rank: number) => {
    switch (rank) {
      case 1: return '#FFD700'; // Gold
      case 2: return '#C0C0C0'; // Silver
      case 3: return '#CD7F32'; // Bronze
      default: return theme.primary;
    }
  };

  const getDefaultTitle = () => {
    switch (type) {
      case 'missions':
        return 'Mission Leaders';
      case 'contributors':
        return 'Top Contributors';
      default:
        return 'Leaderboard';
    }
  };

  const getDefaultSubtitle = () => {
    switch (type) {
      case 'missions':
        return 'Leaders in PEAR Verified Missions';
      case 'contributors':
        return 'Community leaders in PEAR Verified Missions';
      default:
        return 'Community rankings';
    }
  };

  const getFooterText = () => {
    switch (type) {
      case 'missions':
        return 'Complete missions to climb the leaderboard!';
      case 'contributors':
        return 'Complete missions to join the leaderboard!';
      default:
        return 'Keep participating to climb the ranks!';
    }
  };

  const renderLeaderboardItem = ({ item }: { item: Contributor }) => {
    const isMissionType = type === 'missions';
    
    return (
      <View style={[
        styles.leaderboardItem,
        { 
          backgroundColor: theme.cardBackground,
          borderColor: theme.borderColor,
          borderLeftColor: getRankColor(item.rank),
        }
      ]}>
        <View style={styles.rankSection}>
          <Ionicons 
            name={getRankIcon(item.rank)} 
            size={20} 
            color={getRankColor(item.rank)} 
          />
          <Text style={[styles.rankNumber, { color: theme.textColor }]}>
            #{item.rank}
          </Text>
        </View>
        
        <View style={styles.userSection}>
          <Text style={[styles.userName, { color: theme.textColor }]}>
            {item.name}
          </Text>
          {item.badge && (
            <View style={[
              styles.badgeContainer, 
              { backgroundColor: type === 'missions' ? theme.primary : theme.success }
            ]}>
              <Text style={styles.badgeText}>{item.badge}</Text>
            </View>
          )}
        </View>
        
        <View style={styles.statsSection}>
          <View style={styles.statItem}>
            <Text style={[
              styles.statValue, 
              { color: type === 'missions' ? theme.primary : theme.primary }
            ]}>
              {isMissionType ? item.missionsCompleted : item.missionsCompleted}
            </Text>
            <Text style={[styles.statLabel, { color: theme.secondaryText }]}>
              {isMissionType ? 'Missions' : 'Missions'}
            </Text>
          </View>
          
          <View style={styles.statItem}>
            <Text style={[
              styles.statValue, 
              { color: type === 'missions' ? theme.success : theme.success }
            ]}>
              {isMissionType ? item.totalXP.toLocaleString() : `$${item.totalFunding?.toLocaleString()}`}
            </Text>
            <Text style={[styles.statLabel, { color: theme.secondaryText }]}>
              {isMissionType ? 'XP' : 'Donated'}
            </Text>
          </View>
        </View>
      </View>
    );
  };

  return (
    <View style={[
      sharedStyles.card,
      { 
        backgroundColor: theme.cardBackground,
        borderColor: theme.borderColor,
      }
    ]}>
      <View style={styles.header}>
        <Text style={[sharedStyles.sectionTitle, { color: theme.textColor }]}>
          {title || getDefaultTitle()}
        </Text>
        {onViewAll && (
          <TouchableOpacity onPress={onViewAll}>
            <Text style={[styles.viewAllText, { color: theme.primary }]}>
              View All
            </Text>
          </TouchableOpacity>
        )}
      </View>
      
      <Text style={[styles.subtitle, { color: theme.secondaryText }]}>
        {subtitle || getDefaultSubtitle()}
      </Text>
      
      <FlatList
        data={data.slice(0, maxItems)}
        renderItem={renderLeaderboardItem}
        keyExtractor={(item) => item.id}
        scrollEnabled={false}
        showsVerticalScrollIndicator={false}
      />
      
      <View style={styles.footer}>
        <Ionicons 
          name={type === 'missions' ? 'trophy-outline' : 'people'} 
          size={16} 
          color={theme.secondaryText} 
        />
        <Text style={[styles.footerText, { color: theme.secondaryText }]}>
          {getFooterText()}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: THEME.SPACING.sm,
  },
  subtitle: {
    fontSize: THEME.TYPOGRAPHY.fontSize.sm,
    marginBottom: THEME.SPACING.md,
  },
  leaderboardItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: THEME.SPACING.md,
    marginBottom: THEME.SPACING.sm,
    borderRadius: THEME.BORDER_RADIUS.lg,
    borderWidth: 1,
    borderLeftWidth: 4,
  },
  rankSection: {
    alignItems: 'center',
    marginRight: THEME.SPACING.md,
    minWidth: 45,
  },
  rankNumber: {
    fontSize: THEME.TYPOGRAPHY.fontSize.xs,
    fontWeight: 'bold',
    marginTop: THEME.SPACING.xs,
  },
  userSection: {
    flex: 1,
    marginRight: THEME.SPACING.md,
  },
  userName: {
    fontSize: THEME.TYPOGRAPHY.fontSize.base,
    fontWeight: '600',
    marginBottom: THEME.SPACING.xs,
  },
  badgeContainer: {
    paddingHorizontal: THEME.SPACING.sm,
    paddingVertical: THEME.SPACING.xs,
    borderRadius: THEME.BORDER_RADIUS.sm,
    alignSelf: 'flex-start',
  },
  badgeText: {
    color: 'white',
    fontSize: THEME.TYPOGRAPHY.fontSize.xs,
    fontWeight: 'bold',
  },
  statsSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statItem: {
    alignItems: 'center',
    marginLeft: THEME.SPACING.md,
  },
  statValue: {
    fontSize: THEME.TYPOGRAPHY.fontSize.base,
    fontWeight: 'bold',
  },
  statLabel: {
    fontSize: THEME.TYPOGRAPHY.fontSize.xs,
    marginTop: THEME.SPACING.xs,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: THEME.SPACING.md,
    paddingTop: THEME.SPACING.md,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.1)',
  },
  footerText: {
    fontSize: THEME.TYPOGRAPHY.fontSize.xs,
    marginLeft: THEME.SPACING.xs,
    fontStyle: 'italic',
  },
  viewAllText: {
    fontSize: THEME.TYPOGRAPHY.fontSize.sm,
    fontWeight: '600',
  },
});

export default Leaderboard;
