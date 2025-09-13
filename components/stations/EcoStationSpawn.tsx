import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Marker } from 'react-native-maps';
import { Ionicons } from '@expo/vector-icons';
import { EcoStation } from '../../utils/mockData';

interface EcoStationSpawnProps {
  station: EcoStation;
  onPress: (station: EcoStation) => void;
}

const EcoStationSpawn: React.FC<EcoStationSpawnProps> = ({ station, onPress }) => {
  const getStationIcon = () => {
    switch (station.type) {
      case 'recycling-depot':
        return 'refresh';
      case 'analytics-hub':
        return 'analytics';
      case 'pearthquake-event':
        return 'globe';
      default:
        return 'location';
    }
  };

  const getStationColor = () => {
    switch (station.type) {
      case 'recycling-depot':
        return '#10b981'; // Green
      case 'analytics-hub':
        return '#3b82f6'; // Blue
      case 'pearthquake-event':
        return '#f59e0b'; // Orange
      default:
        return '#6b7280'; // Gray
    }
  };

  const getStationGlow = () => {
    switch (station.type) {
      case 'recycling-depot':
        return 'rgba(16, 185, 129, 0.4)';
      case 'analytics-hub':
        return 'rgba(59, 130, 246, 0.4)';
      case 'pearthquake-event':
        return 'rgba(245, 158, 11, 0.4)';
      default:
        return 'rgba(107, 114, 128, 0.4)';
    }
  };

  const getStationSize = () => {
    switch (station.type) {
      case 'pearthquake-event':
        return { width: 50, height: 50, borderRadius: 25 };
      case 'analytics-hub':
        return { width: 42, height: 42, borderRadius: 21 };
      case 'recycling-depot':
        return { width: 38, height: 38, borderRadius: 19 };
      default:
        return { width: 36, height: 36, borderRadius: 18 };
    }
  };

  const getStationBadge = () => {
    if (station.level >= 4) return '💎'; // Diamond for high level
    if (station.level >= 3) return '⭐'; // Star for medium level
    if (station.globalEvent) return '🌍'; // Globe for global events
    return null;
  };

  const stationSize = getStationSize();
  const stationColor = getStationColor();
  const stationGlow = getStationGlow();
  const badge = getStationBadge();

  return (
    <Marker
      coordinate={station.location.coordinates}
      title={`${getStationIcon() === 'globe' ? '🌍' : getStationIcon() === 'refresh' ? '🟢' : '🔵'} ${station.name}`}
      description={`Level ${station.level} • ${station.communityRating}⭐ • ${station.xpReward} XP • ${station.ecoPointsReward} Eco Points`}
      onPress={() => onPress(station)}
    >
      <View style={[styles.marker, { borderColor: stationColor }]}>
        <View 
          style={[
            styles.markerInner, 
            { 
              backgroundColor: stationColor,
              width: stationSize.width,
              height: stationSize.height,
              borderRadius: stationSize.borderRadius
            }
          ]}
        >
          <Ionicons 
            name={getStationIcon() as any} 
            size={station.type === 'pearthquake-event' ? 24 : 20} 
            color="white" 
          />
        </View>
        
        {/* Level Badge */}
        {badge && (
          <View style={[styles.levelBadge, { backgroundColor: stationColor }]}>
            <Text style={styles.levelBadgeText}>{badge}</Text>
          </View>
        )}
        
        {/* Glow Effect */}
        <View 
          style={[
            styles.glow, 
            { 
              backgroundColor: stationGlow,
              shadowColor: stationColor,
              width: stationSize.width + 8,
              height: stationSize.height + 8,
              borderRadius: (stationSize.width + 8) / 2
            }
          ]} 
        />
        
        {/* Pulse Animation for PEARthquake Events */}
        {station.type === 'pearthquake-event' && station.isActive && (
          <View style={[styles.pulse, { borderColor: stationColor }]} />
        )}
      </View>
    </Marker>
  );
};

const styles = StyleSheet.create({
  marker: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    borderWidth: 2,
  },
  markerInner: {
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 3,
    borderWidth: 2,
    borderColor: 'white',
  },
  levelBadge: {
    position: 'absolute',
    top: -8,
    right: -8,
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'white',
    zIndex: 4,
  },
  levelBadgeText: {
    fontSize: 10,
    fontWeight: 'bold',
  },
  glow: {
    position: 'absolute',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 8,
    elevation: 8,
    zIndex: 1,
  },
  pulse: {
    position: 'absolute',
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 2,
    zIndex: 0,
    // Pulse animation would be added here with Animated API
  },
});

export default EcoStationSpawn;
