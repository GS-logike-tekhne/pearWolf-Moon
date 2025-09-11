import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getRoleColor } from '../utils/roleColors';
import { useTheme } from '../context/ThemeContext';
import { THEME } from '../styles/theme';
import ScreenLayout from '../components/ScreenLayout';
import { RoleGuard } from '../components/RoleGuard';

interface Reward {
  id: string;
  title: string;
  description: string;
  cost: number;
  category: 'digital' | 'physical' | 'discount' | 'experience';
  status: 'active' | 'inactive' | 'sold_out';
  claimedCount: number;
  totalAvailable: number;
  imageUrl?: string;
}

interface AdminRewardsProps {
  navigation: any;
}

const AdminRewards: React.FC<AdminRewardsProps> = ({ navigation }) => {
  const { theme } = useTheme();
  const [rewards, setRewards] = useState<Reward[]>([
    {
      id: '1',
      title: 'Eco Water Bottle',
      description: 'Sustainable stainless steel water bottle',
      cost: 500,
      category: 'physical',
      status: 'active',
      claimedCount: 23,
      totalAvailable: 100,
    },
    {
      id: '2',
      title: 'Tree Planting Certificate',
      description: 'Certificate for planting 5 trees in your name',
      cost: 1000,
      category: 'experience',
      status: 'active',
      claimedCount: 45,
      totalAvailable: 200,
    },
    {
      id: '3',
      title: 'Eco Store 20% Discount',
      description: '20% off at partner eco-friendly stores',
      cost: 300,
      category: 'discount',
      status: 'active',
      claimedCount: 67,
      totalAvailable: 500,
    },
    {
      id: '4',
      title: 'Digital Badge Collection',
      description: 'Exclusive digital badges for your profile',
      cost: 200,
      category: 'digital',
      status: 'active',
      claimedCount: 89,
      totalAvailable: 1000,
    },
  ]);

  const [showAddModal, setShowAddModal] = useState(false);
  const [editingReward, setEditingReward] = useState<Reward | null>(null);
  const [newReward, setNewReward] = useState({
    title: '',
    description: '',
    cost: '',
    category: 'physical' as 'digital' | 'physical' | 'discount' | 'experience',
    totalAvailable: '',
  });

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'digital': return '#007bff';
      case 'physical': return '#28a745';
      case 'discount': return '#ffc107';
      case 'experience': return '#8b5cf6';
      default: return theme.primary;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return '#28a745';
      case 'inactive': return '#6c757d';
      case 'sold_out': return '#dc3545';
      default: return theme.secondaryText;
    }
  };

  const handleDeleteReward = (reward: Reward) => {
    Alert.alert(
      'Delete Reward',
      `Are you sure you want to delete "${reward.title}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            setRewards(rewards.filter(r => r.id !== reward.id));
            Alert.alert('Success', 'Reward deleted successfully');
          },
        },
      ]
    );
  };

  const handleToggleStatus = (reward: Reward) => {
    const newStatus = reward.status === 'active' ? 'inactive' : 'active';
    setRewards(rewards.map(r => 
      r.id === reward.id ? { ...r, status: newStatus } : r
    ));
  };

  const handleSaveReward = () => {
    if (!newReward.title || !newReward.description || !newReward.cost) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    const rewardData: Reward = {
      id: editingReward?.id || Date.now().toString(),
      title: newReward.title,
      description: newReward.description,
      cost: parseInt(newReward.cost),
      category: newReward.category,
      status: 'active',
      claimedCount: editingReward?.claimedCount || 0,
      totalAvailable: parseInt(newReward.totalAvailable) || 100,
    };

    if (editingReward) {
      setRewards(rewards.map(r => r.id === editingReward.id ? rewardData : r));
    } else {
      setRewards([...rewards, rewardData]);
    }

    setShowAddModal(false);
    setEditingReward(null);
    setNewReward({ title: '', description: '', cost: '', category: 'physical' as 'digital' | 'physical' | 'discount' | 'experience', totalAvailable: '' });
    Alert.alert('Success', `Reward ${editingReward ? 'updated' : 'added'} successfully`);
  };

  const RewardCard = ({ reward }: { reward: Reward }) => (
    <View style={[styles.rewardCard, { backgroundColor: theme.cardBackground }]}>
      <View style={styles.rewardHeader}>
        <View style={styles.rewardInfo}>
          <Text style={[styles.rewardTitle, { color: theme.textColor }]}>{reward.title}</Text>
          <Text style={[styles.rewardDescription, { color: theme.secondaryText }]}>
            {reward.description}
          </Text>
        </View>
        <View style={styles.badges}>
          <View style={[styles.categoryBadge, { backgroundColor: getCategoryColor(reward.category) }]}>
            <Text style={styles.badgeText}>{reward.category}</Text>
          </View>
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor(reward.status) }]}>
            <Text style={styles.badgeText}>{reward.status}</Text>
          </View>
        </View>
      </View>

      <View style={styles.rewardStats}>
        <View style={styles.stat}>
          <Text style={[styles.statValue, { color: theme.textColor }]}>{reward.cost}</Text>
          <Text style={[styles.statLabel, { color: theme.secondaryText }]}>Eco Points</Text>
        </View>
        <View style={styles.stat}>
          <Text style={[styles.statValue, { color: theme.textColor }]}>{reward.claimedCount}</Text>
          <Text style={[styles.statLabel, { color: theme.secondaryText }]}>Claimed</Text>
        </View>
        <View style={styles.stat}>
          <Text style={[styles.statValue, { color: theme.textColor }]}>{reward.totalAvailable}</Text>
          <Text style={[styles.statLabel, { color: theme.secondaryText }]}>Available</Text>
        </View>
      </View>

      <View style={styles.rewardActions}>
        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: '#007bff' }]}
          onPress={() => {
            setEditingReward(reward);
            setNewReward({
              title: reward.title,
              description: reward.description,
              cost: reward.cost.toString(),
              category: reward.category,
              totalAvailable: reward.totalAvailable.toString(),
            });
            setShowAddModal(true);
          }}
        >
          <Ionicons name="pencil" size={16} color="white" />
          <Text style={styles.actionButtonText}>Edit</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: getStatusColor(reward.status === 'active' ? 'inactive' : 'active') }]}
          onPress={() => handleToggleStatus(reward)}
        >
          <Ionicons name={reward.status === 'active' ? 'pause' : 'play'} size={16} color="white" />
          <Text style={styles.actionButtonText}>
            {reward.status === 'active' ? 'Deactivate' : 'Activate'}
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: '#dc3545' }]}
          onPress={() => handleDeleteReward(reward)}
        >
          <Ionicons name="trash" size={16} color="white" />
          <Text style={styles.actionButtonText}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <ScreenLayout>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: theme.cardBackground }]}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#fd7e14" />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.textColor }]}>
          Reward Management
        </Text>
        <TouchableOpacity 
          style={styles.addButton}
          onPress={() => setShowAddModal(true)}
        >
          <Ionicons name="add" size={24} color={theme.textColor} />
        </TouchableOpacity>
      </View>

      {/* Rewards List */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.rewardsContainer}>
          {rewards.map(reward => (
            <RewardCard key={reward.id} reward={reward} />
          ))}
        </View>
        <View style={styles.bottomSpacing} />
      </ScrollView>

      {/* Add/Edit Reward Modal */}
      <Modal
        visible={showAddModal}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowAddModal(false)}
      >
        <ScreenLayout>
          <View style={[styles.modalHeader, { backgroundColor: theme.cardBackground }]}>
            <TouchableOpacity onPress={() => setShowAddModal(false)}>
              <Text style={[styles.modalButton, { color: theme.textColor }]}>Cancel</Text>
            </TouchableOpacity>
            <Text style={[styles.modalTitle, { color: theme.textColor }]}>
              {editingReward ? 'Edit Reward' : 'Add Reward'}
            </Text>
            <TouchableOpacity onPress={handleSaveReward}>
              <Text style={[styles.modalButton, { color: theme.primary }]}>Save</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent}>
            <View style={styles.formGroup}>
              <Text style={[styles.label, { color: theme.textColor }]}>Title</Text>
              <TextInput
                style={[styles.input, { backgroundColor: theme.cardBackground, color: theme.textColor }]}
                value={newReward.title}
                onChangeText={(text) => setNewReward({ ...newReward, title: text })}
                placeholder="Enter reward title"
                placeholderTextColor={theme.secondaryText}
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={[styles.label, { color: theme.textColor }]}>Description</Text>
              <TextInput
                style={[styles.textArea, { backgroundColor: theme.cardBackground, color: theme.textColor }]}
                value={newReward.description}
                onChangeText={(text) => setNewReward({ ...newReward, description: text })}
                placeholder="Enter reward description"
                placeholderTextColor={theme.secondaryText}
                multiline
                numberOfLines={3}
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={[styles.label, { color: theme.textColor }]}>Cost (Eco Points)</Text>
              <TextInput
                style={[styles.input, { backgroundColor: theme.cardBackground, color: theme.textColor }]}
                value={newReward.cost}
                onChangeText={(text) => setNewReward({ ...newReward, cost: text })}
                placeholder="Enter cost in eco points"
                placeholderTextColor={theme.secondaryText}
                {...({ keyboardType: "numeric" } as any)}
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={[styles.label, { color: theme.textColor }]}>Total Available</Text>
              <TextInput
                style={[styles.input, { backgroundColor: theme.cardBackground, color: theme.textColor }]}
                value={newReward.totalAvailable}
                onChangeText={(text) => setNewReward({ ...newReward, totalAvailable: text })}
                placeholder="Enter total available quantity"
                placeholderTextColor={theme.secondaryText}
                {...({ keyboardType: "numeric" } as any)}
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={[styles.label, { color: theme.textColor }]}>Category</Text>
              <View style={styles.categoryButtons}>
                {['digital', 'physical', 'discount', 'experience'].map(category => (
                  <TouchableOpacity
                    key={category}
                    style={[
                      styles.categoryButton,
                      {
                        backgroundColor: newReward.category === category 
                          ? getCategoryColor(category) 
                          : theme.cardBackground
                      }
                    ]}
                    onPress={() => setNewReward({ ...newReward, category: category as any })}
                  >
                    <Text style={[
                      styles.categoryButtonText,
                      { color: newReward.category === category ? 'white' : theme.textColor }
                    ]}>
                      {category}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </ScrollView>
        </ScreenLayout>
      </Modal>
    </ScreenLayout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: THEME.SPACING.md,
    paddingVertical: THEME.SPACING.sm + 4,
    paddingTop: THEME.SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  backButton: {
    padding: THEME.SPACING.sm,
  },
  headerTitle: {
    fontSize: THEME.TYPOGRAPHY.fontSize.lg,
    fontWeight: '700',
  },
  addButton: {
    padding: THEME.SPACING.sm,
  },
  content: {
    flex: 1,
  },
  rewardsContainer: {
    paddingHorizontal: THEME.SPACING.md,
    paddingTop: THEME.SPACING.md,
  },
  rewardCard: {
    padding: THEME.SPACING.md,
    borderRadius: THEME.BORDER_RADIUS.lg,
    marginBottom: THEME.SPACING.sm + 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  rewardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: THEME.SPACING.sm + 4,
  },
  rewardInfo: {
    flex: 1,
    marginRight: THEME.SPACING.sm + 4,
  },
  rewardTitle: {
    fontSize: THEME.TYPOGRAPHY.fontSize.base,
    fontWeight: '600',
    marginBottom: THEME.SPACING.xs,
  },
  rewardDescription: {
    fontSize: THEME.TYPOGRAPHY.fontSize.sm,
    lineHeight: 20,
  },
  badges: {
    alignItems: 'flex-end',
    gap: 4,
  },
  categoryBadge: {
    paddingHorizontal: THEME.SPACING.sm,
    paddingVertical: THEME.SPACING.xs,
    borderRadius: THEME.BORDER_RADIUS.lg,
  },
  statusBadge: {
    paddingHorizontal: THEME.SPACING.sm,
    paddingVertical: THEME.SPACING.xs,
    borderRadius: THEME.BORDER_RADIUS.lg,
  },
  badgeText: {
    // color: theme.background,
    fontSize: THEME.TYPOGRAPHY.fontSize.xs,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  rewardStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: THEME.SPACING.md,
    paddingVertical: THEME.SPACING.sm + 4,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  stat: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: THEME.TYPOGRAPHY.fontSize.base,
    fontWeight: '700',
    marginBottom: 2,
  },
  statLabel: {
    fontSize: THEME.TYPOGRAPHY.fontSize.xs,
  },
  rewardActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    gap: 8,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: THEME.SPACING.sm,
    paddingHorizontal: THEME.SPACING.sm + 4,
    borderRadius: THEME.BORDER_RADIUS.md,
    gap: 4,
  },
  actionButtonText: {
    // color: theme.background,
    fontSize: THEME.TYPOGRAPHY.fontSize.xs,
    fontWeight: '600',
  },
  bottomSpacing: {
    height: 40,
  },
  // Modal styles
  modalContainer: {
    flex: 1,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: THEME.SPACING.md,
    paddingVertical: THEME.SPACING.sm + 4,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  modalButton: {
    fontSize: THEME.TYPOGRAPHY.fontSize.base,
    fontWeight: '600',
  },
  modalTitle: {
    fontSize: THEME.TYPOGRAPHY.fontSize.lg,
    fontWeight: '700',
  },
  modalContent: {
    flex: 1,
    paddingHorizontal: THEME.SPACING.md,
    paddingTop: THEME.SPACING.md,
  },
  formGroup: {
    marginBottom: THEME.SPACING.md + 4,
  },
  label: {
    fontSize: THEME.TYPOGRAPHY.fontSize.base,
    fontWeight: '600',
    marginBottom: THEME.SPACING.sm,
  },
  input: {
    paddingHorizontal: THEME.SPACING.md,
    paddingVertical: THEME.SPACING.sm + 4,
    borderRadius: THEME.BORDER_RADIUS.md,
    fontSize: THEME.TYPOGRAPHY.fontSize.base,
  },
  textArea: {
    paddingHorizontal: THEME.SPACING.md,
    paddingVertical: THEME.SPACING.sm + 4,
    borderRadius: THEME.BORDER_RADIUS.md,
    fontSize: THEME.TYPOGRAPHY.fontSize.base,
    minHeight: 80,
    textAlignVertical: 'top',
  },
  categoryButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  categoryButton: {
    paddingHorizontal: THEME.SPACING.md,
    paddingVertical: THEME.SPACING.sm,
    borderRadius: 20,
  },
  categoryButtonText: {
    fontSize: THEME.TYPOGRAPHY.fontSize.sm,
    fontWeight: '500',
    textTransform: 'capitalize',
  },
});

export default AdminRewards;