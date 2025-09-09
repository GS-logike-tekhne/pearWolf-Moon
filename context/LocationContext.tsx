import React, { createContext, useContext, useState, useEffect } from 'react';

interface LocationCoordinates {
  latitude: number;
  longitude: number;
  accuracy?: number;
}

interface UserLocation {
  coordinates: LocationCoordinates;
  address?: {
    city?: string;
    state?: string;
    zipCode?: string;
    country?: string;
  };
  timestamp: number;
}

interface LocationContextType {
  userLocation: UserLocation | null;
  isLocationLoading: boolean;
  locationError: string | null;
  requestLocationPermission: () => Promise<boolean>;
  getCurrentLocation: () => Promise<void>;
  getNearbyRegion: (lat: number, lng: number) => Promise<string>;
  calculateDistance: (lat1: number, lng1: number, lat2: number, lng2: number) => number;
}

const LocationContext = createContext<LocationContextType | null>(null);

export const LocationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [userLocation, setUserLocation] = useState<UserLocation | null>(null);
  const [isLocationLoading, setIsLocationLoading] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);

  // Load cached location on app start
  useEffect(() => {
    loadCachedLocation();
  }, []);

  const loadCachedLocation = async () => {
    try {
      const cachedLocation = localStorage.getItem('user_location');
      if (cachedLocation) {
        const location = JSON.parse(cachedLocation);
        // Only use cached location if it's less than 24 hours old
        if (Date.now() - location.timestamp < 24 * 60 * 60 * 1000) {
          setUserLocation(location);
        }
      }
    } catch (error) {
      console.error('Failed to load cached location:', error);
    }
  };

  const requestLocationPermission = async (): Promise<boolean> => {
    try {
      if (!navigator.geolocation) {
        setLocationError('Geolocation is not supported by this browser');
        return false;
      }
      
      // Check permission status
      if ('permissions' in navigator) {
        const permission = await navigator.permissions.query({ name: 'geolocation' });
        if (permission.state === 'denied') {
          setLocationError('Location permission was denied');
          return false;
        }
      }
      
      setLocationError(null);
      return true;
    } catch (error) {
      setLocationError('Failed to request location permission');
      console.error('Location permission error:', error);
      return false;
    }
  };

  const getCurrentLocation = async (): Promise<void> => {
    try {
      setIsLocationLoading(true);
      setLocationError(null);

      // Request permission first
      const hasPermission = await requestLocationPermission();
      if (!hasPermission) {
        return;
      }

      // Get current location
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000 // 5 minutes
        });
      });

      // Reverse geocoding using a free service
      let address;
      try {
        const response = await fetch(
          `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${position.coords.latitude}&longitude=${position.coords.longitude}&localityLanguage=en`
        );
        
        if (response.ok) {
          const geocodeData = await response.json();
          address = {
            city: geocodeData.city || geocodeData.locality || '',
            state: geocodeData.principalSubdivision || '',
            zipCode: geocodeData.postcode || '',
            country: geocodeData.countryName || '',
          };
        }
      } catch (geocodeError) {
        console.warn('Reverse geocoding failed:', geocodeError);
      }

      const userLocationData: UserLocation = {
        coordinates: {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy || undefined,
        },
        address,
        timestamp: Date.now(),
      };

      setUserLocation(userLocationData);
      
      // Cache location for offline use
      localStorage.setItem('user_location', JSON.stringify(userLocationData));
      
      console.log('Location updated:', userLocationData);
    } catch (error) {
      setLocationError('Failed to get current location. Please enable location access.');
      console.error('Get location error:', error);
    } finally {
      setIsLocationLoading(false);
    }
  };

  const getNearbyRegion = async (lat: number, lng: number): Promise<string> => {
    try {
      const response = await fetch(
        `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}&localityLanguage=en`
      );

      if (response.ok) {
        const result = await response.json();
        return `${result.city || result.locality}, ${result.principalSubdivision}`;
      }
      
      return 'Unknown Location';
    } catch (error) {
      console.error('Reverse geocoding error:', error);
      return 'Unknown Location';
    }
  };

  // Calculate distance between two coordinates using Haversine formula
  const calculateDistance = (lat1: number, lng1: number, lat2: number, lng2: number): number => {
    const R = 3959; // Earth's radius in miles
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLng/2) * Math.sin(dLng/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c; // Distance in miles
  };

  const value: LocationContextType = {
    userLocation,
    isLocationLoading,
    locationError,
    requestLocationPermission,
    getCurrentLocation,
    getNearbyRegion,
    calculateDistance,
  };

  return (
    <LocationContext.Provider value={value}>
      {children}
    </LocationContext.Provider>
  );
};

export const useLocation = (): LocationContextType => {
  const context = useContext(LocationContext);
  if (!context) {
    throw new Error('useLocation must be used within a LocationProvider');
  }
  return context;
};

export default LocationContext;