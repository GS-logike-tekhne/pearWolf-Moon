import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useDailyQuests, Quest } from '../hooks/useDailyQuests';
import { useXP } from '../context/XPContext';
import { useTheme } from '../context/ThemeContext';

interface DailyQuestsProps {
  onQuestComplete?: (xp: number) => void;
}

const DailyQuests: React.FC<DailyQuestsProps> = ({ onQuestComplete }) => {
  const { theme } = useTheme();
  const { addXP } = useXP();
  const {
    quests,
    completeQuest,
    xpEarnedToday,
    XP_DAILY_CAP,
    isLoading,
    getQuestProgress,
    getRemainingXp,
  } = useDailyQuests();

  const progress = getQuestProgress();
  const remainingXp = getRemainingXp();

  const handleQuestComplete = async (quest: Quest) => {
    if (quest.completed) return;

    const gainedXP = await completeQuest(quest.id);
    
    if (gainedXP > 0) {
      addXP(gainedXP, `quest-${quest.id}`);
      onQuestComplete?.(gainedXP);
      
      Alert.alert(
        'Quest Completed! 🎉',
        `You earned ${gainedXP} XP for "${quest.title}"`,
        [{ text: 'Awesome!', style: 'default' }]
      );
    } else if (remainingXp === 0) {
      Alert.alert(
        'Daily XP Cap Reached! 📊',
        'You\'ve reached your daily XP limit. Come back tomorrow for more quests!',
        [{ text: 'Got it!', style: 'default' }]
      );
    }
  };

  const getCategoryColor = (category: Quest['category']) => {
    switch (category) {
      case 'cleanup': return '#28A745';
      case 'social': return '#007bff';
      case 'reporting': return '#dc3545';
      case 'engagement': return '#8b5cf6';
      default: return '#6c757d';
    }
  };

  const getCategoryIcon = (category: Quest['category']) => {
    switch (category) {
      case 'cleanup': return 'trash';
      case 'social': return 'people';
      case 'reporting': return 'warning';
      case 'engagement': return 'checkmark-circle';
      default: return 'star';
    }
  };

  if (isLoading) {
    return (
      <View style={[styles.container, { backgroundColor: theme.cardBackground }]}>
        <Text style={[styles.loadingText, { color: theme.textColor }]}>
          Loading daily quests...
        </Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.cardBackground }]}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Ionicons name="trophy" size={24} color="#ffc107" />
          <Text style={[styles.title, { color: theme.textColor }]}>Daily Quests</Text>
        </View>
        <View style={styles.progressBadge}>
          <Text style={styles.progressText}>{progress.completed}/{progress.total}</Text>
        </View>
      </View>

      {/* XP Progress Bar */}
      <View style={styles.xpSection}>
        <View style={styles.xpHeader}>
          <Text style={[styles.xpLabel, { color: theme.secondaryText }]}>Daily XP Progress</Text>
          <Text style={[styles.xpValue, { color: theme.textColor }]}>
            {xpEarnedToday}/{XP_DAILY_CAP}
          </Text>
        </View>
        <View style={[styles.xpProgressBar, { backgroundColor: 'rgba(255,255,255,0.2)' }]}>
          <View
            style={[
              styles.xpProgressFill,
              { 
                backgroundColor: '#28A745',
                width: `${(xpEarnedToday / XP_DAILY_CAP) * 100}%`
              }
            ]}
          />
        </View>
        {remainingXp > 0 && (
          <Text style={[styles.remainingXp, { color: theme.secondaryText }]}>
            {remainingXp} XP remaining today
          </Text>
        )}
      </View>

      {/* Quest List */}
      <ScrollView style={styles.questList} showsVerticalScrollIndicator={false}>
        {quests.map((quest) => (
          <TouchableOpacity
            key={quest.id}
            style={[
              styles.questCard,
              { 
                backgroundColor: quest.completed ? 'rgba(40, 167, 69, 0.1)' : 'transparent',
                borderColor: quest.completed ? '#28A745' : 'rgba(255,255,255,0.1)'
              }
            ]}
            onPress={() => handleQuestComplete(quest)}
            disabled={quest.completed || remainingXp === 0}
            activeOpacity={0.7}
          >
            <View style={styles.questContent}>
              <View style={styles.questLeft}>
                <View 
                  style={[
                    styles.categoryIcon,
                    { backgroundColor: getCategoryColor(quest.category) }
                  ]}
                >
                  <Ionicons 
                    name={getCategoryIcon(quest.category)} 
                    size={16} 
                    color="white" 
                  />
                </View>
                <View style={styles.questInfo}>
                  <Text 
                    style={[
                      styles.questTitle,
                      { 
                        color: theme.textColor,
                        textDecorationLine: quest.completed ? 'line-through' : 'none'
                      }
                    ]}
                  >
                    {quest.title}
                  </Text>
                  <Text style={[styles.questDescription, { color: theme.secondaryText }]}>
                    {quest.description}
                  </Text>
                </View>
              </View>
              
              <View style={styles.questRight}>
                <View style={styles.xpBadge}>
                  <Text style={styles.xpBadgeText}>{quest.xp} XP</Text>
                </View>
                {quest.completed ? (
                  <Ionicons name="checkmark-circle" size={24} color="#28A745" />
                ) : (
                  <Ionicons 
                    name="chevron-forward" 
                    size={20} 
                    color={theme.secondaryText} 
                  />
                )}
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={[styles.footerText, { color: theme.secondaryText }]}>
          Quests reset daily at midnight
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    padding: 16,
    margin: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
  },
  progressBadge: {
    backgroundColor: '#007bff',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  progressText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  xpSection: {
    marginBottom: 16,
  },
  xpHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  xpLabel: {
    fontSize: 14,
    fontWeight: '500',
  },
  xpValue: {
    fontSize: 14,
    fontWeight: '600',
  },
  xpProgressBar: {
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 4,
  },
  xpProgressFill: {
    height: '100%',
    borderRadius: 4,
  },
  remainingXp: {
    fontSize: 12,
    textAlign: 'center',
  },
  questList: {
    maxHeight: 300,
  },
  questCard: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
  },
  questContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  questLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 12,
  },
  categoryIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  questInfo: {
    flex: 1,
  },
  questTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  questDescription: {
    fontSize: 12,
  },
  questRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  xpBadge: {
    backgroundColor: '#ffc107',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  xpBadgeText: {
    color: '#000',
    fontSize: 12,
    fontWeight: '600',
  },
  footer: {
    marginTop: 16,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    fontStyle: 'italic',
  },
  loadingText: {
    textAlign: 'center',
    padding: 20,
    fontSize: 16,
  },
});

export default DailyQuests;
