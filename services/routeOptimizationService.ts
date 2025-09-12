import LocationService from './locationService';
import MissionPinService from './missionPinService';
import { MissionPin } from './liveMapService';

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

export class RouteOptimizationService {
  private static instance: RouteOptimizationService;
  
  public static getInstance(): RouteOptimizationService {
    if (!RouteOptimizationService.instance) {
      RouteOptimizationService.instance = new RouteOptimizationService();
    }
    return RouteOptimizationService.instance;
  }

  /**
   * Optimize route for multiple missions
   */
  optimizeRoute(missionIds: string[]): RouteOptimization | null {
    const currentLocation = LocationService.getCurrentLocation();
    if (!currentLocation || missionIds.length === 0) return null;

    const missions = MissionPinService.getAllMissionPins().filter(mission => missionIds.includes(mission.id));
    if (missions.length === 0) return null;

    // Simple route optimization - in production, use proper TSP algorithm
    const optimizedOrder = this.nearestNeighborRoute(currentLocation, missions);
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
  private nearestNeighborRoute(startLocation: any, missions: MissionPin[]): string[] {
    const route: string[] = [];
    const unvisited = [...missions];
    let currentLocation = startLocation;

    while (unvisited.length > 0) {
      let nearestIndex = 0;
      let nearestDistance = LocationService.calculateDistance(
        currentLocation.latitude,
        currentLocation.longitude,
        unvisited[0].location.latitude,
        unvisited[0].location.longitude
      );

      for (let i = 1; i < unvisited.length; i++) {
        const distance = LocationService.calculateDistance(
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
   * Calculate route distance
   */
  private calculateRouteDistance(waypoints: Array<{latitude: number, longitude: number}>): number {
    let totalDistance = 0;
    for (let i = 0; i < waypoints.length - 1; i++) {
      totalDistance += LocationService.calculateDistance(
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
   * Get optimized route for nearby missions
   */
  getOptimizedRouteForNearby(radius: number = 1000): RouteOptimization | null {
    const nearbyMissions = MissionPinService.getMissionPinsInRadius(radius);
    const missionIds = nearbyMissions.map(mission => mission.id);
    
    return this.optimizeRoute(missionIds);
  }

  /**
   * Calculate route efficiency score
   */
  calculateRouteEfficiency(route: RouteOptimization): number {
    // Simple efficiency calculation based on distance and time
    const maxDistance = 5000; // 5km
    const maxTime = 4 * 60 * 60; // 4 hours
    
    const distanceScore = Math.max(0, (maxDistance - route.totalDistance) / maxDistance);
    const timeScore = Math.max(0, (maxTime - route.estimatedTime) / maxTime);
    
    return (distanceScore + timeScore) / 2 * 100;
  }
}

export default RouteOptimizationService.getInstance();
