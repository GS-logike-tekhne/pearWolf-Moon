import LocationService from './locationService';
import { MissionPin } from './liveMapService';

export interface LiveUser {
  id: string;
  username: string;
  role: string;
  location: {
    latitude: number;
    longitude: number;
    accuracy: number;
    timestamp: Date;
  };
  status: 'idle' | 'traveling' | 'working' | 'completed' | 'offline';
  currentMission?: {
    id: string;
    title: string;
    progress: number; // 0-100
    startTime: Date;
  };
  avatar?: string;
  level?: number;
  xp?: number;
  isVisible: boolean; // Privacy setting
  lastSeen: Date;
}

export interface UserActivity {
  userId: string;
  activity: 'mission_started' | 'mission_completed' | 'location_updated' | 'status_changed';
  timestamp: Date;
  data?: any;
}

export interface LiveUserAnalytics {
  totalUsers: number;
  activeUsers: number;
  usersByStatus: Record<LiveUser['status'], number>;
  usersByRole: Record<string, number>;
  averageActivityLevel: number;
}

export class RealTimeUserService {
  private static instance: RealTimeUserService;
  private liveUsers: Map<string, LiveUser> = new Map();
  private userActivities: UserActivity[] = [];
  private updateInterval: NodeJS.Timeout | null = null;
  private eventCallbacks: Map<string, (user: LiveUser) => void> = new Map();
  private activityCallbacks: Map<string, (activity: UserActivity) => void> = new Map();
  private currentUserId: string | null = null;
  
  public static getInstance(): RealTimeUserService {
    if (!RealTimeUserService.instance) {
      RealTimeUserService.instance = new RealTimeUserService();
    }
    return RealTimeUserService.instance;
  }

  /**
   * Initialize real-time user tracking
   */
  async initialize(currentUserId: string): Promise<void> {
    this.currentUserId = currentUserId;
    await this.loadLiveUsers();
    this.startRealTimeUpdates();
  }

  /**
   * Load live users from API
   */
  async loadLiveUsers(): Promise<LiveUser[]> {
    try {
      // Mock data - in production, this would fetch from your backend
      const mockUsers = this.generateMockLiveUsers();
      mockUsers.forEach(user => {
        this.liveUsers.set(user.id, user);
      });
      return mockUsers;
    } catch (error) {
      console.error('Failed to load live users:', error);
      return [];
    }
  }

  /**
   * Update current user's location and status
   */
  updateCurrentUserStatus(
    status: LiveUser['status'],
    currentMission?: LiveUser['currentMission']
  ): void {
    if (!this.currentUserId) return;

    const currentLocation = LocationService.getCurrentLocation();
    if (!currentLocation) return;

    const user = this.liveUsers.get(this.currentUserId);
    if (user) {
      user.location = {
        latitude: currentLocation.latitude,
        longitude: currentLocation.longitude,
        accuracy: currentLocation.accuracy,
        timestamp: new Date(),
      };
      user.status = status;
      user.currentMission = currentMission;
      user.lastSeen = new Date();

      this.liveUsers.set(this.currentUserId, user);
      this.triggerUserUpdate(user);
      this.recordActivity({
        userId: this.currentUserId,
        activity: 'status_changed',
        timestamp: new Date(),
        data: { status, currentMission },
      });
    }
  }

  /**
   * Update current user's location
   */
  updateCurrentUserLocation(): void {
    if (!this.currentUserId) return;

    const currentLocation = LocationService.getCurrentLocation();
    if (!currentLocation) return;

    const user = this.liveUsers.get(this.currentUserId);
    if (user) {
      user.location = {
        latitude: currentLocation.latitude,
        longitude: currentLocation.longitude,
        accuracy: currentLocation.accuracy,
        timestamp: new Date(),
      };
      user.lastSeen = new Date();

      this.liveUsers.set(this.currentUserId, user);
      this.triggerUserUpdate(user);
      this.recordActivity({
        userId: this.currentUserId,
        activity: 'location_updated',
        timestamp: new Date(),
        data: { location: user.location },
      });
    }
  }

  /**
   * Start a mission for current user
   */
  startMission(mission: MissionPin): void {
    if (!this.currentUserId) return;

    const user = this.liveUsers.get(this.currentUserId);
    if (user) {
      user.status = 'working';
      user.currentMission = {
        id: mission.id,
        title: mission.title,
        progress: 0,
        startTime: new Date(),
      };

      this.liveUsers.set(this.currentUserId, user);
      this.triggerUserUpdate(user);
      this.recordActivity({
        userId: this.currentUserId,
        activity: 'mission_started',
        timestamp: new Date(),
        data: { mission },
      });
    }
  }

