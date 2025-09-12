import * as Location from 'expo-location';
import { Alert } from 'react-native';

export interface MissionPin {
  id: string;
  title: string;
  description: string;
  location: {
    latitude: number;
    longitude: number;
    address: string;
  };
  status: 'available' | 'in_progress' | 'completed' | 'expired';
  type: 'cleanup' | 'verification' | 'eco_station' | 'community_event';
  role: 'trash-hero' | 'impact-warrior' | 'eco-defender' | 'admin';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  xpReward: number;
  ecoPointsReward: number;
  participants: number;
  maxParticipants: number;
  distance?: number;
  estimatedDuration: number;
  createdAt: Date;
  expiresAt: Date;
  metadata?: {
    difficulty?: string;
    equipment?: string[];
    instructions?: string[];
    photos?: string[];
  };
}

export interface UserLocation {
  latitude: number;
  longitude: number;
  accuracy: number;
  timestamp: Date;
  heading?: number;
  speed?: number;
}

export interface ProximityAlert {
  id: string;
  missionId: string;
  distance: number;
  type: 'mission_nearby' | 'mission_entered' | 'mission_exited';
  timestamp: Date;
  acknowledged: boolean;
}

export interface RouteOptimization {
  missions: MissionPin[];
  totalDistance: number;
  estimatedTime: number;
  optimizedOrder: string[];
  waypoints: Array<{
    latitude: number;
    longitude: number;
    missionId: string;
  }>;
}

export class LiveMapService {
  private static instance: LiveMapService;
  private watchId: Location.LocationSubscription | null = null;
  private currentLocation: UserLocation | null = null;
  private proximityThreshold = 150; // meters
  private missionPins: MissionPin[] = [];
  private proximityAlerts: ProximityAlert[] = [];
  
  public static getInstance(): LiveMapService {
    if (!LiveMapService.instance) {
      LiveMapService.instance = new LiveMapService();
    }
    return LiveMapService.instance;
  }

