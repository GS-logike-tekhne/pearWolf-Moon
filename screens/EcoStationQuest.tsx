import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  TouchableOpacity, 
  StyleSheet, 
  Dimensions,
  Animated,
  ImageBackground
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
// Manual gradient component to avoid dependencies
const LinearGradient: React.FC<{
  colors: string[];
  start?: { x: number; y: number };
  end?: { x: number; y: number };
  style?: any;
  children?: React.ReactNode;
}> = ({ colors, style, children }) => {
  return (
    <View style={[{ backgroundColor: colors[0] }, style]}>
      {children}
    </View>
  );
};
import { useTheme } from '../context/ThemeContext';
import { useRoleManager } from '../hooks/useRoleManager';
import { THEME } from '../styles/theme';
import ScreenLayout from '../components/ScreenLayout';
import MenuModal from '../components/MenuModal';
import { useXP } from '../context/XPContext';
import { useMissions } from '../context/MissionContext';

const { width, height } = Dimensions.get('window');

interface QuestZone {
  id: string;
  name: string;
  description: string;
  levelRequired: number;
  xpReward: number;
  ecoPointsReward: number;
  difficulty: 'Easy' | 'Medium' | 'Hard' | 'Epic';
  isUnlocked: boolean;
  isCompleted: boolean;
  icon: string;
  color: string;
  missions: number;
  estimatedTime: string;
}

