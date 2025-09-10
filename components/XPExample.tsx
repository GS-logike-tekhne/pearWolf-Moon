import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useXP } from '../hooks/useXP';
import { XPProgressBar } from './XPProgressBar';

/**
 * Example component demonstrating the XP system usage
 * This can be used in any screen to show XP progress and allow XP gains
 */
export const XPExample: React.FC = () => {
  const { level, xp, progress, nextXP, gainXP } = useXP(230); // Start with 230 XP

  return (
    <View style={styles.container}>
      <Text style={styles.title}>XP System Demo</Text>
      
      <XPProgressBar 
        progress={progress} 
        level={level} 
        nextXP={nextXP}
        color="#4CAF50"
      />
      
      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={[styles.button, { backgroundColor: '#4CAF50' }]}
          onPress={() => gainXP(25)}
        >
          <Text style={styles.buttonText}>+25 XP</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.button, { backgroundColor: '#2196F3' }]}
          onPress={() => gainXP(50)}
        >
          <Text style={styles.buttonText}>+50 XP</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.button, { backgroundColor: '#FF9800' }]}
          onPress={() => gainXP(100)}
        >
          <Text style={styles.buttonText}>+100 XP</Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.statsContainer}>
        <Text style={styles.statText}>Current Level: {level}</Text>
        <Text style={styles.statText}>Total XP: {xp}</Text>
        <Text style={styles.statText}>Progress: {Math.round(progress * 100)}%</Text>
        <Text style={styles.statText}>XP to Next Level: {nextXP - Math.floor(progress * nextXP)}</Text>
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
