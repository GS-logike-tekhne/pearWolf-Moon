import LocationService from './locationService';

import { MissionPin } from './liveMapService';

export interface Geofence {
  id: string;
  missionId: string;
  center: {
    latitude: number;
    longitude: number;
  };
  radius: number; // meters
  type: 'acceptance_zone' | 'completion_zone' | 'verification_zone';
  isActive: boolean;
  metadata?: {
    requiredAccuracy?: number; // GPS accuracy requirement in meters
    timeLimit?: number; // Time limit in minutes
    autoComplete?: boolean; // Auto-complete mission when entering zone
  };
}

export interface GeofenceEvent {
  id: string;
  geofenceId: string;
  missionId: string;
  eventType: 'enter' | 'exit';
  timestamp: Date;
  location: {
    latitude: number;
    longitude: number;
  };
  accuracy: number;
}

export interface GeofenceValidation {
  isValid: boolean;
  reason?: string;
  distance?: number;
  accuracy?: number;
}

export class GeofencingService {
  private static instance: GeofencingService;
  private geofences: Geofence[] = [];
  private activeGeofences: Set<string> = new Set();
  private eventCallbacks: Map<string, (event: GeofenceEvent) => void> = new Map();
  private checkInterval: NodeJS.Timeout | null = null;
  private lastKnownLocation: { latitude: number; longitude: number } | null = null;
  
  public static getInstance(): GeofencingService {
    if (!GeofencingService.instance) {
      GeofencingService.instance = new GeofencingService();
    }
    return GeofencingService.instance;
  }

  /**
   * Initialize geofencing service
   */
  async initialize(): Promise<void> {
    await this.loadGeofences();
    this.startLocationMonitoring();
  }

  /**
   * Load geofences from API
   */
  async loadGeofences(): Promise<Geofence[]> {
    try {
      // Mock data - in production, this would fetch from your backend
      const mockGeofences = this.generateMockGeofences();
      this.geofences = mockGeofences;
      return mockGeofences;
    } catch (error) {
      console.error('Failed to load geofences:', error);
      return [];
    }
  }

  /**
   * Create geofence for a mission
   */
  createGeofence(
    missionId: string,
    center: { latitude: number; longitude: number },
    radius: number,
    type: Geofence['type'],
    metadata?: Geofence['metadata']
  ): Geofence {
    const geofence: Geofence = {
      id: `geofence_${missionId}_${type}_${Date.now()}`,
      missionId,
      center,
      radius,
      type,
      isActive: true,
      metadata,
    };

    this.geofences.push(geofence);
    return geofence;
  }

  /**
   * Remove geofence
   */
  removeGeofence(geofenceId: string): boolean {
    const index = this.geofences.findIndex(g => g.id === geofenceId);
    if (index !== -1) {
      this.geofences.splice(index, 1);
      this.activeGeofences.delete(geofenceId);
      return true;
    }
    return false;
  }

  /**
   * Get geofences for a mission
   */
  getGeofencesForMission(missionId: string): Geofence[] {
    return this.geofences.filter(g => g.missionId === missionId && g.isActive);
  }

  /**
   * Get all active geofences
   */
  getAllGeofences(): Geofence[] {
    return this.geofences.filter(g => g.isActive);
  }

  /**
   * Check if user is within a geofence
   */
  isWithinGeofence(
    location: { latitude: number; longitude: number },
    geofenceId: string
  ): boolean {
    const geofence = this.geofences.find(g => g.id === geofenceId);
    if (!geofence || !geofence.isActive) return false;

    const distance = LocationService.calculateDistance(
      location.latitude,
      location.longitude,
      geofence.center.latitude,
      geofence.center.longitude
    );

    return distance <= geofence.radius;
  }

