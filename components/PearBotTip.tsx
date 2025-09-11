import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';

interface PearBotTipProps {
  userRole: string;
  userLevel: number;
  recentActivity?: string;
  style?: any;
}

const PearBotTip: React.FC<PearBotTipProps> = ({ 
  userRole, 
  userLevel, 
  recentActivity,
  style 
}) => {
  const { theme } = useTheme();
  const [showTip, setShowTip] = useState(false);
  const [currentTip, setCurrentTip] = useState('');
  const pulseAnim = useRef(new Animated.Value(1)).current;
  
  useEffect(() => {
    // Pulse animation for the floating button
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.2,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    );
    pulse.start();
    
    return () => pulse.stop();
  }, []);

  const generateTip = (): string => {
    const ecoFacts = [
      "🌱 Did you know? A single tree can absorb 22kg of CO2 per year!",
      "♻️ Recycling one aluminum can saves enough energy to power a TV for 3 hours.",
      "🌊 Every minute, one garbage truck of plastic enters our oceans.",
      "🌍 Small actions create big impacts - you're making a difference!",
      "⚡ LED bulbs use 75% less energy than traditional incandescent bulbs.",
      "🚲 Biking 10 miles prevents 1 pound of CO2 from entering the atmosphere.",
    ];

    const motivationalTips = [
      "🎯 You're doing amazing! Keep up the great work, eco champion!",
      "🚀 Every cleanup mission brings us closer to a cleaner planet!",
      "💪 Your dedication to the environment inspires others!",
      "🌟 Level up your impact - try a new type of cleanup today!",
      "🏆 You're building a legacy of environmental stewardship!",
    ];

    const roleTips: Record<string, string[]> = {
      'TRASH_HERO': [
        "💰 Pro tip: Early morning cleanups often have better weather and higher rewards!",
        "🧹 Bring your own supplies to earn bonus points on missions!",
        "📍 Check nearby missions before traveling - cluster them for efficiency!",
      ],
      'IMPACT_WARRIOR': [
        "❤️ Your volunteer work creates ripple effects in the community!",
        "👥 Invite friends to join missions - teamwork makes the dream work!",
        "📸 Share your cleanup photos to inspire others!",
      ],
      'ECO_DEFENDER': [
        "📊 Sponsoring cleanups improves your ESG scores and community reputation!",
        "🤝 Partner with local schools for educational cleanup events!",
        "💚 Employee volunteer programs boost morale and team building!",
      ],
      'ADMIN': [
        "📈 Monitor user engagement trends to optimize mission placement!",
        "🎖️ Recognize top performers to maintain community motivation!",
        "🔍 Regular platform updates keep users engaged and active!",
      ]
    };

    // Combine different types of tips
    const allTips = [
      ...ecoFacts,
      ...motivationalTips,
      ...(roleTips[userRole] || [])
    ];

    // Add level-specific tips
    if (userLevel >= 10) {
      allTips.push("🌟 Veteran status unlocked! Consider mentoring new eco-warriors!");
    }
    if (userLevel >= 5) {
      allTips.push("🎨 Experienced user tip: Try organizing themed cleanup events!");
    }

    return allTips[Math.floor(Math.random() * allTips.length)];
  };

  const handlePress = () => {
    setCurrentTip(generateTip());
    setShowTip(true);
  };

  return (
    <>
      <Animated.View 
        style={[
          styles.floatingButton, 
          { 
            backgroundColor: theme.primary,
            transform: [{ scale: pulseAnim }]
          },
          style
        ]}
      >
        <TouchableOpacity
          style={styles.buttonTouchable}
          onPress={handlePress}
        >
          <Ionicons name="chatbubble-ellipses" size={24} color="white" />
        </TouchableOpacity>
      </Animated.View>

      <Modal
        visible={showTip}
        transparent
        animationType="slide"
        onRequestClose={() => setShowTip(false)}
      >
        <TouchableOpacity 
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowTip(false)}
        >
          <View style={[styles.tipContainer, { backgroundColor: theme.cardBackground }]}>
            <View style={styles.tipHeader}>
              <View style={styles.pearBotInfo}>
                <View style={[styles.botAvatar, { backgroundColor: theme.primary }]}>
                  <Ionicons name="leaf" size={20} color="white" />
                </View>
                <View>
                  <Text style={[styles.botName, { color: theme.textColor }]}>
                    PearBot
                  </Text>
                  <Text style={[styles.botSubtitle, { color: theme.secondaryText }]}>
                    Your Eco Assistant
                  </Text>
                </View>
              </View>
              
              <TouchableOpacity
                onPress={() => setShowTip(false)}
                style={styles.closeButton}
              >
                <Ionicons name="close" size={20} color={theme.secondaryText} />
              </TouchableOpacity>
            </View>

            <View style={[styles.tipBubble, { backgroundColor: theme.accent }]}>
              <Text style={[styles.tipText, { color: theme.textColor }]}>
                {currentTip}
              </Text>
            </View>

            <TouchableOpacity
              style={[styles.newTipButton, { backgroundColor: theme.primary }]}
              onPress={() => setCurrentTip(generateTip())}
            >
              <Ionicons name="refresh" size={16} color="white" />
              <Text style={styles.newTipText}>New Tip</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  floatingButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    zIndex: 1000,
  },
  buttonTouchable: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 28,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
    padding: 20,
  },
  tipContainer: {
    borderRadius: 16,
    padding: 20,
    maxHeight: '70%',
  },
  tipHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  pearBotInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  botAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  botName: {
    fontSize: 16,
    fontWeight: '600',
  },
  botSubtitle: {
    fontSize: 12,
    fontWeight: '500',
  },
  closeButton: {
    padding: 8,
  },
  tipBubble: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  tipText: {
    fontSize: 16,
    lineHeight: 22,
    fontWeight: '500',
  },
  newTipButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    padding: 12,
    borderRadius: 10,
  },
  newTipText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
});

export default PearBotTip;