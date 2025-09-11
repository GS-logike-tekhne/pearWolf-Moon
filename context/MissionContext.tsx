import React, { createContext, useContext, useReducer, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Mission, MissionProgress, MissionCompletion, MissionStatus } from '../types/missions';
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
        joinedUsers: [mission.joinedUsers[0] || 'current_user']
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
            timeRemaining: mission.duration,
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
        userEcoPoints: state.userEcoPoints + mission.reward.ecoPoints
      };
    }
    
    case 'BOOST_MISSION': {
      const missionIndex = state.activeMissions.findIndex(m => m.id === action.payload.missionId);
      if (missionIndex === -1 || state.userEcoPoints < action.payload.cost) return state;
      
      const updatedMissions = [...state.activeMissions];
      updatedMissions[missionIndex] = {
        ...updatedMissions[missionIndex],
        boostUsed: true,
        pointsSpentOnBoost: updatedMissions[missionIndex].pointsSpentOnBoost + action.payload.cost
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
      const updatedJoinedUsers = [...mission.joinedUsers, action.payload.userId];
      
      const updatedMissions = [...state.availableMissions];
      updatedMissions[missionIndex] = {
        ...mission,
        joinedUsers: updatedJoinedUsers
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
                completedAt: new Date(),
                actualReward: mission.reward
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
      addXP(mission.reward.xp, `Mission: ${mission.title}`);
      
      dispatch({ 
        type: 'COMPLETE_MISSION', 
        payload: { 
          missionId,
          completion: {
            missionId,
            completedAt: new Date(),
            actualReward: mission.reward
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
      type: 'Quick Clean',
      role: 'TRASH_HERO',
      duration: 900, // 15 minutes
      reward: { xp: 15, ecoPoints: 10 },
      canBoost: false,
      requiresUsers: 1,
      difficulty: 'Easy',
      category: 'Cleanup & Collection',
      icon: 'trash-outline',
      status: 'available',
      joinedUsers: [],
      boostUsed: false,
      pointsSpentOnBoost: 0
    },
    {
      id: 'park_restoration_01',
      title: 'Park Restoration Project',
      description: 'Join a 24-hour community effort to restore local park areas',
      type: 'Timed Mission',
      role: 'TRASH_HERO',
      duration: 86400, // 24 hours
      reward: { xp: 50, ecoPoints: 35, badge: 'Park Guardian' },
      canBoost: true,
      requiresUsers: 1,
      difficulty: 'Medium',
      category: 'Habitat Restoration',
      icon: 'leaf-outline',
      status: 'available',
      joinedUsers: [],
      boostUsed: false,
      pointsSpentOnBoost: 0
    },
    
    // Volunteer/Impact Warrior Missions
    {
      id: 'community_event_01',
      title: 'Organize Eco Workshop',
      description: 'Plan and host an environmental awareness workshop in your community',
      type: 'Community Quest',
      role: 'IMPACT_WARRIOR',
      duration: 259200, // 3 days
      reward: { xp: 75, ecoPoints: 50, badge: 'Community Leader' },
      canBoost: true,
      requiresUsers: 3,
      maxUsers: 10,
      difficulty: 'Hard',
      category: 'Community Engagement',
      icon: 'people-outline',
      status: 'available',
      joinedUsers: [],
      boostUsed: false,
      pointsSpentOnBoost: 0
    },
    
    // Business Missions
    {
      id: 'sponsor_cleanup_01',
      title: 'Corporate Cleanup Sponsorship',
      description: 'Fund and organize a large-scale cleanup event for 50+ participants',
      type: 'Business Mission',
      role: 'ECO_DEFENDER',
      duration: 604800, // 7 days
      reward: { xp: 100, ecoPoints: 200, tokenReward: 500 },
      canBoost: true,
      requiresUsers: 1,
      difficulty: 'Epic',
      category: 'Corporate Sustainability',
      icon: 'business-outline',
      status: 'available',
      joinedUsers: [],
      boostUsed: false,
      pointsSpentOnBoost: 0
    },
    {
      id: 'waste_audit_01',
      title: 'Office Waste Audit',
      description: 'Conduct a comprehensive waste audit of your business operations',
      type: 'Timed Mission',
      role: 'ECO_DEFENDER',
      duration: 172800, // 2 days
      reward: { xp: 60, ecoPoints: 80, badge: 'Efficiency Expert' },
      canBoost: true,
      requiresUsers: 1,
      difficulty: 'Medium',
      category: 'Corporate Sustainability',
      icon: 'analytics-outline',
      status: 'available',
      joinedUsers: [],
      boostUsed: false,
      pointsSpentOnBoost: 0
    }
  ];
};