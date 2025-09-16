import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  StyleSheet,
  Alert,
  Dimensions,
  TouchableOpacity,
  Text,
  Switch,
} from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE, PROVIDER_DEFAULT } from 'react-native-maps';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { getRoleColor } from '../utils/roleColors';
import { normalizeRole } from '../types/roles';
import PEARScreen from '../components/PEARScreen';
import UnifiedHeader from '../components/UnifiedHeader';
import MissionPin from '../components/map/MissionPin';
import MissionPinModal from '../components/map/MissionPinModal';
import ProximityNotification from '../components/map/ProximityNotification';
import RouteOptimizationModal from '../components/map/RouteOptimizationModal';
import HeatZoneOverlay, { HeatZone } from '../components/map/HeatZoneOverlay';
import LiveUserMarker from '../components/map/LiveUserMarker';
import LiveMapService, { MissionPin as MissionPinType, ProximityAlert, RouteOptimization } from '../services/liveMapService';
import HeatZoneService from '../services/heatZoneService';
import GeofencingService from '../services/geofencingService';
import RealTimeUserService, { LiveUser } from '../services/realTimeUserService';
import LocationService from '../services/locationService';
import { MAP_CONFIG } from '../config/mapConfig';
import { useGamification } from '../hooks/useGamification';

const { width, height } = Dimensions.get('window');

interface LiveMapScreenProps {
  route?: any;
  navigation?: any;
}