  /**
   * Complete a mission for current user
   */
  completeMission(missionId: string): void {
    if (!this.currentUserId) return;

    const user = this.liveUsers.get(this.currentUserId);
    if (user && user.currentMission?.id === missionId) {
      user.status = 'completed';
      user.currentMission = undefined;

      this.liveUsers.set(this.currentUserId, user);
      this.triggerUserUpdate(user);
      this.recordActivity({
        userId: this.currentUserId,
        activity: 'mission_completed',
        timestamp: new Date(),
        data: { missionId },
      });
    }
  }

  /**
   * Get all live users
   */
  getAllLiveUsers(): LiveUser[] {
    return Array.from(this.liveUsers.values()).filter(user => user.isVisible);
  }

  /**
   * Get live users within radius
   */
  getLiveUsersInRadius(
    centerLat: number,
    centerLng: number,
    radius: number = 1000
  ): LiveUser[] {
    return this.getAllLiveUsers().filter(user => {
      const distance = LocationService.calculateDistance(
        centerLat,
        centerLng,
        user.location.latitude,
        user.location.longitude
      );
      return distance <= radius;
    });
  }

  /**
   * Get live users by status
   */
  getLiveUsersByStatus(status: LiveUser['status']): LiveUser[] {
    return this.getAllLiveUsers().filter(user => user.status === status);
  }

  /**
   * Get live users by role
   */
  getLiveUsersByRole(role: string): LiveUser[] {
    return this.getAllLiveUsers().filter(user => user.role === role);
  }

  /**
   * Get user by ID
   */
  getLiveUser(userId: string): LiveUser | undefined {
    return this.liveUsers.get(userId);
  }

