import { Platform, Alert, Linking } from 'react-native';
import * as Location from 'expo-location';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface LocationData {
  latitude: number;
  longitude: number;
  accuracy: number;
  timestamp: Date;
  altitude?: number;
  speed?: number;
}

export interface MissionTrackingData {
  missionId: string;
  startTime: Date;
  endTime?: Date;
  startLocation?: LocationData;
  endLocation?: LocationData;
  totalDistance: number; // in meters
  durationMin: number; // mission duration in minutes
  averageSpeedKmH: number; // average speed in km/h
  locations: LocationData[];
  efficiency: {
    distanceKm: number;
    durationMin: number;
    averageSpeedKmH: number;
    ecoPointsPerKm: number;
    timePerKgTrash: number;
    trashCollectedKg: number;
  };
}

export interface MissionEfficiencySummary {
  totalMissionsCompleted: number;
  totalDistanceKm: number;
  totalDurationMin: number;
  averageSpeedKmH: number;
  totalTrashCollectedKg: number;
  averageEfficiencyScore: number;
  ecoPointsPerKm: number;
  timePerKgTrash: number;
}

class ActivityTrackingService {
  private static instance: ActivityTrackingService;
  private currentMission: MissionTrackingData | null = null;
  private locationSubscription: Location.LocationSubscription | null = null;
  private isTracking = false;

  public static getInstance(): ActivityTrackingService {
    if (!ActivityTrackingService.instance) {
      ActivityTrackingService.instance = new ActivityTrackingService();
    }
    return ActivityTrackingService.instance;
  }

  /**
   * Request permissions for location and step tracking
   */
  async requestPermissions(): Promise<boolean> {
    try {
      // Request location permission
      const locationPermission = await Location.requestForegroundPermissionsAsync();
      if (locationPermission.status !== 'granted') {
        Alert.alert(
          'Location Permission Required',
          'Please enable location access to track your eco-missions and earn rewards.',
          [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Open Settings', onPress: () => Linking.openSettings() }
          ]
        );
        return false;
      }

      // Request background location permission for mission tracking
      const backgroundPermission = await Location.requestBackgroundPermissionsAsync();
      if (backgroundPermission.status !== 'granted') {
        console.warn('Background location permission not granted - limited tracking available');
      }

      console.log('Mission efficiency tracking ready');

      return true;
    } catch (error) {
      console.error('Permission request failed:', error);
      return false;
    }
  }

  /**
   * Start tracking a mission
   */
  async startMissionTracking(missionId: string): Promise<boolean> {
    try {
      const hasPermissions = await this.requestPermissions();
      if (!hasPermissions) return false;

      // Get current location
      const currentLocation = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      this.currentMission = {
        missionId,
        startTime: new Date(),
        startLocation: {
          latitude: currentLocation.coords.latitude,
          longitude: currentLocation.coords.longitude,
          accuracy: currentLocation.coords.accuracy || 0,
          timestamp: new Date(currentLocation.timestamp),
          altitude: currentLocation.coords.altitude || undefined,
          speed: currentLocation.coords.speed || undefined,
        },
        totalDistance: 0,
        durationMin: 0,
        averageSpeedKmH: 0,
        locations: [],
        efficiency: {
          distanceKm: 0,
          durationMin: 0,
          averageSpeedKmH: 0,
          ecoPointsPerKm: 0,
          timePerKgTrash: 0,
          trashCollectedKg: 0,
        },
      };

      // Start location tracking
      this.locationSubscription = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.Balanced,
          timeInterval: 10000, // Update every 10 seconds
          distanceInterval: 10, // Update every 10 meters
        },
        (location) => {
          if (this.currentMission) {
            const locationData: LocationData = {
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
              accuracy: location.coords.accuracy || 0,
              timestamp: new Date(location.timestamp),
              altitude: location.coords.altitude || undefined,
              speed: location.coords.speed || undefined,
            };
            
            this.currentMission.locations.push(locationData);
            this.updateDistance();
          }
        }
      );

      console.log('Mission efficiency tracking started');

