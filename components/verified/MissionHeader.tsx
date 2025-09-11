import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';
import { sharedStyles } from '../../styles/shared';
import { THEME } from '../../styles/theme';

interface MissionHeaderProps {
  mission: {
    title: string;
    location: string;
    urgency: 'high' | 'medium' | 'low';
  };
  onBack: () => void;
}

const MissionHeader: React.FC<MissionHeaderProps> = ({ mission, onBack }) => {
  const { theme } = useTheme();

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'high': return theme.error;
      case 'medium': return '#FFA500';
      case 'low': return theme.success;
      default: return theme.secondaryText;
    }
  };

  const getUrgencyText = (urgency: string) => {
    switch (urgency) {
      case 'high': return 'URGENT';
      case 'medium': return 'MODERATE';
      case 'low': return 'STANDARD';
      default: return 'ACTIVE';
    }
  };

  return (
    <View style={[
      sharedStyles.card,
      styles.header,
      { 
        backgroundColor: theme.cardBackground,
        borderColor: theme.borderColor,
      }
    ]}>
      <TouchableOpacity style={styles.backButton} onPress={onBack}>
        <Ionicons name="arrow-back" size={24} color={theme.textColor} />
      </TouchableOpacity>
      
      <View style={styles.headerContent}>
        <View style={styles.titleRow}>
          <Text style={[styles.missionTitle, { color: theme.textColor }]}>
            {mission.title}
          </Text>
          <View style={[
            sharedStyles.badge,
            { backgroundColor: getUrgencyColor(mission.urgency) }
          ]}>
            <Text style={sharedStyles.badgeText}>
              {getUrgencyText(mission.urgency)}
            </Text>
          </View>
        </View>
        
        <View style={styles.locationRow}>
          <Ionicons name="location-outline" size={16} color={theme.secondaryText} />
          <Text style={[styles.location, { color: theme.secondaryText }]}>
            {mission.location}
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    marginBottom: 0,
  },
  backButton: {
    marginRight: THEME.SPACING.md,
  },
  headerContent: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: THEME.SPACING.xs,
  },
  missionTitle: {
    fontSize: THEME.TYPOGRAPHY.fontSize.xl,
    fontWeight: 'bold',
    flex: 1,
    marginRight: THEME.SPACING.sm,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  location: {
    fontSize: THEME.TYPOGRAPHY.fontSize.sm,
    marginLeft: THEME.SPACING.xs,
  },
});

export default MissionHeader;
