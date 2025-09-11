import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { useXP } from '../context/XPContext';
import { useNavigation } from '@react-navigation/native';

const { width } = Dimensions.get('window');

interface EvolutionTier {
  id: string;
  name: string;
  title: string;
  minLevel: number;
  maxLevel: number;
  avatar: string;
  emoji: string;
  color: string;
  abilities: string[];
  description: string;
}

interface XPAction {
  id: string;
  name: string;
  xpValue: number;
  icon: string;
  description: string;
}

interface EvolutionSystemProps {
  role: 'TRASH_HERO' | 'IMPACT_WARRIOR' | 'ECO_DEFENDER';
}

const EvolutionSystem: React.FC<EvolutionSystemProps> = ({
  role,
}) => {
  const { theme } = useTheme();
  const navigation = useNavigation();
  const { state: xpState, addXP } = useXP();
  const [showLevelUpAnimation, setShowLevelUpAnimation] = useState(false);
  const animatedValue = new Animated.Value(0);
  
  const currentLevel = xpState.currentLevel;
  const currentXP = xpState.totalXP;

  // Role-based evolution trees
  const getEvolutionTree = (): EvolutionTier[] => {
    if (role === 'TRASH_HERO') {
      return [
        {
          id: 'seedling',
          name: '🌱 Seedling',
          title: 'New Eco Warrior',
          minLevel: 1,
          maxLevel: 3,
          avatar: '🌱',
          emoji: '🌱',
          color: '#22c55e',
          abilities: ['Basic Cleanup', 'Photo Upload'],
          description: 'Just starting your eco journey'
        },
        {
          id: 'sapling',
          name: '🌿 Sapling',
          title: 'Growing Guardian',
          minLevel: 4,
          maxLevel: 7,
          avatar: '🌿',
          emoji: '🌿',
          color: '#16a34a',
          abilities: ['Team Cleanup', 'Recycling Bonus', 'Mentor Others'],
          description: 'Building strength and knowledge'
        },
        {
          id: 'street-sweeper',
          name: '🧹 Street Sweeper',
          title: 'Urban Cleanup Pro',
          minLevel: 8,
          maxLevel: 12,
          avatar: '🧹',
          emoji: '🧹',
          color: '#15803d',
          abilities: ['Advanced Tools', 'Area Leadership', 'Special Events'],
          description: 'Master of city cleanup operations'
        },
        {
          id: 'eco-beast',
          name: '🦸 Eco Beast',
          title: 'Environmental Legend',
          minLevel: 13,
          maxLevel: 20,
          avatar: '🦸',
          emoji: '🦸',
          color: '#166534',
          abilities: ['Legendary Status', 'Ultimate Tools', 'World Events', 'Training New Heroes'],
          description: 'The ultimate environmental superhero'
        }
      ];
    } else if (role === 'IMPACT_WARRIOR') {
      return [
        {
          id: 'sprout',
          name: '🌱 Sprout',
          title: 'Community Helper',
          minLevel: 1,
          maxLevel: 3,
          avatar: '🌱',
          emoji: '🌱',
          color: '#dc2626',
          abilities: ['Community Events', 'Social Impact'],
          description: 'Starting your volunteer journey'
        },
        {
          id: 'bloom',
          name: '🌸 Bloom',
          title: 'Impact Warrior',
          minLevel: 4,
          maxLevel: 7,
          avatar: '🌸',
          emoji: '🌸',
          color: '#b91c1c',
          abilities: ['Event Organization', 'Team Building', 'Awareness Campaigns'],
          description: 'Blooming into a force for change'
        },
        {
          id: 'forest-guardian',
          name: '🌳 Forest Guardian',
          title: 'Nature Protector',
          minLevel: 8,
          maxLevel: 12,
          avatar: '🌳',
          emoji: '🌳',
          color: '#991b1b',
          abilities: ['Ecosystem Protection', 'Wildlife Care', 'Conservation Programs'],
          description: 'Guardian of natural spaces'
        },
        {
          id: 'eco-champion',
          name: '🏆 Eco Champion',
          title: 'Global Change Maker',
          minLevel: 13,
          maxLevel: 20,
          avatar: '🏆',
          emoji: '🏆',
          color: '#7f1d1d',
          abilities: ['Global Initiatives', 'Policy Influence', 'Movement Leadership'],
          description: 'Champion of worldwide environmental change'
        }
      ];
    } else { // BUSINESS
      return [
        {
          id: 'eco-startup',
          name: '🏢 Eco Startup',
          title: 'Green Business',
          minLevel: 1,
          maxLevel: 3,
          avatar: '🏢',
          emoji: '🏢',
          color: '#2563eb',
          abilities: ['Basic Funding', 'Local Impact'],
          description: 'Starting sustainable business practices'
        },
        {
          id: 'green-enterprise',
          name: '🌐 Green Enterprise',
          title: 'Sustainable Leader',
          minLevel: 4,
          maxLevel: 7,
          avatar: '🌐',
          emoji: '🌐',
          color: '#1d4ed8',
          abilities: ['Regional Programs', 'ESG Leadership', 'Supply Chain Impact'],
          description: 'Leading sustainability initiatives'
        },
        {
          id: 'eco-corporation',
          name: '🏭 Eco Corporation',
          title: 'Industry Pioneer',
          minLevel: 8,
          maxLevel: 12,
          avatar: '🏭',
          emoji: '🏭',
          color: '#1e40af',
          abilities: ['Industry Transformation', 'Global Supply Chain', 'Innovation Labs'],
          description: 'Pioneering sustainable business practices'
        },
        {
          id: 'planet-saver',
          name: '🌍 Planet Saver',
          title: 'Global Environmental Leader',
          minLevel: 13,
          maxLevel: 20,
          avatar: '🌍',
          emoji: '🌍',
          color: '#1e3a8a',
          abilities: ['Planetary Impact', 'Climate Solutions', 'Future Technologies'],
          description: 'Leading humanity toward a sustainable future'
        }
      ];
    }
  };

  // XP Action System
  const getXPActions = (): XPAction[] => {
    const baseActions = [
      { id: 'bag-pickup', name: 'Pick up trash bag', xpValue: 10, icon: 'trash-outline', description: 'Basic cleanup action' },
      { id: 'photo-upload', name: 'Upload before/after photo', xpValue: 5, icon: 'camera-outline', description: 'Document your impact' },
      { id: 'referral', name: 'Invite friend to PEAR', xpValue: 25, icon: 'people-outline', description: 'Grow the community' },
      { id: 'recycle-item', name: 'Properly recycle item', xpValue: 3, icon: 'leaf-outline', description: 'Divert from landfill' },
      { id: 'mission-complete', name: 'Complete cleanup mission', xpValue: 50, icon: 'checkmark-circle-outline', description: 'Finish assigned task' },
    ];

    const roleSpecific = role === 'TRASH_HERO' 
      ? [
          { id: 'earn-money', name: 'Earn cleanup payment', xpValue: 15, icon: 'card-outline', description: 'Professional cleanup work' },
          { id: 'tool-upgrade', name: 'Upgrade cleanup tools', xpValue: 20, icon: 'construct-outline', description: 'Improve efficiency' },
        ]
      : role === 'IMPACT_WARRIOR'
      ? [
          { id: 'community-event', name: 'Organize community event', xpValue: 30, icon: 'megaphone-outline', description: 'Rally the community' },
          { id: 'educate-public', name: 'Share eco education', xpValue: 12, icon: 'school-outline', description: 'Spread awareness' },
        ]
      : [
          { id: 'fund-project', name: 'Fund cleanup project', xpValue: 40, icon: 'wallet-outline', description: 'Financial support for change' },
          { id: 'sponsor-event', name: 'Sponsor community event', xpValue: 60, icon: 'trophy-outline', description: 'Enable large-scale impact' },
        ];

    return [...baseActions, ...roleSpecific];
  };

  const evolutionTree = getEvolutionTree();
  const xpActions = getXPActions();

  // Get current evolution tier
  const getCurrentTier = (): EvolutionTier => {
    return evolutionTree.find(tier => 
      currentLevel >= tier.minLevel && currentLevel <= tier.maxLevel
    ) || evolutionTree[0];
  };
  
  // Handle XP actions
  const handleXPAction = (action: XPAction) => {
    addXP(action.xpValue, action.name);
    // Show visual feedback for XP gain
    console.log(`+${action.xpValue} XP from ${action.name}`);
  };

  // Get next evolution tier
  const getNextTier = (): EvolutionTier | null => {
    const currentTier = getCurrentTier();
    const currentIndex = evolutionTree.indexOf(currentTier);
    return currentIndex < evolutionTree.length - 1 ? evolutionTree[currentIndex + 1] : null;
  };

  const currentTier = getCurrentTier();
  const nextTier = getNextTier();

  // Level up animation
  const triggerLevelUpAnimation = () => {
    setShowLevelUpAnimation(true);
    Animated.sequence([
      Animated.timing(animatedValue, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(animatedValue, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setShowLevelUpAnimation(false);
    });
  };

  const EvolutionCard = ({ tier, isActive = false, isNext = false }: {
    tier: EvolutionTier;
    isActive?: boolean;
    isNext?: boolean;
  }) => (
    <View style={[
      styles.evolutionCard,
      { backgroundColor: theme.cardBackground },
      isActive && { borderColor: tier.color, borderWidth: 3 },
      isNext && { borderColor: tier.color, borderWidth: 1, opacity: 0.7 }
    ]}>
      <View style={[styles.tierHeader, { backgroundColor: tier.color }]}>
        <Text style={styles.tierEmoji}>{tier.emoji}</Text>
        <Text style={styles.tierName}>{tier.name}</Text>
      </View>
      
      <View style={styles.tierContent}>
        <Text style={[styles.tierTitle, { color: theme.textColor }]}>{tier.title}</Text>
        <Text style={[styles.tierLevel, { color: theme.secondaryText }]}>
          Level {tier.minLevel}-{tier.maxLevel}
        </Text>
        
        <View style={styles.abilities}>
          <Text style={[styles.abilitiesTitle, { color: theme.textColor }]}>Abilities:</Text>
          {tier.abilities.map((ability: string, index: number) => (
            <Text key={index} style={[styles.ability, { color: theme.secondaryText }]}>
              • {ability}
            </Text>
          ))}
        </View>
        
        <Text style={[styles.tierDescription, { color: theme.secondaryText }]}>
          {tier.description}
        </Text>
      </View>
    </View>
  );

  const XPActionItem = ({ action }: { action: XPAction }) => (
    <TouchableOpacity 
      style={[styles.xpActionItem, { backgroundColor: theme.cardBackground }]}
      onPress={() => handleXPAction(action)}
      activeOpacity={0.7}
    >
      <View style={[styles.actionIcon, { backgroundColor: theme.primary }]}>
        <Ionicons name={action.icon} size={20} color="white" />
      </View>
      <View style={styles.actionInfo}>
        <Text style={[styles.actionName, { color: theme.textColor }]}>{action.name}</Text>
        <Text style={[styles.actionDescription, { color: theme.secondaryText }]}>{action.description}</Text>
      </View>
      <View style={[styles.xpBadge, { backgroundColor: currentTier.color }]}>
        <Text style={styles.xpValue}>+{action.xpValue} XP</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: theme.cardBackground }]}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
          activeOpacity={0.7}
        >
          <Ionicons name="arrow-back" size={24} color={theme.textColor} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.textColor }]}>
          Evolution System
        </Text>
        <View style={styles.headerRight}>
          <Text style={[styles.currentLevelBadge, { 
            backgroundColor: getCurrentTier().color,
            color: 'white' 
          }]}>
            Lvl {currentLevel}
          </Text>
        </View>
      </View>

      {/* Current Evolution Status */}
      <View style={styles.currentStatus}>
        <Text style={[styles.sectionTitle, { color: theme.textColor }]}>
          Current Evolution
        </Text>
        <EvolutionCard tier={currentTier} isActive={true} />
        
        {nextTier && (
          <>
            <Text style={[styles.nextEvolution, { color: theme.secondaryText }]}>
              Next Evolution at Level {nextTier.minLevel}
            </Text>
            <EvolutionCard tier={nextTier} isNext={true} />
          </>
        )}
      </View>

      {/* XP Actions */}
      <View style={styles.xpActions}>
        <Text style={[styles.sectionTitle, { color: theme.textColor }]}>
          Earn XP Through Actions
        </Text>
        {xpActions.map((action) => (
          <XPActionItem key={action.id} action={action} />
        ))}
      </View>

      {/* Level Up Animation Overlay */}
      {showLevelUpAnimation && (
        <View style={styles.levelUpOverlay}>
          <Text style={styles.levelUpText}>LEVEL UP!</Text>
          <Text style={styles.levelUpSubtext}>Evolution Progress</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    paddingTop: 50,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  backButton: {
    padding: 8,
    marginRight: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    flex: 1,
  },
  headerRight: {
    alignItems: 'flex-end',
  },
  currentLevelBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    fontSize: 14,
    fontWeight: '700',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 16,
  },
  currentStatus: {
    padding: 16,
    marginBottom: 32,
  },
  evolutionCard: {
    borderRadius: 16,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    overflow: 'hidden',
  },
  tierHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  tierEmoji: {
    fontSize: 24,
    marginRight: 12,
  },
  tierName: {
    fontSize: 18,
    fontWeight: '700',
    color: 'white',
    flex: 1,
  },
  tierContent: {
    padding: 16,
  },
  tierTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  tierLevel: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 12,
  },
  abilities: {
    marginBottom: 12,
  },
  abilitiesTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  ability: {
    fontSize: 12,
    fontWeight: '400',
    marginLeft: 8,
    marginBottom: 2,
  },
  tierDescription: {
    fontSize: 12,
    fontStyle: 'italic',
  },
  nextEvolution: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
    marginVertical: 16,
  },
  xpActions: {
    flex: 1,
    paddingHorizontal: 16,
  },
  xpActionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    marginVertical: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  actionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  actionInfo: {
    flex: 1,
  },
  actionName: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 2,
  },
  actionDescription: {
    fontSize: 12,
    fontWeight: '400',
  },
  xpBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  xpValue: {
    fontSize: 12,
    fontWeight: '700',
    color: 'white',
  },
  levelUpOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  levelUpText: {
    fontSize: 48,
    fontWeight: '800',
    color: '#ffd700',
    textAlign: 'center',
  },
  levelUpSubtext: {
    fontSize: 18,
    fontWeight: '600',
    color: 'white',
    textAlign: 'center',
    marginTop: 8,
  },
});

export default EvolutionSystem;