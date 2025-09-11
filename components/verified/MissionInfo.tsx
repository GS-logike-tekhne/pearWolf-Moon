import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';
import { sharedStyles } from '../../styles/shared';
import { THEME } from '../../styles/theme';

interface MissionInfoProps {
  mission: {
    description: string;
    startDate: string;
    endDate: string;
    participants: number;
    organizer: string;
  };
}

const MissionInfo: React.FC<MissionInfoProps> = ({ mission }) => {
  const { theme } = useTheme();

  return (
    <View style={[
      sharedStyles.card,
      { 
        backgroundColor: theme.cardBackground,
        borderColor: theme.borderColor,
      }
    ]}>
      <Text style={[sharedStyles.sectionTitle, { color: theme.textColor }]}>
        Mission Details
      </Text>
      
      <Text style={[styles.description, { color: theme.textColor }]}>
        {mission.description}
      </Text>
      
      <View style={sharedStyles.grid}>
        <View style={sharedStyles.gridItem}>
          <Ionicons name="calendar-outline" size={20} color={theme.primary} />
          <Text style={[sharedStyles.label, { color: theme.secondaryText }]}>
            Start Date
          </Text>
          <Text style={[sharedStyles.value, { color: theme.textColor }]}>
            {mission.startDate}
          </Text>
        </View>
        
        <View style={sharedStyles.gridItem}>
          <Ionicons name="calendar-outline" size={20} color={theme.primary} />
          <Text style={[sharedStyles.label, { color: theme.secondaryText }]}>
            End Date
          </Text>
          <Text style={[sharedStyles.value, { color: theme.textColor }]}>
            {mission.endDate}
          </Text>
        </View>
        
        <View style={sharedStyles.gridItem}>
          <Ionicons name="people-outline" size={20} color={theme.primary} />
          <Text style={[sharedStyles.label, { color: theme.secondaryText }]}>
            Participants
          </Text>
          <Text style={[sharedStyles.value, { color: theme.textColor }]}>
            {mission.participants}
          </Text>
        </View>
        
        <View style={sharedStyles.gridItem}>
          <Ionicons name="person-outline" size={20} color={theme.primary} />
          <Text style={[sharedStyles.label, { color: theme.secondaryText }]}>
            Organizer
          </Text>
          <Text style={[sharedStyles.value, { color: theme.textColor }]}>
            {mission.organizer}
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  description: {
    fontSize: THEME.TYPOGRAPHY.fontSize.base,
    lineHeight: 22,
    marginBottom: THEME.SPACING.md,
  },
});

export default MissionInfo;
