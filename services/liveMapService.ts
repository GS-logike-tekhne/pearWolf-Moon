import LocationService from './locationService';
import MissionPinService from './missionPinService';
import ProximityService from './proximityService';
import RouteOptimizationService from './routeOptimizationService';
import { MissionPin } from './missionPinService';
import { UserLocation } from './locationService';
import { ProximityAlert } from './proximityService';
import { RouteOptimization } from './routeOptimizationService';

export { MissionPin, UserLocation, ProximityAlert, RouteOptimization };

export class LiveMapService {
  private static instance: LiveMapService;
  
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
    const locationInitialized = await LocationService.initializeLocationTracking();
    
    if (locationInitialized) {
      // Set up proximity checking
      ProximityService.onProximityAlert = (alert) => {
        this.onProximityAlert?.(alert);
      };
    }
    
    return locationInitialized;
  }

  /**
   * Stop location tracking
   */
  stopLocationTracking(): void {
    LocationService.stopLocationTracking();
  }

  /**
   * Get current user location
   */
  getCurrentLocation(): UserLocation | null {
    return LocationService.getCurrentLocation();
  }

  /**
   * Load mission pins from API
   */
  async loadMissionPins(centerLat: number, centerLng: number, radius: number = 5000): Promise<MissionPin[]> {
    return MissionPinService.loadMissionPins(centerLat, centerLng, radius);
  }

  /**
   * Get mission pins within radius
   */
  getMissionPinsInRadius(radius: number = 1000): MissionPin[] {
    return MissionPinService.getMissionPinsInRadius(radius);
  }

  /**
   * Get proximity alerts
   */
  getProximityAlerts(): ProximityAlert[] {
    return ProximityService.getProximityAlerts();
  }

  /**
   * Acknowledge proximity alert
   */
  acknowledgeAlert(alertId: string): void {
    ProximityService.acknowledgeAlert(alertId);
  }

  /**
   * Optimize route for multiple missions
   */
  optimizeRoute(missionIds: string[]): RouteOptimization | null {
    return RouteOptimizationService.optimizeRoute(missionIds);
  }

  /**
   * Update mission status
   */
  updateMissionStatus(missionId: string, status: MissionPin['status']): void {
    MissionPinService.updateMissionStatus(missionId, status);
  }

  /**
   * Get mission by ID
   */
  getMission(missionId: string): MissionPin | undefined {
    return MissionPinService.getMission(missionId);
  }

  /**
   * Get all mission pins
   */
  getAllMissionPins(): MissionPin[] {
    return MissionPinService.getAllMissionPins();
  }

  /**
   * Proximity alert callback
   */
  onProximityAlert?: (alert: ProximityAlert) => void;
}

export default LiveMapService.getInstance();
