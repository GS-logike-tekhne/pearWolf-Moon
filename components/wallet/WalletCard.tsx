import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import LinearGradient from 'expo-linear-gradient';
import XPLevelRing from './XPLevelRing';

const { width } = Dimensions.get('window');

interface WalletCardProps {
  role: string;
  tier: string;
  id: string;
  balance: string;
  ecoPoints: number;
  level: number;
  levelProgress: number;
  nextTierEcoPoints: number;
  nextTierCash: string;
}

const WalletCard: React.FC<WalletCardProps> = ({
  role,
  tier,
  id,
  balance,
  ecoPoints,
  level,
  levelProgress,
  nextTierEcoPoints,
  nextTierCash,
}) => {
  return (
    <View style={styles.container}>
      {/* Glow effect background */}
      <View style={styles.glowBackground} />
      
      <LinearGradient
        colors={['#35B87F', '#2A9D6F']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.card}
      >
        {/* Header with XP Ring and Role Info */}
        <View style={styles.header}>
          <View style={styles.xpSection}>
            <XPLevelRing 
              level={level} 
              progress={levelProgress} 
              size={70} 
            />
          </View>
          
          <View style={styles.roleSection}>
            <View style={styles.roleHeader}>
              <Text style={styles.roleTitle}>{role}</Text>
              <View style={styles.roleIcon}>
                <View style={styles.iconRing}>
                  <Ionicons name="leaf" size={16} color="white" />
                </View>
              </View>
            </View>
            <Text style={styles.tierText}>{tier}</Text>
            <Text style={styles.idText}>ID: {id}</Text>
          </View>
        </View>

        {/* Balance Section */}
        <View style={styles.balanceSection}>
          <Text style={styles.balanceAmount}>{balance}</Text>
          <View style={styles.ecoPointsRow}>
            <View style={styles.ecoIcon}>
              <Text style={styles.ecoIconText}>💎</Text>
            </View>
            <Text style={styles.ecoPointsText}>{ecoPoints} Eco Points</Text>
          </View>
        </View>

        {/* Progress Bar */}
        <View style={styles.progressSection}>
          <View style={styles.progressBar}>
            <View 
              style={[
                styles.progressFill, 
                { width: `${(ecoPoints / nextTierEcoPoints) * 100}%` }
              ]} 
            />
          </View>
          
          <View style={styles.progressLabels}>
            <Text style={styles.progressLabel}>Next Tier: Eco {nextTierEcoPoints.toLocaleString()}</Text>
            <Text style={styles.progressLabel}>Next: {nextTierCash}</Text>
          </View>
        </View>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    marginHorizontal: 20,
    marginVertical: 10,
  },
  glowBackground: {
    position: 'absolute',
    top: -5,
    left: -5,
    right: -5,
    bottom: -5,
    backgroundColor: '#35B87F',
    borderRadius: 25,
    opacity: 0.3,
    shadowColor: '#35B87F',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.5,
    shadowRadius: 12,
    elevation: 12,
  },
  card: {
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  xpSection: {
    marginRight: 15,
  },
  roleSection: {
    flex: 1,
    marginTop: 5,
  },
  roleHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  roleTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: 'white',
    marginRight: 10,
  },
  roleIcon: {
    position: 'relative',
  },
  iconRing: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#F4C542',
  },
  tierText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#F4C542',
    marginBottom: 2,
  },
  idText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  balanceSection: {
    alignItems: 'center',
    marginBottom: 20,
  },
  balanceAmount: {
    fontSize: 36,
    fontWeight: '700',
    color: 'white',
    marginBottom: 8,
  },
  ecoPointsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ecoIcon: {
    marginRight: 6,
  },
  ecoIconText: {
    fontSize: 16,
  },
  ecoPointsText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
  },
  progressSection: {
    marginBottom: 5,
  },
  progressBar: {
    height: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#F4C542',
    borderRadius: 3,
  },
  progressLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  progressLabel: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
    fontWeight: '500',
  },
});

export default WalletCard;