      this.isTracking = true;
      console.log('Mission tracking started for:', missionId);
      return true;
    } catch (error) {
      console.error('Failed to start mission tracking:', error);
      return false;
    }
  }

  /**
   * Stop tracking and calculate efficiency metrics
   */
  async stopMissionTracking(trashCollectedKg: number, ecoPointsEarned: number): Promise<MissionTrackingData | null> {
    try {
      if (!this.currentMission) return null;

      // Get final location
      const finalLocation = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      this.currentMission.endTime = new Date();
      this.currentMission.endLocation = {
        latitude: finalLocation.coords.latitude,
        longitude: finalLocation.coords.longitude,
        accuracy: finalLocation.coords.accuracy || 0,
        timestamp: new Date(finalLocation.timestamp),
        altitude: finalLocation.coords.altitude || undefined,
        speed: finalLocation.coords.speed || undefined,
      };

      // Calculate mission efficiency metrics
      const durationMin = this.getMissionDuration() / 60; // Convert to minutes
      const distanceKm = this.currentMission.totalDistance / 1000; // Convert to km
      const averageSpeedKmH = durationMin > 0 ? (distanceKm / (durationMin / 60)) : 0;

      this.currentMission.durationMin = durationMin;
      this.currentMission.averageSpeedKmH = averageSpeedKmH;

      // Calculate efficiency metrics
      this.currentMission.efficiency = {
        distanceKm: distanceKm,
        durationMin: durationMin,
        averageSpeedKmH: averageSpeedKmH,
        ecoPointsPerKm: distanceKm > 0 ? ecoPointsEarned / distanceKm : 0,
        timePerKgTrash: trashCollectedKg > 0 ? durationMin / trashCollectedKg : 0,
        trashCollectedKg: trashCollectedKg,
      };

      // Save mission data
      await this.saveMissionData(this.currentMission);

      // Stop subscriptions
      this.locationSubscription?.remove();
      this.locationSubscription = null;
      this.isTracking = false;

      const completedMission = this.currentMission;
      this.currentMission = null;

      console.log('Mission tracking completed:', completedMission.missionId);
      return completedMission;
    } catch (error) {
      console.error('Failed to stop mission tracking:', error);
      return null;
    }
  }

  /**
   * Get mission efficiency summary for analytics
   */
  async getMissionEfficiencySummary(): Promise<MissionEfficiencySummary> {
    try {
      const savedMissions = await AsyncStorage.getItem('missionTrackingData');
      const missions: MissionTrackingData[] = savedMissions ? JSON.parse(savedMissions) : [];

      if (missions.length === 0) {
        return {
          totalMissionsCompleted: 0,
          totalDistanceKm: 0,
          totalDurationMin: 0,
          averageSpeedKmH: 0,
          totalTrashCollectedKg: 0,
          averageEfficiencyScore: 0,
          ecoPointsPerKm: 0,
          timePerKgTrash: 0,
        };
      }

      // Calculate aggregate metrics
      const totalMissionsCompleted = missions.length;
      const totalDistanceKm = missions.reduce((sum, mission) => sum + mission.efficiency.distanceKm, 0);
      const totalDurationMin = missions.reduce((sum, mission) => sum + mission.efficiency.durationMin, 0);
      const totalTrashCollectedKg = missions.reduce((sum, mission) => sum + mission.efficiency.trashCollectedKg, 0);
      
      const averageSpeedKmH = totalDurationMin > 0 ? (totalDistanceKm / (totalDurationMin / 60)) : 0;
      const ecoPointsPerKm = totalDistanceKm > 0 ? (missions.reduce((sum, mission) => sum + mission.efficiency.ecoPointsPerKm * mission.efficiency.distanceKm, 0) / totalDistanceKm) : 0;
      const timePerKgTrash = totalTrashCollectedKg > 0 ? (totalDurationMin / totalTrashCollectedKg) : 0;

      // Calculate efficiency score (lower time per kg and higher eco points per km = better)
      const averageEfficiencyScore = missions.reduce((sum, mission) => {
        const timeScore = mission.efficiency.timePerKgTrash > 0 ? Math.max(0, 100 - (mission.efficiency.timePerKgTrash / 5)) : 0;
        const ecoScore = mission.efficiency.ecoPointsPerKm * 10;
        return sum + (timeScore + ecoScore) / 2;
      }, 0) / totalMissionsCompleted;

      return {
        totalMissionsCompleted,
        totalDistanceKm,
        totalDurationMin,
        averageSpeedKmH,
        totalTrashCollectedKg,
        averageEfficiencyScore,
        ecoPointsPerKm,
        timePerKgTrash,
      };
    } catch (error) {
      console.error('Failed to get mission efficiency summary:', error);
      return {
        totalMissionsCompleted: 0,
        totalDistanceKm: 0,
        totalDurationMin: 0,
        averageSpeedKmH: 0,
        totalTrashCollectedKg: 0,
        averageEfficiencyScore: 0,
        ecoPointsPerKm: 0,
        timePerKgTrash: 0,
      };
    }
  }

  /**
   * Calculate efficiency bonus for wallet rewards based on mission performance
   */
  calculateEfficiencyBonus(missionData: MissionTrackingData): number {
    const { efficiency } = missionData;
    let bonus = 0;

    // Bonus for time efficiency (lower time per kg = better)
    if (efficiency.timePerKgTrash < 5) bonus += 50; // Less than 5 min per kg
    else if (efficiency.timePerKgTrash < 10) bonus += 30; // Less than 10 min per kg
    else if (efficiency.timePerKgTrash < 15) bonus += 15; // Less than 15 min per kg

    // Bonus for eco points efficiency (higher eco points per km = better)
    if (efficiency.ecoPointsPerKm > 100) bonus += 40; // More than 100 eco points per km
    else if (efficiency.ecoPointsPerKm > 50) bonus += 25; // More than 50 eco points per km
    else if (efficiency.ecoPointsPerKm > 25) bonus += 15; // More than 25 eco points per km

    // Bonus for distance efficiency (reasonable distance for trash collected)
    const distancePerKg = efficiency.distanceKm / efficiency.trashCollectedKg;
    if (distancePerKg < 0.5) bonus += 20; // Less than 500m per kg (very efficient)
    else if (distancePerKg < 1.0) bonus += 10; // Less than 1km per kg (efficient)

    return bonus;
  }


  /**
   * Update total distance based on location changes
   */
  private updateDistance(): void {
    if (!this.currentMission || this.currentMission.locations.length < 2) return;

    const locations = this.currentMission.locations;
    const lastLocation = locations[locations.length - 1];
    const previousLocation = locations[locations.length - 2];

    const distance = this.calculateDistance(
      previousLocation.latitude,
      previousLocation.longitude,
      lastLocation.latitude,
      lastLocation.longitude
    );

    this.currentMission.totalDistance += distance;
  }

  /**
   * Calculate distance between two points (Haversine formula)
   */
  private calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371e3; // Earth's radius in meters
    const φ1 = lat1 * Math.PI / 180;
    const φ2 = lat2 * Math.PI / 180;
    const Δφ = (lat2 - lat1) * Math.PI / 180;
    const Δλ = (lon2 - lon1) * Math.PI / 180;

    const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ/2) * Math.sin(Δλ/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

    return R * c; // Distance in meters
  }

  /**
   * Get mission duration in seconds
   */
  private getMissionDuration(): number {
    if (!this.currentMission || !this.currentMission.endTime) return 0;
    return (this.currentMission.endTime.getTime() - this.currentMission.startTime.getTime()) / 1000;
  }

  /**
   * Save mission data for analytics
   */
  private async saveMissionData(missionData: MissionTrackingData): Promise<void> {
    try {
      const savedMissions = await AsyncStorage.getItem('missionTrackingData');
      const missions = savedMissions ? JSON.parse(savedMissions) : [];
      missions.push(missionData);
      
      await AsyncStorage.setItem('missionTrackingData', JSON.stringify(missions));
    } catch (error) {
      console.error('Failed to save mission data:', error);
    }
  }

  /**
   * Check if currently tracking a mission
   */
  isCurrentlyTracking(): boolean {
    return this.isTracking;
  }

  /**
   * Get current mission data
   */
  getCurrentMission(): MissionTrackingData | null {
    return this.currentMission;
  }
}

export default ActivityTrackingService.getInstance();
