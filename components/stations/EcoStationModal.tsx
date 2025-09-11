import React from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';
import { THEME } from '../../styles/theme';
import { EcoStation, StationMission } from '../../utils/mockData';

interface EcoStationModalProps {
  visible: boolean;
  station: EcoStation | null;
  missions: StationMission[];
  onStartMission: (missionType: string) => void;
  onClose: () => void;
}

const { width } = Dimensions.get('window');

const EcoStationModal: React.FC<EcoStationModalProps> = ({
  visible,
  station,
  missions,
  onStartMission,
  onClose,
}) => {
  const { theme } = useTheme();

  const getStationIcon = () => {
    if (!station) return 'location';
    switch (station.type) {
      case 'recycling-depot':
        return 'recycle';
      case 'analytics-hub':
        return 'analytics';
      case 'pearthquake-event':
        return 'globe';
      default:
        return 'location';
    }
  };

  const getStationColor = () => {
    if (!station) return theme.primary;
    switch (station.type) {
      case 'recycling-depot':
        return '#10b981'; // Green
      case 'analytics-hub':
        return '#3b82f6'; // Blue
      case 'pearthquake-event':
        return '#f59e0b'; // Orange
      default:
        return theme.primary;
    }
  };

  const getStationTypeName = () => {
    if (!station) return 'Eco Station';
    switch (station.type) {
      case 'recycling-depot':
        return 'Recycling Depot';
      case 'analytics-hub':
        return 'Analytics Hub';
      case 'pearthquake-event':
        return 'PEARthquake Event';
      default:
        return 'Eco Station';
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy':
        return '#10b981';
      case 'medium':
        return '#f59e0b';
      case 'hard':
        return '#ef4444';
      default:
        return theme.primary;
    }
  };

  if (!visible || !station) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={[styles.container, { backgroundColor: theme.cardBackground }]}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.stationInfo}>
              <View style={[styles.stationIcon, { backgroundColor: getStationColor() }]}>
                <Ionicons name={getStationIcon() as any} size={32} color="white" />
              </View>
              <View style={styles.stationDetails}>
                <Text style={[styles.stationName, { color: theme.textColor }]}>
                  {station.name}
                </Text>
                <Text style={[styles.stationType, { color: getStationColor() }]}>
                  {getStationTypeName()} • Level {station.level}
                </Text>
              </View>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={24} color={theme.textColor} />
            </TouchableOpacity>
          </View>

          {/* Station Stats */}
          <View style={styles.stats}>
            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: theme.primary }]}>
                {station.communityRating}⭐
              </Text>
              <Text style={[styles.statLabel, { color: theme.secondaryText }]}>
                Rating
              </Text>
            </View>
            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: theme.success }]}>
                {station.currentParticipants}/{station.maxParticipants}
              </Text>
              <Text style={[styles.statLabel, { color: theme.secondaryText }]}>
                Active
              </Text>
            </View>
            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: '#f59e0b' }]}>
                {station.xpReward} XP
              </Text>
              <Text style={[styles.statLabel, { color: theme.secondaryText }]}>
                Reward
              </Text>
            </View>
          </View>

          {/* Description */}
          <Text style={[styles.description, { color: theme.secondaryText }]}>
            {station.description}
          </Text>

          {/* Missions */}
          <View style={styles.missionsSection}>
            <Text style={[styles.sectionTitle, { color: theme.textColor }]}>
              Available Missions
            </Text>
            <ScrollView style={styles.missionsList} showsVerticalScrollIndicator={false}>
              {missions.map((mission) => (
                <TouchableOpacity
                  key={mission.id}
                  style={[styles.missionCard, { backgroundColor: theme.borderColor }]}
                  onPress={() => onStartMission(mission.type)}
                >
                  <View style={styles.missionHeader}>
                    <Text style={[styles.missionTitle, { color: theme.textColor }]}>
                      {mission.title}
                    </Text>
                    <View style={[
                      styles.difficultyBadge,
                      { backgroundColor: getDifficultyColor(mission.difficulty) }
                    ]}>
                      <Text style={styles.difficultyText}>
                        {mission.difficulty.toUpperCase()}
                      </Text>
                    </View>
                  </View>
                  <Text style={[styles.missionDescription, { color: theme.secondaryText }]}>
                    {mission.description}
                  </Text>
                  <View style={styles.missionRewards}>
                    <Text style={[styles.rewardText, { color: theme.primary }]}>
                      +{mission.xpReward} XP
                    </Text>
                    <Text style={[styles.rewardText, { color: '#10b981' }]}>
                      +{mission.ecoPointsReward} Eco Points
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* Global Event Info */}
          {station.globalEvent && (
            <View style={[styles.eventInfo, { backgroundColor: getStationColor() }]}>
              <Ionicons name="globe" size={20} color="white" />
              <Text style={styles.eventText}>
                Global Event • {station.currentParticipants} participants worldwide
              </Text>
            </View>
          )}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'flex-end',
  },
  container: {
    height: '80%',
    borderTopLeftRadius: THEME.BORDER_RADIUS.xl,
    borderTopRightRadius: THEME.BORDER_RADIUS.xl,
    padding: THEME.SPACING.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: THEME.SPACING.lg,
  },
  stationInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  stationIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: THEME.SPACING.md,
  },
  stationDetails: {
    flex: 1,
  },
  stationName: {
    fontSize: THEME.TYPOGRAPHY.fontSize.xl,
    fontWeight: 'bold',
    marginBottom: THEME.SPACING.xs,
  },
  stationType: {
    fontSize: THEME.TYPOGRAPHY.fontSize.sm,
    fontWeight: '600',
  },
  closeButton: {
    padding: THEME.SPACING.xs,
  },
  stats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: THEME.SPACING.lg,
    paddingVertical: THEME.SPACING.md,
    borderRadius: THEME.BORDER_RADIUS.lg,
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: THEME.TYPOGRAPHY.fontSize.lg,
    fontWeight: 'bold',
    marginBottom: THEME.SPACING.xs,
  },
  statLabel: {
    fontSize: THEME.TYPOGRAPHY.fontSize.sm,
  },
  description: {
    fontSize: THEME.TYPOGRAPHY.fontSize.base,
    lineHeight: 22,
    marginBottom: THEME.SPACING.lg,
    textAlign: 'center',
  },
  missionsSection: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: THEME.TYPOGRAPHY.fontSize.lg,
    fontWeight: 'bold',
    marginBottom: THEME.SPACING.md,
  },
  missionsList: {
    flex: 1,
  },
  missionCard: {
    padding: THEME.SPACING.md,
    borderRadius: THEME.BORDER_RADIUS.lg,
    marginBottom: THEME.SPACING.sm,
  },
  missionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: THEME.SPACING.sm,
  },
  missionTitle: {
    fontSize: THEME.TYPOGRAPHY.fontSize.base,
    fontWeight: '600',
    flex: 1,
  },
  difficultyBadge: {
    paddingHorizontal: THEME.SPACING.sm,
    paddingVertical: THEME.SPACING.xs,
    borderRadius: THEME.BORDER_RADIUS.full,
  },
  difficultyText: {
    color: 'white',
    fontSize: THEME.TYPOGRAPHY.fontSize.xs,
    fontWeight: 'bold',
  },
  missionDescription: {
    fontSize: THEME.TYPOGRAPHY.fontSize.sm,
    marginBottom: THEME.SPACING.sm,
    lineHeight: 18,
  },
  missionRewards: {
    flexDirection: 'row',
    gap: THEME.SPACING.md,
  },
  rewardText: {
    fontSize: THEME.TYPOGRAPHY.fontSize.sm,
    fontWeight: '600',
  },
  eventInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: THEME.SPACING.md,
    borderRadius: THEME.BORDER_RADIUS.lg,
    marginTop: THEME.SPACING.md,
    gap: THEME.SPACING.sm,
  },
  eventText: {
    color: 'white',
    fontSize: THEME.TYPOGRAPHY.fontSize.sm,
    fontWeight: '600',
    flex: 1,
  },
});

export default EcoStationModal;
