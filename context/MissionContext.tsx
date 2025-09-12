import React, { createContext, useContext, useReducer, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Mission, MissionCompletion, MissionStatus } from '../types/missions';

// Define MissionProgress interface locally since it's not exported from types
interface MissionProgress {
  missionId: string;
  progress: number;
  timeRemaining?: number;
  stepsCompleted: string[];
  currentStep?: string;
}
import { useXP } from './XPContext';

interface MissionState {
  availableMissions: Mission[];
  activeMissions: Mission[];
  completedMissions: Mission[];
  missionProgress: { [missionId: string]: MissionProgress };
  userEcoPoints: number;
}

interface MissionContextType {
  state: MissionState;
  acceptMission: (missionId: string) => void;
  completeMission: (missionId: string) => void;
  boostMission: (missionId: string, boostCost: number) => void;
  joinMission: (missionId: string, userId: string) => void;
  updateMissionProgress: (missionId: string, progress: number, currentStep?: string) => void;
  refreshMissions: () => void;
}

type MissionAction = 
  | { type: 'LOAD_MISSIONS'; payload: Partial<MissionState> }
  | { type: 'ACCEPT_MISSION'; payload: { missionId: string } }
  | { type: 'COMPLETE_MISSION'; payload: { missionId: string; completion: MissionCompletion } }
  | { type: 'BOOST_MISSION'; payload: { missionId: string; cost: number; timeReduction: number } }
  | { type: 'JOIN_MISSION'; payload: { missionId: string; userId: string } }
  | { type: 'UPDATE_PROGRESS'; payload: { missionId: string; progress: number; currentStep?: string } }
  | { type: 'TICK_TIMERS' }
  | { type: 'SET_ECO_POINTS'; payload: { points: number } };

const initialMissionState: MissionState = {
  availableMissions: [],
  activeMissions: [],
  completedMissions: [],
  missionProgress: {},
  userEcoPoints: 100 // Starting eco-points
};

const missionReducer = (state: MissionState, action: MissionAction): MissionState => {
  switch (action.type) {
    case 'LOAD_MISSIONS':
      return {
        ...state,
        ...action.payload,
      };
    
    case 'ACCEPT_MISSION': {
      const mission = state.availableMissions.find(m => m.id === action.payload.missionId);
      if (!mission) return state;
      
      const updatedMission = {
        ...mission,
        status: 'active' as MissionStatus,
        startedAt: new Date(),
        currentParticipants: mission.currentParticipants + 1
      };
      
      return {
        ...state,
        availableMissions: state.availableMissions.filter(m => m.id !== action.payload.missionId),
        activeMissions: [...state.activeMissions, updatedMission],
        missionProgress: {
          ...state.missionProgress,
          [mission.id]: {
            missionId: mission.id,
            progress: 0,
            timeRemaining: mission.estimatedDuration * 60, // Convert minutes to seconds
            stepsCompleted: []
          }
        }
      };
    }
    
    case 'COMPLETE_MISSION': {
      const mission = state.activeMissions.find(m => m.id === action.payload.missionId);
      if (!mission) return state;
      
      const completedMission = {
        ...mission,
        status: 'completed' as MissionStatus,
        completedAt: action.payload.completion.completedAt
      };
      
      return {
        ...state,
        activeMissions: state.activeMissions.filter(m => m.id !== action.payload.missionId),
        completedMissions: [...state.completedMissions, completedMission],
        userEcoPoints: state.userEcoPoints + mission.ecoPointsReward
      };
    }
    
    case 'BOOST_MISSION': {
      const missionIndex = state.activeMissions.findIndex(m => m.id === action.payload.missionId);
      if (missionIndex === -1 || state.userEcoPoints < action.payload.cost) return state;
      
      const updatedMissions = [...state.activeMissions];
      updatedMissions[missionIndex] = {
        ...updatedMissions[missionIndex],
        // Note: boostUsed and pointsSpentOnBoost are not part of Mission interface
        // These would need to be tracked separately or added to the interface
      };
      
      const currentProgress = state.missionProgress[action.payload.missionId];
      const newTimeRemaining = Math.max(0, (currentProgress?.timeRemaining || 0) - action.payload.timeReduction);
      
      return {
        ...state,
        activeMissions: updatedMissions,
        userEcoPoints: state.userEcoPoints - action.payload.cost,
        missionProgress: {
          ...state.missionProgress,
          [action.payload.missionId]: {
            ...currentProgress,
            timeRemaining: newTimeRemaining
          }
        }
      };
    }
    
    case 'JOIN_MISSION': {
      const missionIndex = state.availableMissions.findIndex(m => m.id === action.payload.missionId);
      if (missionIndex === -1) return state;
      
      const mission = state.availableMissions[missionIndex];
      const updatedParticipants = mission.currentParticipants + 1;
      
      const updatedMissions = [...state.availableMissions];
      updatedMissions[missionIndex] = {
        ...mission,
        currentParticipants: updatedParticipants
      };
      
      return {
        ...state,
        availableMissions: updatedMissions
      };
    }
    
    case 'UPDATE_PROGRESS': {
      return {
        ...state,
        missionProgress: {
          ...state.missionProgress,
          [action.payload.missionId]: {
            ...state.missionProgress[action.payload.missionId],
            progress: action.payload.progress,
            currentStep: action.payload.currentStep
          }
        }
      };
    }
    
    case 'TICK_TIMERS': {
      const updatedProgress = { ...state.missionProgress };
      let missionsToComplete: string[] = [];
      
      Object.keys(updatedProgress).forEach(missionId => {
        const progress = updatedProgress[missionId];
        if (progress.timeRemaining && progress.timeRemaining > 0) {
          updatedProgress[missionId] = {
            ...progress,
            timeRemaining: Math.max(0, progress.timeRemaining - 1),
            progress: Math.min(100, progress.progress + (100 / (progress.timeRemaining || 1)))
          };
          
          if (updatedProgress[missionId].timeRemaining === 0) {
            missionsToComplete.push(missionId);
          }
        }
      });
      
      // Auto-complete missions that have reached 0 time
      let newState = {
        ...state,
        missionProgress: updatedProgress
      };
      
      missionsToComplete.forEach(missionId => {
        const mission = state.activeMissions.find(m => m.id === missionId);
        if (mission) {
          newState = missionReducer(newState, {
            type: 'COMPLETE_MISSION',
            payload: {
              missionId,
              completion: {
                missionId,
                userId: 'current_user',
                completedAt: new Date(),
                xpEarned: mission.xpReward,
                ecoPointsEarned: mission.ecoPointsReward,
                badgesEarned: mission.badgeReward ? [mission.badgeReward] : []
              }
            }
          });
        }
      });
      
      return newState;
    }
    
    case 'SET_ECO_POINTS':
      return {
        ...state,
        userEcoPoints: action.payload.points
      };
    
    default:
      return state;
  }
};

