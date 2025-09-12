import { Mission } from '../../types/missions';
import {
  LocationCoordinates,
  UserLocation,
  MissionLocation,
} from './locationTypes';

/**
 * Simplified Location Utilities
 * Only essential functions for PEAR core functionality
 */
export class LocationUtils {
  /**
   * Calculate distance between two coordinates using Haversine formula
   * Returns distance in meters
   */
  static calculateDistance(
    from: LocationCoordinates,
    to: LocationCoordinates
  ): number {
    const R = 6371000; // Earth's radius in meters
    const dLat = this.toRadians(to.latitude - from.latitude);
    const dLng = this.toRadians(to.longitude - from.longitude);
    
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRadians(from.latitude)) *
        Math.cos(this.toRadians(to.latitude)) *
        Math.sin(dLng / 2) *
        Math.sin(dLng / 2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  /**
   * Filter missions by proximity to user location
   */
  static filterMissionsByProximity(
    missions: Mission[],
    userLocation: UserLocation,
    maxDistance: number = 15000 // 15km in meters
  ): Mission[] {
    if (!userLocation?.coordinates) return missions;

    return missions.filter(mission => {
      if (!mission.location?.coordinates) return false;

      const distance = this.calculateDistance(
        userLocation.coordinates,
        mission.location.coordinates
      );

      return distance <= maxDistance;
    });
  }

  /**
   * Get nearby missions sorted by distance
   */
  static getNearbyMissions(
    missions: Mission[],
    userLocation: UserLocation,
    maxDistance: number = 15000
  ): Mission[] {
    const nearbyMissions = this.filterMissionsByProximity(
      missions,
      userLocation,
      maxDistance
    );

    return nearbyMissions.sort((a, b) => {
      const distanceA = this.calculateDistance(
        userLocation.coordinates,
        a.location.coordinates
      );
      const distanceB = this.calculateDistance(
        userLocation.coordinates,
        b.location.coordinates
      );
      return distanceA - distanceB;
    });
  }

  /**
   * Check if location is within radius
   */
  static isWithinRadius(
    center: LocationCoordinates,
    point: LocationCoordinates,
    radius: number
  ): boolean {
    const distance = this.calculateDistance(center, point);
    return distance <= radius;
  }

  /**
   * Validate location coordinates
   */
  static isLocationValid(coordinates: LocationCoordinates): boolean {
    return (
      coordinates.latitude >= -90 &&
      coordinates.latitude <= 90 &&
      coordinates.longitude >= -180 &&
      coordinates.longitude <= 180 &&
      !isNaN(coordinates.latitude) &&
      !isNaN(coordinates.longitude)
    );
  }

  /**
   * Format distance for display
   */
  static formatDistance(distance: number): string {
    if (distance < 1000) {
      return `${Math.round(distance)} m`;
    }
    return `${(distance / 1000).toFixed(1)} km`;
  }

  /**
   * Calculate travel time (walking speed: 1.4 m/s)
   */
  static calculateTravelTime(distance: number): number {
    return distance / 1.4; // seconds
  }

  // ============================================================================
  // PRIVATE METHODS
  // ============================================================================

  private static toRadians(degrees: number): number {
    return degrees * (Math.PI / 180);
  }
}