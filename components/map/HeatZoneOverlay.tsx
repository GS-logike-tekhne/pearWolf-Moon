import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { Circle } from 'react-native-maps';
import { useTheme } from '../../context/ThemeContext';

export interface HeatZone {
  id: string;
  center: {
    latitude: number;
    longitude: number;
  };
  radius: number; // meters
  intensity: number; // 0-1 based on activity level
  type: 'trash_hotspot' | 'cleanup_success' | 'sponsor_zone' | 'high_activity';
  metadata?: {
    missionCount?: number;
    lastActivity?: Date;
    sponsorInfo?: {
      name: string;
      logo?: string;
      color?: string;
    };
  };
}

interface HeatZoneOverlayProps {
  heatZones: HeatZone[];
  visible: boolean;
}

const HeatZoneOverlay: React.FC<HeatZoneOverlayProps> = ({ heatZones, visible }) => {
  const { theme } = useTheme();
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (visible) {
      // Create pulsing animation for active zones
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.2,
            duration: 2000,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 2000,
            useNativeDriver: true,
          }),
        ])
      ).start();
    }
  }, [visible, pulseAnim]);

  const getZoneColor = (zone: HeatZone): string => {
    const { type, intensity } = zone;
    
    switch (type) {
      case 'trash_hotspot':
        // Red gradient based on intensity
        const redIntensity = Math.floor(255 * intensity);
        return `rgba(${redIntensity}, 50, 50, ${0.3 + intensity * 0.4})`;
      
      case 'cleanup_success':
        // Green gradient for cleaned areas
        const greenIntensity = Math.floor(255 * intensity);
        return `rgba(50, ${greenIntensity}, 50, ${0.2 + intensity * 0.3})`;
      
      case 'sponsor_zone':
        // Custom sponsor color or default blue
        return zone.metadata?.sponsorInfo?.color 
          ? `${zone.metadata.sponsorInfo.color}${Math.floor(0.3 + intensity * 0.4).toString(16).padStart(2, '0')}`
          : `rgba(50, 100, 200, ${0.3 + intensity * 0.4})`;
      
      case 'high_activity':
        // Orange gradient for high activity areas
        const orangeIntensity = Math.floor(255 * intensity);
        return `rgba(${orangeIntensity}, ${Math.floor(orangeIntensity * 0.7)}, 50, ${0.3 + intensity * 0.4})`;
      
      default:
        return `rgba(100, 100, 100, ${0.2 + intensity * 0.3})`;
    }
  };

  const getZoneStrokeColor = (zone: HeatZone): string => {
    const { type, intensity } = zone;
    
    switch (type) {
      case 'trash_hotspot':
        return `rgba(255, 100, 100, ${0.6 + intensity * 0.4})`;
      case 'cleanup_success':
        return `rgba(100, 255, 100, ${0.6 + intensity * 0.4})`;
      case 'sponsor_zone':
        return zone.metadata?.sponsorInfo?.color 
          ? `${zone.metadata.sponsorInfo.color}${Math.floor(0.8 + intensity * 0.2).toString(16).padStart(2, '0')}`
          : `rgba(100, 150, 255, ${0.6 + intensity * 0.4})`;
      case 'high_activity':
        return `rgba(255, 200, 100, ${0.6 + intensity * 0.4})`;
      default:
        return `rgba(150, 150, 150, ${0.6 + intensity * 0.4})`;
    }
  };

  if (!visible || heatZones.length === 0) {
    return null;
  }

  return (
    <>
      {heatZones.map((zone) => (
        <Animated.View
          key={zone.id}
          style={[
            styles.zoneContainer,
            {
              transform: [{ scale: pulseAnim }],
            },
          ]}
        >
          {/* Main heat zone circle */}
          <Circle
            center={zone.center}
            radius={zone.radius}
            fillColor={getZoneColor(zone)}
            strokeColor={getZoneStrokeColor(zone)}
            strokeWidth={2}
          />
          
          {/* Inner glow effect for high intensity zones */}
          {zone.intensity > 0.7 && (
            <Circle
              center={zone.center}
              radius={zone.radius * 0.6}
              fillColor={getZoneColor({ ...zone, intensity: zone.intensity * 0.5 })}
              strokeColor="transparent"
            />
          )}
          
          {/* Outer pulse ring for urgent zones */}
          {zone.type === 'trash_hotspot' && zone.intensity > 0.8 && (
            <Circle
              center={zone.center}
              radius={zone.radius * 1.3}
              fillColor="transparent"
              strokeColor={getZoneStrokeColor(zone)}
              strokeWidth={1}
            />
          )}
        </Animated.View>
      ))}
    </>
  );
};

const styles = StyleSheet.create({
  zoneContainer: {
    position: 'absolute',
  },
});

export default HeatZoneOverlay;
