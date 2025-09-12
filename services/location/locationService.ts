import * as Location from 'expo-location';
import { Alert } from 'react-native';
import {
  UserLocation,
  LocationCoordinates,
  LocationPermission,
  LocationServiceConfig,
  ProximityAlert,
  RouteOptimization,
  RouteWaypoint,
  DEFAULT_LOCATION_CONFIG,
} from './locationTypes';
import { LocationUtils } from './locationUtils';

/**
 * Simplified Location Service
 * Core location functionality without over-engineering
 */
export class LocationService {
  private static instance: LocationService;
  private watchId: Location.LocationSubscription | null = null;
  private currentLocation: UserLocation | null = null;
  private locationCallbacks: ((location: UserLocation) => void)[] = [];
  private config: LocationServiceConfig;
  private isTracking: boolean = false;

  private constructor() {
    this.config = DEFAULT_LOCATION_CONFIG;
  }

  public static getInstance(): LocationService {
    if (!LocationService.instance) {
      LocationService.instance = new LocationService();
    }
    return LocationService.instance;
  }

  /**
   * Initialize location tracking
   */
  async initializeLocationTracking(): Promise<boolean> {
    try {
      const permission = await this.requestLocationPermission();
      if (!permission.granted) {
        return false;
      }

      const location = await this.getCurrentLocation();
      return location !== null;
    } catch (error) {
      console.error('Failed to initialize location tracking:', error);
      return false;
    }
  }

  /**
   * Get current location
   */
  async getCurrentLocation(): Promise<UserLocation | null> {
    try {
      const location = await Location.getCurrentPositionAsync({
        accuracy: this.getLocationAccuracy(),
        maximumAge: 10000,
        timeout: 15000,
      });

      const userLocation: UserLocation = {
        coordinates: {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          accuracy: location.coords.accuracy,
        },
        timestamp: new Date(location.timestamp),
      };

      // Try to get address
      try {
        const addresses = await Location.reverseGeocodeAsync({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        });

        if (addresses.length > 0) {
          const address = addresses[0];
          userLocation.address = [
            address.street,
            address.city,
            address.region,
            address.postalCode,
            address.country,
          ].filter(Boolean).join(', ');
        }
      } catch (addressError) {
        console.warn('Failed to get address:', addressError);
      }

      this.currentLocation = userLocation;
      return userLocation;
    } catch (error) {
      console.error('Failed to get current location:', error);
      return null;
    }
  }

  /**
   * Start location tracking
   */
  async startLocationTracking(callback: (location: UserLocation) => void): Promise<void> {
    if (this.isTracking) {
      this.locationCallbacks.push(callback);
      return;
    }

    try {
      const permission = await this.requestLocationPermission();
      if (!permission.granted) {
        throw new Error('Location permission not granted');
      }

      this.locationCallbacks.push(callback);
      this.isTracking = true;

      this.watchId = await Location.watchPositionAsync(
        {
          accuracy: this.getLocationAccuracy(),
          timeInterval: this.config.updateInterval,
          distanceInterval: 10,
        },
        (location) => {
          this.updateUserLocation(location);
        }
      );
    } catch (error) {
      console.error('Failed to start location tracking:', error);
      this.isTracking = false;
      throw error;
    }
  }

  /**
   * Stop location tracking
   */
  stopLocationTracking(): void {
    if (this.watchId) {
      this.watchId.remove();
      this.watchId = null;
    }
    this.isTracking = false;
    this.locationCallbacks = [];
  }

  /**
   * Request location permission
   */
  async requestLocationPermission(): Promise<LocationPermission> {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      
      const granted = status === 'granted';
      
      if (!granted) {
        Alert.alert(
          'Location Permission Required',
          'PEAR needs location access to show nearby missions and track your cleanup progress.',
          [{ text: 'OK' }]
        );
      }

      return {
        granted,
        status: status as 'granted' | 'denied' | 'undetermined',
      };
    } catch (error) {
      console.error('Failed to request location permission:', error);
      return {
        granted: false,
        status: 'denied',
      };
    }
  }

  /**
   * Check proximity alerts
   */
  checkProximityAlerts(
    userLocation: UserLocation,
    missions: any[],
    threshold: number = 1000
  ): ProximityAlert[] {
    const alerts: ProximityAlert[] = [];

    missions.forEach(mission => {
      if (!mission.location?.coordinates) return;

      const distance = LocationUtils.calculateDistance(
        userLocation.coordinates,
        mission.location.coordinates
      );

      if (distance <= threshold) {
        alerts.push({
          missionId: mission.id,
          distance,
          type: 'nearby',
        });
      }
    });

    return alerts;
  }

  /**
   * Simple route optimization (nearest neighbor)
   */
  optimizeRoute(
    userLocation: UserLocation,
    missions: any[]
  ): RouteOptimization | null {
    if (missions.length === 0) return null;

    const sortedMissions = LocationUtils.getNearbyMissions(
      missions,
      userLocation,
      this.config.maxDistance
    );

    let totalDistance = 0;
    let currentLocation = userLocation.coordinates;

    const optimizedOrder = sortedMissions.map(mission => {
      const distance = LocationUtils.calculateDistance(
        currentLocation,
        mission.location.coordinates
      );
      totalDistance += distance;
      currentLocation = mission.location.coordinates;
      return mission.id;
    });

    const estimatedTime = LocationUtils.calculateTravelTime(totalDistance) / 60; // minutes

    return {
      missions: optimizedOrder,
      totalDistance,
      estimatedTime,
    };
  }

  /**
   * Get current location (cached)
   */
  getCurrentLocationSync(): UserLocation | null {
    return this.currentLocation;
  }

  /**
   * Update configuration
   */
  updateConfig(config: Partial<LocationServiceConfig>): void {
    this.config = { ...this.config, ...config };
  }

  // ============================================================================
  // PRIVATE METHODS
  // ============================================================================

  private updateUserLocation(location: Location.LocationObject): void {
    const userLocation: UserLocation = {
      coordinates: {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        accuracy: location.coords.accuracy,
      },
      timestamp: new Date(location.timestamp),
    };

    this.currentLocation = userLocation;

    this.locationCallbacks.forEach(callback => {
      try {
        callback(userLocation);
      } catch (error) {
        console.error('Error in location callback:', error);
      }
    });
  }

  private getLocationAccuracy(): Location.LocationAccuracy {
    switch (this.config.accuracy) {
      case 'low':
        return Location.Accuracy.Low;
      case 'balanced':
        return Location.Accuracy.Balanced;
      case 'high':
        return Location.Accuracy.High;
      default:
        return Location.Accuracy.High;
    }
  }
}

export default LocationService.getInstance();