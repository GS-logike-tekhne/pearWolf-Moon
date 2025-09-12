import { MissionPin } from './liveMapService';
import LocationService from './locationService';

export class MissionPinService {
  private static instance: MissionPinService;
  private missionPins: MissionPin[] = [];
  
  public static getInstance(): MissionPinService {
    if (!MissionPinService.instance) {
      MissionPinService.instance = new MissionPinService();
    }
    return MissionPinService.instance;
  }

  /**
   * Load mission pins from API
   */
  async loadMissionPins(centerLat: number, centerLng: number, radius: number = 5000): Promise<MissionPin[]> {
    try {
      // Mock API call - in production, this would fetch from your backend
      const mockMissions = this.generateMockMissions(centerLat, centerLng, radius);
      
      // Calculate distances from user location
      const currentLocation = LocationService.getCurrentLocation();
      if (currentLocation) {
        mockMissions.forEach(mission => {
          mission.distance = LocationService.calculateDistance(
            currentLocation.latitude,
            currentLocation.longitude,
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
    const currentLocation = LocationService.getCurrentLocation();
    if (!currentLocation) return [];

    return this.missionPins.filter(mission => {
      const distance = LocationService.calculateDistance(
        currentLocation.latitude,
        currentLocation.longitude,
        mission.location.latitude,
        mission.location.longitude
      );
      return distance <= radius;
    });
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
}

export default MissionPinService.getInstance();
