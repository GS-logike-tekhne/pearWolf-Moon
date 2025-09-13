import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Dimensions,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';
import { THEME } from '../../styles/theme';

interface SortingItem {
  id: string;
  name: string;
  category: 'recycle' | 'trash' | 'compost';
  image: string;
}

interface SortingGameProps {
  visible: boolean;
  onComplete: (score: number, time: number) => void;
  onClose: () => void;
  difficulty: 'easy' | 'medium' | 'hard';
  timeLimit?: number; // in minutes
}

const { width } = Dimensions.get('window');

const SORTING_ITEMS: SortingItem[] = [
  // Recycle
  { id: '1', name: 'Plastic Bottle', category: 'recycle', image: 'bottle' },
  { id: '2', name: 'Aluminum Can', category: 'recycle', image: 'cube' },
  { id: '3', name: 'Glass Jar', category: 'recycle', image: 'wine' },
  { id: '4', name: 'Cardboard Box', category: 'recycle', image: 'square' },
  { id: '5', name: 'Newspaper', category: 'recycle', image: 'newspaper' },
  
  // Trash
  { id: '6', name: 'Plastic Bag', category: 'trash', image: 'bag' },
  { id: '7', name: 'Styrofoam', category: 'trash', image: 'layers' },
  { id: '8', name: 'Broken Glass', category: 'trash', image: 'warning' },
  { id: '9', name: 'Candy Wrapper', category: 'trash', image: 'trash' },
  { id: '10', name: 'Cigarette Butt', category: 'trash', image: 'cigarette' },
  
  // Compost
  { id: '11', name: 'Apple Core', category: 'compost', image: 'leaf' },
  { id: '12', name: 'Banana Peel', category: 'compost', image: 'leaf' },
  { id: '13', name: 'Coffee Grounds', category: 'compost', image: 'leaf' },
  { id: '14', name: 'Egg Shells', category: 'compost', image: 'leaf' },
  { id: '15', name: 'Grass Clippings', category: 'compost', image: 'leaf' },
];

