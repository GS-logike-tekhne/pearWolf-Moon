import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Modal,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { getRoleColor } from '../utils/roleColors';
import { useTheme } from '../context/ThemeContext';
import UnifiedHeader from '../components/UnifiedHeader';
import MenuModal from '../components/MenuModal';

interface Issue {
  id: string;
  title: string;
  description: string;
  category: 'user_dispute' | 'payment_issue' | 'safety_concern' | 'technical_bug' | 'harassment' | 'fraud';
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'open' | 'investigating' | 'resolved' | 'escalated';
  reportedBy: {
    name: string;
    role: string;
    id: string;
  };
  reportedUser?: {
    name: string;
    role: string;
    id: string;
  };
  reportedDate: string;
  lastUpdate: string;
  assignedTo?: string;
  evidence?: string[];
  resolution?: string;
}

interface AdminIssueResolutionProps {
  navigation: any;
}

const AdminIssueResolution: React.FC<AdminIssueResolutionProps> = ({ navigation }) => {
  const { theme } = useTheme();
  const adminColor = getRoleColor('admin');
  const [showMenu, setShowMenu] = useState(false);
  
  const [issues, setIssues] = useState<Issue[]>([
    {
      id: '1',
      title: 'Payment not received for completed job',
      description: 'User completed beach cleanup job but payment has not been processed after 48 hours.',
      category: 'payment_issue',
      priority: 'high',
      status: 'investigating',
      reportedBy: { name: 'John Smith', role: 'TRASH_HERO', id: 'u1' },
      reportedUser: { name: 'EcoClean Corp', role: 'BUSINESS', id: 'b1' },
      reportedDate: '2024-03-01T10:00:00Z',
      lastUpdate: '2024-03-01T14:30:00Z',
      assignedTo: 'Admin Sarah',
    },
    {
      id: '2',
      title: 'Inappropriate behavior during cleanup',
      description: 'Reports of harassment and unprofessional conduct during community cleanup event.',
      category: 'harassment',
      priority: 'critical',
      status: 'open',
      reportedBy: { name: 'Maria Garcia', role: 'VOLUNTEER', id: 'v1' },
      reportedUser: { name: 'Mike Johnson', role: 'TRASH_HERO', id: 'h1' },
      reportedDate: '2024-03-02T09:15:00Z',
      lastUpdate: '2024-03-02T09:15:00Z',
    },
    {
      id: '3',
      title: 'Safety equipment not provided',
      description: 'Business posted hazardous cleanup job without providing proper safety equipment.',
      category: 'safety_concern',
      priority: 'high',
      status: 'escalated',
      reportedBy: { name: 'Alex Chen', role: 'TRASH_HERO', id: 'h2' },
      reportedUser: { name: 'Industrial Clean Ltd', role: 'BUSINESS', id: 'b2' },
      reportedDate: '2024-02-28T16:45:00Z',
      lastUpdate: '2024-03-01T08:00:00Z',
      assignedTo: 'Admin Mike',
    },
  ]);

  const [selectedFilter, setSelectedFilter] = useState('all');
  const [showResolveModal, setShowResolveModal] = useState(false);
  const [selectedIssue, setSelectedIssue] = useState<Issue | null>(null);
  const [resolutionNotes, setResolutionNotes] = useState('');

  const getCategoryConfig = (category: string) => {
    switch (category) {
      case 'user_dispute': return { icon: 'people', color: '#6f42c1', label: 'User Dispute' };
      case 'payment_issue': return { icon: 'card', color: getRoleColor('admin'), label: 'Payment Issue' };
      case 'safety_concern': return { icon: 'warning', color: getRoleColor('impact-warrior'), label: 'Safety Concern' };
      case 'technical_bug': return { icon: 'bug', color: '#6c757d', label: 'Technical Bug' };
      case 'harassment': return { icon: 'alert-circle', color: getRoleColor('impact-warrior'), label: 'Harassment' };
      case 'fraud': return { icon: 'shield-outline', color: getRoleColor('impact-warrior'), label: 'Fraud' };
      default: return { icon: 'help-circle', color: adminColor, label: 'Other' };
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'low': return '#28a745';
      case 'medium': return '#ffc107';
      case 'high': return getRoleColor('admin');
      case 'critical': return getRoleColor('impact-warrior');
      default: return theme.secondaryText;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return '#ffc107';
      case 'investigating': return getRoleColor('business');
      case 'resolved': return '#28a745';
      case 'escalated': return getRoleColor('impact-warrior');
      default: return theme.secondaryText;
    }
  };

  const handleResolveIssue = () => {
    if (!selectedIssue || !resolutionNotes.trim()) {
      Alert.alert('Error', 'Please provide resolution notes');
      return;
    }

    setIssues(issues.map(issue => 
      issue.id === selectedIssue.id 
        ? { ...issue, status: 'resolved', resolution: resolutionNotes, lastUpdate: new Date().toISOString() }
        : issue
    ));

    setShowResolveModal(false);
    setSelectedIssue(null);
    setResolutionNotes('');
    Alert.alert('Success', 'Issue resolved successfully');
  };

  const handleEscalateIssue = (issue: Issue) => {
    Alert.alert(
      'Escalate Issue',
      `Escalate "${issue.title}" to senior management?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Escalate',
          onPress: () => {
            setIssues(issues.map(i => 
              i.id === issue.id ? { ...i, status: 'escalated', lastUpdate: new Date().toISOString() } : i
            ));
            Alert.alert('Success', 'Issue escalated successfully');
          },
        },
      ]
    );
  };

  const filteredIssues = issues.filter(issue => {
    if (selectedFilter === 'all') return true;
    return issue.status === selectedFilter || issue.priority === selectedFilter || issue.category === selectedFilter;
  });

  const IssueCard = ({ issue }: { issue: Issue }) => {
    const categoryConfig = getCategoryConfig(issue.category);
    
    return (
      <View style={[styles.issueCard, { backgroundColor: theme.cardBackground }]}>
        <View style={styles.issueHeader}>
          <View style={styles.issueInfo}>
            <Text style={[styles.issueTitle, { color: theme.textColor }]}>{issue.title}</Text>
            <Text style={[styles.issueDescription, { color: theme.secondaryText }]}>
              {issue.description}
            </Text>
          </View>
          <View style={styles.badges}>
            <View style={[styles.categoryBadge, { backgroundColor: categoryConfig.color }]}>
              <Ionicons name={categoryConfig.icon as any} size={12} color="white" />
              <Text style={styles.badgeText}>{categoryConfig.label}</Text>
            </View>
            <View style={[styles.priorityBadge, { backgroundColor: getPriorityColor(issue.priority) }]}>
              <Text style={styles.badgeText}>{issue.priority}</Text>
            </View>
            <View style={[styles.statusBadge, { backgroundColor: getStatusColor(issue.status) }]}>
              <Text style={styles.badgeText}>{issue.status}</Text>
            </View>
          </View>
        </View>

        <View style={styles.issueMeta}>
          <View style={styles.metaRow}>
            <Ionicons name="person" size={14} color={theme.secondaryText} />
            <Text style={[styles.metaText, { color: theme.secondaryText }]}>
              Reported by: {issue.reportedBy.name} ({issue.reportedBy.role})
            </Text>
          </View>
          {issue.reportedUser && (
            <View style={styles.metaRow}>
              <Ionicons name="alert-circle" size={14} color={theme.secondaryText} />
              <Text style={[styles.metaText, { color: theme.secondaryText }]}>
                Against: {issue.reportedUser.name} ({issue.reportedUser.role})
              </Text>
            </View>
          )}
          <View style={styles.metaRow}>
            <Ionicons name="calendar" size={14} color={theme.secondaryText} />
            <Text style={[styles.metaText, { color: theme.secondaryText }]}>
              Reported: {new Date(issue.reportedDate).toLocaleDateString()}
            </Text>
          </View>
          {issue.assignedTo && (
            <View style={styles.metaRow}>
              <Ionicons name="person-circle" size={14} color={theme.secondaryText} />
              <Text style={[styles.metaText, { color: theme.secondaryText }]}>
                Assigned to: {issue.assignedTo}
              </Text>
            </View>
          )}
        </View>

        {issue.resolution && (
          <View style={[styles.resolutionContainer, { backgroundColor: 'rgba(40, 167, 69, 0.1)' }]}>
            <Text style={[styles.resolutionLabel, { color: '#28a745' }]}>Resolution:</Text>
            <Text style={[styles.resolutionText, { color: theme.textColor }]}>{issue.resolution}</Text>
          </View>
        )}

        <View style={styles.issueActions}>
          {issue.status !== 'resolved' && (
            <>
              <TouchableOpacity
                style={[styles.actionButton, { backgroundColor: '#28a745' }]}
                onPress={() => {
                  setSelectedIssue(issue);
                  setShowResolveModal(true);
                }}
              >
                <Ionicons name="checkmark" size={16} color="white" />
                <Text style={styles.actionButtonText}>Resolve</Text>
              </TouchableOpacity>
              
              {issue.status !== 'escalated' && (
                <TouchableOpacity
                  style={[styles.actionButton, { backgroundColor: adminColor }]}
                  onPress={() => handleEscalateIssue(issue)}
                >
                  <Ionicons name="arrow-up" size={16} color="white" />
                  <Text style={styles.actionButtonText}>Escalate</Text>
                </TouchableOpacity>
              )}
            </>
          )}
          
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: getRoleColor('business') }]}
            onPress={() => navigation.navigate('IssueDetails', { issueId: issue.id })}
          >
            <Ionicons name="eye" size={16} color="white" />
            <Text style={styles.actionButtonText}>Details</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: '#6c757d' }]}
            onPress={() => navigation.navigate('UserProfile', { userId: issue.reportedBy.id })}
          >
            <Ionicons name="person" size={16} color="white" />
            <Text style={styles.actionButtonText}>Reporter</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <UnifiedHeader
        onMenuPress={() => setShowMenu(true)}
        role="admin"
        onNotificationPress={() => navigation.navigate('Notifications')}
        onProfilePress={() => navigation.navigate('ProfileScreen', { 
          role: 'ADMIN',
          onSignOut: () => navigation.navigate('Login')
        })}
      />
      
      {/* Page Header */}
      <View style={[styles.pageHeader, { backgroundColor: theme.cardBackground }]}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color={getRoleColor('admin')} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.textColor }]}>
          Issue Resolution Center
        </Text>
        <TouchableOpacity style={styles.filterButton}>
          <Ionicons name="filter" size={24} color={adminColor} />
        </TouchableOpacity>
      </View>

      {/* Summary Stats */}
      <View style={styles.statsContainer}>
        <View style={[styles.statCard, { backgroundColor: theme.cardBackground }]}>
          <Text style={[styles.statValue, { color: adminColor }]}>
            {issues.filter(i => i.status === 'open').length}
          </Text>
          <Text style={[styles.statLabel, { color: theme.secondaryText }]}>Open</Text>
        </View>
        <View style={[styles.statCard, { backgroundColor: theme.cardBackground }]}>
          <Text style={[styles.statValue, { color: getRoleColor('business') }]}>
            {issues.filter(i => i.status === 'investigating').length}
          </Text>
          <Text style={[styles.statLabel, { color: theme.secondaryText }]}>Investigating</Text>
        </View>
        <View style={[styles.statCard, { backgroundColor: theme.cardBackground }]}>
          <Text style={[styles.statValue, { color: getRoleColor('impact-warrior') }]}>
            {issues.filter(i => i.priority === 'critical').length}
          </Text>
          <Text style={[styles.statLabel, { color: theme.secondaryText }]}>Critical</Text>
        </View>
        <View style={[styles.statCard, { backgroundColor: theme.cardBackground }]}>
          <Text style={[styles.statValue, { color: '#28a745' }]}>
            {issues.filter(i => i.status === 'resolved').length}
          </Text>
          <Text style={[styles.statLabel, { color: theme.secondaryText }]}>Resolved</Text>
        </View>
      </View>

      {/* Filters */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filtersContainer}>
        {['all', 'open', 'investigating', 'escalated', 'critical', 'high', 'harassment', 'payment_issue'].map(filter => (
          <TouchableOpacity
            key={filter}
            style={[
              styles.filterChip,
              { backgroundColor: selectedFilter === filter ? adminColor : theme.cardBackground }
            ]}
            onPress={() => setSelectedFilter(filter)}
          >
            <Text style={[
              styles.filterText,
              { color: selectedFilter === filter ? 'white' : theme.textColor }
            ]}>
              {filter.replace('_', ' ')}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Issues List */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.issuesContainer}>
          {filteredIssues.map(issue => (
            <IssueCard key={issue.id} issue={issue} />
          ))}
        </View>
        <View style={styles.bottomSpacing} />
      </ScrollView>

      {/* Resolve Issue Modal */}
      <Modal
        visible={showResolveModal}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowResolveModal(false)}
      >
        <SafeAreaView style={[styles.modalContainer, { backgroundColor: theme.background }]}>
          <View style={[styles.modalHeader, { backgroundColor: theme.cardBackground }]}>
            <TouchableOpacity onPress={() => setShowResolveModal(false)}>
              <Text style={[styles.modalButton, { color: theme.textColor }]}>Cancel</Text>
            </TouchableOpacity>
            <Text style={[styles.modalTitle, { color: theme.textColor }]}>Resolve Issue</Text>
            <TouchableOpacity onPress={handleResolveIssue}>
              <Text style={[styles.modalButton, { color: adminColor }]}>Resolve</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.modalContent}>
            {selectedIssue && (
              <>
                <Text style={[styles.issueTitle, { color: theme.textColor }]}>
                  {selectedIssue.title}
                </Text>
                <Text style={[styles.issueDescription, { color: theme.secondaryText, marginBottom: 20 }]}>
                  {selectedIssue.description}
                </Text>
              </>
            )}

            <Text style={[styles.label, { color: theme.textColor }]}>Resolution Notes</Text>
            <TextInput
              style={[styles.textArea, { backgroundColor: theme.cardBackground, color: theme.textColor }]}
              value={resolutionNotes}
              onChangeText={setResolutionNotes}
              placeholder="Describe how this issue was resolved..."
              placeholderTextColor={theme.secondaryText}
              multiline
              numberOfLines={6}
            />
          </View>
        </SafeAreaView>
      </Modal>
      <MenuModal
        visible={showMenu}
        onClose={() => setShowMenu(false)}
        userRole="ADMIN"
        onNavigate={(screen, params) => navigation.navigate(screen, params)}
        onSignOut={() => navigation.navigate('Login')}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  pageHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingTop: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  backButton: {},
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  filterButton: {
    padding: 8,
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 16,
    gap: 8,
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
    borderRadius: 8,
  },
  statValue: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 12,
  },
  filtersContainer: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
  },
  filterText: {
    fontSize: 14,
    fontWeight: '500',
    textTransform: 'capitalize',
  },
  content: {
    flex: 1,
  },
  issuesContainer: {
    paddingHorizontal: 16,
  },
  issueCard: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  issueHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  issueInfo: {
    flex: 1,
    marginRight: 12,
  },
  issueTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  issueDescription: {
    fontSize: 14,
    lineHeight: 20,
  },
  badges: {
    alignItems: 'flex-end',
    gap: 4,
  },
  categoryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  priorityBadge: {
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
    textTransform: 'uppercase',
  },
  issueMeta: {
    marginBottom: 16,
    paddingVertical: 8,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    gap: 4,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  metaText: {
    fontSize: 12,
  },
  resolutionContainer: {
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  resolutionLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  resolutionText: {
    fontSize: 14,
    lineHeight: 20,
  },
  issueActions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    gap: 4,
    minWidth: 80,
    justifyContent: 'center',
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
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  textArea: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    fontSize: 16,
    minHeight: 120,
    textAlignVertical: 'top',
  },
});

export default AdminIssueResolution;