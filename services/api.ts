import axios, { AxiosInstance, AxiosResponse } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// API Configuration
const API_BASE_URL = __DEV__ 
  ? 'http://localhost:5000/api' 
  : 'https://api.pear-app.com/api';

// Create axios instance
const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  async (config) => {
    try {
      const token = await AsyncStorage.getItem('auth_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error('Error getting auth token:', error);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Token expired, clear storage and redirect to login
      await AsyncStorage.removeItem('auth_token');
      await AsyncStorage.removeItem('user_data');
      // You can dispatch a logout action here if using Redux
    }
    return Promise.reject(error);
  }
);

// Types for API responses
export interface ApiResponse<T = any> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'TRASH_HERO' | 'IMPACT_WARRIOR' | 'ECO_DEFENDER' | 'ADMIN';
  level: number;
  xp: number;
  ecoPoints: number;
  walletId: string;
  createdAt: string;
  updatedAt: string;
}

export interface Mission {
  id: string;
  title: string;
  description: string;
  location: {
    name: string;
    coordinates: {
      latitude: number;
      longitude: number;
    };
  };
  reward: {
    ecoPoints: number;
    xp: number;
    cash?: number;
  };
  status: 'available' | 'active' | 'completed' | 'cancelled';
  priority: 'low' | 'medium' | 'high';
  duration: number; // in minutes
  maxParticipants: number;
  currentParticipants: number;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface Transaction {
  id: string;
  userId: string;
  type: 'earned' | 'spent' | 'donated' | 'withdrawn';
  amount: number;
  currency: 'ecoPoints' | 'xp' | 'usd';
  description: string;
  missionId?: string;
  createdAt: string;
}

export interface Analytics {
  totalUsers: number;
  totalMissions: number;
  totalEcoPointsDistributed: number;
  totalCleanupsCompleted: number;
  topPerformingRoles: Array<{
    role: string;
    missionsCompleted: number;
    ecoPointsEarned: number;
  }>;
  monthlyStats: Array<{
    month: string;
    missions: number;
    ecoPoints: number;
    users: number;
  }>;
}

// Auth API
export const authAPI = {
  login: async (email: string, password: string): Promise<ApiResponse<{ user: User; token: string }>> => {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  },

  register: async (userData: {
    email: string;
    password: string;
    name: string;
    role: User['role'];
  }): Promise<ApiResponse<{ user: User; token: string }>> => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },

  logout: async (): Promise<ApiResponse> => {
    const response = await api.post('/auth/logout');
    return response.data;
  },

  refreshToken: async (): Promise<ApiResponse<{ token: string }>> => {
    const response = await api.post('/auth/refresh');
    return response.data;
  },

  getProfile: async (): Promise<ApiResponse<User>> => {
    const response = await api.get('/auth/profile');
    return response.data;
  },

  updateProfile: async (userData: Partial<User>): Promise<ApiResponse<User>> => {
    const response = await api.put('/auth/profile', userData);
    return response.data;
  },
};

// Missions API
export const missionsAPI = {
  getAvailableMissions: async (filters?: {
    location?: { latitude: number; longitude: number; radius: number };
    priority?: string;
    role?: string;
  }): Promise<ApiResponse<Mission[]>> => {
    const response = await api.get('/missions/available', { params: filters });
    return response.data;
  },

  getMissionById: async (missionId: string): Promise<ApiResponse<Mission>> => {
    const response = await api.get(`/missions/${missionId}`);
    return response.data;
  },

  acceptMission: async (missionId: string): Promise<ApiResponse<Mission>> => {
    const response = await api.post(`/missions/${missionId}/accept`);
    return response.data;
  },

  completeMission: async (missionId: string, completionData: {
    photos?: string[];
    notes?: string;
    actualDuration?: number;
  }): Promise<ApiResponse<{ mission: Mission; rewards: { xp: number; ecoPoints: number } }>> => {
    const response = await api.post(`/missions/${missionId}/complete`, completionData);
    return response.data;
  },

  cancelMission: async (missionId: string, reason?: string): Promise<ApiResponse> => {
    const response = await api.post(`/missions/${missionId}/cancel`, { reason });
    return response.data;
  },

  createMission: async (missionData: Omit<Mission, 'id' | 'createdAt' | 'updatedAt' | 'currentParticipants'>): Promise<ApiResponse<Mission>> => {
    const response = await api.post('/missions', missionData);
    return response.data;
  },

  getUserMissions: async (status?: Mission['status']): Promise<ApiResponse<Mission[]>> => {
    const response = await api.get('/missions/user', { params: { status } });
    return response.data;
  },
};