const MissionContext = createContext<MissionContextType | undefined>(undefined);

interface MissionProviderProps {
  children: React.ReactNode;
}

export const MissionProvider: React.FC<MissionProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(missionReducer, initialMissionState);
  const { addXP } = useXP();

  // Load mission data from storage on app start
  useEffect(() => {
    loadMissionData();
    loadInitialMissions();
  }, []);

  // Save mission data whenever state changes
  useEffect(() => {
    saveMissionData();
  }, [state]);

  // Timer tick effect for active missions
  useEffect(() => {
    const interval = setInterval(() => {
      dispatch({ type: 'TICK_TIMERS' });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const loadMissionData = async (): Promise<void> => {
    try {
      const savedData = await AsyncStorage.getItem('mission_data');
      if (savedData) {
        const parsedData = JSON.parse(savedData);
        // Convert date strings back to Date objects
        if (parsedData.activeMissions) {
          parsedData.activeMissions = parsedData.activeMissions.map((mission: any) => ({
            ...mission,
            startedAt: mission.startedAt ? new Date(mission.startedAt) : undefined,
            completedAt: mission.completedAt ? new Date(mission.completedAt) : undefined,
          }));
        }
        dispatch({ type: 'LOAD_MISSIONS', payload: parsedData });
      }
    } catch (error) {
      console.error('Error loading mission data:', error);
    }
  };

  const saveMissionData = async (): Promise<void> => {
    try {
      await AsyncStorage.setItem('mission_data', JSON.stringify(state));
    } catch (error) {
      console.error('Error saving mission data:', error);
    }
  };

  const loadInitialMissions = (): void => {
    // This will be replaced with API call later
    const initialMissions = generateInitialMissions();
    dispatch({ type: 'LOAD_MISSIONS', payload: { availableMissions: initialMissions } });
  };

  const acceptMission = (missionId: string): void => {
    dispatch({ type: 'ACCEPT_MISSION', payload: { missionId } });
  };

  const completeMission = (missionId: string): void => {
    const mission = state.activeMissions.find(m => m.id === missionId);
    if (mission) {
      // Add XP to evolution system
      addXP(mission.xpReward, `Mission: ${mission.title}`);
      
      dispatch({ 
        type: 'COMPLETE_MISSION', 
        payload: { 
          missionId,
          completion: {
            missionId,
            userId: 'current_user',
            completedAt: new Date(),
            xpEarned: mission.xpReward,
            ecoPointsEarned: mission.ecoPointsReward,
            badgesEarned: mission.badgeReward ? [mission.badgeReward] : []
          }
        } 
      });
    }
  };

  const boostMission = (missionId: string, boostCost: number): void => {
    const timeReduction = 600; // 10 minutes in seconds
    dispatch({ 
      type: 'BOOST_MISSION', 
      payload: { missionId, cost: boostCost, timeReduction } 
    });
  };

  const joinMission = (missionId: string, userId: string): void => {
    dispatch({ type: 'JOIN_MISSION', payload: { missionId, userId } });
  };

  const updateMissionProgress = (missionId: string, progress: number, currentStep?: string): void => {
    dispatch({ 
      type: 'UPDATE_PROGRESS', 
      payload: { missionId, progress, currentStep } 
    });
  };

  const refreshMissions = (): void => {
    loadInitialMissions();
  };

  const value: MissionContextType = {
    state,
    acceptMission,
    completeMission,
    boostMission,
    joinMission,
    updateMissionProgress,
    refreshMissions,
  };

  return (
    <MissionContext.Provider value={value}>
      {children}
    </MissionContext.Provider>
  );
};

export const useMissions = (): MissionContextType => {
  const context = useContext(MissionContext);
  if (!context) {
    throw new Error('useMissions must be used within a MissionProvider');
  }
  return context;
};

// Generate initial mock missions for testing
const generateInitialMissions = (): Mission[] => {
  return [
    // Trash Hero Missions
    {
      id: 'cleanup_street_01',
      title: 'Street Cleanup Quest',
      description: 'Pick up litter on your street for 15 minutes and document your impact',
      type: 'cleanup',
      requiredRole: 'trash-hero',
      estimatedDuration: 15, // 15 minutes
      xpReward: 15,
      ecoPointsReward: 10,
      difficulty: 'easy',
      urgency: 'low',
      status: 'available',
      currentParticipants: 0,
      location: {
        name: 'Local Street',
        coordinates: { latitude: 0, longitude: 0 },
        address: 'Your Street'
      },
      startDate: new Date(),
      endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
      progress: { current: 0, target: 1, unit: 'cleanup' },
      instructions: ['Pick up litter', 'Document your work'],
      requiresPhotoVerification: true,
      requiresLocationVerification: true,
      createdBy: 'system',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 'park_restoration_01',
      title: 'Park Restoration Project',
      description: 'Join a 24-hour community effort to restore local park areas',
      type: 'restoration',
      requiredRole: 'trash-hero',
      estimatedDuration: 1440, // 24 hours in minutes
      xpReward: 50,
      ecoPointsReward: 35,
      badgeReward: 'Park Guardian',
      difficulty: 'medium',
      urgency: 'medium',
      status: 'available',
      currentParticipants: 0,
      location: {
        name: 'Local Park',
        coordinates: { latitude: 0, longitude: 0 },
        address: 'Community Park'
      },
      startDate: new Date(),
      endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      progress: { current: 0, target: 1, unit: 'restoration' },
      instructions: ['Join community effort', 'Help restore park areas'],
      requiresPhotoVerification: true,
      requiresLocationVerification: true,
      createdBy: 'system',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    
    // Volunteer/Impact Warrior Missions
    {
      id: 'community_event_01',
      title: 'Organize Eco Workshop',
      description: 'Plan and host an environmental awareness workshop in your community',
      type: 'community-event',
      requiredRole: 'impact-warrior',
      estimatedDuration: 4320, // 3 days in minutes
      xpReward: 75,
      ecoPointsReward: 50,
      badgeReward: 'Community Leader',
      minParticipants: 3,
      maxParticipants: 10,
      difficulty: 'hard',
      urgency: 'high',
      status: 'available',
      currentParticipants: 0,
      location: {
        name: 'Community Center',
        coordinates: { latitude: 0, longitude: 0 },
        address: 'Local Community Center'
      },
      startDate: new Date(),
      endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      progress: { current: 0, target: 1, unit: 'workshop' },
      instructions: ['Plan workshop', 'Host event', 'Document impact'],
      requiresPhotoVerification: true,
      requiresLocationVerification: true,
      createdBy: 'system',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    
    // Business Missions
    {
      id: 'sponsor_cleanup_01',
      title: 'Corporate Cleanup Sponsorship',
      description: 'Fund and organize a large-scale cleanup event for 50+ participants',
      type: 'data-collection',
      requiredRole: 'eco-defender',
      estimatedDuration: 10080, // 7 days in minutes
      xpReward: 100,
      ecoPointsReward: 200,
      difficulty: 'hard',
      urgency: 'urgent',
      status: 'available',
      currentParticipants: 0,
      location: {
        name: 'Corporate Office',
        coordinates: { latitude: 0, longitude: 0 },
        address: 'Business District'
      },
      startDate: new Date(),
      endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      progress: { current: 0, target: 1, unit: 'sponsorship' },
      instructions: ['Fund cleanup event', 'Organize participants', 'Document results'],
      requiresPhotoVerification: true,
      requiresLocationVerification: true,
      createdBy: 'system',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 'waste_audit_01',
      title: 'Office Waste Audit',
      description: 'Conduct a comprehensive waste audit of your business operations',
      type: 'analytics',
      requiredRole: 'eco-defender',
      estimatedDuration: 2880, // 2 days in minutes
      xpReward: 60,
      ecoPointsReward: 80,
      badgeReward: 'Efficiency Expert',
      difficulty: 'medium',
      urgency: 'medium',
      status: 'available',
      currentParticipants: 0,
      location: {
        name: 'Office Building',
        coordinates: { latitude: 0, longitude: 0 },
        address: 'Business Office'
      },
      startDate: new Date(),
      endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      progress: { current: 0, target: 1, unit: 'audit' },
      instructions: ['Conduct waste audit', 'Analyze data', 'Create report'],
      requiresPhotoVerification: true,
      requiresLocationVerification: true,
      createdBy: 'system',
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ];
};