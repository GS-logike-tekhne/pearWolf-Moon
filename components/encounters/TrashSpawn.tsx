import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Marker } from 'react-native-maps';
import { Ionicons } from '@expo/vector-icons';
import { TrashEncounter } from '../../hooks/useTrashEncounters';

interface TrashSpawnProps {
  encounter: TrashEncounter;
  onPress: (encounter: TrashEncounter) => void;
}

const TrashSpawn: React.FC<TrashSpawnProps> = ({ encounter, onPress }) => {
  const getTrashIcon = () => {
    switch (encounter.type) {
      case 'plastic_bottle':
        return 'bottle';
      case 'candy_wrapper':
        return 'trash';
      case 'cigarette_butt':
        return 'cigarette';
      case 'broken_glass':
        return 'warning';
      case 'metal_can':
        return 'cube';
      case 'styrofoam':
        return 'square';
      case 'large_debris':
        return 'construct';
      case 'hazardous_waste':
        return 'skull';
      default:
        return 'trash';
    }
  };

  const getRarityColor = () => {
    switch (encounter.rarity) {
      case 'common':
        return '#10b981'; // Green
      case 'uncommon':
        return '#f59e0b'; // Orange
      case 'rare':
        return '#ef4444'; // Red
      default:
        return '#10b981';
    }
  };

  const getRarityGlow = () => {
    switch (encounter.rarity) {
      case 'common':
        return 'rgba(16, 185, 129, 0.3)';
      case 'uncommon':
        return 'rgba(245, 158, 11, 0.3)';
      case 'rare':
        return 'rgba(239, 68, 68, 0.3)';
      default:
        return 'rgba(16, 185, 129, 0.3)';
    }
  };

  return (
    <Marker
      coordinate={encounter.coordinates}
      title={`🗑️ ${encounter.type.replace('_', ' ').toUpperCase()}`}
      description={`${encounter.xpReward} XP • ${encounter.ecoPointsReward} Eco Points`}
      onPress={() => onPress(encounter)}
    >
      <View style={[styles.marker, { borderColor: getRarityColor() }]}>
        <View style={[styles.markerInner, { backgroundColor: getRarityColor() }]}>
          <Ionicons 
            name={getTrashIcon() as any} 
            size={16} 
            color="white" 
          />
        </View>
        <View 
          style={[
            styles.glow, 
            { 
              backgroundColor: getRarityGlow(),
              shadowColor: getRarityColor()
            }
          ]} 
        />
      </View>
    </Marker>
  );
};

const styles = StyleSheet.create({
  marker: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  markerInner: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
  },
  glow: {
    position: 'absolute',
    width: 40,
    height: 40,
    borderRadius: 20,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 8,
    elevation: 8,
    zIndex: 1,
  },
});

export default TrashSpawn;