  /**
   * Get analytics for live users
   */
  getAnalytics(): LiveUserAnalytics {
    const allUsers = this.getAllLiveUsers();
    const totalUsers = allUsers.length;
    const activeUsers = allUsers.filter(u => u.status !== 'offline').length;

    const usersByStatus = allUsers.reduce((acc, user) => {
      acc[user.status] = (acc[user.status] || 0) + 1;
      return acc;
    }, {} as Record<LiveUser['status'], number>);

    const usersByRole = allUsers.reduce((acc, user) => {
      acc[user.role] = (acc[user.role] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const averageActivityLevel = totalUsers > 0 
      ? allUsers.reduce((sum, user) => {
          const activityScore = user.status === 'working' ? 1 : 
                               user.status === 'traveling' ? 0.7 :
                               user.status === 'completed' ? 0.5 : 0.2;
          return sum + activityScore;
        }, 0) / totalUsers
      : 0;

    return {
      totalUsers,
      activeUsers,
      usersByStatus,
      usersByRole,
      averageActivityLevel,
    };
  }

  /**
   * Register callback for user updates
   */
  onUserUpdate(callback: (user: LiveUser) => void): string {
    const callbackId = `user_callback_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    this.eventCallbacks.set(callbackId, callback);
    return callbackId;
  }

  /**
   * Register callback for user activities
   */
  onUserActivity(callback: (activity: UserActivity) => void): string {
    const callbackId = `activity_callback_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    this.activityCallbacks.set(callbackId, callback);
    return callbackId;
  }

  /**
   * Unregister user update callback
   */
  removeUserUpdateCallback(callbackId: string): void {
    this.eventCallbacks.delete(callbackId);
  }

  /**
   * Unregister user activity callback
   */
  removeUserActivityCallback(callbackId: string): void {
    this.activityCallbacks.delete(callbackId);
  }

  /**
   * Start real-time updates
   */
  private startRealTimeUpdates(): void {
    this.updateInterval = setInterval(() => {
      this.updateUserLocations();
      this.cleanupInactiveUsers();
    }, 5000); // Update every 5 seconds
  }

  /**
   * Stop real-time updates
   */
  stopRealTimeUpdates(): void {
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
      this.updateInterval = null;
    }
  }

  /**
   * Update user locations (simulate movement for demo)
   */
  private updateUserLocations(): void {
    this.liveUsers.forEach((user, userId) => {
      if (userId === this.currentUserId) return; // Skip current user

      // Simulate user movement for demo
      if (user.status === 'traveling' || user.status === 'working') {
        const movement = 0.0001; // Small movement
        const angle = Math.random() * 2 * Math.PI;
        
        user.location.latitude += movement * Math.cos(angle);
        user.location.longitude += movement * Math.sin(angle);
        user.location.timestamp = new Date();
        user.lastSeen = new Date();

        this.liveUsers.set(userId, user);
        this.triggerUserUpdate(user);
      }
    });
  }

  /**
   * Clean up inactive users
   */
  private cleanupInactiveUsers(): void {
    const now = new Date();
    const inactiveThreshold = 5 * 60 * 1000; // 5 minutes

    this.liveUsers.forEach((user, userId) => {
      if (userId === this.currentUserId) return; // Keep current user

      const timeSinceLastSeen = now.getTime() - user.lastSeen.getTime();
      if (timeSinceLastSeen > inactiveThreshold) {
        user.status = 'offline';
        this.liveUsers.set(userId, user);
        this.triggerUserUpdate(user);
      }
    });
  }

  /**
   * Trigger user update to all registered callbacks
   */
  private triggerUserUpdate(user: LiveUser): void {
    this.eventCallbacks.forEach(callback => {
      try {
        callback(user);
      } catch (error) {
        console.error('Error in user update callback:', error);
      }
    });
  }

  /**
   * Record user activity
   */
  private recordActivity(activity: UserActivity): void {
    this.userActivities.push(activity);
    
    // Keep only last 100 activities
    if (this.userActivities.length > 100) {
      this.userActivities = this.userActivities.slice(-100);
    }

    // Notify activity callbacks
    this.activityCallbacks.forEach(callback => {
      try {
        callback(activity);
      } catch (error) {
        console.error('Error in activity callback:', error);
      }
    });
  }

  /**
   * Generate mock live users for testing
   */
  private generateMockLiveUsers(): LiveUser[] {
    const users: LiveUser[] = [];
    const currentLocation = LocationService.getCurrentLocation();
    
    if (!currentLocation) {
      return this.generateDefaultLiveUsers();
    }

    const { latitude, longitude } = currentLocation;
    const roles = ['trash-hero', 'impact-warrior', 'eco-defender'];
    const statuses: LiveUser['status'][] = ['idle', 'traveling', 'working', 'completed'];
    const usernames = ['EcoWarrior', 'CleanUpKing', 'GreenHero', 'TrashBuster', 'EcoChampion'];

    // Generate 5-8 mock users
    const userCount = 5 + Math.floor(Math.random() * 4);
    
    for (let i = 0; i < userCount; i++) {
      const angle = Math.random() * 2 * Math.PI;
      const distance = 100 + Math.random() * 2000; // 100m to 2km
      const latOffset = (distance * Math.cos(angle)) / 111000;
      const lngOffset = (distance * Math.sin(angle)) / (111000 * Math.cos(latitude * Math.PI / 180));

      const status = statuses[Math.floor(Math.random() * statuses.length)];
      const role = roles[Math.floor(Math.random() * roles.length)];

      users.push({
        id: `user_${i + 1}`,
        username: usernames[i] || `User${i + 1}`,
        role,
        location: {
          latitude: latitude + latOffset,
          longitude: longitude + lngOffset,
          accuracy: 10 + Math.random() * 20,
          timestamp: new Date(),
        },
        status,
        currentMission: status === 'working' ? {
          id: `mission_${i + 1}`,
          title: `Cleanup Mission ${i + 1}`,
          progress: Math.floor(Math.random() * 100),
          startTime: new Date(Date.now() - Math.random() * 30 * 60 * 1000),
        } : undefined,
        level: 1 + Math.floor(Math.random() * 20),
        xp: Math.floor(Math.random() * 5000),
        isVisible: true,
        lastSeen: new Date(),
      });
    }

    return users;
  }

  /**
   * Generate default live users for San Francisco
   */
  private generateDefaultLiveUsers(): LiveUser[] {
    return [
      {
        id: 'user_1',
        username: 'EcoWarrior',
        role: 'trash-hero',
        location: {
          latitude: 37.7749,
          longitude: -122.4194,
          accuracy: 15,
          timestamp: new Date(),
        },
        status: 'working',
        currentMission: {
          id: 'mission_1',
          title: 'Downtown Cleanup',
          progress: 65,
          startTime: new Date(Date.now() - 20 * 60 * 1000),
        },
        level: 12,
        xp: 2450,
        isVisible: true,
        lastSeen: new Date(),
      },
      {
        id: 'user_2',
        username: 'GreenHero',
        role: 'impact-warrior',
        location: {
          latitude: 37.7849,
          longitude: -122.4094,
          accuracy: 12,
          timestamp: new Date(),
        },
        status: 'traveling',
        level: 8,
        xp: 1800,
        isVisible: true,
        lastSeen: new Date(),
      },
    ];
  }
}

export default RealTimeUserService.getInstance();
