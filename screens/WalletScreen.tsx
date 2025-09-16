import React, { useState, useRef } from 'react';
import {
  View,
  StyleSheet,
  Text,
  Dimensions,
  TouchableOpacity,
  Animated,
} from 'react-native';
import { useAuth } from '../context/AuthContext';
import { useXP } from '../hooks/useXP';
import { useRoleManager } from '../hooks/useRoleManager';
import PEARScreen from '../components/PEARScreen';
import MenuModal from '../components/MenuModal';
import UnifiedHeader from '../components/UnifiedHeader';

interface WalletScreenProps {
  navigation: any;
  route: any;
}

const WalletScreen: React.FC<WalletScreenProps> = ({ navigation, route }) => {
  const { user, logout } = useAuth();
  const { currentLevel, getXPSummary } = useXP();
  const { currentRole } = useRoleManager();
  const [showMenu, setShowMenu] = useState(false);
  const [isFlipped, setIsFlipped] = useState(false);
  
  const xpSummary = getXPSummary();
  const xpTotal = xpSummary.totalXP;
  
  // Use current role from role manager
  const userRole = currentRole || 'TRASH_HERO';
  
  // Animation values
  const flipAnimation = useRef(new Animated.Value(0)).current;
  
  const flipCard = () => {
    const toValue = isFlipped ? 0 : 1;
    setIsFlipped(!isFlipped);
    
    Animated.timing(flipAnimation, {
      toValue,
      duration: 600,
      useNativeDriver: true,
    }).start();
  };
  
  const frontInterpolate = flipAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'],
  });
  
  const backInterpolate = flipAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: ['180deg', '360deg'],
  });

  return (
    <PEARScreen
      title="Wallet"
      role={userRole}
      showHeader={false}
      showScroll={true}
      enableRefresh={true}
      onRefresh={() => {
        console.log('Refreshing wallet...');
      }}
      refreshing={false}
      navigation={navigation}
      backgroundColor="white"
    >
      {/* Unified Header */}
      <UnifiedHeader
        onMenuPress={() => setShowMenu(true)}
        role={userRole}
        onNotificationPress={() => navigation.navigate('Notifications')}
        onProfilePress={() => navigation.navigate('ProfileScreen', { 
          role: userRole,
          onSignOut: () => navigation.navigate('Login')
        })}
      />

      {/* Wallet Content */}
      <View style={styles.container}>
        {/* Credit Card Container */}
        <TouchableOpacity style={styles.cardContainer} onPress={flipCard} activeOpacity={0.9}>
          {/* Front Side */}
          <Animated.View 
            style={[
              styles.creditCard,
              styles.cardFront,
              { transform: [{ rotateY: frontInterpolate }] }
            ]}
          >
            {/* Card Header */}
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>PEAR WALLET</Text>
              <Text style={styles.cardSubtitle}>Digital Card</Text>
            </View>
            
            {/* Wallet ID */}
            <View style={styles.cardNumberContainer}>
              <Text style={styles.cardNumber}>{user?.walletId || 'WALLET-001'}</Text>
            </View>
            
            {/* Card Footer */}
            <View style={styles.cardFooter}>
              <View style={styles.cardInfo}>
                <Text style={styles.cardLabel}>CARDHOLDER</Text>
                <Text style={styles.cardValue}>{user?.name || 'Trash Hero'}</Text>
              </View>
              <View style={styles.cardInfo}>
                <Text style={styles.cardLabel}>MEMBER SINCE</Text>
                <Text style={styles.cardValue}>{user?.memberSince || '2024'}</Text>
              </View>
            </View>
            
            {/* Card Chip */}
            <View style={styles.cardChip} />
          </Animated.View>
          
          {/* Back Side */}
          <Animated.View 
            style={[
              styles.creditCard,
              styles.cardBack,
              { transform: [{ rotateY: backInterpolate }] }
            ]}
          >
            {/* Magnetic Strip */}
            <View style={styles.magneticStrip} />
            
            {/* Security Code */}
            <View style={styles.securityCodeContainer}>
              <Text style={styles.securityCodeLabel}>SECURITY CODE</Text>
              <Text style={styles.securityCode}>123</Text>
            </View>
            
            {/* Card Info */}
            <View style={styles.backInfo}>
              <Text style={styles.backText}>
                This card is property of PEAR Wallet
              </Text>
              <Text style={styles.backText}>
                If found, please return to nearest PEAR station
              </Text>
            </View>
            
            {/* Signature Strip */}
            <View style={styles.signatureStrip}>
              <Text style={styles.signatureLabel}>SIGNATURE</Text>
              <View style={styles.signatureLine} />
            </View>
          </Animated.View>
        </TouchableOpacity>
        
        {/* Flip Instruction */}
        <Text style={styles.flipInstruction}>Tap card to flip</Text>
      </View>

      {/* Menu Modal */}
      <MenuModal
        visible={showMenu}
        onClose={() => setShowMenu(false)}
        userRole={userRole.toUpperCase().replace('-', '_') as any}
        userName="TrashHero Pro"
        userLevel={currentLevel.level}
        onNavigate={(screen, params) => {
          console.log('Navigating to:', screen, params);
          navigation.navigate(screen, params);
        }}
        onSignOut={async () => {
          console.log('Sign out pressed');
          try {
            await logout();
            navigation.getParent()?.reset({
              index: 0,
              routes: [{ name: 'Login' }],
            });
          } catch (error) {
            console.error('Logout failed:', error);
            navigation.getParent()?.reset({
              index: 0,
              routes: [{ name: 'Login' }],
            });
          }
        }}
      />
    </PEARScreen>
  );
};

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardContainer: {
    width: width * 0.85,
    height: 220,
    alignItems: 'center',
    justifyContent: 'center',
  },
  creditCard: {
    width: '100%',
    height: '100%',
    backgroundColor: '#000000',
    borderRadius: 16,
    padding: 24,
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 12,
    position: 'absolute',
    backfaceVisibility: 'hidden',
  },
  cardFront: {
    zIndex: 2,
  },
  cardBack: {
    zIndex: 1,
  },
  cardHeader: {
    alignItems: 'flex-start',
  },
  cardTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  cardSubtitle: {
    color: '#CCCCCC',
    fontSize: 12,
    marginTop: 4,
    letterSpacing: 0.5,
  },
  cardNumberContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  cardNumber: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
    letterSpacing: 1,
    textAlign: 'center',
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  cardInfo: {
    alignItems: 'flex-start',
  },
  cardLabel: {
    color: '#999999',
    fontSize: 10,
    fontWeight: '500',
    letterSpacing: 1,
    marginBottom: 4,
  },
  cardValue: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  cardChip: {
    position: 'absolute',
    top: 24,
    right: 24,
    width: 32,
    height: 24,
    backgroundColor: '#FFD700',
    borderRadius: 4,
  },
  // Back side styles
  magneticStrip: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 40,
    backgroundColor: '#333333',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  securityCodeContainer: {
    position: 'absolute',
    top: 60,
    right: 24,
    alignItems: 'center',
  },
  securityCodeLabel: {
    color: '#999999',
    fontSize: 8,
    fontWeight: '500',
    letterSpacing: 1,
    marginBottom: 4,
  },
  securityCode: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 2,
    backgroundColor: '#FFFFFF',
    color: '#000000',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  backInfo: {
    position: 'absolute',
    bottom: 80,
    left: 24,
    right: 24,
    alignItems: 'center',
  },
  backText: {
    color: '#CCCCCC',
    fontSize: 10,
    textAlign: 'center',
    marginBottom: 4,
    lineHeight: 14,
  },
  signatureStrip: {
    position: 'absolute',
    bottom: 24,
    left: 24,
    right: 24,
  },
  signatureLabel: {
    color: '#999999',
    fontSize: 8,
    fontWeight: '500',
    letterSpacing: 1,
    marginBottom: 8,
  },
  signatureLine: {
    height: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 2,
  },
  flipInstruction: {
    color: '#666666',
    fontSize: 14,
    marginTop: 20,
    textAlign: 'center',
  },
});

export default WalletScreen;