const SortingGame: React.FC<SortingGameProps> = ({
  visible,
  onComplete,
  onClose,
  difficulty,
  timeLimit = 3
}) => {
  const { theme } = useTheme();
  const [items, setItems] = useState<SortingItem[]>([]);
  const [currentItemIndex, setCurrentItemIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(timeLimit * 60); // Convert to seconds
  const [isGameActive, setIsGameActive] = useState(false);
  const [gameComplete, setGameComplete] = useState(false);

  // Get items based on difficulty
  const getGameItems = () => {
    switch (difficulty) {
      case 'easy':
        return SORTING_ITEMS.slice(0, 6); // 6 items
      case 'medium':
        return SORTING_ITEMS.slice(0, 10); // 10 items
      case 'hard':
        return SORTING_ITEMS; // All 15 items
      default:
        return SORTING_ITEMS.slice(0, 6);
    }
  };

  // Initialize game
  useEffect(() => {
    if (visible) {
      const gameItems = getGameItems();
      setItems(gameItems);
      setCurrentItemIndex(0);
      setScore(0);
      setTimeLeft(timeLimit * 60);
      setIsGameActive(true);
      setGameComplete(false);
    }
  }, [visible, difficulty, timeLimit]);

  // Timer countdown
  useEffect(() => {
    if (isGameActive && timeLeft > 0) {
      const timer = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && isGameActive) {
      // Time's up
      setIsGameActive(false);
      setGameComplete(true);
      onComplete(score, timeLimit * 60 - timeLeft);
    }
  }, [isGameActive, timeLeft]);

  // Check if game is complete
  useEffect(() => {
    if (currentItemIndex >= items.length && isGameActive) {
      setIsGameActive(false);
      setGameComplete(true);
      onComplete(score, timeLimit * 60 - timeLeft);
    }
  }, [currentItemIndex, items.length, isGameActive, score, timeLeft, timeLimit, onComplete]);

  const handleSort = (category: 'recycle' | 'trash' | 'compost') => {
    if (!isGameActive || currentItemIndex >= items.length) return;

    const currentItem = items[currentItemIndex];
    const isCorrect = currentItem.category === category;

    if (isCorrect) {
      setScore(score + 1);
    }

    // Move to next item
    setCurrentItemIndex(currentItemIndex + 1);
  };

  const getCurrentItem = () => {
    if (currentItemIndex >= items.length) return null;
    return items[currentItemIndex];
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getScoreMessage = () => {
    const percentage = (score / items.length) * 100;
    if (percentage >= 90) return "Perfect! 🌟";
    if (percentage >= 80) return "Excellent! 🎉";
    if (percentage >= 70) return "Good Job! 👍";
    if (percentage >= 60) return "Not Bad! 💪";
    return "Keep Practicing! 🌱";
  };

  const getBinColor = (category: 'recycle' | 'trash' | 'compost') => {
    switch (category) {
      case 'recycle':
        return '#3b82f6'; // Blue
      case 'trash':
        return '#6b7280'; // Gray
      case 'compost':
        return '#10b981'; // Green
      default:
        return theme.primary;
    }
  };

  const getBinIcon = (category: 'recycle' | 'trash' | 'compost') => {
    switch (category) {
      case 'recycle':
        return 'refresh';
      case 'trash':
        return 'trash';
      case 'compost':
        return 'leaf';
      default:
        return 'help';
    }
  };

  if (!visible) return null;

  const currentItem = getCurrentItem();

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={[styles.container, { backgroundColor: theme.cardBackground }]}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={[styles.title, { color: theme.textColor }]}>
              🗑️ Sorting Challenge
            </Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={24} color={theme.textColor} />
            </TouchableOpacity>
          </View>

          {/* Game Stats */}
          <View style={styles.stats}>
            <View style={styles.statItem}>
              <Text style={[styles.statLabel, { color: theme.secondaryText }]}>Score</Text>
              <Text style={[styles.statValue, { color: theme.primary }]}>{score}/{items.length}</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={[styles.statLabel, { color: theme.secondaryText }]}>Time</Text>
              <Text style={[styles.statValue, { color: timeLeft <= 30 ? '#ef4444' : theme.textColor }]}>
                {formatTime(timeLeft)}
              </Text>
            </View>
            <View style={styles.statItem}>
              <Text style={[styles.statLabel, { color: theme.secondaryText }]}>Progress</Text>
              <Text style={[styles.statValue, { color: theme.textColor }]}>
                {currentItemIndex + 1}/{items.length}
              </Text>
            </View>
          </View>

          {/* Game Area */}
          {!gameComplete ? (
            <>
              {/* Current Item */}
              <View style={styles.itemArea}>
                <Text style={[styles.instruction, { color: theme.textColor }]}>
                  Sort this item:
                </Text>
                <View style={[styles.currentItem, { backgroundColor: theme.borderColor }]}>
                  <Ionicons 
                    name={currentItem?.image as any} 
                    size={48} 
                    color={theme.textColor} 
                  />
                  <Text style={[styles.itemName, { color: theme.textColor }]}>
                    {currentItem?.name}
                  </Text>
                </View>
              </View>

              {/* Sorting Bins */}
              <View style={styles.binsContainer}>
                <TouchableOpacity
                  style={[styles.bin, { backgroundColor: getBinColor('recycle') }]}
                  onPress={() => handleSort('recycle')}
                  disabled={!isGameActive}
                >
                  <Ionicons name="refresh" size={32} color="white" />
                  <Text style={styles.binLabel}>Recycle</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.bin, { backgroundColor: getBinColor('trash') }]}
                  onPress={() => handleSort('trash')}
                  disabled={!isGameActive}
                >
                  <Ionicons name="trash" size={32} color="white" />
                  <Text style={styles.binLabel}>Trash</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.bin, { backgroundColor: getBinColor('compost') }]}
                  onPress={() => handleSort('compost')}
                  disabled={!isGameActive}
                >
                  <Ionicons name="leaf" size={32} color="white" />
                  <Text style={styles.binLabel}>Compost</Text>
                </TouchableOpacity>
              </View>
            </>
          ) : (
            /* Game Complete */
            <View style={styles.completeArea}>
              <View style={[styles.completeIcon, { backgroundColor: theme.primary }]}>
                <Ionicons name="checkmark" size={48} color="white" />
              </View>
              <Text style={[styles.completeTitle, { color: theme.textColor }]}>
                Challenge Complete!
              </Text>
              <Text style={[styles.scoreMessage, { color: theme.secondaryText }]}>
                {getScoreMessage()}
              </Text>
              <View style={styles.finalStats}>
                <Text style={[styles.finalScore, { color: theme.primary }]}>
                  Score: {score}/{items.length} ({(score/items.length*100).toFixed(0)}%)
                </Text>
                <Text style={[styles.finalTime, { color: theme.secondaryText }]}>
                  Time: {formatTime(timeLimit * 60 - timeLeft)}
                </Text>
              </View>
            </View>
          )}

          {/* Difficulty Badge */}
          <View style={styles.difficultyBadge}>
            <Text style={[styles.difficultyText, { color: theme.secondaryText }]}>
              {difficulty.toUpperCase()}
            </Text>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    width: width * 0.9,
    maxWidth: 400,
    borderRadius: THEME.BORDER_RADIUS.xl,
    padding: THEME.SPACING.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: THEME.SPACING.lg,
  },
  title: {
    fontSize: THEME.TYPOGRAPHY.fontSize.xl,
    fontWeight: 'bold',
  },
  closeButton: {
    padding: THEME.SPACING.xs,
  },
  stats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: THEME.SPACING.lg,
    paddingVertical: THEME.SPACING.md,
    borderRadius: THEME.BORDER_RADIUS.lg,
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
  },
  statItem: {
    alignItems: 'center',
  },
  statLabel: {
    fontSize: THEME.TYPOGRAPHY.fontSize.sm,
    marginBottom: THEME.SPACING.xs,
  },
  statValue: {
    fontSize: THEME.TYPOGRAPHY.fontSize.lg,
    fontWeight: 'bold',
  },
  itemArea: {
    alignItems: 'center',
    marginBottom: THEME.SPACING.lg,
  },
  instruction: {
    fontSize: THEME.TYPOGRAPHY.fontSize.base,
    marginBottom: THEME.SPACING.md,
    textAlign: 'center',
  },
  currentItem: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: THEME.SPACING.sm,
  },
  itemName: {
    fontSize: THEME.TYPOGRAPHY.fontSize.sm,
    fontWeight: '600',
    textAlign: 'center',
  },
  binsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: THEME.SPACING.lg,
  },
  bin: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  binLabel: {
    color: 'white',
    fontSize: THEME.TYPOGRAPHY.fontSize.xs,
    fontWeight: '600',
    marginTop: THEME.SPACING.xs,
  },
  completeArea: {
    alignItems: 'center',
  },
  completeIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: THEME.SPACING.md,
  },
  completeTitle: {
    fontSize: THEME.TYPOGRAPHY.fontSize.xl,
    fontWeight: 'bold',
    marginBottom: THEME.SPACING.sm,
  },
  scoreMessage: {
    fontSize: THEME.TYPOGRAPHY.fontSize.base,
    marginBottom: THEME.SPACING.lg,
    textAlign: 'center',
  },
  finalStats: {
    alignItems: 'center',
  },
  finalScore: {
    fontSize: THEME.TYPOGRAPHY.fontSize.lg,
    fontWeight: 'bold',
    marginBottom: THEME.SPACING.xs,
  },
  finalTime: {
    fontSize: THEME.TYPOGRAPHY.fontSize.base,
  },
  difficultyBadge: {
    position: 'absolute',
    top: THEME.SPACING.md,
    right: THEME.SPACING.md,
    paddingHorizontal: THEME.SPACING.sm,
    paddingVertical: THEME.SPACING.xs,
    borderRadius: THEME.BORDER_RADIUS.full,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
  },
  difficultyText: {
    fontSize: THEME.TYPOGRAPHY.fontSize.xs,
    fontWeight: 'bold',
  },
});

export default SortingGame;
