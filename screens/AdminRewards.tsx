import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  TextInput,
  Alert,
  Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getRoleColor } from '../utils/roleColors';
import { useTheme } from '../context/ThemeContext';

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
    category: 'physical' as const,
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
    setNewReward({ title: '', description: '', cost: '', category: 'physical', totalAvailable: '' });
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
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
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
        <SafeAreaView style={[styles.modalContainer, { backgroundColor: theme.background }]}>
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
                keyboardType="numeric"
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
                keyboardType="numeric"
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
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
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
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingTop: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  addButton: {
    padding: 8,
  },
  content: {
    flex: 1,
  },
  rewardsContainer: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  rewardCard: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
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
    marginBottom: 12,
  },
  rewardInfo: {
    flex: 1,
    marginRight: 12,
  },
  rewardTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  rewardDescription: {
    fontSize: 14,
    lineHeight: 20,
  },
  badges: {
    alignItems: 'flex-end',
    gap: 4,
  },
  categoryBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeText: {
    color: 'white',
    fontSize: 10,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  rewardStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  stat: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 12,
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
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    gap: 4,
  },
  actionButtonText: {
    color: 'white',
    fontSize: 12,
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
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  modalButton: {
    fontSize: 16,
    fontWeight: '600',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  modalContent: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  input: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    fontSize: 16,
  },
  textArea: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    fontSize: 16,
    minHeight: 80,
    textAlignVertical: 'top',
  },
  categoryButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  categoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  categoryButtonText: {
    fontSize: 14,
    fontWeight: '500',
    textTransform: 'capitalize',
  },
});

export default AdminRewards;