  /**
   * Validate mission acceptance based on geofencing
   */
  validateMissionAcceptance(
    missionId: string,
    userLocation: { latitude: number; longitude: number },
    accuracy: number
  ): GeofenceValidation {
    const acceptanceGeofences = this.geofences.filter(
      g => g.missionId === missionId && g.type === 'acceptance_zone' && g.isActive
    );

    if (acceptanceGeofences.length === 0) {
      return { isValid: true }; // No geofencing restrictions
    }

    // Check if user is within any acceptance zone
    for (const geofence of acceptanceGeofences) {
      const distance = LocationService.calculateDistance(
        userLocation.latitude,
        userLocation.longitude,
        geofence.center.latitude,
        geofence.center.longitude
      );

      if (distance <= geofence.radius) {
        // Check accuracy requirement
        const requiredAccuracy = geofence.metadata?.requiredAccuracy || 50;
        if (accuracy <= requiredAccuracy) {
          return {
            isValid: true,
            distance,
            accuracy,
          };
        } else {
          return {
            isValid: false,
            reason: `GPS accuracy too low. Required: ${requiredAccuracy}m, Current: ${Math.round(accuracy)}m`,
            distance,
            accuracy,
          };
        }
      }
    }

    // User is not within any acceptance zone
    const nearestGeofence = acceptanceGeofences.reduce((nearest, current) => {
      const nearestDistance = LocationService.calculateDistance(
        userLocation.latitude,
        userLocation.longitude,
        nearest.center.latitude,
        nearest.center.longitude
      );
      const currentDistance = LocationService.calculateDistance(
        userLocation.latitude,
        userLocation.longitude,
        current.center.latitude,
        current.center.longitude
      );
      return currentDistance < nearestDistance ? current : nearest;
    });

    const distance = LocationService.calculateDistance(
      userLocation.latitude,
      userLocation.longitude,
      nearestGeofence.center.latitude,
      nearestGeofence.center.longitude
    );

    return {
      isValid: false,
      reason: `You must be within ${nearestGeofence.radius}m of the mission location`,
      distance,
      accuracy,
    };
  }

  /**
   * Validate mission completion based on geofencing
   */
  validateMissionCompletion(
    missionId: string,
    userLocation: { latitude: number; longitude: number },
    accuracy: number
  ): GeofenceValidation {
    const completionGeofences = this.geofences.filter(
      g => g.missionId === missionId && g.type === 'completion_zone' && g.isActive
    );

    if (completionGeofences.length === 0) {
      return { isValid: true }; // No completion zone restrictions
    }

    // Check if user is within any completion zone
    for (const geofence of completionGeofences) {
      const distance = LocationService.calculateDistance(
        userLocation.latitude,
        userLocation.longitude,
        geofence.center.latitude,
        geofence.center.longitude
      );

      if (distance <= geofence.radius) {
        const requiredAccuracy = geofence.metadata?.requiredAccuracy || 30;
        if (accuracy <= requiredAccuracy) {
          return {
            isValid: true,
            distance,
            accuracy,
          };
        } else {
          return {
            isValid: false,
            reason: `GPS accuracy too low for completion. Required: ${requiredAccuracy}m, Current: ${Math.round(accuracy)}m`,
            distance,
            accuracy,
          };
        }
      }
    }

    return {
      isValid: false,
      reason: 'You must be at the mission location to complete it',
      accuracy,
    };
  }

