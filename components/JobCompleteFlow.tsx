import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  Modal, 
  TouchableOpacity, 
  StyleSheet, 
  Animated, 
  Dimensions,
  ScrollView 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { useXP } from '../context/XPContext';

const { width, height } = Dimensions.get('window');

interface JobReward {
  type: 'xp' | 'eco_points' | 'badge' | 'money';
  amount: number | string;
  label: string;
  icon: string;
  color: string;
}

interface Job {
  id: string;
  title: string;
  description: string;
  location: string;
  estimatedTime: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  rewards: JobReward[];
  requirements?: string[];
}

interface JobCompleteFlowProps {
  job: Job | null;
  isVisible: boolean;
  onClose: () => void;
  onJobAccept?: (job: Job) => void;
  onJobComplete?: (job: Job) => void;
  flowType: 'accept' | 'complete';
}

const JobCompleteFlow: React.FC<JobCompleteFlowProps> = ({
  job,
  isVisible,
  onClose,
  onJobAccept,
  onJobComplete,
  flowType
}) => {
  const { theme } = useTheme();
  const { addXP } = useXP();

  // Animation states
  const [animationStage, setAnimationStage] = useState<'entry' | 'rewards' | 'celebration'>('entry');
  const [scaleAnim] = useState(new Animated.Value(0));
  const [slideAnim] = useState(new Animated.Value(100));
  const [confettiAnim] = useState(new Animated.Value(0));
  const [rewardAnims] = useState(
    job?.rewards.map(() => new Animated.Value(0)) || []
  );

  useEffect(() => {
    if (isVisible && job) {
      startAnimation();
    }
  }, [isVisible, job]);

  const startAnimation = () => {
    if (flowType === 'accept') {
      // Simple acceptance animation
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 50,
          friction: 7,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        })
      ]).start();
    } else {
      // Complete celebration sequence
      startCompletionSequence();
    }
  };

  const startCompletionSequence = () => {
    // Stage 1: Entry
    setAnimationStage('entry');
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 400,
        useNativeDriver: true,
      })
    ]).start(() => {
      // Stage 2: Show rewards
      setTimeout(() => {
        setAnimationStage('rewards');
        showRewards();
      }, 500);
    });
  };

  const showRewards = () => {
    const rewardAnimations = rewardAnims.map((anim, index) =>
      Animated.timing(anim, {
        toValue: 1,
        duration: 600,
        delay: index * 200,
        useNativeDriver: true,
      })
    );

    Animated.stagger(200, rewardAnimations).start(() => {
      // Stage 3: Celebration
      setTimeout(() => {
        setAnimationStage('celebration');
        startCelebration();
      }, 800);
    });
  };

  const startCelebration = () => {
    // Confetti animation
    Animated.timing(confettiAnim, {
      toValue: 1,
      duration: 2000,
      useNativeDriver: true,
    }).start();

    // Add XP to user context
    if (job) {
      const xpReward = job.rewards.find(r => r.type === 'xp');
      if (xpReward) {
        addXP(Number(xpReward.amount), 'mission_completion');
      }
    }
  };

  const handleAction = () => {
    if (flowType === 'accept' && job) {
      onJobAccept?.(job);
    } else if (flowType === 'complete' && job) {
      onJobComplete?.(job);
    }
    onClose();
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return '#22c55e';
      case 'Medium': return '#f59e0b';
      case 'Hard': return '#ef4444';
      default: return theme.primary;
    }
  };

  const renderConfetti = () => {
    const confettiPieces = Array.from({ length: 20 }, (_, i) => i);
    
    return (
      <View style={styles.confettiContainer}>
        {confettiPieces.map((_, index) => {
          const randomX = Math.random() * width;
          const randomDelay = Math.random() * 1000;
          const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#f9ca24', '#6c5ce7', '#22c55e'];
          
          return (
            <Animated.View
              key={index}
              style={[
                styles.confettiPiece,
                {
                  left: randomX,
                  backgroundColor: colors[index % colors.length],
                  transform: [
                    {
                      translateY: confettiAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [-50, height + 100],
                      })
                    },
                    {
                      rotate: confettiAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: ['0deg', '720deg'],
                      })
                    }
                  ],
                  opacity: confettiAnim.interpolate({
                    inputRange: [0, 0.1, 0.9, 1],
                    outputRange: [0, 1, 1, 0],
                  })
                }
              ]}
            />
          );
        })}
      </View>
    );
  };

  const renderReward = (reward: JobReward, index: number) => (
    <Animated.View
      key={`${reward.type}-${index}`}
      style={[
        styles.rewardItem,
        {
          backgroundColor: theme.card,
          opacity: flowType === 'complete' ? rewardAnims[index] : 1,
          transform: flowType === 'complete' ? [{
            scale: rewardAnims[index]?.interpolate({
              inputRange: [0, 1],
              outputRange: [0, 1],
            }) || 1
          }] : []
        }
      ]}
    >
      <View style={[styles.rewardIcon, { backgroundColor: `${reward.color}20` }]}>
        <Ionicons name={reward.icon as any} size={24} color={reward.color} />
      </View>
      <View style={styles.rewardDetails}>
        <Text style={[styles.rewardAmount, { color: theme.text }]}>
          {reward.amount}
        </Text>
        <Text style={[styles.rewardLabel, { color: theme.textSecondary }]}>
          {reward.label}
        </Text>
      </View>
    </Animated.View>
  );

  if (!job) return null;

  return (
    <Modal
      visible={isVisible}
      transparent
      animationType="none"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        {flowType === 'complete' && animationStage === 'celebration' && renderConfetti()}
        
        <Animated.View
          style={[
            styles.container,
            { backgroundColor: theme.background },
            {
              transform: [
                { scale: scaleAnim },
                { translateY: slideAnim }
              ]
            }
          ]}
        >
          <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
            {/* Header */}
            <View style={styles.header}>
              <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                <Ionicons name="close" size={24} color={theme.text} />
              </TouchableOpacity>
              
              <View style={styles.headerContent}>
                <View style={[
                  styles.statusIcon,
                  { 
                    backgroundColor: flowType === 'complete' ? '#22c55e' : theme.primary 
                  }
                ]}>
                  <Ionicons 
                    name={flowType === 'complete' ? 'checkmark' : 'briefcase'} 
                    size={32} 
                    color="white" 
                  />
                </View>
                
                <Text style={[styles.headerTitle, { color: theme.text }]}>
                  {flowType === 'complete' ? 'Job Completed!' : 'Job Details'}
                </Text>
                
                <Text style={[styles.headerSubtitle, { color: theme.textSecondary }]}>
                  {flowType === 'complete' 
                    ? 'Congratulations on making a difference!' 
                    : 'Review the job details below'
                  }
                </Text>
              </View>
            </View>

            {/* Job Info */}
            <View style={[styles.jobInfo, { backgroundColor: theme.card }]}>
              <View style={styles.jobHeader}>
                <Text style={[styles.jobTitle, { color: theme.text }]}>{job.title}</Text>
                <View style={[
                  styles.difficultyBadge,
                  { backgroundColor: getDifficultyColor(job.difficulty) }
                ]}>
                  <Text style={styles.difficultyText}>{job.difficulty}</Text>
                </View>
              </View>
              
              <Text style={[styles.jobDescription, { color: theme.textSecondary }]}>
                {job.description}
              </Text>
              
              <View style={styles.jobMeta}>
                <View style={styles.metaItem}>
                  <Ionicons name="location" size={16} color={theme.primary} />
                  <Text style={[styles.metaText, { color: theme.textSecondary }]}>
                    {job.location}
                  </Text>
                </View>
                <View style={styles.metaItem}>
                  <Ionicons name="time" size={16} color={theme.primary} />
                  <Text style={[styles.metaText, { color: theme.textSecondary }]}>
                    {job.estimatedTime}
                  </Text>
                </View>
              </View>
            </View>

            {/* Rewards Section */}
            <View style={styles.rewardsSection}>
              <Text style={[styles.sectionTitle, { color: theme.text }]}>
                {flowType === 'complete' ? 'Your Rewards' : 'Potential Rewards'}
              </Text>
              
              <View style={styles.rewardsGrid}>
                {job.rewards.map((reward, index) => renderReward(reward, index))}
              </View>
            </View>

            {/* Requirements (for accept flow) */}
            {flowType === 'accept' && job.requirements && (
              <View style={styles.requirementsSection}>
                <Text style={[styles.sectionTitle, { color: theme.text }]}>
                  Requirements
                </Text>
                {job.requirements.map((req, index) => (
                  <View key={index} style={styles.requirementItem}>
                    <Ionicons name="checkmark-circle" size={16} color="#22c55e" />
                    <Text style={[styles.requirementText, { color: theme.textSecondary }]}>
                      {req}
                    </Text>
                  </View>
                ))}
              </View>
            )}

            {/* Action Button */}
            <TouchableOpacity
              style={[
                styles.actionButton,
                { 
                  backgroundColor: flowType === 'complete' ? '#22c55e' : theme.primary 
                }
              ]}
              onPress={handleAction}
            >
              <Text style={styles.actionButtonText}>
                {flowType === 'complete' ? 'Claim Rewards' : 'Accept Job'}
              </Text>
              <Ionicons 
                name={flowType === 'complete' ? 'gift' : 'arrow-forward'} 
                size={20} 
                color="white" 
              />
            </TouchableOpacity>
          </ScrollView>
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    width: width * 0.9,
    maxHeight: height * 0.8,
    borderRadius: 24,
    overflow: 'hidden' as const,
  },
  content: {
    flex: 1,
  },
  header: {
    padding: 24,
    alignItems: 'center',
    position: 'relative',
  },
  closeButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    padding: 8,
    zIndex: 1,
  },
  headerContent: {
    alignItems: 'center',
  },
  statusIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 8,
    textAlign: 'center',
  },
  headerSubtitle: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
  },
  jobInfo: {
    margin: 20,
    padding: 20,
    borderRadius: 16,
  },
  jobHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  jobTitle: {
    fontSize: 18,
    fontWeight: '700',
    flex: 1,
    marginRight: 12,
  },
  difficultyBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  difficultyText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  jobDescription: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 16,
  },
  jobMeta: {
    flexDirection: 'row',
    gap: 20,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  metaText: {
    fontSize: 14,
    fontWeight: '500',
  },
  rewardsSection: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 16,
  },
  rewardsGrid: {
    gap: 12,
  },
  rewardItem: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    padding: 16,
    borderRadius: 12,
    gap: 12,
  },
  rewardIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  rewardDetails: {
    flex: 1,
  },
  rewardAmount: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 2,
  },
  rewardLabel: {
    fontSize: 14,
    fontWeight: '500',
  },
  requirementsSection: {
    padding: 20,
    paddingTop: 0,
  },
  requirementItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  requirementText: {
    fontSize: 14,
    flex: 1,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    margin: 20,
    padding: 16,
    borderRadius: 16,
    gap: 8,
  },
  actionButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '700',
  },
  confettiContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    pointerEvents: 'none',
  },
  confettiPiece: {
    position: 'absolute' as const,
    width: 10,
    height: 10,
    borderRadius: 5,
  },
});

export default JobCompleteFlow;