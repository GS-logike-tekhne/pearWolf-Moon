import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  Dimensions,
  ScrollView 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';

const { width } = Dimensions.get('window');

interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  isUnlocked: boolean;
  unlockedAt?: Date;
  category: 'cleanup' | 'community' | 'achievement' | 'special';
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

interface BadgeSystemProps {
  navigation?: any;
  route?: any;
  badges?: Badge[];
  onBadgePress?: (badge: Badge) => void;
  showUnlockAnimation?: boolean;
  newlyUnlockedBadge?: Badge | null;
  onAnimationComplete?: () => void;
}

const BadgeSystem: React.FC<BadgeSystemProps> = ({ 
  navigation,
  route,
  badges: propBadges, 
  onBadgePress,
  showUnlockAnimation = false,
  newlyUnlockedBadge,
  onAnimationComplete 
}) => {
  
  // Sample badge data for demo
  const sampleBadges: Badge[] = [
    {
      id: '1',
      name: 'First Cleanup',
      description: 'Complete your first cleanup mission',
      icon: 'leaf',
      color: '#28A745',
      isUnlocked: true,
      unlockedAt: new Date('2024-01-15'),
      category: 'cleanup',
      rarity: 'common'
    },
    {
      id: '2', 
      name: 'Streak Master',
      description: 'Complete cleanups for 7 days straight',
      icon: 'flame',
      color: '#f97316',
      isUnlocked: true,
      unlockedAt: new Date('2024-02-01'),
      category: 'achievement',
      rarity: 'rare'
    },
    {
      id: '3',
      name: 'Ocean Guardian',
      description: 'Complete 10 beach cleanup missions',
      icon: 'water',
      color: '#06b6d4',
      isUnlocked: true,
      unlockedAt: new Date('2024-02-15'),
      category: 'cleanup',
      rarity: 'epic'
    },
    {
      id: '4',
      name: 'Community Leader',
      description: 'Organize 5 community cleanup events',
      icon: 'people',
      color: '#8b5cf6',
      isUnlocked: false,
      category: 'community',
      rarity: 'epic'
    },
    {
      id: '5',
      name: 'Eco Legend',
      description: 'Complete 100 cleanup missions',
      icon: 'trophy',
      color: '#f59e0b',
      isUnlocked: false,
      category: 'achievement',
      rarity: 'legendary'
    },
    {
      id: '6',
      name: 'Earth Day Hero',
      description: 'Special badge for Earth Day participation',
      icon: 'planet',
      color: '#10b981',
      isUnlocked: true,
      unlockedAt: new Date('2024-04-22'),
      category: 'special',
      rarity: 'rare'
    }
  ];
  
  const badges = propBadges || sampleBadges;
  const { theme } = useTheme();
  const [selectedBadge, setSelectedBadge] = useState<Badge | null>(null);

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'legendary': return '#f59e0b';
      case 'epic': return '#8b5cf6';
      case 'rare': return '#06b6d4';
      default: return '#64748b';
    }
  };

  const getCategoryDisplayName = (category: string) => {
    switch (category) {
      case 'cleanup': return 'Cleanup';
      case 'community': return 'Community';
      case 'achievement': return 'Achievement';
      case 'special': return 'Special';
      default: return 'Badge';
    }
  };

  const handleBadgePress = (badge: Badge) => {
    setSelectedBadge(badge);
    onBadgePress?.(badge);
  };

  const renderBadge = (badge: Badge) => (
    <TouchableOpacity
      key={badge.id}
      style={[
        styles.badgeContainer,
        { 
          backgroundColor: badge.isUnlocked ? theme.cardBackground : `${theme.cardBackground}80`,
          borderColor: getRarityColor(badge.rarity),
          opacity: badge.isUnlocked ? 1 : 0.6
        }
      ]}
      onPress={() => handleBadgePress(badge)}
      disabled={!badge.isUnlocked}
    >
      <View style={[
        styles.badgeIconContainer,
        { 
          backgroundColor: badge.isUnlocked ? `${badge.color}20` : `${badge.color}10`,
          borderColor: badge.isUnlocked ? badge.color : `${badge.color}50`
        }
      ]}>
        <Ionicons 
          name={badge.icon as any} 
          size={32} 
          color={badge.isUnlocked ? badge.color : `${badge.color}80`} 
        />
      </View>
      
      <Text style={[
        styles.badgeName, 
        { 
          color: badge.isUnlocked ? theme.textColor : theme.secondaryText 
        }
      ]}>
        {badge.name}
      </Text>
      
      <Text style={[styles.badgeDescription, { color: theme.secondaryText }]}>
        {badge.description}
      </Text>
      
      <View style={styles.badgeFooter}>
        <View style={[
          styles.rarityBadge,
          { backgroundColor: getRarityColor(badge.rarity) }
        ]}>
          <Text style={styles.rarityText}>{badge.rarity.toUpperCase()}</Text>
        </View>
        
        <Text style={[styles.categoryText, { color: theme.secondaryText }]}>
          {getCategoryDisplayName(badge.category)}
        </Text>
      </View>
      
      {badge.isUnlocked && badge.unlockedAt && (
        <Text style={[styles.unlockedDate, { color: theme.secondaryText }]}>
          Unlocked {badge.unlockedAt.toLocaleDateString()}
        </Text>
      )}
    </TouchableOpacity>
  );

  const categorizedBadges = {
    cleanup: badges.filter(b => b.category === 'cleanup'),
    community: badges.filter(b => b.category === 'community'),
    achievement: badges.filter(b => b.category === 'achievement'),
    special: badges.filter(b => b.category === 'special')
  };

  const unlockedCount = badges.filter(b => b.isUnlocked).length;
  const totalCount = badges.length;

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={[styles.header, { backgroundColor: theme.cardBackground }]}>
        <Text style={[styles.title, { color: theme.textColor }]}>Badge Collection</Text>
        <Text style={[styles.subtitle, { color: theme.secondaryText }]}>
          {unlockedCount} of {totalCount} badges unlocked
        </Text>
        
        <View style={[styles.progressContainer, { backgroundColor: theme.background }]}>
          <View 
            style={[
              styles.progressBar,
              { 
                width: `${(unlockedCount / totalCount) * 100}%`,
                backgroundColor: theme.primary
              }
            ]}
          />
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {Object.entries(categorizedBadges).map(([category, badgeList]) => {
          if (badgeList.length === 0) return null;
          
          return (
            <View key={category} style={styles.categorySection}>
              <Text style={[styles.categoryTitle, { color: theme.textColor }]}>
                {getCategoryDisplayName(category)} Badges
              </Text>
              
              <View style={styles.badgeGrid}>
                {badgeList.map(renderBadge)}
              </View>
            </View>
          );
        })}
        
        <View style={styles.bottomSpacing} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 16,
  },
  progressContainer: {
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    borderRadius: 4,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  categorySection: {
    marginBottom: 32,
  },
  categoryTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 16,
  },
  badgeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  badgeContainer: {
    width: (width - 60) / 2,
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  badgeIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    borderWidth: 2,
    alignSelf: 'center',
  },
  badgeName: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 8,
  },
  badgeDescription: {
    fontSize: 12,
    textAlign: 'center',
    marginBottom: 12,
    lineHeight: 16,
  },
  badgeFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  rarityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  rarityText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
  categoryText: {
    fontSize: 10,
    fontWeight: '500',
  },
  unlockedDate: {
    fontSize: 10,
    textAlign: 'center',
    marginTop: 4,
  },
  bottomSpacing: {
    height: 20,
  },
});

export default BadgeSystem;