  /**
   * Register callback for geofence events
   */
  onGeofenceEvent(callback: (event: GeofenceEvent) => void): string {
    const callbackId = `callback_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    this.eventCallbacks.set(callbackId, callback);
    return callbackId;
  }

  /**
   * Unregister geofence event callback
   */
  removeGeofenceEventCallback(callbackId: string): void {
    this.eventCallbacks.delete(callbackId);
  }

  /**
   * Start monitoring location for geofence events
   */
  private startLocationMonitoring(): void {
    this.checkInterval = setInterval(() => {
      this.checkGeofenceEvents();
    }, 2000); // Check every 2 seconds
  }

  /**
   * Stop location monitoring
   */
  stopLocationMonitoring(): void {
    if (this.checkInterval) {
      clearInterval(this.checkInterval);
      this.checkInterval = null;
    }
  }

  /**
   * Check for geofence enter/exit events
   */
  private checkGeofenceEvents(): void {
    const currentLocation = LocationService.getCurrentLocation();
    if (!currentLocation) return;

    const { latitude, longitude, accuracy } = currentLocation;
    const currentPos = { latitude, longitude };

    // Check each active geofence
    this.geofences.forEach(geofence => {
      if (!geofence.isActive) return;

      const isCurrentlyInside = this.isWithinGeofence(currentPos, geofence.id);
      const wasInside = this.activeGeofences.has(geofence.id);

      if (isCurrentlyInside && !wasInside) {
        // Entered geofence
        this.activeGeofences.add(geofence.id);
        this.triggerGeofenceEvent(geofence, 'enter', currentPos, accuracy);
      } else if (!isCurrentlyInside && wasInside) {
        // Exited geofence
        this.activeGeofences.delete(geofence.id);
        this.triggerGeofenceEvent(geofence, 'exit', currentPos, accuracy);
      }
    });

    this.lastKnownLocation = currentPos;
  }

  /**
   * Trigger geofence event to all registered callbacks
   */
  private triggerGeofenceEvent(
    geofence: Geofence,
    eventType: 'enter' | 'exit',
    location: { latitude: number; longitude: number },
    accuracy: number
  ): void {
    const event: GeofenceEvent = {
      id: `event_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      geofenceId: geofence.id,
      missionId: geofence.missionId,
      eventType,
      timestamp: new Date(),
      location,
      accuracy,
    };

    // Notify all registered callbacks
    this.eventCallbacks.forEach(callback => {
      try {
        callback(event);
      } catch (error) {
        console.error('Error in geofence event callback:', error);
      }
    });
  }

  /**
   * Generate mock geofences for testing
   */
  private generateMockGeofences(): Geofence[] {
    const geofences: Geofence[] = [];
    const currentLocation = LocationService.getCurrentLocation();
    
    if (!currentLocation) {
      return this.generateDefaultGeofences();
    }

    const { latitude, longitude } = currentLocation;

    // Generate geofences for mock missions
    for (let i = 1; i <= 5; i++) {
      const angle = Math.random() * 2 * Math.PI;
      const distance = 200 + Math.random() * 1000; // 200m to 1.2km
      const latOffset = (distance * Math.cos(angle)) / 111000;
      const lngOffset = (distance * Math.sin(angle)) / (111000 * Math.cos(latitude * Math.PI / 180));

      const missionCenter = {
        latitude: latitude + latOffset,
        longitude: longitude + lngOffset,
      };

      // Acceptance zone (larger radius)
      geofences.push({
        id: `acceptance_${i}`,
        missionId: `mission_${i}`,
        center: missionCenter,
        radius: 100, // 100m acceptance radius
        type: 'acceptance_zone',
        isActive: true,
        metadata: {
          requiredAccuracy: 50,
        },
      });

      // Completion zone (smaller radius)
      geofences.push({
        id: `completion_${i}`,
        missionId: `mission_${i}`,
        center: missionCenter,
        radius: 30, // 30m completion radius
        type: 'completion_zone',
        isActive: true,
        metadata: {
          requiredAccuracy: 20,
          autoComplete: true,
        },
      });
    }

    return geofences;
  }

  /**
   * Generate default geofences for San Francisco
   */
  private generateDefaultGeofences(): Geofence[] {
    return [
      {
        id: 'sf_acceptance_1',
        missionId: 'mission_1',
        center: { latitude: 37.7749, longitude: -122.4194 },
        radius: 100,
        type: 'acceptance_zone',
        isActive: true,
        metadata: {
          requiredAccuracy: 50,
        },
      },
      {
        id: 'sf_completion_1',
        missionId: 'mission_1',
        center: { latitude: 37.7749, longitude: -122.4194 },
        radius: 30,
        type: 'completion_zone',
        isActive: true,
        metadata: {
          requiredAccuracy: 20,
          autoComplete: true,
        },
      },
    ];
  }
}

export default GeofencingService.getInstance();
