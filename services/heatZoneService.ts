import { HeatZone } from '../components/map/HeatZoneOverlay';
import LocationService from './locationService';

export interface HeatZoneAnalytics {
  totalZones: number;
  activeHotspots: number;
  cleanedAreas: number;
  sponsorZones: number;
  averageIntensity: number;
}

export class HeatZoneService {
  private static instance: HeatZoneService;
  private heatZones: HeatZone[] = [];
  private updateInterval: NodeJS.Timeout | null = null;
  
  public static getInstance(): HeatZoneService {
    if (!HeatZoneService.instance) {
      HeatZoneService.instance = new HeatZoneService();
    }
    return HeatZoneService.instance;
  }

  /**
   * Initialize heat zone tracking
   */
  async initialize(): Promise<void> {
    await this.loadHeatZones();
    this.startPeriodicUpdates();
  }

  /**
   * Load heat zones from API
   */
  async loadHeatZones(): Promise<HeatZone[]> {
    try {
      // Mock data - in production, this would fetch from your backend
      const mockZones = this.generateMockHeatZones();
      this.heatZones = mockZones;
      return mockZones;
    } catch (error) {
      console.error('Failed to load heat zones:', error);
      return [];
    }
  }

  /**
   * Get all heat zones
   */
  getAllHeatZones(): HeatZone[] {
    return this.heatZones;
  }

  /**
   * Get heat zones within radius of a location
   */
  getHeatZonesInRadius(
    centerLat: number, 
    centerLng: number, 
    radius: number = 5000
  ): HeatZone[] {
    return this.heatZones.filter(zone => {
      const distance = LocationService.calculateDistance(
        centerLat,
        centerLng,
        zone.center.latitude,
        zone.center.longitude
      );
      return distance <= radius;
    });
  }

  /**
   * Get heat zones by type
   */
  getHeatZonesByType(type: HeatZone['type']): HeatZone[] {
    return this.heatZones.filter(zone => zone.type === type);
  }

  /**
   * Update heat zone intensity based on activity
   */
  updateZoneIntensity(zoneId: string, newIntensity: number): void {
    const zone = this.heatZones.find(z => z.id === zoneId);
    if (zone) {
      zone.intensity = Math.max(0, Math.min(1, newIntensity));
      zone.metadata = {
        ...zone.metadata,
        lastActivity: new Date(),
      };
    }
  }

  /**
   * Create a new heat zone (admin function)
   */
  createHeatZone(zone: Omit<HeatZone, 'id'>): HeatZone {
    const newZone: HeatZone = {
      ...zone,
      id: `heat_zone_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    };
    
    this.heatZones.push(newZone);
    return newZone;
  }

  /**
   * Remove a heat zone (admin function)
   */
  removeHeatZone(zoneId: string): boolean {
    const index = this.heatZones.findIndex(z => z.id === zoneId);
    if (index !== -1) {
      this.heatZones.splice(index, 1);
      return true;
    }
    return false;
  }

  /**
   * Get analytics for heat zones
   */
  getAnalytics(): HeatZoneAnalytics {
    const totalZones = this.heatZones.length;
    const activeHotspots = this.heatZones.filter(z => z.type === 'trash_hotspot' && z.intensity > 0.5).length;
    const cleanedAreas = this.heatZones.filter(z => z.type === 'cleanup_success').length;
    const sponsorZones = this.heatZones.filter(z => z.type === 'sponsor_zone').length;
    const averageIntensity = totalZones > 0 
      ? this.heatZones.reduce((sum, z) => sum + z.intensity, 0) / totalZones 
      : 0;

    return {
      totalZones,
      activeHotspots,
      cleanedAreas,
      sponsorZones,
      averageIntensity,
    };
  }

  /**
   * Start periodic updates for dynamic heat zones
   */
  private startPeriodicUpdates(): void {
    this.updateInterval = setInterval(() => {
      this.updateDynamicZones();
    }, 30000); // Update every 30 seconds
  }

  /**
   * Stop periodic updates
   */
  stopUpdates(): void {
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
      this.updateInterval = null;
    }
  }

  /**
   * Update dynamic zones based on real-time data
   */
  private updateDynamicZones(): void {
    // Simulate dynamic intensity changes
    this.heatZones.forEach(zone => {
      if (zone.type === 'trash_hotspot' || zone.type === 'high_activity') {
        // Random intensity fluctuation for demo
        const change = (Math.random() - 0.5) * 0.1;
        zone.intensity = Math.max(0, Math.min(1, zone.intensity + change));
      }
    });
  }

  /**
   * Generate mock heat zones for testing
   */
  private generateMockHeatZones(): HeatZone[] {
    const zones: HeatZone[] = [];
    const currentLocation = LocationService.getCurrentLocation();
    
    if (!currentLocation) {
      // Default to San Francisco if no location
      return this.generateDefaultHeatZones();
    }

    const { latitude, longitude } = currentLocation;
    const zoneTypes: HeatZone['type'][] = ['trash_hotspot', 'cleanup_success', 'sponsor_zone', 'high_activity'];

    // Generate 8-12 heat zones around current location
    const zoneCount = 8 + Math.floor(Math.random() * 5);
    
    for (let i = 0; i < zoneCount; i++) {
      const angle = Math.random() * 2 * Math.PI;
      const distance = 500 + Math.random() * 3000; // 500m to 3.5km
      const latOffset = (distance * Math.cos(angle)) / 111000;
      const lngOffset = (distance * Math.sin(angle)) / (111000 * Math.cos(latitude * Math.PI / 180));

      const type = zoneTypes[Math.floor(Math.random() * zoneTypes.length)];
      const intensity = Math.random();

      zones.push({
        id: `heat_zone_${i + 1}`,
        center: {
          latitude: latitude + latOffset,
          longitude: longitude + lngOffset,
        },
        radius: 200 + Math.random() * 800, // 200m to 1km radius
        intensity,
        type,
        metadata: {
          missionCount: Math.floor(Math.random() * 10),
          lastActivity: new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000),
          ...(type === 'sponsor_zone' && {
            sponsorInfo: {
              name: `Sponsor ${i + 1}`,
              color: `#${Math.floor(Math.random()*16777215).toString(16)}`,
            },
          }),
        },
      });
    }

    return zones;
  }

  /**
   * Generate default heat zones for San Francisco
   */
  private generateDefaultHeatZones(): HeatZone[] {
    return [
      {
        id: 'sf_hotspot_1',
        center: { latitude: 37.7749, longitude: -122.4194 },
        radius: 500,
        intensity: 0.8,
        type: 'trash_hotspot',
        metadata: {
          missionCount: 5,
          lastActivity: new Date(),
        },
      },
      {
        id: 'sf_cleanup_1',
        center: { latitude: 37.7849, longitude: -122.4094 },
        radius: 300,
        intensity: 0.6,
        type: 'cleanup_success',
        metadata: {
          missionCount: 3,
          lastActivity: new Date(Date.now() - 2 * 60 * 60 * 1000),
        },
      },
      {
        id: 'sf_sponsor_1',
        center: { latitude: 37.7649, longitude: -122.4294 },
        radius: 400,
        intensity: 0.4,
        type: 'sponsor_zone',
        metadata: {
          missionCount: 2,
          lastActivity: new Date(Date.now() - 30 * 60 * 1000),
          sponsorInfo: {
            name: 'EcoCorp',
            color: '#4CAF50',
          },
        },
      },
    ];
  }
}

export default HeatZoneService.getInstance();