const LiveMapScreen: React.FC<LiveMapScreenProps> = ({ route, navigation }) => {
  const { theme } = useTheme();
  const userRole = normalizeRole(route?.params?.role || 'trash-hero');
  const roleColor = getRoleColor(userRole);
  
  const mapRef = useRef<MapView>(null);
  
  // State
  const [missionPins, setMissionPins] = useState<MissionPinType[]>([]);
  const [selectedMission, setSelectedMission] = useState<MissionPinType | null>(null);
  const [showMissionModal, setShowMissionModal] = useState(false);
  const [proximityAlerts, setProximityAlerts] = useState<ProximityAlert[]>([]);
  const [showRouteModal, setShowRouteModal] = useState(false);
  const [optimizedRoute, setOptimizedRoute] = useState<RouteOptimization | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentRegion, setCurrentRegion] = useState({
    latitude: 37.7749,
    longitude: -122.4194,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  });

  // New state for enhanced features
  const [heatZones, setHeatZones] = useState<HeatZone[]>([]);
  const [liveUsers, setLiveUsers] = useState<LiveUser[]>([]);
  const [showHeatZones, setShowHeatZones] = useState(true);
  const [showLiveUsers, setShowLiveUsers] = useState(true);
  const [selectedUser, setSelectedUser] = useState<LiveUser | null>(null);

  // Gamification
  const { processMissionCompletion } = useGamification('current_user');

  useEffect(() => {
    initializeMap();
    return () => {
      LiveMapService.stopLocationTracking();
      HeatZoneService.stopUpdates();
      GeofencingService.stopLocationMonitoring();
      RealTimeUserService.stopRealTimeUpdates();
    };
  }, []);

  const initializeMap = async () => {
    try {
      setIsLoading(true);
      
      // Initialize location tracking
      const locationInitialized = await LiveMapService.initializeLocationTracking();
      if (!locationInitialized) {
        Alert.alert('Location Error', 'Unable to access location. Please enable location services.');
        return;
      }

      // Initialize enhanced services
      await Promise.all([
        HeatZoneService.initialize(),
        GeofencingService.initialize(),
        RealTimeUserService.initialize('current_user'),
      ]);

      // Set up proximity alerts
      LiveMapService.onProximityAlert = (alert: ProximityAlert) => {
        setProximityAlerts(prev => [...prev, alert]);
      };

      // Load initial data
      await Promise.all([
        loadMissionPins(),
        loadHeatZones(),
        loadLiveUsers(),
      ]);

      // Set up geofence event callbacks
      const geofenceCallbackId = GeofencingService.onGeofenceEvent((event) => {
        console.log('Geofence event:', event);
        // Handle geofence events (mission acceptance/completion validation)
      });

      // Set up live user update callbacks
      const userUpdateCallbackId = RealTimeUserService.onUserUpdate((user) => {
        setLiveUsers(prev => {
          const index = prev.findIndex(u => u.id === user.id);
          if (index !== -1) {
            const updated = [...prev];
            updated[index] = user;
            return updated;
          }
          return [...prev, user];
        });
      });
      
    } catch (error) {
      console.error('Failed to initialize map:', error);
      Alert.alert('Map Error', 'Failed to load map data. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const loadMissionPins = async () => {
    try {
      const pins = await LiveMapService.loadMissionPins(
        currentRegion.latitude,
        currentRegion.longitude,
        5000 // 5km radius
      );
      
      setMissionPins(pins);
    } catch (error) {
      console.error('Failed to load mission pins:', error);
    }
  };

  const loadHeatZones = async () => {
    try {
      const zones = await HeatZoneService.loadHeatZones();
      setHeatZones(zones);
    } catch (error) {
      console.error('Failed to load heat zones:', error);
    }
  };

  const loadLiveUsers = async () => {
    try {
      const users = await RealTimeUserService.loadLiveUsers();
      setLiveUsers(users);
    } catch (error) {
      console.error('Failed to load live users:', error);
    }
  };

  const handleMissionPinPress = (mission: MissionPinType) => {
    setSelectedMission(mission);
    setShowMissionModal(true);
  };


  const handleNavigateToMission = (mission: MissionPinType) => {
    setShowMissionModal(false);
    
    // Animate map to mission location
    mapRef.current?.animateToRegion({
      latitude: mission.location.latitude,
      longitude: mission.location.longitude,
      latitudeDelta: 0.005,
      longitudeDelta: 0.005,
    }, 1000);
    
    Alert.alert(
      'Navigation Started',
      `Navigate to ${mission.title}`,
      [{ text: 'OK' }]
    );
  };

  const handleOptimizeRoute = () => {
    const availableMissions = missionPins.filter(pin => pin.status === 'available');
    if (availableMissions.length < 2) {
      Alert.alert(
        'Not Enough Missions',
        'You need at least 2 available missions to optimize a route.',
        [{ text: 'OK' }]
      );
      return;
    }

    const missionIds = availableMissions.map(mission => mission.id);
    const route = LiveMapService.optimizeRoute(missionIds);
    
    if (route) {
      setOptimizedRoute(route);
      setShowRouteModal(true);
    }
  };

  const handleStartRoute = (route: RouteOptimization) => {
    setShowRouteModal(false);
    
    // Animate map to show the entire route
    const bounds = route.missions.reduce((acc, mission) => {
      return {
        minLat: Math.min(acc.minLat, mission.location.latitude),
        maxLat: Math.max(acc.maxLat, mission.location.latitude),
        minLng: Math.min(acc.minLng, mission.location.longitude),
        maxLng: Math.max(acc.maxLng, mission.location.longitude),
      };
    }, {
      minLat: route.missions[0]?.location.latitude || 0,
      maxLat: route.missions[0]?.location.latitude || 0,
      minLng: route.missions[0]?.location.longitude || 0,
      maxLng: route.missions[0]?.location.longitude || 0,
    });

    const centerLat = (bounds.minLat + bounds.maxLat) / 2;
    const centerLng = (bounds.minLng + bounds.maxLng) / 2;
    const latDelta = Math.max(bounds.maxLat - bounds.minLat, 0.01) * 1.2;
    const lngDelta = Math.max(bounds.maxLng - bounds.minLng, 0.01) * 1.2;

    mapRef.current?.animateToRegion({
      latitude: centerLat,
      longitude: centerLng,
      latitudeDelta: latDelta,
      longitudeDelta: lngDelta,
    }, 1000);

    Alert.alert(
      'Route Started! 🗺️',
      `Navigate through ${route.missions.length} missions for maximum efficiency.`,
      [{ text: 'Let\'s Go!', style: 'default' }]
    );
  };

  const handleUserPress = (user: LiveUser) => {
    setSelectedUser(user);
    // Could show user details modal here
  };

  const handleAcceptMission = async (mission: MissionPinType) => {
    try {
      // Validate geofencing before accepting
      const currentLocation = LocationService.getCurrentLocation();
      if (currentLocation) {
        const validation = GeofencingService.validateMissionAcceptance(
          mission.id,
          { latitude: currentLocation.latitude, longitude: currentLocation.longitude },
          currentLocation.accuracy
        );

        if (!validation.isValid) {
          Alert.alert('Cannot Accept Mission', validation.reason || 'Unknown error');
          return;
        }
      }

      // Accept mission
      LiveMapService.updateMissionStatus(mission.id, 'in_progress');
      RealTimeUserService.startMission(mission);
      
      // Update local state
      setMissionPins(prev => 
        prev.map(pin => 
          pin.id === mission.id 
            ? { ...pin, status: 'in_progress', participants: pin.participants + 1 }
            : pin
        )
      );
      
      setShowMissionModal(false);
      Alert.alert(
        'Mission Accepted! 🎯',
        `You've joined ${mission.title}. Good luck!`,
        [{ text: 'Let\'s Go!', style: 'default' }]
      );
    } catch (error) {
      console.error('Failed to accept mission:', error);
      Alert.alert('Error', 'Failed to accept mission. Please try again.');
    }
  };

  const handleDismissAlert = (alertId: string) => {
    setProximityAlerts(prev => prev.filter(alert => alert.id !== alertId));
    LiveMapService.acknowledgeAlert(alertId);
  };

  const handleAlertPress = (alert: ProximityAlert) => {
    const mission = missionPins.find(pin => pin.id === alert.missionId);
    if (mission) {
      handleMissionPinPress(mission);
    }
    handleDismissAlert(alert.id);
  };

  const renderMissionPins = () => {
    return missionPins.map((mission) => (
      <Marker
        key={mission.id}
        coordinate={{
          latitude: mission.location.latitude,
          longitude: mission.location.longitude,
        }}
        onPress={() => handleMissionPinPress(mission)}
      >
        <MissionPin
          mission={mission}
          onPress={handleMissionPinPress}
          size="medium"
        />
      </Marker>
    ));
  };

  const renderProximityNotifications = () => {
    return proximityAlerts.map((alert) => (
      <ProximityNotification
        key={alert.id}
        alert={alert}
        onPress={() => handleAlertPress(alert)}
        onDismiss={() => handleDismissAlert(alert.id)}
      />
    ));
  };

  return (
    <PEARScreen
      title="Live Map"
      role={userRole}
      showHeader={false}
      showScroll={false}
      enableRefresh={true}
      onRefresh={loadMissionPins}
    >
      {/* Unified Header */}
      <UnifiedHeader
        onMenuPress={() => console.log('Menu pressed')}
        role={userRole}
        onNotificationPress={() => console.log('Notifications pressed')}
        onProfilePress={() => console.log('Profile pressed')}
      />

      <View style={styles.container}>
        {/* Map */}
        <MapView
          ref={mapRef}
          style={styles.map}
          provider={MAP_CONFIG.provider === 'google' ? PROVIDER_GOOGLE : PROVIDER_DEFAULT}
          initialRegion={currentRegion}
          showsUserLocation={true}
          showsMyLocationButton={true}
          showsCompass={true}
          onRegionChangeComplete={(region) => setCurrentRegion(region)}
          onMapReady={() => {
            console.log('Map is ready! Provider:', MAP_CONFIG.provider);
          }}
        >
          {/* Heat Zones Overlay */}
          <HeatZoneOverlay 
            heatZones={heatZones} 
            visible={showHeatZones} 
          />
          
          {/* Mission Pins */}
          {renderMissionPins()}
          
          {/* Live User Markers */}
          {showLiveUsers && liveUsers.map((user) => (
            <LiveUserMarker
              key={user.id}
              user={user}
              onPress={handleUserPress}
              showStatus={true}
              showMission={true}
            />
          ))}
        </MapView>

        {/* Proximity Notifications */}
        {renderProximityNotifications()}

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: roleColor }]}
            onPress={loadMissionPins}
            activeOpacity={0.8}
          >
            <Ionicons name="refresh" size={24} color="white" />
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: theme.primary }]}
            onPress={handleOptimizeRoute}
            activeOpacity={0.8}
          >
            <Ionicons name="navigate" size={24} color="white" />
          </TouchableOpacity>
        </View>

        {/* Map Layer Controls */}
        <View style={[styles.layerControls, { backgroundColor: theme.cardBackground }]}>
          <View style={styles.layerControl}>
            <Ionicons name="flame" size={16} color={showHeatZones ? '#FF5722' : theme.secondaryText} />
            <Text style={[styles.layerControlText, { color: theme.textColor }]}>
              Heat Zones
            </Text>
            <Switch
              value={showHeatZones}
              onValueChange={setShowHeatZones}
              trackColor={{ false: theme.borderColor, true: '#FF5722' }}
              thumbColor={showHeatZones ? '#fff' : theme.secondaryText}
            />
          </View>
          
          <View style={styles.layerControl}>
            <Ionicons name="people" size={16} color={showLiveUsers ? theme.primary : theme.secondaryText} />
            <Text style={[styles.layerControlText, { color: theme.textColor }]}>
              Live Users
            </Text>
            <Switch
              value={showLiveUsers}
              onValueChange={setShowLiveUsers}
              trackColor={{ false: theme.borderColor, true: theme.primary }}
              thumbColor={showLiveUsers ? '#fff' : theme.secondaryText}
            />
          </View>
        </View>

        {/* Mission Stats */}
        <View style={[styles.statsContainer, { backgroundColor: theme.cardBackground }]}>
          <View style={styles.statItem}>
            <Ionicons name="location" size={16} color={roleColor} />
            <Text style={[styles.statText, { color: theme.textColor }]}>
              {missionPins.filter(p => p.status === 'available').length} Available
            </Text>
          </View>
          
          <View style={styles.statItem}>
            <Ionicons name="people" size={16} color={theme.primary} />
            <Text style={[styles.statText, { color: theme.textColor }]}>
              {missionPins.filter(p => p.status === 'in_progress').length} In Progress
            </Text>
          </View>
          
          <View style={styles.statItem}>
            <Ionicons name="checkmark-circle" size={16} color={theme.success} />
            <Text style={[styles.statText, { color: theme.textColor }]}>
              {missionPins.filter(p => p.status === 'completed').length} Completed
            </Text>
          </View>
        </View>

        {/* Modals */}
        <MissionPinModal
          visible={showMissionModal}
          mission={selectedMission}
          onClose={() => setShowMissionModal(false)}
          onAccept={handleAcceptMission}
          onNavigate={handleNavigateToMission}
        />

        <RouteOptimizationModal
          visible={showRouteModal}
          route={optimizedRoute}
          onClose={() => setShowRouteModal(false)}
          onStartRoute={handleStartRoute}
        />
      </View>
    </PEARScreen>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  actionButtons: {
    position: 'absolute',
    bottom: 120,
    right: 16,
    gap: 12,
  },
  actionButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  statsContainer: {
    position: 'absolute',
    top: 16,
    left: 16,
    right: 16,
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statText: {
    fontSize: 12,
    fontWeight: '600',
  },
  layerControls: {
    position: 'absolute',
    top: 80,
    left: 16,
    right: 16,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  layerControl: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  layerControlText: {
    fontSize: 14,
    fontWeight: '600',
    flex: 1,
    marginLeft: 8,
  },
});

export default LiveMapScreen;
