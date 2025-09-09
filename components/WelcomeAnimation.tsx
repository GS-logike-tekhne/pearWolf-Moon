import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';

const { width } = Dimensions.get('window');

interface ImpactMetrics {
  earnings?: string;
  ecoPoints?: string;
  missions: string;
  completedJobs?: string;
  impact?: string;
}

interface WelcomeAnimationProps {
  role: 'trash-hero' | 'impact-warrior' | 'eco-defender';
  impactMetrics: ImpactMetrics;
  isVisible: boolean;
  onAnimationComplete: () => void;
  userName?: string;
}

const WelcomeAnimation: React.FC<WelcomeAnimationProps> = ({
  role,
  impactMetrics,
  isVisible,
  onAnimationComplete,
  userName = 'Hero'
}) => {
  const { theme } = useTheme();
  const [slideAnim] = useState(new Animated.Value(-width));
  const [fadeAnim] = useState(new Animated.Value(0));
  const [scaleAnim] = useState(new Animated.Value(0));
  const [metricsAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    if (isVisible) {
      startWelcomeAnimation();
    }
  }, [isVisible]);

  const startWelcomeAnimation = () => {
    // Slide in from left
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 800,
      useNativeDriver: true,
    }).start();

    // Fade in content
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      delay: 300,
      useNativeDriver: true,
    }).start();

    // Scale in icon
    Animated.timing(scaleAnim, {
      toValue: 1,
      duration: 500,
      delay: 600,
      useNativeDriver: true,
    }).start();

    // Animate metrics
    Animated.timing(metricsAnim, {
      toValue: 1,
      duration: 800,
      delay: 900,
      useNativeDriver: true,
    }).start(() => {
      // Auto-complete after animation
      setTimeout(() => {
        onAnimationComplete();
      }, 2000);
    });
  };

  const getRoleConfig = () => {
    switch (role) {
      case 'trash-hero':
        return {
          title: 'Welcome Back, Trash Hero!',
          subtitle: 'Ready to earn while saving the planet?',
          icon: 'shield',
          color: '#28A745',
          gradient: ['#28A745', '#20c997'],
        };
      case 'impact-warrior':
        return {
          title: 'Welcome Back, Impact Warrior!',
          subtitle: 'Ready to make a difference?',
          icon: 'heart',
          color: '#007bff',
          gradient: ['#007bff', '#6f42c1'],
        };
      case 'eco-defender':
        return {
          title: 'Welcome Back, Eco Defender!',
          subtitle: 'Ready to lead environmental change?',
          icon: 'business',
          color: '#8b5cf6',
          gradient: ['#8b5cf6', '#06b6d4'],
        };
      default:
        return {
          title: 'Welcome Back!',
          subtitle: 'Ready to make an impact?',
          icon: 'star',
          color: theme.primary,
          gradient: [theme.primary, theme.secondary],
        };
    }
  };

  const renderMetrics = () => {
    const metrics = [];
    
    if (impactMetrics.earnings) {
      metrics.push({
        label: 'Total Earned',
        value: impactMetrics.earnings,
        icon: 'card',
        color: '#f59e0b',
      });
    }
    
    if (impactMetrics.ecoPoints) {
      metrics.push({
        label: 'Eco Points',
        value: impactMetrics.ecoPoints,
        icon: 'star',
        color: '#10b981',
      });
    }
    
    metrics.push({
      label: role === 'trash-hero' ? 'Jobs Completed' : 'Missions Joined',
      value: impactMetrics.missions,
      icon: role === 'trash-hero' ? 'briefcase' : 'people',
      color: '#6366f1',
    });

    if (impactMetrics.completedJobs) {
      metrics.push({
        label: 'Completed',
        value: impactMetrics.completedJobs,
        icon: 'checkmark-circle',
        color: '#22c55e',
      });
    }

    if (impactMetrics.impact) {
      metrics.push({
        label: 'Impact Score',
        value: impactMetrics.impact,
        icon: 'trending-up',
        color: '#f97316',
      });
    }

    return metrics.slice(0, 3); // Show max 3 metrics
  };

  const config = getRoleConfig();

  if (!isVisible) return null;

  return (
    <Animated.View
      style={[
        styles.container,
        {
          backgroundColor: theme.cardBackground,
          transform: [{ translateX: slideAnim }],
        },
      ]}
    >
      <View style={styles.content}>
        {/* Header Section */}
        <Animated.View
          style={[
            styles.header,
            { opacity: fadeAnim }
          ]}
        >
          <View style={styles.titleContainer}>
            <Text style={[styles.welcomeText, { color: theme.textColor }]}>
              Good {getTimeOfDay()}, {userName}! 👋
            </Text>
            <Text style={[styles.title, { color: config.color }]}>
              {config.title}
            </Text>
            <Text style={[styles.subtitle, { color: theme.secondaryText }]}>
              {config.subtitle}
            </Text>
          </View>

          <Animated.View
            style={[
              styles.iconContainer,
              {
                backgroundColor: config.color,
                transform: [{ scale: scaleAnim }],
              },
            ]}
          >
            <Ionicons name={config.icon as any} size={32} color="white" />
          </Animated.View>
        </Animated.View>

        {/* Metrics Section */}
        <Animated.View
          style={[
            styles.metricsContainer,
            {
              opacity: metricsAnim,
              transform: [{
                translateY: metricsAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [20, 0],
                })
              }]
            }
          ]}
        >
          <Text style={[styles.metricsTitle, { color: theme.textColor }]}>
            Your Impact So Far
          </Text>
          
          <View style={styles.metricsGrid}>
            {renderMetrics().map((metric, index) => (
              <Animated.View
                key={index}
                style={[
                  styles.metricCard,
                  {
                    backgroundColor: 'rgba(255,255,255,0.1)',
                    opacity: metricsAnim,
                    transform: [{
                      scale: metricsAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0.8, 1],
                      })
                    }]
                  }
                ]}
              >
                <View style={[styles.metricIcon, { backgroundColor: metric.color }]}>
                  <Ionicons name={metric.icon as any} size={16} color="white" />
                </View>
                <Text style={[styles.metricValue, { color: theme.textColor }]}>
                  {metric.value}
                </Text>
                <Text style={[styles.metricLabel, { color: theme.secondaryText }]}>
                  {metric.label}
                </Text>
              </Animated.View>
            ))}
          </View>
        </Animated.View>

        {/* Action Section */}
        <Animated.View
          style={[
            styles.actionSection,
            { opacity: metricsAnim }
          ]}
        >
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: config.color }]}
            onPress={onAnimationComplete}
          >
            <Text style={styles.actionButtonText}>
              {role === 'trash-hero' ? 'Find New Jobs' : 'Join Missions'}
            </Text>
            <Ionicons name="arrow-forward" size={20} color="white" />
          </TouchableOpacity>
        </Animated.View>
      </View>

      {/* Progress Indicator */}
      <View style={styles.progressContainer}>
        <Animated.View
          style={[
            styles.progressBar,
            {
              backgroundColor: config.color,
              transform: [{
                scaleX: metricsAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, 1],
                })
              }]
            }
          ]}
        />
      </View>
    </Animated.View>
  );
};

const getTimeOfDay = () => {
  const hour = new Date().getHours();
  if (hour < 12) return 'morning';
  if (hour < 17) return 'afternoon';
  return 'evening';
};

const styles = StyleSheet.create({
  container: {
    margin: 16,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  content: {
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 24,
  },
  titleContainer: {
    flex: 1,
    paddingRight: 16,
  },
  welcomeText: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 4,
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    marginBottom: 4,
    lineHeight: 26,
  },
  subtitle: {
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 20,
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  metricsContainer: {
    marginBottom: 24,
  },
  metricsTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 16,
    textAlign: 'center',
  },
  metricsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    gap: 12,
  },
  metricCard: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 8,
    borderRadius: 12,
  },
  metricIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  metricValue: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 4,
  },
  metricLabel: {
    fontSize: 11,
    fontWeight: '500',
    textAlign: 'center',
  },
  actionSection: {
    alignItems: 'center',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 25,
    gap: 8,
  },
  actionButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  progressContainer: {
    height: 4,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  progressBar: {
    height: '100%',
    transformOrigin: 'left center',
  },
});

export default WelcomeAnimation;