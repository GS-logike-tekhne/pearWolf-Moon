import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';

const { width } = Dimensions.get('window');

interface DonationGoal {
  id: string;
  title: string;
  description: string;
  targetAmount: number;
  currentAmount: number;
  deadline?: string;
  category: 'cleanup' | 'equipment' | 'education' | 'tree_planting' | 'ocean_cleanup';
  supporters: number;
}

interface DonationProgressProps {
  goal: DonationGoal;
  onDonate?: (goalId: string) => void;
  onViewDetails?: (goalId: string) => void;
  showActions?: boolean;
  compact?: boolean;
}

const DonationProgress: React.FC<DonationProgressProps> = ({
  goal,
  onDonate,
  onViewDetails,
  showActions = true,
  compact = false
}) => {
  const { theme } = useTheme();
  const [progressAnim] = useState(new Animated.Value(0));
  const [pulseAnim] = useState(new Animated.Value(1));

  const progressPercentage = Math.min((goal.currentAmount / goal.targetAmount) * 100, 100);
  const isCompleted = goal.currentAmount >= goal.targetAmount;
  const remainingAmount = Math.max(goal.targetAmount - goal.currentAmount, 0);

  useEffect(() => {
    // Animate progress bar
    Animated.timing(progressAnim, {
      toValue: progressPercentage / 100,
      duration: 1500,
      useNativeDriver: false,
    }).start();

    // Pulse animation for active goals
    if (!isCompleted) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.05,
            duration: 2000,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 2000,
            useNativeDriver: true,
          }),
        ])
      ).start();
    }
  }, [progressPercentage, isCompleted]);

  const getCategoryConfig = () => {
    switch (goal.category) {
      case 'cleanup':
        return {
          icon: 'trash-bin',
          color: '#28A745',
          bgColor: '#e8f5e8',
        };
      case 'equipment':
        return {
          icon: 'construct',
          color: '#6f42c1',
          bgColor: '#f0e6ff',
        };
      case 'education':
        return {
          icon: 'school',
          color: '#fd7e14',
          bgColor: '#fff3e0',
        };
      case 'tree_planting':
        return {
          icon: 'leaf',
          color: '#20c997',
          bgColor: '#e6f9f5',
        };
      case 'ocean_cleanup':
        return {
          icon: 'water',
          color: '#0dcaf0',
          bgColor: '#e5f9fd',
        };
      default:
        return {
          icon: 'heart',
          color: theme.primary,
          bgColor: 'rgba(255,255,255,0.1)',
        };
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDaysRemaining = () => {
    if (!goal.deadline) return null;
    
    const deadline = new Date(goal.deadline);
    const now = new Date();
    const diffTime = deadline.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays <= 0) return 'Expired';
    if (diffDays === 1) return '1 day left';
    return `${diffDays} days left`;
  };

  const config = getCategoryConfig();

  return (
    <Animated.View
      style={[
        styles.container,
        {
          backgroundColor: theme.cardBackground,
          transform: compact ? [] : [{ scale: pulseAnim }],
        },
        compact && styles.compactContainer,
      ]}
    >
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.titleSection}>
          <View style={[styles.categoryIcon, { backgroundColor: config.bgColor }]}>
            <Ionicons name={config.icon as any} size={compact ? 16 : 20} color={config.color} />
          </View>
          <View style={styles.titleContainer}>
            <Text style={[
              styles.title, 
              { color: theme.textColor },
              compact && styles.compactTitle
            ]}>
              {goal.title}
            </Text>
            {!compact && (
              <Text style={[styles.description, { color: theme.secondaryText }]}>
                {goal.description}
              </Text>
            )}
          </View>
        </View>
        
        {isCompleted && (
          <View style={[styles.completedBadge, { backgroundColor: config.color }]}>
            <Ionicons name="checkmark" size={16} color="white" />
            <Text style={styles.completedText}>Funded</Text>
          </View>
        )}
      </View>

      {/* Progress Section */}
      <View style={styles.progressSection}>
        <View style={styles.progressHeader}>
          <Text style={[styles.currentAmount, { color: config.color }]}>
            {formatCurrency(goal.currentAmount)}
          </Text>
          <Text style={[styles.targetAmount, { color: theme.secondaryText }]}>
            of {formatCurrency(goal.targetAmount)}
          </Text>
        </View>
        
        <View style={[styles.progressBarContainer, { backgroundColor: config.bgColor }]}>
          <Animated.View
            style={[
              styles.progressBar,
              {
                backgroundColor: config.color,
                width: progressAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: ['0%', '100%'],
                }),
              },
            ]}
          />
        </View>
        
        <View style={styles.progressFooter}>
          <Text style={[styles.progressPercentage, { color: theme.textColor }]}>
            {progressPercentage.toFixed(1)}% funded
          </Text>
          <Text style={[styles.supportersCount, { color: theme.secondaryText }]}>
            {goal.supporters} supporters
          </Text>
        </View>
      </View>

      {/* Meta Information */}
      {!compact && (
        <View style={styles.metaSection}>
          {remainingAmount > 0 && (
            <View style={styles.metaItem}>
              <Ionicons name="trending-up" size={14} color={theme.secondaryText} />
              <Text style={[styles.metaText, { color: theme.secondaryText }]}>
                {formatCurrency(remainingAmount)} to go
              </Text>
            </View>
          )}
          
          {goal.deadline && (
            <View style={styles.metaItem}>
              <Ionicons name="time" size={14} color={theme.secondaryText} />
              <Text style={[styles.metaText, { color: theme.secondaryText }]}>
                {formatDaysRemaining()}
              </Text>
            </View>
          )}
        </View>
      )}

      {/* Actions */}
      {showActions && !compact && (
        <View style={styles.actionsContainer}>
          <TouchableOpacity
            style={[styles.actionButton, styles.secondaryButton, { borderColor: config.color }]}
            onPress={() => onViewDetails?.(goal.id)}
          >
            <Text style={[styles.secondaryButtonText, { color: config.color }]}>
              View Details
            </Text>
          </TouchableOpacity>
          
          {!isCompleted && (
            <TouchableOpacity
              style={[styles.actionButton, styles.primaryButton, { backgroundColor: config.color }]}
              onPress={() => onDonate?.(goal.id)}
            >
              <Ionicons name="heart" size={16} color="white" />
              <Text style={styles.primaryButtonText}>Donate</Text>
            </TouchableOpacity>
          )}
        </View>
      )}

      {/* Compact Action */}
      {showActions && compact && !isCompleted && (
        <TouchableOpacity
          style={[styles.compactAction, { backgroundColor: config.color }]}
          onPress={() => onDonate?.(goal.id)}
        >
          <Ionicons name="heart" size={14} color="white" />
        </TouchableOpacity>
      )}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    padding: 16,
    margin: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  compactContainer: {
    padding: 12,
    margin: 4,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  titleSection: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    flex: 1,
  },
  categoryIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  titleContainer: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 4,
    lineHeight: 22,
  },
  compactTitle: {
    fontSize: 14,
    marginBottom: 2,
  },
  description: {
    fontSize: 14,
    lineHeight: 20,
  },
  completedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  completedText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  progressSection: {
    marginBottom: 16,
  },
  progressHeader: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 8,
    gap: 8,
  },
  currentAmount: {
    fontSize: 20,
    fontWeight: '800',
  },
  targetAmount: {
    fontSize: 14,
    fontWeight: '500',
  },
  progressBarContainer: {
    height: 8,
    borderRadius: 4,
    marginBottom: 8,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    borderRadius: 4,
  },
  progressFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  progressPercentage: {
    fontSize: 14,
    fontWeight: '600',
  },
  supportersCount: {
    fontSize: 12,
    fontWeight: '500',
  },
  metaSection: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 16,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontSize: 12,
    fontWeight: '500',
  },
  actionsContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    gap: 6,
  },
  primaryButton: {
    // backgroundColor set dynamically
  },
  secondaryButton: {
    borderWidth: 2,
    backgroundColor: 'transparent',
  },
  primaryButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  secondaryButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  compactAction: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default DonationProgress;