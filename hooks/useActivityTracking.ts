import { useState, useEffect, useCallback } from 'react';
import ActivityTrackingService, { 
  MissionEfficiencySummary, 
  MissionTrackingData 
} from '../services/activityTrackingService';

export interface ActivityTrackingHook {
  // Current mission data
  efficiencySummary: MissionEfficiencySummary;
  isTracking: boolean;
  currentMission: MissionTrackingData | null;
  
  // Mission tracking functions
  startMissionTracking: (missionId: string) => Promise<boolean>;
  stopMissionTracking: (trashCollectedKg: number, ecoPointsEarned: number) => Promise<MissionTrackingData | null>;
  
  // Data retrieval functions
  refreshEfficiencySummary: () => Promise<void>;
  
  // Gamification helpers
  getEfficiencyBonus: (missionData: MissionTrackingData) => number;
  getMissionStats: () => { missionsCompleted: number; totalDistance: number; efficiencyScore: number };
}

export const useActivityTracking = (): ActivityTrackingHook => {
  const [efficiencySummary, setEfficiencySummary] = useState<MissionEfficiencySummary>({
    totalMissionsCompleted: 0,
    totalDistanceKm: 0,
    totalDurationMin: 0,
    averageSpeedKmH: 0,
    totalTrashCollectedKg: 0,
    averageEfficiencyScore: 0,
    ecoPointsPerKm: 0,
    timePerKgTrash: 0,
  });
  
  const [isTracking, setIsTracking] = useState(false);
  const [currentMission, setCurrentMission] = useState<MissionTrackingData | null>(null);

  // Initialize efficiency summary
  useEffect(() => {
    refreshEfficiencySummary();
  }, []);

  const refreshEfficiencySummary = useCallback(async () => {
    try {
      const summary = await ActivityTrackingService.getMissionEfficiencySummary();
      setEfficiencySummary(summary);
      setIsTracking(ActivityTrackingService.isCurrentlyTracking());
      setCurrentMission(ActivityTrackingService.getCurrentMission());
    } catch (error) {
      console.error('Failed to refresh efficiency summary:', error);
    }
  }, []);

  const startMissionTracking = useCallback(async (missionId: string): Promise<boolean> => {
    try {
      const success = await ActivityTrackingService.startMissionTracking(missionId);
      if (success) {
        setIsTracking(true);
        setCurrentMission(ActivityTrackingService.getCurrentMission());
      }
      return success;
    } catch (error) {
      console.error('Failed to start mission tracking:', error);
      return false;
    }
  }, []);

  const stopMissionTracking = useCallback(async (trashCollectedKg: number, ecoPointsEarned: number): Promise<MissionTrackingData | null> => {
    try {
      const missionData = await ActivityTrackingService.stopMissionTracking(trashCollectedKg, ecoPointsEarned);
      if (missionData) {
        setIsTracking(false);
        setCurrentMission(null);
        // Refresh summary to include new mission data
        await refreshEfficiencySummary();
      }
      return missionData;
    } catch (error) {
      console.error('Failed to stop mission tracking:', error);
      return null;
    }
  }, [refreshEfficiencySummary]);

  const getEfficiencyBonus = useCallback((missionData: MissionTrackingData): number => {
    return ActivityTrackingService.calculateEfficiencyBonus(missionData);
  }, []);

  const getMissionStats = useCallback(() => {
    return {
      missionsCompleted: efficiencySummary.totalMissionsCompleted,
      totalDistance: efficiencySummary.totalDistanceKm,
      efficiencyScore: efficiencySummary.averageEfficiencyScore,
    };
  }, [efficiencySummary]);

  return {
    efficiencySummary,
    isTracking,
    currentMission,
    startMissionTracking,
    stopMissionTracking,
    refreshEfficiencySummary,
    getEfficiencyBonus,
    getMissionStats,
  };
};