// XP & Rewards API
export const xpAPI = {
  getUserXP: async (): Promise<ApiResponse<{
    totalXP: number;
    currentLevel: number;
    xpForNextLevel: number;
    xpInCurrentLevel: number;
    badges: Array<{ id: string; name: string; earnedAt?: string }>;
    achievements: Array<{ id: string; title: string; completed: boolean }>;
  }>> => {
    const response = await api.get('/xp');
    return response.data;
  },

  addXP: async (amount: number, source: string): Promise<ApiResponse<{
    newTotalXP: number;
    newLevel: number;
    leveledUp: boolean;
  }>> => {
    const response = await api.post('/xp/add', { amount, source });
    return response.data;
  },

  getLeaderboard: async (type: 'xp' | 'missions' | 'ecoPoints' = 'xp'): Promise<ApiResponse<Array<{
    userId: string;
    name: string;
    value: number;
    rank: number;
  }>>> => {
    const response = await api.get('/xp/leaderboard', { params: { type } });
    return response.data;
  },
};

// Wallet & Transactions API
export const walletAPI = {
  getWallet: async (): Promise<ApiResponse<{
    ecoPoints: number;
    usdBalance: number;
    walletId: string;
  }>> => {
    const response = await api.get('/wallet');
    return response.data;
  },

  getTransactions: async (filters?: {
    type?: Transaction['type'];
    limit?: number;
    offset?: number;
  }): Promise<ApiResponse<Transaction[]>> => {
    const response = await api.get('/wallet/transactions', { params: filters });
    return response.data;
  },

  fundWallet: async (amount: number, paymentMethod: string): Promise<ApiResponse<{
    transactionId: string;
    status: 'pending' | 'completed' | 'failed';
  }>> => {
    const response = await api.post('/wallet/fund', { amount, paymentMethod });
    return response.data;
  },

  withdrawFunds: async (amount: number, bankAccount: string): Promise<ApiResponse<{
    transactionId: string;
    status: 'pending' | 'completed' | 'failed';
  }>> => {
    const response = await api.post('/wallet/withdraw', { amount, bankAccount });
    return response.data;
  },

  donateEcoPoints: async (missionId: string, amount: number): Promise<ApiResponse<{
    transactionId: string;
    newBalance: number;
  }>> => {
    const response = await api.post('/wallet/donate', { missionId, amount });
    return response.data;
  },
};

// Analytics API (Admin only)
export const analyticsAPI = {
  getDashboardStats: async (): Promise<ApiResponse<Analytics>> => {
    const response = await api.get('/analytics/dashboard');
    return response.data;
  },

  getUserStats: async (userId?: string): Promise<ApiResponse<{
    missionsCompleted: number;
    totalXP: number;
    totalEcoPoints: number;
    averageRating: number;
    joinDate: string;
  }>> => {
    const response = await api.get('/analytics/user', { params: { userId } });
    return response.data;
  },

  getMissionStats: async (missionId?: string): Promise<ApiResponse<{
    participants: number;
    completionRate: number;
    averageDuration: number;
    totalEcoPointsDistributed: number;
  }>> => {
    const response = await api.get('/analytics/mission', { params: { missionId } });
    return response.data;
  },
};

// Utility functions
export const apiUtils = {
  handleError: (error: any): string => {
    if (error.response?.data?.message) {
      return error.response.data.message;
    }
    if (error.message) {
      return error.message;
    }
    return 'An unexpected error occurred';
  },

  isNetworkError: (error: any): boolean => {
    return !error.response && error.request;
  },

  isAuthError: (error: any): boolean => {
    return error.response?.status === 401;
  },
};

export default api;
