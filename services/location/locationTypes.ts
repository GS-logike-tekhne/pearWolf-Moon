/**
 * Simplified location types for PEAR application
 * Only essential types needed for core functionality
 */

// ============================================================================
// CORE LOCATION TYPES
// ============================================================================

export interface LocationCoordinates {
  latitude: number;
  longitude: number;
  accuracy?: number;
}

export interface UserLocation {
  coordinates: LocationCoordinates;
  timestamp: Date;
  address?: string;
}

export interface LocationPermission {
  granted: boolean;
  status: 'granted' | 'denied' | 'undetermined';
}

// ============================================================================
// MISSION LOCATION TYPES
// ============================================================================

export interface MissionLocation {
  coordinates: LocationCoordinates;
  name: string;
  address: string;
}

// ============================================================================
// PROXIMITY TYPES
// ============================================================================

export interface ProximityAlert {
  missionId: string;
  distance: number;
  type: 'nearby' | 'entered' | 'exited';
}

// ============================================================================
// ROUTE OPTIMIZATION TYPES
// ============================================================================

export interface RouteWaypoint {
  latitude: number;
  longitude: number;
  missionId: string;
}

export interface RouteOptimization {
  missions: string[]; // mission IDs in optimal order
  totalDistance: number; // meters
  estimatedTime: number; // minutes
}

// ============================================================================
// LOCATION SERVICE CONFIG
// ============================================================================

export interface LocationServiceConfig {
  accuracy: 'low' | 'balanced' | 'high';
  updateInterval: number; // milliseconds
  maxDistance: number; // meters
}

// ============================================================================
// DEFAULT CONFIGURATIONS
// ============================================================================

export const DEFAULT_LOCATION_CONFIG: LocationServiceConfig = {
  accuracy: 'high',
  updateInterval: 5000, // 5 seconds
  maxDistance: 15000, // 15km
};