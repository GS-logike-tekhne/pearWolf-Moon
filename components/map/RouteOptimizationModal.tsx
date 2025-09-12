import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
  FlatList,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { RouteOptimization } from '../../services/liveMapService';
import { useTheme } from '../../context/ThemeContext';
import { getRoleColor } from '../../utils/roleColors';

interface RouteOptimizationModalProps {
  visible: boolean;
  route: RouteOptimization | null;
  onClose: () => void;
  onStartRoute: (route: RouteOptimization) => void;
}

const RouteOptimizationModal: React.FC<RouteOptimizationModalProps> = ({
  visible,
  route,
  onClose,
  onStartRoute,
}) => {
  const { theme } = useTheme();
  const [selectedMissions, setSelectedMissions] = useState<string[]>([]);

  useEffect(() => {
    if (route) {
      setSelectedMissions(route.missions.map(m => m.id));
    }
  }, [route]);

  if (!route) return null;

  const formatDistance = (distance: number): string => {
    if (distance < 1000) return `${Math.round(distance)}m`;
    return `${(distance / 1000).toFixed(1)}km`;
  };

  const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  const toggleMissionSelection = (missionId: string) => {
    setSelectedMissions(prev => 
      prev.includes(missionId) 
        ? prev.filter(id => id !== missionId)
        : [...prev, missionId]
    );
  };

  const handleStartRoute = () => {
    if (selectedMissions.length === 0) {
      Alert.alert('No Missions Selected', 'Please select at least one mission to start your route.');
      return;
    }

    const filteredRoute = {
      ...route,
      missions: route.missions.filter(m => selectedMissions.includes(m.id)),
      optimizedOrder: route.optimizedOrder.filter(id => selectedMissions.includes(id)),
      waypoints: route.waypoints.filter(wp => selectedMissions.includes(wp.missionId)),
    };

    onStartRoute(filteredRoute);
    onClose();
  };

  const calculateSelectedStats = () => {
    const selectedMissionCount = selectedMissions.length;
    const totalXP = route.missions
      .filter(m => selectedMissions.includes(m.id))
      .reduce((sum, m) => sum + m.xpReward, 0);
    const totalEcoPoints = route.missions
      .filter(m => selectedMissions.includes(m.id))
      .reduce((sum, m) => sum + m.ecoPointsReward, 0);

    return { selectedMissionCount, totalXP, totalEcoPoints };
  };

  const stats = calculateSelectedStats();

  const MissionItem = ({ mission, index }: { mission: any, index: number }) => {
    const isSelected = selectedMissions.includes(mission.id);
    const roleColor = getRoleColor(mission.role);

    return (
      <TouchableOpacity
        style={[
          styles.missionItem,
          {
            backgroundColor: theme.cardBackground,
            borderColor: isSelected ? roleColor : theme.borderColor,
            borderWidth: isSelected ? 2 : 1,
          },
        ]}
        onPress={() => toggleMissionSelection(mission.id)}
        activeOpacity={0.8}
      >
        <View style={styles.missionHeader}>
          <View style={styles.missionInfo}>
            <Text style={[styles.missionNumber, { color: roleColor }]}>
              #{index + 1}
            </Text>
            <Text style={[styles.missionTitle, { color: theme.textColor }]}>
              {mission.title}
            </Text>
          </View>
          
          <View style={[
            styles.checkbox,
            {
              backgroundColor: isSelected ? roleColor : 'transparent',
              borderColor: roleColor,
            },
          ]}>
            {isSelected && (
              <Ionicons name="checkmark" size={16} color="white" />
            )}
          </View>
        </View>

        <View style={styles.missionDetails}>
          <View style={styles.detailRow}>
            <Ionicons name="location" size={14} color={theme.secondaryText} />
            <Text style={[styles.detailText, { color: theme.secondaryText }]}>
              {mission.location.address}
            </Text>
          </View>
          
          <View style={styles.detailRow}>
            <Ionicons name="time" size={14} color={theme.secondaryText} />
            <Text style={[styles.detailText, { color: theme.secondaryText }]}>
              {mission.estimatedDuration}min
            </Text>
          </View>
          
          <View style={styles.rewardsRow}>
            <View style={styles.rewardItem}>
              <Ionicons name="star" size={14} color={theme.primary} />
              <Text style={[styles.rewardText, { color: theme.textColor }]}>
                {mission.xpReward} XP
              </Text>
            </View>
            <View style={styles.rewardItem}>
              <Ionicons name="leaf" size={14} color={roleColor} />
              <Text style={[styles.rewardText, { color: theme.textColor }]}>
                {mission.ecoPointsReward} Eco
              </Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        {/* Header */}
        <View style={[styles.header, { borderBottomColor: theme.borderColor }]}>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Ionicons name="close" size={24} color={theme.textColor} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: theme.textColor }]}>
            Optimized Route
          </Text>
          <View style={{ width: 24 }} />
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Route Stats */}
          <View style={[styles.statsCard, { backgroundColor: theme.cardBackground }]}>
            <Text style={[styles.statsTitle, { color: theme.textColor }]}>
              Route Overview
            </Text>
            
            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <Ionicons name="walk" size={20} color={theme.primary} />
                <Text style={[styles.statValue, { color: theme.textColor }]}>
                  {formatDistance(route.totalDistance)}
                </Text>
                <Text style={[styles.statLabel, { color: theme.secondaryText }]}>
                  Total Distance
                </Text>
              </View>
              
              <View style={styles.statItem}>
                <Ionicons name="time" size={20} color={theme.primary} />
                <Text style={[styles.statValue, { color: theme.textColor }]}>
                  {formatTime(route.estimatedTime)}
                </Text>
                <Text style={[styles.statLabel, { color: theme.secondaryText }]}>
                  Estimated Time
                </Text>
              </View>
              
              <View style={styles.statItem}>
                <Ionicons name="list" size={20} color={theme.primary} />
                <Text style={[styles.statValue, { color: theme.textColor }]}>
                  {route.missions.length}
                </Text>
                <Text style={[styles.statLabel, { color: theme.secondaryText }]}>
                  Missions
                </Text>
              </View>
            </View>
          </View>

          {/* Selected Stats */}
          {stats.selectedMissionCount > 0 && (
            <View style={[styles.selectedStatsCard, { backgroundColor: theme.success + '20' }]}>
              <Text style={[styles.selectedStatsTitle, { color: theme.success }]}>
                Selected Missions: {stats.selectedMissionCount}
              </Text>
              
              <View style={styles.selectedStatsRow}>
                <View style={styles.selectedStatItem}>
                  <Ionicons name="star" size={16} color={theme.primary} />
                  <Text style={[styles.selectedStatText, { color: theme.textColor }]}>
                    {stats.totalXP} XP
                  </Text>
                </View>
                <View style={styles.selectedStatItem}>
                  <Ionicons name="leaf" size={16} color={theme.success} />
                  <Text style={[styles.selectedStatText, { color: theme.textColor }]}>
                    {stats.totalEcoPoints} Eco Points
                  </Text>
                </View>
              </View>
            </View>
          )}

          {/* Missions List */}
          <View style={styles.missionsSection}>
            <Text style={[styles.sectionTitle, { color: theme.textColor }]}>
              Missions ({route.missions.length})
            </Text>
            
            <FlatList
              data={route.missions}
              renderItem={({ item, index }) => (
                <MissionItem mission={item} index={index} />
              )}
              keyExtractor={(item) => item.id}
              scrollEnabled={false}
              ItemSeparatorComponent={() => <View style={styles.separator} />}
            />
          </View>
        </ScrollView>

        {/* Footer */}
        <View style={[styles.footer, { backgroundColor: theme.cardBackground }]}>
          <TouchableOpacity
            style={[
              styles.startButton,
              {
                backgroundColor: stats.selectedMissionCount > 0 ? theme.primary : theme.borderColor,
              },
            ]}
            onPress={handleStartRoute}
            disabled={stats.selectedMissionCount === 0}
          >
            <Ionicons name="navigate" size={20} color="white" />
            <Text style={styles.startButtonText}>
              Start Route ({stats.selectedMissionCount} missions)
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
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
    paddingVertical: 16,
    paddingTop: 50,
    borderBottomWidth: 1,
  },
  closeButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  statsCard: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  statsTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 16,
    textAlign: 'center',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statValue: {
    fontSize: 20,
    fontWeight: '700',
    marginTop: 8,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    textAlign: 'center',
  },
  selectedStatsCard: {
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(76, 175, 80, 0.3)',
  },
  selectedStatsTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 8,
    textAlign: 'center',
  },
  selectedStatsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 24,
  },
  selectedStatItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  selectedStatText: {
    fontSize: 14,
    fontWeight: '600',
  },
  missionsSection: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 12,
  },
  missionItem: {
    borderRadius: 12,
    padding: 16,
  },
  missionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  missionInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  missionNumber: {
    fontSize: 16,
    fontWeight: '700',
    marginRight: 12,
    minWidth: 24,
  },
  missionTitle: {
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  missionDetails: {
    gap: 8,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  detailText: {
    fontSize: 14,
    flex: 1,
  },
  rewardsRow: {
    flexDirection: 'row',
    gap: 16,
  },
  rewardItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  rewardText: {
    fontSize: 14,
    fontWeight: '600',
  },
  separator: {
    height: 12,
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.1)',
  },
  startButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
  },
  startButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default RouteOptimizationModal;
