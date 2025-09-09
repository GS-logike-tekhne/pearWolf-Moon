import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';

interface ProgressBarProps {
  currentXP: number;
  nextLevelXP: number;
  level: number;
  role: string;
  showLevel?: boolean;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ 
  currentXP, 
  nextLevelXP, 
  level, 
  role,
  showLevel = true 
}) => {
  const { theme } = useTheme();
  const progress = (currentXP / nextLevelXP) * 100;
  
  const getRoleTitle = (role: string): string => {
    switch (role) {
      case 'trash-hero': return 'Trash Hero';
      case 'impact-warrior': return 'Impact Warrior';
      case 'business': return 'EcoDefender';
      case 'admin': return 'Admin';
      default: return 'Eco Champion';
    }
  };

  const getRoleIcon = (role: string): string => {
    switch (role) {
      case 'trash-hero': return 'cash';
      case 'impact-warrior': return 'heart';
      case 'business': return 'business';
      case 'admin': return 'shield';
      default: return 'leaf';
    }
  };

  return (
    <View style={styles.container}>
      {showLevel && (
        <View style={styles.levelHeader}>
          <View style={styles.levelInfo}>
            <Ionicons name={getRoleIcon(role)} size={16} color={theme.primary} />
            <Text style={[styles.levelText, { color: theme.primary }]}>
              Level {level} {getRoleTitle(role)}
            </Text>
          </View>
          <Text style={[styles.xpText, { color: theme.secondaryText }]}>
            XP: {currentXP.toLocaleString()}/{nextLevelXP.toLocaleString()}
          </Text>
        </View>
      )}
      
      <View style={styles.progressContainer}>
        <View style={[styles.progressTrack, { backgroundColor: theme.accent }]}>
          <View 
            style={[
              styles.progressFill, 
              { 
                width: `${Math.min(progress, 100)}%`,
                backgroundColor: theme.primary 
              }
            ]} 
          />
        </View>
        <Text style={[styles.progressText, { color: theme.secondaryText }]}>
          {Math.round(progress)}%
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
  },
  levelHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  levelInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  levelText: {
    fontSize: 14,
    fontWeight: '600',
  },
  xpText: {
    fontSize: 12,
    fontWeight: '500',
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  progressTrack: {
    flex: 1,
    height: 6,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  progressText: {
    fontSize: 11,
    fontWeight: '500',
    minWidth: 30,
    textAlign: 'right',
  },
});

export default ProgressBar;