import { useState, useCallback } from 'react';
import { useXP } from '../context/XPContext';
import { useAuth } from '../context/AuthContext';
import { EcoStation, StationMission, mockEcoStations, mockStationMissions } from '../utils/mockData';
import { normalizeRole } from '../types/roles';

interface StationResult {
  xpEarned: number;
  ecoPointsEarned: number;
  badgeProgress?: string;
  missionCompleted?: boolean;
}

export const useEcoStations = () => {
  const { addXP } = useXP();
  const { currentRole } = useAuth();
  const [completedStations, setCompletedStations] = useState<string[]>([]);
  const [completedMissions, setCompletedMissions] = useState<string[]>([]);

  // Get stations available to current user role
  const getAvailableStations = useCallback((): EcoStation[] => {
    return mockEcoStations.filter(station => {
      // Show all stations if no role restriction or if user has required role
      if (!station.requiredRole || normalizeRole(currentRole) === normalizeRole(station.requiredRole)) {
        return station.isActive;
      }
      return false;
    });
  }, [currentRole]);

  // Get missions for a specific station
  const getStationMissions = useCallback((stationId: string): StationMission[] => {
    return mockStationMissions.filter(mission => mission.stationId === stationId);
  }, []);

  // Check if user can access a station
  const canAccessStation = useCallback((station: EcoStation): boolean => {
    if (!station.requiredRole) return true;
    return normalizeRole(currentRole) === normalizeRole(station.requiredRole);
  }, [currentRole]);

  // Complete a station mission
  const completeStationMission = useCallback((mission: StationMission): StationResult => {
    // Check if already completed
    if (completedMissions.includes(mission.id)) {
      throw new Error('Mission already completed');
    }

    // Award XP and Eco Points
    addXP(mission.xpReward, 'eco_station_mission');
    
    // Mark as completed
    setCompletedMissions(prev => [...prev, mission.id]);

    // Determine badge progress
    let badgeProgress: string | undefined;
    const station = mockEcoStations.find(s => s.id === mission.stationId);
    
    if (station?.badgeReward) {
      // Check if this is the first completion for this badge
      const stationMissions = getStationMissions(mission.stationId);
      const completedStationMissions = completedMissions.filter(id => 
        stationMissions.some(m => m.id === id)
      );
      
      if (completedStationMissions.length === 0) {
        badgeProgress = `${station.badgeReward} Badge Unlocked!`;
      }
    }

    return {
      xpEarned: mission.xpReward,
      ecoPointsEarned: mission.ecoPointsReward,
      badgeProgress,
      missionCompleted: true
    };
  }, [addXP, completedMissions, getStationMissions]);

  // Complete a station (for PEARthquake events)
  const completeStation = useCallback((station: EcoStation): StationResult => {
    // Check if already completed
    if (completedStations.includes(station.id)) {
      throw new Error('Station already completed');
    }

    // Award XP and Eco Points
    addXP(station.xpReward, 'eco_station_complete');
    
    // Mark as completed
    setCompletedStations(prev => [...prev, station.id]);

    // Determine badge progress
    let badgeProgress: string | undefined;
    if (station.badgeReward && !completedStations.includes(station.id)) {
      badgeProgress = `${station.badgeReward} Badge Unlocked!`;
    }

    return {
      xpEarned: station.xpReward,
      ecoPointsEarned: station.ecoPointsReward,
      badgeProgress
    };
  }, [addXP, completedStations]);

  // Get user's station progress
  const getStationProgress = useCallback((stationId: string) => {
    const station = mockEcoStations.find(s => s.id === stationId);
    const missions = getStationMissions(stationId);
    const completedStationMissions = missions.filter(m => completedMissions.includes(m.id));
    
    return {
      totalMissions: missions.length,
      completedMissions: completedStationMissions.length,
      progress: missions.length > 0 ? (completedStationMissions.length / missions.length) * 100 : 0,
      isCompleted: completedStations.includes(stationId)
    };
  }, [getStationMissions, completedMissions, completedStations]);

  // Get user's overall station stats
  const getUserStationStats = useCallback(() => {
    const availableStations = getAvailableStations();
    const completedStationCount = availableStations.filter(s => completedStations.includes(s.id)).length;
    const totalMissions = availableStations.reduce((sum, station) => {
      return sum + getStationMissions(station.id).length;
    }, 0);
    const completedMissionCount = completedMissions.length;
    
    return {
      stationsAvailable: availableStations.length,
      stationsCompleted: completedStationCount,
      missionsTotal: totalMissions,
      missionsCompleted: completedMissionCount,
      overallProgress: availableStations.length > 0 ? (completedStationCount / availableStations.length) * 100 : 0
    };
  }, [getAvailableStations, getStationMissions, completedStations, completedMissions]);

  return {
    getAvailableStations,
    getStationMissions,
    canAccessStation,
    completeStationMission,
    completeStation,
    getStationProgress,
    getUserStationStats,
    completedStations,
    completedMissions
  };
};