  /**
   * Initialize location tracking
   */
  async initializeLocationTracking(): Promise<boolean> {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          'Location Permission Required',
          'PEAR needs location access to show nearby missions and track your cleanup progress.',
          [{ text: 'OK' }]
        );
        return false;
      }

      // Start watching location
      this.watchId = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          timeInterval: 5000, // Update every 5 seconds
          distanceInterval: 10, // Update every 10 meters
        },
        (location) => {
          this.updateUserLocation(location);
          this.checkProximityAlerts();
        }
      );

      return true;
    } catch (error) {
      console.error('Failed to initialize location tracking:', error);
      return false;
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
  }

  /**
   * Update user location
   */
  private updateUserLocation(location: Location.LocationObject): void {
    this.currentLocation = {
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
      accuracy: location.coords.accuracy || 0,
      timestamp: new Date(location.timestamp),
      heading: location.coords.heading || undefined,
      speed: location.coords.speed || undefined,
    };
  }

  /**
   * Get current user location
   */
  getCurrentLocation(): UserLocation | null {
    return this.currentLocation;
  }

  /**
   * Load mission pins from API
   */
  async loadMissionPins(centerLat: number, centerLng: number, radius: number = 5000): Promise<MissionPin[]> {
    try {
      // Mock API call - in production, this would fetch from your backend
      const mockMissions = this.generateMockMissions(centerLat, centerLng, radius);
      
      // Calculate distances from user location
      if (this.currentLocation) {
        mockMissions.forEach(mission => {
          mission.distance = this.calculateDistance(
            this.currentLocation!.latitude,
            this.currentLocation!.longitude,
            mission.location.latitude,
            mission.location.longitude
          );
        });
      }

      this.missionPins = mockMissions;
      return mockMissions;
    } catch (error) {
      console.error('Failed to load mission pins:', error);
      return [];
    }
  }

  /**
   * Get mission pins within radius
   */
  getMissionPinsInRadius(radius: number = 1000): MissionPin[] {
    if (!this.currentLocation) return [];

    return this.missionPins.filter(mission => {
      const distance = this.calculateDistance(
        this.currentLocation!.latitude,
        this.currentLocation!.longitude,
        mission.location.latitude,
        mission.location.longitude
      );
      return distance <= radius;
    });
  }

  /**
   * Check for proximity alerts
   */
  private checkProximityAlerts(): void {
    if (!this.currentLocation) return;

    this.missionPins.forEach(mission => {
      const distance = this.calculateDistance(
        this.currentLocation!.latitude,
        this.currentLocation!.longitude,
        mission.location.latitude,
        mission.location.longitude
      );

      // Check if user entered proximity
      if (distance <= this.proximityThreshold) {
        const existingAlert = this.proximityAlerts.find(
          alert => alert.missionId === mission.id && alert.type === 'mission_entered'
        );

        if (!existingAlert) {
          this.createProximityAlert(mission.id, distance, 'mission_entered');
        }
      }

      // Check if user exited proximity
      if (distance > this.proximityThreshold) {
        const existingAlert = this.proximityAlerts.find(
          alert => alert.missionId === mission.id && alert.type === 'mission_exited'
        );

        if (!existingAlert) {
          this.createProximityAlert(mission.id, distance, 'mission_exited');
        }
      }
    });
  }

  /**
   * Create proximity alert
   */
  private createProximityAlert(missionId: string, distance: number, type: ProximityAlert['type']): void {
    const alert: ProximityAlert = {
      id: `alert_${Date.now()}_${missionId}`,
      missionId,
      distance,
      type,
      timestamp: new Date(),
      acknowledged: false,
    };

    this.proximityAlerts.push(alert);
    
    // Trigger proximity event
    this.onProximityAlert?.(alert);
  }

  /**
   * Proximity alert callback
   */
  onProximityAlert?: (alert: ProximityAlert) => void;

  /**
   * Get proximity alerts
   */
  getProximityAlerts(): ProximityAlert[] {
    return this.proximityAlerts;
  }

  /**
   * Acknowledge proximity alert
   */
  acknowledgeAlert(alertId: string): void {
    const alert = this.proximityAlerts.find(a => a.id === alertId);
    if (alert) {
      alert.acknowledged = true;
    }
  }

  /**
   * Optimize route for multiple missions
   */
  optimizeRoute(missionIds: string[]): RouteOptimization | null {
    if (!this.currentLocation || missionIds.length === 0) return null;

    const missions = this.missionPins.filter(mission => missionIds.includes(mission.id));
    if (missions.length === 0) return null;

    // Simple route optimization - in production, use proper TSP algorithm
    const optimizedOrder = this.nearestNeighborRoute(this.currentLocation, missions);
    const waypoints = optimizedOrder.map(missionId => {
      const mission = missions.find(m => m.id === missionId);
      return {
        latitude: mission!.location.latitude,
        longitude: mission!.location.longitude,
        missionId: missionId,
      };
    });

    const totalDistance = this.calculateRouteDistance(waypoints);
    const estimatedTime = this.calculateRouteTime(totalDistance, missions.length);

    return {
      missions,
      totalDistance,
      estimatedTime,
      optimizedOrder,
      waypoints,
    };
  }

  /**
   * Nearest neighbor route optimization
   */
  private nearestNeighborRoute(startLocation: UserLocation, missions: MissionPin[]): string[] {
    const route: string[] = [];
    const unvisited = [...missions];
    let currentLocation = startLocation;

    while (unvisited.length > 0) {
      let nearestIndex = 0;
      let nearestDistance = this.calculateDistance(
        currentLocation.latitude,
        currentLocation.longitude,
        unvisited[0].location.latitude,
        unvisited[0].location.longitude
      );

      for (let i = 1; i < unvisited.length; i++) {
        const distance = this.calculateDistance(
          currentLocation.latitude,
          currentLocation.longitude,
          unvisited[i].location.latitude,
          unvisited[i].location.longitude
        );

        if (distance < nearestDistance) {
          nearestDistance = distance;
          nearestIndex = i;
        }
      }

      const nearestMission = unvisited.splice(nearestIndex, 1)[0];
      route.push(nearestMission.id);
      currentLocation = {
        latitude: nearestMission.location.latitude,
        longitude: nearestMission.location.longitude,
        accuracy: 0,
        timestamp: new Date(),
      };
    }

    return route;
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

    return R * c;
  }

  /**
   * Calculate route distance
   */
  private calculateRouteDistance(waypoints: Array<{latitude: number, longitude: number}>): number {
    let totalDistance = 0;
    for (let i = 0; i < waypoints.length - 1; i++) {
      totalDistance += this.calculateDistance(
        waypoints[i].latitude,
        waypoints[i].longitude,
        waypoints[i + 1].latitude,
        waypoints[i + 1].longitude
      );
    }
    return totalDistance;
  }

  /**
   * Calculate estimated route time
   */
  private calculateRouteTime(distance: number, missionCount: number): number {
    const walkingSpeed = 1.4; // m/s (average walking speed)
    const missionTime = missionCount * 15 * 60; // 15 minutes per mission
    const travelTime = distance / walkingSpeed;
    
    return missionTime + travelTime;
  }

  /**
   * Generate mock missions for testing
   */
  private generateMockMissions(centerLat: number, centerLng: number, radius: number): MissionPin[] {
    const missions: MissionPin[] = [];
    const missionTypes = ['cleanup', 'verification', 'eco_station', 'community_event'];
    const roles = ['trash-hero', 'impact-warrior', 'eco-defender'];
    const statuses = ['available', 'in_progress', 'completed'];
    const priorities = ['low', 'medium', 'high', 'urgent'];

    for (let i = 0; i < 15; i++) {
      // Generate random location within radius
      const angle = Math.random() * 2 * Math.PI;
      const distance = Math.random() * radius;
      const latOffset = (distance * Math.cos(angle)) / 111000; // Rough conversion
      const lngOffset = (distance * Math.sin(angle)) / (111000 * Math.cos(centerLat * Math.PI / 180));

      missions.push({
        id: `mission_${i + 1}`,
        title: `Cleanup Mission ${i + 1}`,
        description: `Help clean up this area and make a positive environmental impact.`,
        location: {
          latitude: centerLat + latOffset,
          longitude: centerLng + lngOffset,
          address: `Mock Address ${i + 1}`,
        },
        status: statuses[Math.floor(Math.random() * statuses.length)] as any,
        type: missionTypes[Math.floor(Math.random() * missionTypes.length)] as any,
        role: roles[Math.floor(Math.random() * roles.length)] as any,
        priority: priorities[Math.floor(Math.random() * priorities.length)] as any,
        xpReward: 50 + Math.floor(Math.random() * 100),
        ecoPointsReward: 25 + Math.floor(Math.random() * 50),
        participants: Math.floor(Math.random() * 5),
        maxParticipants: 5 + Math.floor(Math.random() * 10),
        estimatedDuration: 15 + Math.floor(Math.random() * 45),
        createdAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000),
        expiresAt: new Date(Date.now() + Math.random() * 7 * 24 * 60 * 60 * 1000),
        metadata: {
          difficulty: ['easy', 'medium', 'hard'][Math.floor(Math.random() * 3)],
          equipment: ['gloves', 'trash bags', 'grabber'],
          instructions: [
            'Wear protective gear',
            'Take before and after photos',
            'Dispose of waste properly',
          ],
        },
      });
    }

    return missions;
  }

  /**
   * Update mission status
   */
  updateMissionStatus(missionId: string, status: MissionPin['status']): void {
    const mission = this.missionPins.find(m => m.id === missionId);
    if (mission) {
      mission.status = status;
    }
  }

  /**
   * Get mission by ID
   */
  getMission(missionId: string): MissionPin | undefined {
    return this.missionPins.find(m => m.id === missionId);
  }

  /**
   * Get all mission pins
   */
  getAllMissionPins(): MissionPin[] {
    return this.missionPins;
  }
}

export default LiveMapService.getInstance();
