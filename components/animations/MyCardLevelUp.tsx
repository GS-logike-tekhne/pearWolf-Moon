import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Dimensions,
  Modal,
  TouchableOpacity,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import XPBar from './XPBar';
import StreakAnimation from './StreakAnimation';
import BadgeUnlock from './BadgeUnlock';
import { Confetti } from './XPAnimation';

interface User {
  id: string;
  username: string;
  avatar?: string;
  level: number;
  currentXP: number;
  maxXP: number;
  streak: number;
  badges: string[];
  role: string;
}

interface LevelUpData {
  previousLevel: number;
  newLevel: number;
  xpGained: number;
  newBadges: Array<{
    id: string;
    name: string;
    description: string;
    icon: string;
    color: string;
    rarity: 'common' | 'rare' | 'epic' | 'legendary';
  }>;
  streakBonus?: number;
}

interface MyCardLevelUpProps {
  user: User;
  levelUpData: LevelUpData;
  visible: boolean;
  onClose: () => void;
  onBadgeClaim?: (badge: any) => void;
}

const { width, height } = Dimensions.get('window');

export const MyCardLevelUp: React.FC<MyCardLevelUpProps> = ({
  user,
  levelUpData,
  visible,
  onClose,
  onBadgeClaim,
}) => {
  const [currentBadgeIndex, setCurrentBadgeIndex] = useState(0);
  const [showBadgeUnlock, setShowBadgeUnlock] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  const cardAnim = useRef(new Animated.Value(0)).current;
  const levelAnim = useRef(new Animated.Value(0)).current;
  const xpAnim = useRef(new Animated.Value(0)).current;
  const streakAnim = useRef(new Animated.Value(0)).current;
  const glowAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      // Initial card appearance
      Animated.spring(cardAnim, {
        toValue: 1,
        tension: 100,
        friction: 8,
        useNativeDriver: true,
      }).start();

      // Level animation
      Animated.timing(levelAnim, {
        toValue: 1,
        duration: 800,
        delay: 300,
        useNativeDriver: true,
      }).start();

      // XP animation
      Animated.timing(xpAnim, {
        toValue: 1,
        duration: 1000,
        delay: 600,
        useNativeDriver: true,
      }).start();

      // Streak animation
      Animated.timing(streakAnim, {
        toValue: 1,
        duration: 800,
        delay: 900,
        useNativeDriver: true,
      }).start();

      // Glow effect
      Animated.loop(
        Animated.sequence([
          Animated.timing(glowAnim, {
            toValue: 1,
            duration: 1500,
            useNativeDriver: false,
          }),
          Animated.timing(glowAnim, {
            toValue: 0,
            duration: 1500,
            useNativeDriver: false,
          }),
        ])
      ).start();

      // Show confetti
      setShowConfetti(true);

      // Show badge unlocks one by one
      if (levelUpData.newBadges.length > 0) {
        setTimeout(() => {
          setShowBadgeUnlock(true);
        }, 2000);
      }
    } else {
      // Reset animations
      cardAnim.setValue(0);
      levelAnim.setValue(0);
      xpAnim.setValue(0);
      streakAnim.setValue(0);
      glowAnim.setValue(0);
      setShowConfetti(false);
      setShowBadgeUnlock(false);
      setCurrentBadgeIndex(0);
    }
  }, [visible, levelUpData]);

  const handleBadgeClaim = (badge: any) => {
    onBadgeClaim?.(badge);
    
    // Show next badge if available
    if (currentBadgeIndex < levelUpData.newBadges.length - 1) {
      setCurrentBadgeIndex(prev => prev + 1);
    } else {
      setShowBadgeUnlock(false);
    }
  };

  const glowOpacity = glowAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 0.3],
  });

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return '#9C27B0';
      case 'business': return '#2196F3';
      case 'trash-hero': return '#4CAF50';
      case 'volunteer': return '#FF9800';
      default: return '#4CAF50';
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        {/* Confetti */}
        {showConfetti && (
          <Confetti
            visible={showConfetti}
            onComplete={() => setShowConfetti(false)}
          />
        )}

        {/* Main Card */}
        <Animated.View
          style={[
            {
              backgroundColor: '#fff',
              borderRadius: 20,
              padding: 24,
              width: '100%',
              maxWidth: 400,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 10 },
              shadowOpacity: 0.3,
              shadowRadius: 20,
              elevation: 10,
              position: 'relative' as const,
              overflow: 'hidden' as const,
            },
            {
              transform: [{ scale: cardAnim }],
            },
          ]}
        >
          {/* Glow Effect */}
          <Animated.View
            style={[
              styles.glowEffect,
              {
                backgroundColor: getRoleColor(user.role),
                opacity: glowOpacity,
              },
            ]}
          />

          {/* Header */}
          <View style={styles.header}>
            <View style={styles.avatarContainer}>
              {user.avatar ? (
                <Image source={{ uri: user.avatar }} style={styles.avatar} />
              ) : (
                <View style={[styles.avatarPlaceholder, { backgroundColor: getRoleColor(user.role) }]}>
                  <Ionicons name="person" size={32} color="#fff" />
                </View>
              )}
            </View>
            <View style={styles.userInfo}>
              <Text style={styles.username}>{user.username}</Text>
              <View style={[styles.roleBadge, { backgroundColor: getRoleColor(user.role) }]}>
                <Text style={styles.roleText}>{user.role.replace('-', ' ')}</Text>
              </View>
            </View>
          </View>

          {/* Level Up Announcement */}
          <Animated.View
            style={[
              styles.levelUpSection,
              { opacity: levelAnim },
            ]}
          >
            <Text style={styles.levelUpTitle}>LEVEL UP!</Text>
            <View style={styles.levelTransition}>
              <Text style={styles.levelText}>{levelUpData.previousLevel}</Text>
              <Ionicons name="arrow-forward" size={24} color="#4CAF50" />
              <Text style={[styles.levelText, { color: '#4CAF50' }]}>
                {levelUpData.newLevel}
              </Text>
            </View>
            <Text style={styles.xpGainedText}>
              +{levelUpData.xpGained.toLocaleString()} XP
            </Text>
          </Animated.View>

          {/* XP Bar */}
          <Animated.View
            style={[
              styles.xpSection,
              { opacity: xpAnim },
            ]}
          >
            <XPBar
              currentXP={user.currentXP}
              maxXP={user.maxXP}
              level={user.level}
              animated={true}
              color={getRoleColor(user.role)}
            />
          </Animated.View>

          {/* Streak */}
          <Animated.View
            style={[
              styles.streakSection,
              { opacity: streakAnim },
            ]}
          >
            <StreakAnimation
              streak={user.streak}
              animated={true}
              color="#FF6B35"
              size="medium"
            />
          </Animated.View>

          {/* New Badges Preview */}
          {levelUpData.newBadges.length > 0 && (
            <View style={styles.badgesSection}>
              <Text style={styles.badgesTitle}>New Badges Unlocked!</Text>
              <View style={styles.badgesPreview}>
                {levelUpData.newBadges.map((badge, index) => (
                  <View key={badge.id} style={styles.badgePreview}>
                    <View style={[styles.badgeIcon, { backgroundColor: badge.color }]}>
                      <Ionicons name={badge.icon as any} size={20} color="#fff" />
                    </View>
                    <Text style={styles.badgeName}>{badge.name}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* Action Buttons */}
          <View style={styles.actionButtons}>
            <TouchableOpacity
              style={[styles.primaryButton, { backgroundColor: getRoleColor(user.role) }]}
              onPress={onClose}
            >
              <Ionicons name="checkmark" size={20} color="#fff" />
              <Text style={styles.primaryButtonText}>Awesome!</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>

        {/* Badge Unlock Modal */}
        {showBadgeUnlock && levelUpData.newBadges[currentBadgeIndex] && (
          <BadgeUnlock
            badge={levelUpData.newBadges[currentBadgeIndex]}
            visible={showBadgeUnlock}
            onClose={() => setShowBadgeUnlock(false)}
            onClaim={handleBadgeClaim}
          />
        )}
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 24,
    width: '100%',
    maxWidth: 400,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
    position: 'relative' as const,
    overflow: 'hidden' as const,
  },
  glowEffect: {
    position: 'absolute' as const,
    top: -20,
    left: -20,
    right: -20,
    bottom: -20,
    borderRadius: 40,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  avatarContainer: {
    marginRight: 16,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  avatarPlaceholder: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  userInfo: {
    flex: 1,
  },
  username: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  roleBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  roleText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
    textTransform: 'capitalize',
  },
  levelUpSection: {
    alignItems: 'center' as const,
    marginBottom: 24,
  },
  levelUpTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginBottom: 12,
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  levelTransition: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  levelText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
    marginHorizontal: 8,
  },
  xpGainedText: {
    fontSize: 18,
    color: '#4CAF50',
    fontWeight: 'bold',
  },
  xpSection: {
    marginBottom: 20,
  },
  streakSection: {
    alignItems: 'center' as const,
    marginBottom: 20,
  },
  badgesSection: {
    marginBottom: 24,
  },
  badgesTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 12,
  },
  badgesPreview: {
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
    gap: 12,
  },
  badgePreview: {
    alignItems: 'center',
  },
  badgeIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
  },
  badgeName: {
    fontSize: 10,
    color: '#666',
    textAlign: 'center',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  primaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
});

export default MyCardLevelUp;
