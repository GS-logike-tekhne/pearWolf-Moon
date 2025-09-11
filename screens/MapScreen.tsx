import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import * as Location from 'expo-location';
import { getRoleColor } from '../utils/roleColors';
import { mockVerifiedMissions } from '../utils/mockData';
import { useTheme } from '../context/ThemeContext';
import { THEME } from '../styles/theme';
import { missionsAPI, Mission, apiUtils } from '../services/api';
import ScreenLayout from '../components/ScreenLayout';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

// Trash Encounter imports
import { useTrashEncounters, TrashEncounter } from '../hooks/useTrashEncounters';
import TrashSpawn from '../components/encounters/TrashSpawn';
import TrashEncounterModal from '../components/encounters/TrashEncounter';
import EncounterRewards from '../components/encounters/EncounterRewards';

// Eco Station imports
import { useEcoStations } from '../hooks/useEcoStations';
import EcoStationSpawn from '../components/stations/EcoStationSpawn';
import EcoStationModal from '../components/stations/EcoStationModal';
import SortingGame from '../components/stations/SortingGame';

const { width, height } = Dimensions.get('window');

type MapScreenProps = {
  navigation: NativeStackNavigationProp<any>;
  route: {
    params?: {
      role?: string;
    };
  };
};

const MapScreen: React.FC<MapScreenProps> = ({ navigation, route }) => {
  const { theme } = useTheme();
  const role = route?.params?.role || 'business';
  
  const [userLocation, setUserLocation] = useState<Location.LocationObject | null>(null);
  const [missions, setMissions] = useState<Mission[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedMission, setSelectedMission] = useState<Mission | null>(null);
  const [selectedVerifiedMission, setSelectedVerifiedMission] = useState<any>(null);

  // Trash Encounter state
  const [selectedTrashEncounter, setSelectedTrashEncounter] = useState<TrashEncounter | null>(null);
  const [showEncounterModal, setShowEncounterModal] = useState(false);
  const [showRewardsModal, setShowRewardsModal] = useState(false);
  const [encounterResult, setEncounterResult] = useState<{ xpEarned: number; ecoPointsEarned: number; badgeProgress?: string } | null>(null);
  
  // Trash encounter hook
  const { encounters, updateUserLocation, completeEncounter } = useTrashEncounters();
  
  // Eco Station state
  const [selectedEcoStation, setSelectedEcoStation] = useState<any>(null);
  const [showStationModal, setShowStationModal] = useState(false);
  const [showSortingGame, setShowSortingGame] = useState(false);
  
  // Eco Station hook
  const { 
    getAvailableStations, 
    canAccessStation, 
    completeStation, 
    completeStationMission,
    getStationMissions 
  } = useEcoStations();


  // Mock mission data with coordinates
  const mockMissions: Mission[] = [
    {
      id: '1',
      title: 'Beach Cleanup Initiative',
      description: 'Join us for a comprehensive beach cleanup to protect marine life',
      location: {
        name: 'Santa Monica Beach',
        coordinates: { latitude: 34.0195, longitude: -118.4912 },
      },
      reward: { ecoPoints: 150, xp: 100, cash: 45 },
      status: 'available',
      priority: 'high',
      duration: 180,
      maxParticipants: 20,
      currentParticipants: 8,
      createdBy: 'admin',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: '2',
      title: 'Park Restoration Project',
      description: 'Help restore urban green space by removing litter and maintaining trails',
      location: {
        name: 'Central Park',
        coordinates: { latitude: 34.0522, longitude: -118.2437 },
      },
      reward: { ecoPoints: 200, xp: 125, cash: 65 },
      status: 'available',
      priority: 'medium',
      duration: 240,
      maxParticipants: 15,
      currentParticipants: 6,
      createdBy: 'admin',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: '3',
      title: 'River Cleanup Drive',
      description: 'Critical cleanup needed to protect local watershed and wildlife habitat',
      location: {
        name: 'LA River Trail',
        coordinates: { latitude: 34.0736, longitude: -118.2406 },
      },
      reward: { ecoPoints: 175, xp: 110, cash: 55 },
      status: 'available',
      priority: 'high',
      duration: 120,
      maxParticipants: 12,
      currentParticipants: 4,
      createdBy: 'admin',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ];

  const handleBack = () => {
    navigation.goBack();
  };

  const requestLocationPermission = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          'Permission Denied',
          'Location permission is required to show your position on the map.',
          [{ text: 'OK' }]
        );
        return false;
      }
      return true;
    } catch (error) {
      console.error('Error requesting location permission:', error);
      return false;
    }
  };

  const getCurrentLocation = async () => {
    try {
      const hasPermission = await requestLocationPermission();
      if (!hasPermission) return;

      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });
      
      setUserLocation(location);
      
      // Update trash encounters with new location
      updateUserLocation(location.coords.latitude, location.coords.longitude);
    } catch (error) {
      console.error('Error getting current location:', error);
      Alert.alert(
        'Location Error',
        'Unable to get your current location. Using default location.',
        [{ text: 'OK' }]
      );
    }
  };

  const loadMissions = async () => {
    try {
      setIsLoading(true);
      
      // Try API first, fallback to mock data
      try {
        const response = await missionsAPI.getAvailableMissions();
        if (response.success && response.data) {
          setMissions(response.data);
          return;
        }
      } catch (apiError) {
        console.log('API failed, using mock data:', apiUtils.handleError(apiError));
      }
      
      // Use mock data
      setMissions(mockMissions);
    } catch (error) {
      console.error('Error loading missions:', error);
      setMissions([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getCurrentLocation();
    loadMissions();
  }, []);

  const getMissionIcon = (priority: Mission['priority']) => {
    switch (priority) {
      case 'high':
        return { name: 'warning', color: theme.error };
      case 'medium':
        return { name: 'information-circle', color: theme.warning };
      case 'low':
        return { name: 'checkmark-circle', color: '#28a745' };
      default:
        return { name: 'location', color: theme.primary };
    }
  };

  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 3959; // Earth's radius in miles
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return (R * c).toFixed(1);
  };

  // Trash encounter handlers
  const handleTrashEncounterPress = (encounter: TrashEncounter) => {
    setSelectedTrashEncounter(encounter);
    setShowEncounterModal(true);
    // Clear other selections
    setSelectedMission(null);
    setSelectedVerifiedMission(null);
  };

  const handleEncounterComplete = (result: { xpEarned: number; ecoPointsEarned: number; badgeProgress?: string }) => {
    setShowEncounterModal(false);
    setEncounterResult(result);
    setShowRewardsModal(true);
    
    // Complete the encounter in the hook
    if (selectedTrashEncounter) {
      completeEncounter(selectedTrashEncounter.id);
    }
  };

  const handleCloseEncounterModal = () => {
    setShowEncounterModal(false);
    setSelectedTrashEncounter(null);
  };

  const handleCloseRewardsModal = () => {
    setShowRewardsModal(false);
    setEncounterResult(null);
    setSelectedTrashEncounter(null);
  };

  // Eco Station handlers
  const handleEcoStationPress = (station: any) => {
    if (!canAccessStation(station)) {
      Alert.alert(
        'Access Denied',
        `This station is only available to ${station.requiredRole} users.`,
        [{ text: 'OK' }]
      );
      return;
    }

    setSelectedEcoStation(station);
    setShowStationModal(true);
    // Clear other selections
    setSelectedMission(null);
    setSelectedVerifiedMission(null);
    setSelectedTrashEncounter(null);
  };

  const handleStationMissionStart = (missionType: string) => {
    if (missionType === 'sorting') {
      setShowSortingGame(true);
    } else {
      // Handle other mission types (photo-verification, data-collection, etc.)
      Alert.alert(
        'Mission Type',
        `${missionType} missions are coming soon!`,
        [{ text: 'OK' }]
      );
    }
  };

  const handleSortingGameComplete = (score: number, time: number) => {
    setShowSortingGame(false);
    
    // Award XP and Eco Points based on performance
    const mission = getStationMissions(selectedEcoStation?.id).find(m => m.type === 'sorting');
    if (mission) {
      const performanceMultiplier = Math.min(score / 10, 1); // Max 100% multiplier
      const xpEarned = Math.floor(mission.xpReward * performanceMultiplier);
      const ecoPointsEarned = Math.floor(mission.ecoPointsReward * performanceMultiplier);
      
      try {
        completeStationMission(mission);
        Alert.alert(
          'Mission Complete! 🌟',
          `Great job! You earned ${xpEarned} XP and ${ecoPointsEarned} Eco Points!`,
          [{ text: 'Awesome!' }]
        );
      } catch (error) {
        Alert.alert('Mission Complete!', 'You\'ve already completed this mission.');
      }
    }
    
    setShowStationModal(false);
    setSelectedEcoStation(null);
  };

  const handleCloseStationModal = () => {
    setShowStationModal(false);
    setSelectedEcoStation(null);
  };

  const handleCloseSortingGame = () => {
    setShowSortingGame(false);
  };

  const JobPin: React.FC<{ job: Mission }> = ({ job }) => (
    <TouchableOpacity style={styles.jobPin}>
      <Ionicons 
        name="trash" 
        size={16} 
        color="white" 
      />
      <Text style={styles.jobPinText}>{job.title}</Text>
      <Text style={styles.jobDistance}>0.5mi</Text>
    </TouchableOpacity>
  );

  const initialRegion = userLocation 
    ? {
        latitude: userLocation.coords.latitude,
        longitude: userLocation.coords.longitude,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      }
    : {
        latitude: 34.0522, // Default to LA
        longitude: -118.2437,
        latitudeDelta: 0.1,
        longitudeDelta: 0.1,
      };

  return (
    <ScreenLayout scrollable={false} padding={{ horizontal: 0, vertical: 0 }}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: theme.background }]}>
        <TouchableOpacity 
          style={[styles.backButton, { backgroundColor: theme.background }]}
          onPress={handleBack}
        >
          <Ionicons name="arrow-back" size={24} color={getRoleColor(role)} />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={[styles.headerTitle, { color: theme.textColor }]}>Mission Map</Text>
          <Text style={[styles.headerSubtitle, { color: theme.secondaryText }]}>
            {missions.length} active missions nearby
          </Text>
        </View>
        <TouchableOpacity 
          style={[styles.filterButton, { backgroundColor: theme.background }]}
          onPress={loadMissions}
        >
          <Ionicons name="refresh" size={20} color={getRoleColor(role)} />
        </TouchableOpacity>
      </View>

      {/* Map View */}
      <View style={styles.mapContainer}>
        <MapView
          provider={PROVIDER_GOOGLE}
          style={styles.map}
          initialRegion={initialRegion}
          showsUserLocation={true}
          showsMyLocationButton={true}
          showsCompass={true}
          showsScale={true}
        >
          {/* User Location Marker */}
          {userLocation && (
            <Marker
              coordinate={{
                latitude: userLocation.coords.latitude,
                longitude: userLocation.coords.longitude,
              }}
              title="Your Location"
              description="You are here"
            >
              <View style={[styles.userMarker, { backgroundColor: getRoleColor(role) }]}>
                <Ionicons name="person" size={20} color="white" />
              </View>
            </Marker>
          )}

          {/* Regular Mission Markers */}
          {missions.map((mission) => {
            const icon = getMissionIcon(mission.priority);
            const distance = userLocation 
              ? calculateDistance(
                  userLocation.coords.latitude,
                  userLocation.coords.longitude,
                  mission.location.coordinates.latitude,
                  mission.location.coordinates.longitude
                )
              : 'N/A';

            return (
              <Marker
                key={mission.id}
                coordinate={mission.location.coordinates}
                title={mission.title}
                description={`${mission.location.name} • ${distance} mi away`}
                onPress={() => {
                  setSelectedMission(mission);
                  setSelectedVerifiedMission(null);
                }}
              >
                <View style={[styles.missionMarker, { backgroundColor: icon.color }]}>
                  <Ionicons name={icon.name} size={16} color="white" />
                </View>
              </Marker>
            );
          })}

          {/* PEAR Verified Mission Markers */}
          {mockVerifiedMissions.map((verifiedMission) => {
            const distance = userLocation 
              ? calculateDistance(
                  userLocation.coords.latitude,
                  userLocation.coords.longitude,
                  verifiedMission.location.coordinates.latitude,
                  verifiedMission.location.coordinates.longitude
                )
              : 'N/A';

            return (
              <Marker
                key={verifiedMission.id}
                coordinate={verifiedMission.location.coordinates}
                title={`🍐 ${verifiedMission.title}`}
                description={`PEAR Verified • ${verifiedMission.location.name} • ${distance} mi away • ${verifiedMission.category}`}
                onPress={() => {
                  setSelectedVerifiedMission(verifiedMission);
                  setSelectedMission(null);
                }}
              >
                <View style={styles.verifiedMissionMarker}>
                  <View style={styles.verifiedMissionInner}>
                    <Ionicons name="shield-checkmark" size={18} color="white" />
                  </View>
                  <View style={styles.verifiedMissionBadge}>
                    <Text style={styles.verifiedMissionText}>🍐</Text>
                  </View>
                </View>
              </Marker>
            );
          })}

          {/* Trash Encounter Markers */}
          {encounters.map((encounter) => (
            <TrashSpawn
              key={encounter.id}
              encounter={encounter}
              onPress={handleTrashEncounterPress}
            />
          ))}

          {/* Eco Station Markers */}
          {getAvailableStations().map((station) => (
            <EcoStationSpawn
              key={station.id}
              station={station}
              onPress={handleEcoStationPress}
            />
          ))}
        </MapView>
        </View>
        
      {/* PEAR Verified Mission Details Panel */}
      {selectedVerifiedMission && (
        <View style={[styles.missionPanel, { backgroundColor: theme.cardBackground }]}>
          <View style={styles.missionPanelHeader}>
            <View style={styles.verifiedMissionHeader}>
              <Text style={styles.verifiedMissionTitle}>🍐</Text>
              <Text style={[styles.missionTitle, { color: theme.textColor }]}>
                {selectedVerifiedMission.title}
              </Text>
            </View>
            <TouchableOpacity onPress={() => setSelectedVerifiedMission(null)}>
              <Ionicons name="close" size={24} color={theme.secondaryText} />
            </TouchableOpacity>
          </View>
          
          <Text style={[styles.missionDescription, { color: theme.secondaryText }]}>
            {selectedVerifiedMission.description}
          </Text>
          
          <View style={styles.verifiedMissionStats}>
            <View style={styles.verifiedStatItem}>
              <Text style={[styles.verifiedStatValue, { color: theme.primary }]}>
                ${selectedVerifiedMission.raised}
              </Text>
              <Text style={[styles.verifiedStatLabel, { color: theme.secondaryText }]}>
                Raised
              </Text>
            </View>
            
            <View style={styles.verifiedStatItem}>
              <Text style={[styles.verifiedStatValue, { color: theme.success }]}>
                {selectedVerifiedMission.participants}
              </Text>
              <Text style={[styles.verifiedStatLabel, { color: theme.secondaryText }]}>
                Participants
              </Text>
            </View>
            
            <View style={styles.verifiedStatItem}>
              <Text style={[styles.verifiedStatValue, { color: theme.warning }]}>
                {selectedVerifiedMission.donors}
              </Text>
              <Text style={[styles.verifiedStatLabel, { color: theme.secondaryText }]}>
                Donors
              </Text>
            </View>
          </View>
          
          <TouchableOpacity 
            style={[styles.acceptButton, { backgroundColor: theme.success }]}
            onPress={() => {
              navigation.navigate('PearVerifiedMissionDetail', { 
                mission: {
                  ...selectedVerifiedMission,
                  beforePhotos: [],
                  afterPhotos: []
                }
              });
            }}
          >
            <Text style={styles.acceptButtonText}>View PEAR Mission</Text>
            <Ionicons name="arrow-forward" size={16} color="white" />
          </TouchableOpacity>
        </View>
      )}

      {/* Regular Mission Details Panel */}
      {selectedMission && (
        <View style={[styles.missionPanel, { backgroundColor: theme.cardBackground }]}>
          <View style={styles.missionPanelHeader}>
            <Text style={[styles.missionTitle, { color: theme.textColor }]}>
              {selectedMission.title}
            </Text>
            <TouchableOpacity onPress={() => setSelectedMission(null)}>
              <Ionicons name="close" size={24} color={theme.secondaryText} />
          </TouchableOpacity>
          </View>
          
          <Text style={[styles.missionDescription, { color: theme.secondaryText }]}>
            {selectedMission.description}
          </Text>
          
          <View style={styles.missionDetails}>
            <View style={styles.missionDetailItem}>
              <Ionicons name="location" size={16} color={theme.primary} />
              <Text style={[styles.missionDetailText, { color: theme.textColor }]}>
                {selectedMission.location.name}
              </Text>
            </View>
            
            <View style={styles.missionDetailItem}>
              <Ionicons name="time" size={16} color={theme.primary} />
              <Text style={[styles.missionDetailText, { color: theme.textColor }]}>
                {selectedMission.duration} min
              </Text>
            </View>
            
            <View style={styles.missionDetailItem}>
              <Ionicons name="people" size={16} color={theme.primary} />
              <Text style={[styles.missionDetailText, { color: theme.textColor }]}>
                {selectedMission.currentParticipants}/{selectedMission.maxParticipants}
              </Text>
            </View>
          </View>
          
          <View style={styles.missionRewards}>
            <View style={styles.rewardItem}>
              <Text style={[styles.rewardAmount, { color: theme.primary }]}>
                +{selectedMission.reward.ecoPoints} EP
              </Text>
            </View>
            <View style={styles.rewardItem}>
                <Text style={[styles.rewardAmount, { color: theme.primary }]}>
                +{selectedMission.reward.xp} XP
              </Text>
            </View>
            {selectedMission.reward.cash && (
              <View style={styles.rewardItem}>
                <Text style={[styles.rewardAmount, { color: theme.warning }]}>
                  +${selectedMission.reward.cash}
                </Text>
              </View>
            )}
          </View>
          
          <TouchableOpacity 
            style={[styles.acceptButton, { backgroundColor: getRoleColor(role) }]}
            onPress={() => {
              // Navigate to mission details or accept mission
              navigation.navigate('MissionDetails', { missionId: selectedMission.id });
            }}
          >
            <Text style={styles.acceptButtonText}>View Mission</Text>
            <Ionicons name="arrow-forward" size={16} color="white" />
          </TouchableOpacity>
        </View>
      )}

      {/* Loading Overlay */}
      {isLoading && (
        <View style={styles.loadingOverlay}>
          <Text style={[styles.loadingText, { color: theme.textColor }]}>
            Loading missions...
          </Text>
      </View>
      )}

      {/* Bottom Sheet */}
      <View style={styles.bottomSheet}>
        <View style={styles.bottomSheetHandle} />
        <Text style={styles.bottomSheetTitle}>Nearby Opportunities</Text>
        
        <ScrollView style={styles.jobsList}>
          {missions.map((job) => (
            <JobPin key={job.id} job={job} />
          ))}
        </ScrollView>
      </View>

      {/* Trash Encounter Modal */}
      <TrashEncounterModal
        visible={showEncounterModal}
        encounter={selectedTrashEncounter}
        onComplete={handleEncounterComplete}
        onClose={handleCloseEncounterModal}
      />

      {/* Encounter Rewards Modal */}
      <EncounterRewards
        visible={showRewardsModal}
        xpEarned={encounterResult?.xpEarned || 0}
        ecoPointsEarned={encounterResult?.ecoPointsEarned || 0}
        trashType={selectedTrashEncounter ? selectedTrashEncounter.type.replace('_', ' ') : ''}
        rarity={selectedTrashEncounter?.rarity || 'common'}
        badgeProgress={encounterResult?.badgeProgress}
        onClose={handleCloseRewardsModal}
      />

      {/* Eco Station Modal */}
      <EcoStationModal
        visible={showStationModal}
        station={selectedEcoStation}
        missions={selectedEcoStation ? getStationMissions(selectedEcoStation.id) : []}
        onStartMission={handleStationMissionStart}
        onClose={handleCloseStationModal}
      />

      {/* Sorting Game Modal */}
      <SortingGame
        visible={showSortingGame}
        onComplete={handleSortingGameComplete}
        onClose={handleCloseSortingGame}
        difficulty={selectedEcoStation?.level >= 4 ? 'hard' : selectedEcoStation?.level >= 3 ? 'medium' : 'easy'}
        timeLimit={3}
      />
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
    padding: THEME.SPACING.md + 4,
    paddingTop: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: THEME.SPACING.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  headerContent: {
    flex: 1,
  },
  headerTitle: {
    fontSize: THEME.TYPOGRAPHY.fontSize["2xl"],
    fontWeight: '700',
  },
  headerSubtitle: {
    fontSize: THEME.TYPOGRAPHY.fontSize.base,
    marginTop: THEME.SPACING.xs,
  },
  mapContainer: {
    flex: 1,
    position: 'relative',
  },
  mapPlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#e5e7eb',
  },
  mapText: {
    fontSize: THEME.TYPOGRAPHY.fontSize.lg,
    color: '#6b7280',
    marginTop: THEME.SPACING.md,
  },
  filterButton: {
    paddingHorizontal: THEME.SPACING.md,
    paddingVertical: THEME.SPACING.sm,
    borderRadius: THEME.BORDER_RADIUS.md,
    backgroundColor: '#f3f4f6',
    marginRight: THEME.SPACING.sm,
  },
  map: {
    flex: 1,
  },
  userMarker: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#3b82f6',
    borderWidth: 3,
    borderColor: 'white',
  },
  missionMarker: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#10b981',
    borderWidth: 2,
    borderColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
  verifiedMissionMarker: {
    width: 40,
    height: 40,
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  verifiedMissionInner: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#10b981',
    borderWidth: 3,
    borderColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  verifiedMissionBadge: {
    position: 'absolute',
    top: -2,
    right: -2,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#f59e0b',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'white',
  },
  verifiedMissionText: {
    fontSize: 8,
    fontWeight: 'bold',
  },
  verifiedMissionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  verifiedMissionTitle: {
    fontSize: 20,
    marginRight: 8,
  },
  verifiedMissionStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: THEME.SPACING.lg,
    paddingVertical: THEME.SPACING.md,
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: THEME.BORDER_RADIUS.lg,
  },
  verifiedStatItem: {
    alignItems: 'center',
  },
  verifiedStatValue: {
    fontSize: THEME.TYPOGRAPHY.fontSize.lg,
    fontWeight: '700',
  },
  verifiedStatLabel: {
    fontSize: THEME.TYPOGRAPHY.fontSize.xs,
    marginTop: THEME.SPACING.xs,
  },
  missionPanel: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: THEME.SPACING.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  missionPanelHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: THEME.SPACING.md,
  },
  missionTitle: {
    fontSize: THEME.TYPOGRAPHY.fontSize.xl,
    fontWeight: '700',
    flex: 1,
  },
  missionDescription: {
    fontSize: THEME.TYPOGRAPHY.fontSize.base,
    color: '#6b7280',
    marginBottom: THEME.SPACING.md,
  },
  missionDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: THEME.SPACING.md,
  },
  missionDetailItem: {
    flex: 1,
    alignItems: 'center',
  },
  missionDetailText: {
    fontSize: THEME.TYPOGRAPHY.fontSize.sm,
    color: '#6b7280',
  },
  missionRewards: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: THEME.SPACING.lg,
  },
  rewardItem: {
    alignItems: 'center',
  },
  rewardAmount: {
    fontSize: THEME.TYPOGRAPHY.fontSize.lg,
    fontWeight: '700',
  },
  acceptButton: {
    backgroundColor: '#10b981',
    paddingVertical: THEME.SPACING.md,
    borderRadius: THEME.BORDER_RADIUS.lg,
    alignItems: 'center',
  },
  acceptButtonText: {
    color: 'white',
    fontSize: THEME.TYPOGRAPHY.fontSize.lg,
    fontWeight: '700',
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: THEME.TYPOGRAPHY.fontSize.lg,
    fontWeight: '600',
  },
  mapSubtext: {
    fontSize: THEME.TYPOGRAPHY.fontSize.sm,
    color: '#9ca3af',
    marginTop: THEME.SPACING.xs,
  },
  mapControls: {
    position: 'absolute',
    top: 20,
    right: 20,
    gap: 8,
  },
  controlButton: {
    // backgroundColor: theme.background,
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  bottomSheet: {
    // backgroundColor: theme.background,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingHorizontal: THEME.SPACING.md + 4,
    paddingTop: THEME.SPACING.sm + 4,
    paddingBottom: THEME.SPACING.md + 4,
    maxHeight: 300,
  },
  bottomSheetHandle: {
    width: 32,
    height: 4,
    backgroundColor: '#d1d5db',
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: THEME.SPACING.md,
  },
  bottomSheetTitle: {
    fontSize: THEME.TYPOGRAPHY.fontSize.lg,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: THEME.SPACING.md,
  },
  jobsList: {
    flex: 1,
  },
  jobPin: {
    backgroundColor: '#1e40af',
    flexDirection: 'row',
    alignItems: 'center',
    padding: THEME.SPACING.sm + 4,
    borderRadius: THEME.BORDER_RADIUS.md,
    marginBottom: THEME.SPACING.sm,
  },
  jobPinText: {
    // color: theme.background,
    fontSize: THEME.TYPOGRAPHY.fontSize.sm,
    fontWeight: '600',
    marginLeft: THEME.SPACING.sm,
    flex: 1,
  },
  jobDistance: {
    color: '#bfdbfe',
    fontSize: THEME.TYPOGRAPHY.fontSize.xs,
  },
});

export default MapScreen;