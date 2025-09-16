import React, { useState } from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';

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
  const [showComparison, setShowComparison] = useState(false);
  const fadeAnim = new Animated.Value(0);
  const slideAnim = new Animated.Value(50);

  const handleCardPress = () => {
    if (showComparison) {
      // Hide animation
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 50,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start(() => {
        setShowComparison(false);
      });
    } else {
      // Show animation
      setShowComparison(true);
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={styles.card}
        onPress={handleCardPress}
        activeOpacity={0.9}
      >
        {/* Glassmorphism Background */}
        <LinearGradient
          colors={['rgba(255, 255, 255, 0.1)', 'rgba(255, 255, 255, 0.05)']}
          style={styles.glassBackground}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          {/* Glass Overlay */}
          <View style={styles.glassOverlay} />
          
          {/* Card Content */}
          <View style={styles.cardContent}>
            {/* Header */}
            <View style={styles.header}>
              <View style={styles.cardType}>
                <Text style={styles.cardTypeText}>PEAR</Text>
              </View>
              <View style={styles.chip}>
                <View style={styles.chipInner}>
                  <View style={styles.chipLines}>
                    <View style={styles.chipLine1} />
                    <View style={styles.chipLine2} />
                    <View style={styles.chipLine3} />
                    <View style={styles.chipLine4} />
                  </View>
                </View>
              </View>
            </View>

            {/* Wallet ID */}
            <View style={styles.cardNumberSection}>
              <Text style={styles.cardNumber}>{id}</Text>
            </View>

            {/* User Info */}
            <View style={styles.userInfoSection}>
              <View style={styles.userInfoRow}>
                <Text style={styles.userInfoLabel}>ROLE</Text>
                <Text style={styles.userInfoValue}>{role}</Text>
              </View>
              <View style={styles.userInfoRow}>
                <Text style={styles.userInfoLabel}>LEVEL</Text>
                <Text style={styles.userInfoValue}>{level}</Text>
              </View>
              <View style={styles.userInfoRow}>
                <Text style={styles.userInfoLabel}>BALANCE</Text>
                <Text style={styles.userInfoValue}>{balance}</Text>
              </View>
            </View>

            {/* Footer */}
            <View style={styles.footer}>
              <View style={styles.cardholderSection}>
                <Text style={styles.cardholderLabel}>CARDHOLDER</Text>
                <Text style={styles.cardholderName}>{role}</Text>
              </View>
              <View style={styles.expirySection}>
                <Text style={styles.expiryLabel}>VALID THRU</Text>
                <Text style={styles.expiryDate}>12/28</Text>
              </View>
            </View>
          </View>

          {/* Decorative Glass Elements */}
          <View style={styles.glassCircle1} />
          <View style={styles.glassCircle2} />
          <View style={styles.glassCircle3} />
        </LinearGradient>

        {/* Animated Comparison Overlay */}
        {showComparison && (
          <Animated.View 
            style={[
              styles.comparisonOverlay,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              }
            ]}
          >
            <View style={styles.comparisonContent}>
              <Text style={styles.comparisonTitle}>Weekly Comparison</Text>
              <View style={styles.comparisonRow}>
                <View style={styles.comparisonItem}>
                  <Text style={styles.comparisonLabel}>This Week</Text>
                  <Text style={styles.comparisonValue}>$127</Text>
                </View>
                <View style={styles.comparisonItem}>
                  <Text style={styles.comparisonLabel}>Last Week</Text>
                  <Text style={styles.comparisonValue}>$113</Text>
                </View>
              </View>
              <View style={styles.comparisonFooter}>
                <Ionicons name="trending-up" size={16} color="#9AE630" />
                <Text style={styles.comparisonChange}>+12% vs last week</Text>
              </View>
            </View>
          </Animated.View>
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 8,
    marginTop: 20,
    marginBottom: 20,
    paddingTop: 0,
  },
  card: {
    backgroundColor: 'transparent',
    borderRadius: 20,
    position: 'relative',
    overflow: 'hidden',
    marginHorizontal: 0,
    alignSelf: 'center',
    width: '100%',
    minHeight: 220,
    // Glassmorphism shadows
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.3,
    shadowRadius: 25,
    elevation: 15,
  },
  glassBackground: {
    flex: 1,
    borderRadius: 20,
    position: 'relative',
    overflow: 'hidden',
  },
  glassOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  cardContent: {
    flex: 1,
    padding: 24,
    zIndex: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 30,
  },
  cardType: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  cardTypeText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#ffffff',
    letterSpacing: 1,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  chip: {
    width: 40,
    height: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.4)',
  },
  chipInner: {
    width: 30,
    height: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  chipLines: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  chipLine1: {
    position: 'absolute',
    width: 2,
    height: 8,
    backgroundColor: '#9AE630',
    top: 2,
    left: 4,
  },
  chipLine2: {
    position: 'absolute',
    width: 2,
    height: 6,
    backgroundColor: '#9AE630',
    top: 4,
    right: 4,
  },
  chipLine3: {
    position: 'absolute',
    width: 2,
    height: 8,
    backgroundColor: '#9AE630',
    bottom: 2,
    left: 6,
  },
  chipLine4: {
    position: 'absolute',
    width: 2,
    height: 6,
    backgroundColor: '#9AE630',
    bottom: 4,
    right: 6,
  },
  cardNumberSection: {
    marginBottom: 20,
  },
  cardNumber: {
    fontSize: 20,
    fontWeight: '500',
    color: '#ffffff',
    letterSpacing: 2,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  userInfoSection: {
    marginBottom: 20,
  },
  userInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  userInfoLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: 'rgba(255, 255, 255, 0.7)',
    letterSpacing: 1,
  },
  userInfoValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#9AE630',
    letterSpacing: 0.5,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  cardholderSection: {
    flex: 1,
  },
  cardholderLabel: {
    fontSize: 10,
    fontWeight: '500',
    color: 'rgba(255, 255, 255, 0.7)',
    letterSpacing: 1,
    marginBottom: 4,
  },
  cardholderName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ffffff',
    letterSpacing: 1,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  expirySection: {
    alignItems: 'flex-end',
  },
  expiryLabel: {
    fontSize: 10,
    fontWeight: '500',
    color: 'rgba(255, 255, 255, 0.7)',
    letterSpacing: 1,
    marginBottom: 4,
  },
  expiryDate: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ffffff',
    letterSpacing: 1,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  glassCircle1: {
    position: 'absolute',
    top: -50,
    right: -50,
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  glassCircle2: {
    position: 'absolute',
    bottom: -30,
    left: -30,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
  },
  glassCircle3: {
    position: 'absolute',
    top: 50,
    left: -20,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(154, 230, 48, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(154, 230, 48, 0.2)',
  },
  comparisonOverlay: {
    position: 'absolute' as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.95)',
    borderRadius: 20,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
    padding: 20,
  },
  comparisonContent: {
    alignItems: 'center' as const,
    width: '100%',
  },
  comparisonTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 20,
    letterSpacing: 1,
  },
  comparisonRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 20,
  },
  comparisonItem: {
    alignItems: 'center',
  },
  comparisonLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: '#888888',
    marginBottom: 8,
    letterSpacing: 1,
  },
  comparisonValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#9AE630',
    letterSpacing: 1,
  },
  comparisonFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(154, 230, 48, 0.1)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#9AE630',
  },
  comparisonChange: {
    fontSize: 14,
    fontWeight: '600',
    color: '#9AE630',
    marginLeft: 6,
    letterSpacing: 0.5,
  },
});

export default WalletCard;