const EcoStationQuest: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { theme } = useTheme();
  const { currentRole } = useRoleManager();
  const { state: xpState } = useXP();
  const level = xpState.currentLevel;
  const xp = xpState.totalXP;
  const { state: missionState } = useMissions();
  const { activeMissions } = missionState;
  
  const [selectedZone, setSelectedZone] = useState<string | null>(null);
  const [showMenu, setShowMenu] = useState(false);
  const scrollY = new Animated.Value(0);

  // Use current role from role manager, fallback to default
  const role = currentRole ? currentRole.toLowerCase().replace('_', '-') : 'impact-warrior';

  // Quest zones data - unlocked based on user level
  const questZones: QuestZone[] = [
    {
      id: 'neighborhood',
      name: 'Neighborhood Guardian',
      description: 'Clean your local streets and earn your first rewards',
      levelRequired: 1,
      xpReward: 50,
      ecoPointsReward: 25,
      difficulty: 'Easy',
      isUnlocked: level >= 1,
      isCompleted: false,
      icon: 'home',
      color: '#4ECDC4',
      missions: 3,
      estimatedTime: '30 min'
    },
    {
      id: 'parks',
      name: 'Park Protector',
      description: 'Restore green spaces and unlock nature badges',
      levelRequired: 3,
      xpReward: 100,
      ecoPointsReward: 50,
      difficulty: 'Medium',
      isUnlocked: level >= 3,
      isCompleted: false,
      icon: 'leaf',
      color: '#95E1D3',
      missions: 5,
      estimatedTime: '1 hour'
    },
    {
      id: 'waterfront',
      name: 'Coastal Champion',
      description: 'Protect waterways and marine ecosystems',
      levelRequired: 5,
      xpReward: 200,
      ecoPointsReward: 100,
      difficulty: 'Hard',
      isUnlocked: level >= 5,
      isCompleted: false,
      icon: 'water',
      color: '#74B9FF',
      missions: 7,
      estimatedTime: '2 hours'
    },
    {
      id: 'urban',
      name: 'Urban Ecosystem',
      description: 'Transform city spaces into sustainable environments',
      levelRequired: 8,
      xpReward: 300,
      ecoPointsReward: 150,
      difficulty: 'Epic',
      isUnlocked: level >= 8,
      isCompleted: false,
      icon: 'business',
      color: '#FDCB6E',
      missions: 10,
      estimatedTime: '3 hours'
    },
    {
      id: 'wilderness',
      name: 'Wilderness Warden',
      description: 'Protect untouched natural areas and wildlife',
      levelRequired: 12,
      xpReward: 500,
      ecoPointsReward: 250,
      difficulty: 'Epic',
      isUnlocked: level >= 12,
      isCompleted: false,
      icon: 'trending-up',
      color: '#6C5CE7',
      missions: 15,
      estimatedTime: '5 hours'
    }
  ];

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return '#4ECDC4';
      case 'Medium': return '#FDCB6E';
      case 'Hard': return '#E17055';
      case 'Epic': return '#6C5CE7';
      default: return theme.primary;
    }
  };

  const handleZonePress = (zone: QuestZone) => {
    if (!zone.isUnlocked) return;
    
    setSelectedZone(zone.id);
    // Navigate to mission feed with zone filter
    navigation.navigate('MissionFeed', { 
      userRole: 'TRASH_HERO', 
      zoneFilter: zone.id,
      navigation 
    });
  };

  const renderQuestZone = (zone: QuestZone, index: number) => {
    const isLocked = !zone.isUnlocked;
    const cardScale = selectedZone === zone.id ? 0.95 : 1;

    return (
      <Animated.View
        key={zone.id}
        style={[
          styles.questCard,
          { 
            opacity: isLocked ? 0.5 : 1,
            transform: [{ scale: cardScale }],
            marginBottom: index === questZones.length - 1 ? 100 : 20,
          }
        ]}
      >
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => handleZonePress(zone)}
          disabled={isLocked}
          style={styles.questCardContent}
        >
          <LinearGradient
            colors={isLocked ? ['#707070', '#505050'] : [zone.color, `${zone.color}CC`]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.questGradient}
          >
            {/* Lock Overlay */}
            {isLocked && (
              <View style={styles.lockOverlay}>
                <Ionicons name="lock-closed" size={40} color="white" />
                <Text style={styles.lockText}>Level {zone.levelRequired} Required</Text>
              </View>
            )}

            {/* Zone Content */}
            <View style={styles.questHeader}>
              <View style={styles.questIconContainer}>
                <Ionicons name={zone.icon as any} size={32} color="white" />
              </View>
              <View style={styles.questHeaderText}>
                <Text style={styles.questTitle}>{zone.name}</Text>
                <Text style={styles.questDifficulty}>{zone.difficulty} Quest</Text>
              </View>
              <View style={styles.questStats}>
                <Text style={styles.questStatNumber}>{zone.missions}</Text>
                <Text style={styles.questStatLabel}>Missions</Text>
              </View>
            </View>

            <Text style={styles.questDescription}>{zone.description}</Text>

            <View style={styles.questFooter}>
              <View style={styles.questRewards}>
                <View style={styles.rewardItem}>
                  <Ionicons name="star" size={16} color="#FFD93D" />
                  <Text style={styles.rewardText}>{zone.xpReward} XP</Text>
                </View>
                <View style={styles.rewardItem}>
                  <Ionicons name="leaf" size={16} color="#4ECDC4" />
                  <Text style={styles.rewardText}>{zone.ecoPointsReward} Points</Text>
                </View>
              </View>
              <View style={styles.questTime}>
                <Ionicons name="time" size={16} color="rgba(255,255,255,0.8)" />
                <Text style={styles.timeText}>{zone.estimatedTime}</Text>
              </View>
            </View>

            {/* Difficulty Badge */}
            <View style={[styles.difficultyBadge, { backgroundColor: getDifficultyColor(zone.difficulty) }]}>
              <Text style={styles.difficultyText}>{zone.difficulty}</Text>
            </View>
          </LinearGradient>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  return (
    <ScreenLayout>

      {/* Progress Indicator */}
      <View style={[styles.progressContainer, { backgroundColor: theme.card }]}>
        <View style={styles.progressHeader}>
          <Text style={[styles.progressTitle, { color: theme.text }]}>Your Progress</Text>
          <Text style={[styles.progressSubtitle, { color: theme.textSecondary }]}>
            {questZones.filter(z => z.isUnlocked).length} of {questZones.length} zones unlocked
          </Text>
        </View>
        <View style={styles.progressBar}>
          <View 
            style={[
              styles.progressFill, 
              { 
                backgroundColor: theme.primary,
                width: `${(questZones.filter(z => z.isUnlocked).length / questZones.length) * 100}%`
              }
            ]} 
          />
        </View>
      </View>

      {/* Quest Zones List */}
      <Animated.ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true }
        )}
        scrollEventThrottle={16}
      >
        {questZones.map((zone, index) => renderQuestZone(zone, index))}
      </Animated.ScrollView>

      {/* Active Missions Indicator */}
      {activeMissions.length > 0 && (
        <View style={[styles.activeMissionsIndicator, { backgroundColor: theme.primary }]}>
          <Ionicons name="flash" size={16} color="white" />
          <Text style={styles.activeMissionsText}>
            {activeMissions.length} Active Mission{activeMissions.length !== 1 ? 's' : ''}
          </Text>
        </View>
      )}

      {/* Menu Modal */}
      <MenuModal
        visible={showMenu}
        onClose={() => setShowMenu(false)}
        userRole={currentRole || 'IMPACT_WARRIOR'}
        userName="User"
        userLevel={level}
        onNavigate={(screen, params) => {
          navigation.navigate(screen, params);
        }}
        onSignOut={() => navigation.navigate('Login')}
      />
    </ScreenLayout>
  );
};

