import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getRoleColor } from '../utils/roleColors';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import UnifiedHeader from '../components/UnifiedHeader';
import MenuModal from '../components/MenuModal';

const { width } = Dimensions.get('window');

interface NewsArticle {
  id: number;
  title: string;
  summary: string;
  date: string;
  category: 'sustainability' | 'climate' | 'waste-management' | 'recycling' | 'community';
  readTime: string;
  isRead: boolean;
}

const EcoNewsScreen = ({ navigation, route }: any) => {
  const { theme } = useTheme();
  const { user } = useAuth();
  const [showMenu, setShowMenu] = useState(false);
  const userRole = route?.params?.role || 'trash-hero';

  // Get role-specific configuration
  const getRoleConfig = () => {
    switch (userRole) {
      case 'trash-hero':
        return { color: getRoleColor('trash-hero'), title: 'Trash Hero' };
      case 'impact-warrior':
        return { color: getRoleColor('impact-warrior'), title: 'Impact Warrior' };
      case 'business':
        return { color: getRoleColor('business'), title: 'Eco Defender' };
      case 'admin':
        return { color: getRoleColor('admin'), title: 'Administrator' };
      default:
        return { color: theme.primary, title: 'User' };
    }
  };

  const roleConfig = getRoleConfig();

  // Mock news articles (in production, these would come from an API)
  const newsArticles: NewsArticle[] = [
    {
      id: 1,
      title: 'Houston Bans Single-Use Plastics: What This Means for Our Community',
      summary: 'Houston city council unanimously approved new legislation banning single-use plastic bags and straws. Learn how this affects local cleanup missions.',
      date: 'Today',
      category: 'waste-management',
      readTime: '3 min read',
      isRead: false,
    },
    {
      id: 2,
      title: 'Meet Our Top Trash Hero of the Month: Sarah Chen',
      summary: 'Sarah has completed 45 cleanup missions this month, earning over $2,100 while removing 300+ pounds of litter from local parks.',
      date: 'Yesterday',
      category: 'community',
      readTime: '2 min read',
      isRead: false,
    },
    {
      id: 3,
      title: '5 New Green Jobs That Could Pay You to Clean the Planet',
      summary: 'From solar panel cleaning to urban farming, discover emerging career opportunities in the environmental sector.',
      date: '2 days ago',
      category: 'sustainability',
      readTime: '5 min read',
      isRead: true,
    },
    {
      id: 4,
      title: 'Climate Report: Why Local Action Matters More Than Ever',
      summary: 'New research shows community-led environmental initiatives have 3x more impact than top-down approaches.',
      date: '3 days ago',
      category: 'climate',
      readTime: '4 min read',
      isRead: false,
    },
    {
      id: 5,
      title: 'Recycling Revolution: How AI is Transforming Waste Management',
      summary: 'Smart sorting systems and AI-powered collection routes are making recycling more efficient and profitable.',
      date: '1 week ago',
      category: 'recycling',
      readTime: '6 min read',
      isRead: true,
    },
  ];

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'sustainability': return 'leaf';
      case 'climate': return 'partly-sunny';
      case 'waste-management': return 'trash';
      case 'recycling': return 'refresh-circle';
      case 'community': return 'people';
      default: return 'newspaper';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'sustainability': return '#10b981';
      case 'climate': return '#3b82f6';
      case 'waste-management': return '#f59e0b';
      case 'recycling': return '#8b5cf6';
      case 'community': return '#ef4444';
      default: return theme.primary;
    }
  };

  const NewsCard = ({ article }: { article: NewsArticle }) => (
    <TouchableOpacity 
      style={[styles.newsCard, { backgroundColor: theme.cardBackground }]}
      activeOpacity={0.7}
    >
      <View style={styles.cardHeader}>
        <View style={[styles.categoryBadge, { backgroundColor: getCategoryColor(article.category) }]}>
          <Ionicons name={getCategoryIcon(article.category) as any} size={14} color="white" />
          <Text style={styles.categoryText}>
            {article.category.replace('-', ' ').toUpperCase()}
          </Text>
        </View>
        <View style={styles.articleMeta}>
          <Text style={[styles.articleDate, { color: theme.secondaryText }]}>
            {article.date}
          </Text>
          <Text style={[styles.readTime, { color: theme.secondaryText }]}>
            • {article.readTime}
          </Text>
        </View>
      </View>

      <Text style={[styles.articleTitle, { color: theme.textColor }]}>
        {article.title}
      </Text>
      
      <Text style={[styles.articleSummary, { color: theme.secondaryText }]}>
        {article.summary}
      </Text>

      <View style={styles.cardFooter}>
        <TouchableOpacity style={[styles.readButton, { backgroundColor: roleConfig.color }]}>
          <Text style={styles.readButtonText}>Read Article</Text>
        </TouchableOpacity>
        
        {article.isRead && (
          <View style={styles.readIndicator}>
            <Ionicons name="checkmark-circle" size={16} color="#10b981" />
            <Text style={[styles.readText, { color: '#10b981' }]}>Read</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <UnifiedHeader
        onMenuPress={() => setShowMenu(true)}
        role={userRole}
        onNotificationPress={() => navigation.navigate('Notifications')}
        onProfilePress={() => navigation.navigate('ProfileScreen', { 
          role: userRole,
          onSignOut: () => navigation.navigate('Login')
        })}
      />

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={[styles.header, { backgroundColor: theme.background }]}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color={roleConfig.color} />
          </TouchableOpacity>
          
          <Text style={[styles.headerTitle, { color: theme.textColor }]}>Eco News</Text>
          
          <View style={[styles.newsIcon, { backgroundColor: roleConfig.color }]}>
            <Ionicons name="newspaper" size={16} color="white" />
          </View>
        </View>

        {/* Section Header */}
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: theme.textColor }]}>
            Latest Updates
          </Text>
          <TouchableOpacity>
            <Text style={[styles.viewAll, { color: roleConfig.color }]}>
              View All
            </Text>
          </TouchableOpacity>
        </View>

        {/* News Articles */}
        <View style={styles.articlesList}>
          {newsArticles.map((article) => (
            <NewsCard key={article.id} article={article} />
          ))}
        </View>

        <View style={styles.bottomSpacing} />
      </ScrollView>

      {/* Menu Modal */}
      <MenuModal
        visible={showMenu}
        onClose={() => setShowMenu(false)}
        userRole={userRole.toUpperCase().replace('-', '_') as any}
        userName={roleConfig.title}
        userLevel={6}
        onNavigate={(screen, params) => {
          navigation.navigate(screen, params);
        }}
        onSignOut={() => {
          navigation.navigate('Login');
        }}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingTop: 8,
  },
  backButton: {},
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    flex: 1,
    textAlign: 'center',
    marginRight: 32, // Compensate for news icon
  },
  newsIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Section Header
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  viewAll: {
    fontSize: 14,
    fontWeight: '600',
  },

  // Articles Section
  articlesList: {
    paddingHorizontal: 16,
  },
  newsCard: {
    padding: 16,
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  categoryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  categoryText: {
    color: 'white',
    fontSize: 10,
    fontWeight: '600',
  },
  articleMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  articleDate: {
    fontSize: 12,
  },
  readTime: {
    fontSize: 12,
  },
  articleTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 8,
    lineHeight: 24,
  },
  articleSummary: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 16,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  readButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  readButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  readIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  readText: {
    fontSize: 12,
    fontWeight: '500',
  },
  bottomSpacing: {
    height: 16,
  },
});

export default EcoNewsScreen;