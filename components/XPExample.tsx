import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useXP } from '../hooks/useXP';
import { XPProgressBar } from './XPProgressBar';

/**
 * Example component demonstrating the XP system usage
 * This can be used in any screen to show XP progress and allow XP gains
 */
export const XPExample: React.FC = () => {
  const xpData = useXP(230); // Start with 230 XP
  const { currentLevel, progressPercent, xpToNext, addXP } = xpData;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>XP System Demo</Text>
      
      <XPProgressBar 
        progress={progressPercent / 100} 
        level={currentLevel.level} 
        nextXP={xpToNext}
        color="#4CAF50"
      />
      
      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={[styles.button, { backgroundColor: '#4CAF50' }]}
          onPress={() => addXP(25, 'Demo')}
        >
          <Text style={styles.buttonText}>+25 XP</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.button, { backgroundColor: '#2196F3' }]}
          onPress={() => addXP(50, 'Demo')}
        >
          <Text style={styles.buttonText}>+50 XP</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.button, { backgroundColor: '#FF9800' }]}
          onPress={() => addXP(100, 'Demo')}
        >
          <Text style={styles.buttonText}>+100 XP</Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.statsContainer}>
        <Text style={styles.statText}>Current Level: {currentLevel.level}</Text>
        <Text style={styles.statText}>Total XP: {currentLevel.xp}</Text>
        <Text style={styles.statText}>Progress: {Math.round(progressPercent)}%</Text>
        <Text style={styles.statText}>XP to Next Level: {xpToNext}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    margin: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
    color: '#333',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 16,
  },
  button: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    minWidth: 80,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 14,
  },
  statsContainer: {
    marginTop: 16,
    padding: 12,
    backgroundColor: 'white',
    borderRadius: 8,
  },
  statText: {
    fontSize: 14,
    marginBottom: 4,
    color: '#666',
  },
});
