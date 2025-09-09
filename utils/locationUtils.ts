import { Mission } from '../types/missions';

interface LocationCoordinates {
  lat: number;
  lng: number;
}

interface UserLocation {
  coordinates: LocationCoordinates;
  address?: {
    city?: string;
    state?: string;
    zipCode?: string;
    country?: string;
  };
}

/**
 * Calculate distance between two coordinates using Haversine formula
 * Returns distance in miles
 */
export const calculateDistance = (lat1: number, lng1: number, lat2: number, lng2: number): number => {
  const R = 3959; // Earth's radius in miles
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLng/2) * Math.sin(dLng/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
};

/**
 * Filter missions by proximity to user location
 */
export const filterMissionsByProximity = (
  missions: Mission[],
  userLocation: UserLocation,
  maxDistance: number = 15 // miles
): Mission[] => {
  if (!userLocation?.coordinates) return missions;

  return missions.filter(mission => {
    if (!mission.region?.coordinates) return false;
    
    const distance = calculateDistance(
      userLocation.coordinates.lat,
      userLocation.coordinates.lng,
      mission.region.coordinates.lat,
      mission.region.coordinates.lng
    );
    
    return distance <= maxDistance;
  });
};

/**
 * Filter missions by region (city/state)
 */
export const filterMissionsByRegion = (
  missions: Mission[],
  userLocation: UserLocation
): Mission[] => {
  if (!userLocation?.address?.city || !userLocation?.address?.state) {
    return missions;
  }

  return missions.filter(mission => {
    // Exact city match
    if (mission.region?.city?.toLowerCase() === userLocation.address?.city?.toLowerCase() &&
        mission.region?.state?.toLowerCase() === userLocation.address?.state?.toLowerCase()) {
      return true;
    }
    
    // State fallback
    if (mission.region?.state?.toLowerCase() === userLocation.address?.state?.toLowerCase()) {
      return true;
    }
    
    return false;
  });
};

/**
 * Get priority-based mission filtering
 * Priority 1: Within 2 miles
 * Priority 2: Within 5 miles + same city
 * Priority 3: Within 15 miles
 * Priority 4: Same state
 */
export const getPrioritizedMissions = (
  missions: Mission[],
  userLocation: UserLocation,
  userRole: string
): Mission[] => {
  if (!userLocation?.coordinates) return missions;

  const roleMissions = missions.filter(mission => 
    mission.role === userRole || mission.role === 'ALL'
  );

  const prioritizedMissions: Mission[] = [];
  const processed = new Set<string>();

  // Priority 1: Within 2 miles
  roleMissions.forEach(mission => {
    if (processed.has(mission.id)) return;
    
    if (mission.region?.coordinates) {
      const distance = calculateDistance(
        userLocation.coordinates.lat,
        userLocation.coordinates.lng,
        mission.region.coordinates.lat,
        mission.region.coordinates.lng
      );
      
      if (distance <= 2) {
        prioritizedMissions.push({ ...mission, priority: 1, distance });
        processed.add(mission.id);
      }
    }
  });

  // Priority 2: Within 5 miles + same city
  roleMissions.forEach(mission => {
    if (processed.has(mission.id)) return;
    
    if (mission.region?.coordinates && 
        mission.region?.city?.toLowerCase() === userLocation.address?.city?.toLowerCase()) {
      const distance = calculateDistance(
        userLocation.coordinates.lat,
        userLocation.coordinates.lng,
        mission.region.coordinates.lat,
        mission.region.coordinates.lng
      );
      
      if (distance <= 5) {
        prioritizedMissions.push({ ...mission, priority: 2, distance });
        processed.add(mission.id);
      }
    }
  });

  // Priority 3: Within 15 miles
  roleMissions.forEach(mission => {
    if (processed.has(mission.id)) return;
    
    if (mission.region?.coordinates) {
      const distance = calculateDistance(
        userLocation.coordinates.lat,
        userLocation.coordinates.lng,
        mission.region.coordinates.lat,
        mission.region.coordinates.lng
      );
      
      if (distance <= 15) {
        prioritizedMissions.push({ ...mission, priority: 3, distance });
        processed.add(mission.id);
      }
    }
  });

  // Priority 4: Same state
  roleMissions.forEach(mission => {
    if (processed.has(mission.id)) return;
    
    if (mission.region?.state?.toLowerCase() === userLocation.address?.state?.toLowerCase()) {
      prioritizedMissions.push({ ...mission, priority: 4, distance: 999 });
      processed.add(mission.id);
    }
  });

  // Sort by priority, then by distance
  return prioritizedMissions.sort((a, b) => {
    if (a.priority !== b.priority) {
      return (a.priority || 999) - (b.priority || 999);
    }
    return (a.distance || 999) - (b.distance || 999);
  });
};

/**
 * Get region display name from mission
 */
export const getRegionDisplayName = (mission: Mission): string => {
  if (mission.region?.city && mission.region?.state) {
    return `${mission.region.city}, ${mission.region.state}`;
  }
  if (mission.region?.state) {
    return mission.region.state;
  }
  return 'Unknown Location';
};

/**
 * Check if user is in same region as mission
 */
export const isInSameRegion = (
  userLocation: UserLocation,
  mission: Mission,
  proximityMiles: number = 10
): boolean => {
  // Check city match
  if (userLocation.address?.city && mission.region?.city &&
      userLocation.address.city.toLowerCase() === mission.region.city.toLowerCase()) {
    return true;
  }

  // Check proximity
  if (userLocation.coordinates && mission.region?.coordinates) {
    const distance = calculateDistance(
      userLocation.coordinates.lat,
      userLocation.coordinates.lng,
      mission.region.coordinates.lat,
      mission.region.coordinates.lng
    );
    return distance <= proximityMiles;
  }

  return false;
};

/**
 * Generate mock coordinates for development
 */
export const generateMockCoordinates = (city: string, state: string): LocationCoordinates => {
  // Mock coordinates for common US cities
  const cityCoordinates: Record<string, LocationCoordinates> = {
    'houston,tx': { lat: 29.7604, lng: -95.3698 },
    'austin,tx': { lat: 30.2672, lng: -97.7431 },
    'dallas,tx': { lat: 32.7767, lng: -96.7970 },
    'san antonio,tx': { lat: 29.4241, lng: -98.4936 },
    'new york,ny': { lat: 40.7128, lng: -74.0060 },
    'los angeles,ca': { lat: 34.0522, lng: -118.2437 },
    'chicago,il': { lat: 41.8781, lng: -87.6298 },
    'miami,fl': { lat: 25.7617, lng: -80.1918 },
    'seattle,wa': { lat: 47.6062, lng: -122.3321 },
    'denver,co': { lat: 39.7392, lng: -104.9903 },
  };

  const key = `${city.toLowerCase()},${state.toLowerCase()}`;
  if (cityCoordinates[key]) {
    return cityCoordinates[key];
  }

  // Generate random coordinates for unknown cities
  // This is a simplified approach for development
  const baseLat = 39.8283; // Center of US
  const baseLng = -98.5795;
  const randomOffsetLat = (Math.random() - 0.5) * 20; // +/- 10 degrees
  const randomOffsetLng = (Math.random() - 0.5) * 40; // +/- 20 degrees

  return {
    lat: baseLat + randomOffsetLat,
    lng: baseLng + randomOffsetLng,
  };
};

export default {
  calculateDistance,
  filterMissionsByProximity,
  filterMissionsByRegion,
  getPrioritizedMissions,
  getRegionDisplayName,
  isInSameRegion,
  generateMockCoordinates,
};