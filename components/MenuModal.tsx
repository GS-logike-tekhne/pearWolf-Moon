import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  SafeAreaView,
  ScrollView,
  Modal,
  Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';

const { width, height } = Dimensions.get('window');

interface MenuItem {
  id: string;
  title: string;
  icon: string;
  color?: string;
  onPress: () => void;
  badge?: number;
}

interface MenuModalProps {
  visible: boolean;
  onClose: () => void;
  userRole: 'TRASH_HERO' | 'IMPACT_WARRIOR' | 'ECO_DEFENDER' | 'ADMIN';
  userName?: string;
  userLevel?: number;
  onNavigate: (screen: string, params?: any) => void;
  onSignOut?: () => void;
}

const MenuModal: React.FC<MenuModalProps> = ({
  visible,
  onClose,
  userRole,
  userName = 'User',
  userLevel = 1,
  onNavigate,
  onSignOut
}) => {
  const { theme } = useTheme();
  const [slideAnim] = useState(new Animated.Value(width));
  const [fadeAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: width,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 250,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible]);

  const getRoleConfig = () => {
    switch (userRole) {
      case 'TRASH_HERO':
        return {
          title: 'Trash Hero',
          color: '#28A745',
          icon: 'person',
        };
      case 'IMPACT_WARRIOR':
        return {
          title: 'Impact Warrior',
          color: '#dc3545',
          icon: 'person',
        };
      case 'ECO_DEFENDER':
        return {
          title: 'Eco Defender',
          color: '#007bff',
          icon: 'person',
        };
      case 'ADMIN':
        return {
          title: 'Administrator',
          color: '#fd7e14',
          icon: 'person',
        };
      default:
        return {
          title: 'User',
          color: theme.primary,
          icon: 'person',
        };
    }
  };

  const roleConfig = getRoleConfig();

  const getFeatureItems = (): MenuItem[] => [
    {
      id: 'wallet',
      title: 'Wallet',
      icon: 'wallet',
      color: '#28a745',
      onPress: () => {
        onNavigate('WalletScreen', { role: userRole.toLowerCase().replace('_', '-') });
        onClose();
      },
    },
    {
      id: 'map',
      title: 'Map View',
      icon: 'map',
      color: '#17a2b8',
      onPress: () => {
        onNavigate('MapScreen');
        onClose();
      },
    },
    {
      id: 'badges',
      title: 'My Badges',
      icon: 'medal',
      color: '#ffc107',
      onPress: () => {
        onNavigate('BadgeSystem', { userRole });
        onClose();
      },
    },
    {
      id: 'quest',
      title: 'Eco Quest Zones',
      icon: 'rocket',
      color: '#8b5cf6',
      onPress: () => {
        onNavigate('EcoStationQuest');
        onClose();
      },
    },
    {
      id: 'notifications',
      title: 'Notifications',
      icon: 'notifications',
      color: '#007bff',
      badge: 3,
      onPress: () => {
        onNavigate('Notifications');
        onClose();
      },
    },
  ];

  const getSupportItems = (): MenuItem[] => [
    {
      id: 'suggest',
      title: 'Suggest Cleanup',
      icon: 'add-circle-outline',
      color: '#28a745',
      onPress: () => {
        onNavigate('SuggestCleanup', { role: userRole.toLowerCase().replace('_', '-') });
        onClose();
      },
    },
    {
      id: 'support',
      title: 'Support Center',
      icon: 'help-circle-outline',
      color: '#007bff',
      onPress: () => {
        onNavigate('SupportScreen', { role: userRole.toLowerCase().replace('_', '-') });
        onClose();
      },
    },
    {
      id: 'eco-news',
      title: 'Eco News',
      icon: 'newspaper-outline',
      color: '#10b981',
      onPress: () => {
        onNavigate('EcoNewsScreen', { role: userRole.toLowerCase().replace('_', '-') });
        onClose();
      },
    },
  ];

  const MenuItem = ({ item }: { item: MenuItem }) => (
    <TouchableOpacity
      style={[styles.menuItem, { backgroundColor: theme.background }]}
      onPress={item.onPress}
      activeOpacity={0.7}
    >
      <View style={[styles.menuItemIcon, { backgroundColor: item.color || theme.primary }]}>
        <Ionicons name={item.icon as any} size={20} color="white" />
      </View>
      
      <Text style={[styles.menuItemTitle, { color: theme.textColor }]}>
        {item.title}
      </Text>
      
      {item.badge && (
        <View style={[styles.badge, { backgroundColor: '#dc3545' }]}>
          <Text style={styles.badgeText}>{item.badge}</Text>
        </View>
      )}
      
      <Ionicons name="chevron-forward" size={20} color={theme.secondaryText} />
    </TouchableOpacity>
  );

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onClose}
    >
      <Animated.View style={[styles.overlay, { opacity: fadeAnim }]}>
        <TouchableOpacity style={styles.overlayTouchable} onPress={onClose} />
        
        <Animated.View
          style={[
            styles.menuContainer,
            {
              backgroundColor: theme.background,
              transform: [{ translateX: slideAnim }],
            },
          ]}
        >
          <SafeAreaView style={styles.safeArea}>
            {/* Header */}
            <View style={[styles.header, { backgroundColor: theme.background }]}>
              <View style={styles.userInfo}>
                <View style={[styles.userAvatar, { backgroundColor: roleConfig.color }]}>
                  <Ionicons name={roleConfig.icon as any} size={24} color="white" />
                </View>
                <View style={styles.userDetails}>
                  <Text style={[styles.userName, { color: theme.textColor }]}>
                    {userName}
                  </Text>
                  <Text style={[styles.userRole, { color: theme.secondaryText }]}>
                    {roleConfig.title}
                  </Text>
                </View>
              </View>
              
              <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                <Ionicons name="close" size={24} color={theme.textColor} />
              </TouchableOpacity>
            </View>

            {/* Menu Content */}
            <ScrollView style={styles.menuContent} showsVerticalScrollIndicator={false}>
              {/* My Card */}
              <TouchableOpacity
                style={[styles.myCardButton, { backgroundColor: theme.background }]}
                onPress={() => {
                  onNavigate('MyCard', { role: userRole.toLowerCase().replace('_', '-') });
                  onClose();
                }}
              >
                <View style={[styles.myCardIcon, { backgroundColor: roleConfig.color }]}>
                  <Text style={styles.pearIcon}>🍐</Text>
                </View>
                <Text style={[styles.myCardText, { color: theme.textColor }]}>My PEAR Card</Text>
                <Ionicons name="chevron-forward" size={20} color={theme.secondaryText} />
              </TouchableOpacity>

              {/* FEATURES Section */}
              <View style={styles.menuSection}>
                <Text style={[styles.sectionTitle, { color: theme.secondaryText }]}>
                  FEATURES
                </Text>
                
                <View style={styles.sectionItems}>
                  {getFeatureItems().map((item) => (
                    <MenuItem key={item.id} item={item} />
                  ))}
                </View>
              </View>

              {/* SUPPORT Section */}
              <View style={styles.menuSection}>
                <Text style={[styles.sectionTitle, { color: theme.secondaryText }]}>
                  SUPPORT
                </Text>
                
                <View style={styles.sectionItems}>
                  {getSupportItems().map((item) => (
                    <MenuItem key={item.id} item={item} />
                  ))}
                </View>
              </View>
              
              {/* Sign Out */}
              {onSignOut && (
                <View style={styles.signOutSection}>
                  <TouchableOpacity
                    style={[styles.signOutButton, { backgroundColor: '#dc3545' }]}
                    onPress={() => {
                      onSignOut();
                      onClose();
                    }}
                  >
                    <Ionicons name="log-out" size={20} color="white" />
                    <Text style={styles.signOutText}>Sign Out</Text>
                  </TouchableOpacity>
                </View>
              )}

              <View style={styles.bottomSpacing} />
            </ScrollView>
          </SafeAreaView>
        </Animated.View>
      </Animated.View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    flexDirection: 'row' as const,
  },
  overlayTouchable: {
    flex: 1,
  },
  menuContainer: {
    width: width * 0.85,
    maxWidth: 350,
    height: '100%' as const,
    shadowColor: '#000',
    shadowOffset: { width: -2, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 10,
  },
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    paddingTop: 16,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  userAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  userDetails: {
    flex: 1,
  },
  userName: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 2,
  },
  userRole: {
    fontSize: 14,
    fontWeight: '500',
  },
  closeButton: {
    padding: 8,
  },
  menuContent: {
    flex: 1,
    paddingHorizontal: 20,
  },
  myCardButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    marginBottom: 24,
  },
  myCardIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  myCardText: {
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
  },
  menuSection: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 16,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  sectionItems: {
    gap: 4,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
  },
  menuItemIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  menuItemTitle: {
    fontSize: 16,
    fontWeight: '500',
    flex: 1,
  },
  badge: {
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
    marginRight: 8,
    minWidth: 20,
    alignItems: 'center',
  },
  badgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  signOutSection: {
    marginTop: 24,
    marginBottom: 24,
  },
  signOutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 12,
    gap: 8,
  },
  signOutText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  bottomSpacing: {
    height: 40,
  },
  pearIcon: {
    fontSize: 20,
    textAlign: 'center',
  },
});

export default MenuModal;