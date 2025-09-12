import LocationService from './locationService';
import MissionPinService from './missionPinService';
import { MissionPin } from './liveMapService';

export interface ProximityAlert {
  id: string;
  missionId: string;
  distance: number;
  type: 'mission_nearby' | 'mission_entered' | 'mission_exited';
  timestamp: Date;
  acknowledged: boolean;
}

export class ProximityService {
  private static instance: ProximityService;
  private proximityThreshold = 150; // meters
  private proximityAlerts: ProximityAlert[] = [];
  
  public static getInstance(): ProximityService {
    if (!ProximityService.instance) {
      ProximityService.instance = new ProximityService();
    }
    return ProximityService.instance;
  }

  /**
   * Check for proximity alerts
   */
  checkProximityAlerts(): void {
    const currentLocation = LocationService.getCurrentLocation();
    if (!currentLocation) return;

    const missionPins = MissionPinService.getAllMissionPins();

    missionPins.forEach(mission => {
      const distance = LocationService.calculateDistance(
        currentLocation.latitude,
        currentLocation.longitude,
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
   * Set proximity threshold
   */
  setProximityThreshold(threshold: number): void {
    this.proximityThreshold = threshold;
  }

  /**
   * Get proximity threshold
   */
  getProximityThreshold(): number {
    return this.proximityThreshold;
  }

  /**
   * Clear all alerts
   */
  clearAlerts(): void {
    this.proximityAlerts = [];
  }

  /**
   * Get alerts for specific mission
   */
  getMissionAlerts(missionId: string): ProximityAlert[] {
    return this.proximityAlerts.filter(alert => alert.missionId === missionId);
  }
}

export default ProximityService.getInstance();