const styles = StyleSheet.create({
  progressContainer: {
    margin: THEME.SPACING.md + 4,
    padding: THEME.SPACING.md + 4,
    borderRadius: THEME.BORDER_RADIUS.xl,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  progressHeader: {
    marginBottom: THEME.SPACING.sm + 4,
  },
  progressTitle: {
    fontSize: THEME.TYPOGRAPHY.fontSize.base,
    fontWeight: '600',
  },
  progressSubtitle: {
    fontSize: THEME.TYPOGRAPHY.fontSize.sm,
    marginTop: 2,
  },
  progressBar: {
    height: 6,
    backgroundColor: 'rgba(0,0,0,0.1)',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: THEME.SPACING.md + 4,
  },
  questCard: {
    borderRadius: 20,
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
  },
  questCardContent: {
    height: 180,
  },
  questGradient: {
    flex: 1,
    padding: THEME.SPACING.md + 4,
    position: 'relative',
  },
  lockOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
  },
  lockText: {
    // color: theme.background,
    fontSize: THEME.TYPOGRAPHY.fontSize.base,
    fontWeight: '600',
    marginTop: THEME.SPACING.sm,
  },
  questHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: THEME.SPACING.sm + 4,
  },
  questIconContainer: {
    width: 48,
    height: 48,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: THEME.BORDER_RADIUS["2xl"],
    justifyContent: 'center',
    alignItems: 'center',
  },
  questHeaderText: {
    flex: 1,
    marginLeft: THEME.SPACING.sm + 4,
  },
  questTitle: {
    fontSize: THEME.TYPOGRAPHY.fontSize.lg,
    fontWeight: '700',
    // color: theme.background,
  },
  questDifficulty: {
    fontSize: THEME.TYPOGRAPHY.fontSize.sm,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 2,
  },
  questStats: {
    alignItems: 'center',
  },
  questStatNumber: {
    fontSize: THEME.TYPOGRAPHY.fontSize.xl,
    fontWeight: '700',
    // color: theme.background,
  },
  questStatLabel: {
    fontSize: THEME.TYPOGRAPHY.fontSize.xs,
    color: 'rgba(255,255,255,0.8)',
  },
  questDescription: {
    fontSize: THEME.TYPOGRAPHY.fontSize.sm,
    color: 'rgba(255,255,255,0.9)',
    lineHeight: 20,
    marginBottom: THEME.SPACING.md,
  },
  questFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  questRewards: {
    flexDirection: 'row',
    gap: 16,
  },
  rewardItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  rewardText: {
    fontSize: THEME.TYPOGRAPHY.fontSize.xs,
    fontWeight: '600',
    // color: theme.background,
  },
  questTime: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  timeText: {
    fontSize: THEME.TYPOGRAPHY.fontSize.xs,
    color: 'rgba(255,255,255,0.8)',
  },
  difficultyBadge: {
    position: 'absolute',
    top: 15,
    right: 15,
    paddingHorizontal: THEME.SPACING.sm,
    paddingVertical: THEME.SPACING.xs,
    borderRadius: THEME.BORDER_RADIUS.lg,
  },
  difficultyText: {
    fontSize: THEME.TYPOGRAPHY.fontSize.xs,
    fontWeight: '600',
    // color: theme.background,
  },
  activeMissionsIndicator: {
    position: 'absolute',
    bottom: 30,
    left: 20,
    right: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: THEME.SPACING.sm + 4,
    paddingHorizontal: THEME.SPACING.md + 4,
    borderRadius: 25,
    gap: 8,
  },
  activeMissionsText: {
    // color: theme.background,
    fontSize: THEME.TYPOGRAPHY.fontSize.sm,
    fontWeight: '600',
  },
});

export default EcoStationQuest;