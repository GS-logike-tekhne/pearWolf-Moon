import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { useXP } from '../context/XPContext';

const { width } = Dimensions.get('window');

interface AnalyticsReport {
  id: string;
  title: string;
  type: 'esg' | 'impact' | 'sustainability' | 'volunteer';
  description: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  xpReward: number;
  ecoPointsReward: number;
  isCompleted: boolean;
  isLocked: boolean;
  requirements?: string[];
  estimatedTime: string;
  dataPoints?: number;
}

interface AnalyticsProgress {
  totalReports: number;
  completedReports: number;
  currentStreak: number;
  totalPoundsCleaned: number;
  totalCO2Offset: number; // in tons
  totalVolunteerHours: number;
  totalPEARPointsSpent: number;
  hubLevel: number;
  nextLevelXP: number;
}

const EcoAnalyticsHub: React.FC = () => {
  const { theme } = useTheme();
  const { addXP } = useXP();
  const [selectedReport, setSelectedReport] = useState<AnalyticsReport | null>(null);
  const [analyticsProgress, setAnalyticsProgress] = useState<AnalyticsProgress>({
    totalReports: 10,
    completedReports: 3,
    currentStreak: 12,
    totalPoundsCleaned: 8500,
    totalCO2Offset: 12.5,
    totalVolunteerHours: 240,
    totalPEARPointsSpent: 15000,
    hubLevel: 4,
    nextLevelXP: 500,
  });

  // Analytics-themed reports
  const analyticsReports: AnalyticsReport[] = [
    {
      id: 'esg_report_1',
      title: 'ESG Impact Report Q1',
      description: 'Generate comprehensive ESG impact report for Q1 sustainability metrics',
      type: 'esg',
      difficulty: 'Medium',
      xpReward: 100,
      ecoPointsReward: 50,
      isCompleted: true,
      isLocked: false,
      estimatedTime: '3 hours',
      dataPoints: 25,
    },
    {
      id: 'impact_metrics',
      title: 'Sponsored Cleanup Impact',
      description: 'Track and analyze impact metrics from sponsored cleanup missions',
      type: 'impact',
      difficulty: 'Easy',
      xpReward: 70,
      ecoPointsReward: 35,
      isCompleted: true,
      isLocked: false,
      estimatedTime: '2 hours',
      dataPoints: 15,
    },
    {
      id: 'sustainability_dashboard',
      title: 'Sustainability Dashboard',
      description: 'Create interactive dashboard for corporate sustainability goals',
      type: 'sustainability',
      difficulty: 'Hard',
      xpReward: 150,
      ecoPointsReward: 75,
      isCompleted: false,
      isLocked: false,
      estimatedTime: '4 hours',
      dataPoints: 40,
    },
    {
      id: 'volunteer_analytics',
      title: 'Volunteer Engagement Analytics',
      description: 'Analyze volunteer participation and engagement metrics',
      type: 'volunteer',
      difficulty: 'Medium',
      xpReward: 90,
      ecoPointsReward: 45,
      isCompleted: false,
      isLocked: false,
      estimatedTime: '2.5 hours',
      dataPoints: 20,
    },
    {
      id: 'carbon_footprint',
      title: 'Carbon Footprint Analysis',
      description: 'Calculate and report carbon footprint reduction from sponsored missions',
      type: 'sustainability',
      difficulty: 'Hard',
      xpReward: 120,
      ecoPointsReward: 60,
      isCompleted: false,
      isLocked: true,
      estimatedTime: '5 hours',
      dataPoints: 35,
    },
  ];

  const getReportTypeIcon = (type: string) => {
    switch (type) {
      case 'esg': return 'document-text';
      case 'impact': return 'trending-up';
      case 'sustainability': return 'leaf';
      case 'volunteer': return 'people';
      default: return 'help-circle';
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return '#22c55e';
      case 'Medium': return '#f59e0b';
      case 'Hard': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const getReportTypeColor = (type: string) => {
    switch (type) {
      case 'esg': return '#1478C8';
      case 'impact': return '#3b82f6';
      case 'sustainability': return '#22c55e';
      case 'volunteer': return '#8b5cf6';
      default: return '#6b7280';
    }
  };

  const handleReportPress = (report: AnalyticsReport) => {
    if (!report.isLocked) {
      setSelectedReport(report);
    }
  };

  const handleStartReport = (report: AnalyticsReport) => {
    // Simulate report completion
    addXP(report.xpReward, 'analytics_report');
    setAnalyticsProgress(prev => ({
      ...prev,
      completedReports: prev.completedReports + 1,
      totalPoundsCleaned: prev.totalPoundsCleaned + (report.dataPoints || 0) * 50,
      totalCO2Offset: prev.totalCO2Offset + (report.dataPoints || 0) * 0.1,
      totalVolunteerHours: prev.totalVolunteerHours + (report.dataPoints || 0) * 2,
      totalPEARPointsSpent: prev.totalPEARPointsSpent + report.ecoPointsReward,
    }));
    setSelectedReport(null);
  };

  const ReportCard = ({ report }: { report: AnalyticsReport }) => (
    <TouchableOpacity
      style={[
        styles.reportCard,
        {
          backgroundColor: report.isLocked ? '#f8fafc' : '#ffffff',
          borderColor: report.isCompleted ? '#22c55e' : report.isLocked ? '#e2e8f0' : '#1478C8',
          opacity: report.isLocked ? 0.6 : 1,
        }
      ]}
      onPress={() => handleReportPress(report)}
      disabled={report.isLocked}
      activeOpacity={0.8}
    >
      <View style={styles.reportHeader}>
        <View style={[
          styles.reportTypeIcon,
          { backgroundColor: getReportTypeColor(report.type) }
        ]}>
          <Ionicons name={getReportTypeIcon(report.type) as any} size={20} color="white" />
        </View>
        
        <View style={styles.reportInfo}>
          <Text style={[styles.reportTitle, { color: '#1e293b' }]}>
            {report.title}
          </Text>
          <Text style={[styles.reportDescription, { color: '#64748b' }]}>
            {report.description}
          </Text>
        </View>
        
        {report.isCompleted && (
          <View style={styles.completedBadge}>
            <Ionicons name="checkmark-circle" size={24} color="#22c55e" />
          </View>
        )}
        
        {report.isLocked && (
          <View style={styles.lockedBadge}>
            <Ionicons name="lock-closed" size={20} color="#64748b" />
          </View>
        )}
      </View>
      
      <View style={styles.reportMeta}>
        <View style={[
          styles.difficultyBadge,
          { backgroundColor: getDifficultyColor(report.difficulty) }
        ]}>
          <Text style={styles.difficultyText}>{report.difficulty}</Text>
        </View>
        
        <View style={styles.rewardInfo}>
          <View style={styles.rewardItem}>
            <Ionicons name="star" size={14} color="#fbbf24" />
            <Text style={[styles.rewardText, { color: '#fbbf24' }]}>
              {report.xpReward} XP
            </Text>
          </View>
          <View style={styles.rewardItem}>
            <Ionicons name="leaf" size={14} color="#22c55e" />
            <Text style={[styles.rewardText, { color: '#22c55e' }]}>
              {report.ecoPointsReward} EP
            </Text>
          </View>
        </View>
      </View>
      
      <View style={styles.reportFooter}>
        <View style={styles.timeInfo}>
          <Ionicons name="time" size={14} color="#1478C8" />
          <Text style={[styles.timeText, { color: '#64748b' }]}>
            {report.estimatedTime}
          </Text>
        </View>
        
        {report.dataPoints && (
          <View style={styles.dataInfo}>
            <Ionicons name="analytics" size={14} color="#1478C8" />
            <Text style={[styles.dataText, { color: '#1478C8' }]}>
              {report.dataPoints} data points
            </Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );

  const ProgressSection = () => (
    <View style={[styles.progressSection, { backgroundColor: '#ffffff' }]}>
      <View style={styles.progressHeader}>
        <Ionicons name="analytics" size={24} color="#1478C8" />
        <Text style={[styles.progressTitle, { color: '#1e293b' }]}>
          Analytics Progress
        </Text>
      </View>
      
      <View style={styles.progressStats}>
        <View style={styles.statItem}>
          <Text style={[styles.statValue, { color: '#1478C8' }]}>
            {analyticsProgress.completedReports}/{analyticsProgress.totalReports}
          </Text>
          <Text style={[styles.statLabel, { color: '#64748b' }]}>
            Reports
          </Text>
        </View>
        
        <View style={styles.statItem}>
          <Text style={[styles.statValue, { color: '#22c55e' }]}>
            {analyticsProgress.totalPoundsCleaned.toLocaleString()}
          </Text>
          <Text style={[styles.statLabel, { color: '#64748b' }]}>
            Lbs Cleaned
          </Text>
        </View>
        
        <View style={styles.statItem}>
          <Text style={[styles.statValue, { color: '#3b82f6' }]}>
            {analyticsProgress.totalCO2Offset.toFixed(1)}
          </Text>
          <Text style={[styles.statLabel, { color: '#64748b' }]}>
            Tons CO₂
          </Text>
        </View>
      </View>
      
      <View style={styles.secondaryStats}>
        <View style={styles.statItem}>
          <Text style={[styles.statValue, { color: '#8b5cf6' }]}>
            {analyticsProgress.totalVolunteerHours}
          </Text>
          <Text style={[styles.statLabel, { color: '#64748b' }]}>
            Volunteer Hrs
          </Text>
        </View>
        
        <View style={styles.statItem}>
          <Text style={[styles.statValue, { color: '#f59e0b' }]}>
            {analyticsProgress.totalPEARPointsSpent.toLocaleString()}
          </Text>
          <Text style={[styles.statLabel, { color: '#64748b' }]}>
            PEAR Points
          </Text>
        </View>
      </View>
      
      <View style={styles.levelProgress}>
        <Text style={[styles.levelText, { color: '#1e293b' }]}>
          Hub Level {analyticsProgress.hubLevel}
        </Text>
        <View style={[styles.progressBar, { backgroundColor: '#e2e8f0' }]}>
          <View 
            style={[
              styles.progressFill, 
              { 
                backgroundColor: '#1478C8',
                width: `${(analyticsProgress.completedReports / analyticsProgress.totalReports) * 100}%`
              }
            ]} 
          />
        </View>
        <Text style={[styles.nextLevelText, { color: '#64748b' }]}>
          {analyticsProgress.nextLevelXP - (analyticsProgress.completedReports * 50)} XP to next level
        </Text>
      </View>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: '#f8fafc' }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: '#ffffff' }]}>
        <View style={styles.headerContent}>
          <View style={styles.headerIcon}>
            <Ionicons name="analytics" size={32} color="#1478C8" />
          </View>
          <View style={styles.headerText}>
            <Text style={[styles.headerTitle, { color: '#1e293b' }]}>
              Eco Analytics Hub
            </Text>
            <Text style={[styles.headerSubtitle, { color: '#64748b' }]}>
              Business intelligence and sustainability analytics
            </Text>
          </View>
        </View>
        
        <View style={styles.headerStats}>
          <View style={styles.streakBadge}>
            <Ionicons name="trending-up" size={16} color="#1478C8" />
            <Text style={[styles.streakText, { color: '#1478C8' }]}>
              {analyticsProgress.currentStreak} day streak
            </Text>
          </View>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <ProgressSection />
        
        <View style={styles.reportsSection}>
          <Text style={[styles.sectionTitle, { color: '#1e293b' }]}>
            Available Reports
          </Text>
          
          {analyticsReports.map((report) => (
            <ReportCard key={report.id} report={report} />
          ))}
        </View>
      </ScrollView>

      {/* Report Detail Modal */}
      {selectedReport && (
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: '#ffffff' }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: '#1e293b' }]}>
                {selectedReport.title}
              </Text>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setSelectedReport(null)}
              >
                <Ionicons name="close" size={24} color="#1e293b" />
              </TouchableOpacity>
            </View>
            
            <Text style={[styles.modalDescription, { color: '#64748b' }]}>
              {selectedReport.description}
            </Text>
            
            <View style={styles.modalMeta}>
              <View style={styles.modalMetaItem}>
                <Ionicons name="time" size={16} color="#1478C8" />
                <Text style={[styles.modalMetaText, { color: '#1e293b' }]}>
                  {selectedReport.estimatedTime}
                </Text>
              </View>
              {selectedReport.dataPoints && (
                <View style={styles.modalMetaItem}>
                  <Ionicons name="analytics" size={16} color="#1478C8" />
                  <Text style={[styles.modalMetaText, { color: '#1e293b' }]}>
                    {selectedReport.dataPoints} data points
                  </Text>
                </View>
              )}
            </View>
            
            <TouchableOpacity
              style={[styles.startButton, { backgroundColor: '#1478C8' }]}
              onPress={() => handleStartReport(selectedReport)}
            >
              <Text style={styles.startButtonText}>Generate Report</Text>
              <Ionicons name="arrow-forward" size={20} color="white" />
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 20,
    paddingTop: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  headerIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#dbeafe',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  headerText: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    fontWeight: '500',
  },
  headerStats: {
    alignItems: 'flex-end',
  },
  streakBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#dbeafe',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 6,
  },
  streakText: {
    fontSize: 12,
    fontWeight: '600',
  },
  content: {
    flex: 1,
  },
  progressSection: {
    margin: 16,
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  progressHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 12,
  },
  progressTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  progressStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  secondaryStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 11,
    fontWeight: '500',
  },
  levelProgress: {
    gap: 8,
  },
  levelText: {
    fontSize: 14,
    fontWeight: '600',
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  nextLevelText: {
    fontSize: 12,
    fontWeight: '500',
  },
  reportsSection: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 16,
  },
  reportCard: {
    marginBottom: 16,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  reportHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  reportTypeIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  reportInfo: {
    flex: 1,
  },
  reportTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 4,
  },
  reportDescription: {
    fontSize: 14,
    lineHeight: 20,
  },
  completedBadge: {
    marginLeft: 8,
  },
  lockedBadge: {
    marginLeft: 8,
  },
  reportMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  difficultyBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  difficultyText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  rewardInfo: {
    flexDirection: 'row',
    gap: 16,
  },
  rewardItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  rewardText: {
    fontSize: 12,
    fontWeight: '600',
  },
  reportFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  timeInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  timeText: {
    fontSize: 12,
    fontWeight: '500',
  },
  dataInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  dataText: {
    fontSize: 12,
    fontWeight: '600',
  },
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    width: '100%',
    maxWidth: 400,
    padding: 24,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    flex: 1,
  },
  closeButton: {
    padding: 4,
  },
  modalDescription: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 20,
  },
  modalMeta: {
    gap: 12,
    marginBottom: 24,
  },
  modalMetaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  modalMetaText: {
    fontSize: 14,
    fontWeight: '500',
  },
  startButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
  },
  startButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '700',
  },
});

export default EcoAnalyticsHub;
