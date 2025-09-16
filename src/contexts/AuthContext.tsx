import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User, UserRole, LoginRequest, SignupRequest, ApiResponse, LoginResponse } from '../types';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  currentRole: UserRole;
  login: (credentials: LoginRequest) => Promise<void>;
  signup: (userData: SignupRequest) => Promise<void>;
  logout: () => Promise<void>;
  setCurrentRole: (role: UserRole) => void;
  getAvailableRoles: () => UserRole[];
  canSwitchToRole: (role: UserRole) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

// Mock users for development
const mockUsers: User[] = [
  {
    id: '1',
    username: 'admin',
    name: 'Admin User',
    email: 'admin@pearapp.com',
    role: 'ADMIN',
    ecoPoints: 5000,
    kycVerified: true,
    backgroundCheckVerified: true,
    verificationLevel: 'background_check',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '2',
    username: 'jjmoore254',
    name: 'JJ Moore',
    email: 'jj@pearapp.com',
    role: 'ECO_DEFENDER',
    ecoPoints: 3450,
    kycVerified: true,
    backgroundCheckVerified: true,
    verificationLevel: 'background_check',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '3',
    username: 'testuser',
    name: 'Test User',
    email: 'test@pearapp.com',
    role: 'TRASH_HERO',
    ecoPoints: 1250,
    kycVerified: true,
    backgroundCheckVerified: true,
    verificationLevel: 'background_check',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '4',
    username: 'volunteer',
    name: 'Sarah Johnson',
    email: 'sarah@pearapp.com',
    role: 'IMPACT_WARRIOR',
    ecoPoints: 1680,
    kycVerified: true,
    backgroundCheckVerified: true,
    verificationLevel: 'background_check',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentRole, setCurrentRoleState] = useState<UserRole>('TRASH_HERO');

  const isAuthenticated = user !== null;

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async (): Promise<void> => {
    try {
      const savedUser = await AsyncStorage.getItem('user_data');
      const savedToken = await AsyncStorage.getItem('auth_token');
      
      if (savedUser && savedToken) {
        const userData = JSON.parse(savedUser);
        setUser(userData);
        setCurrentRoleState(userData.role);
      }
    } catch (error) {
      console.error('Auth check error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (credentials: LoginRequest): Promise<void> => {
    try {
      setIsLoading(true);
      
      // Find user in mock data
      const foundUser = mockUsers.find(
        u => u.username === credentials.username
      );
      
      if (!foundUser) {
        throw new Error('Invalid credentials');
      }
      
      // In a real app, you'd verify the password here
      // For demo purposes, we'll accept any password
      
      // Generate a mock token
      const token = `mock_token_${Date.now()}`;
      
      // Store auth data
      await AsyncStorage.setItem('auth_token', token);
      await AsyncStorage.setItem('user_data', JSON.stringify(foundUser));
      
      setUser(foundUser);
      setCurrentRoleState(foundUser.role);
      
      console.log('Login successful:', foundUser);
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (userData: SignupRequest): Promise<void> => {
    try {
      setIsLoading(true);
      
      // Create new user
      const newUser: User = {
        id: Date.now().toString(),
        username: userData.username,
        name: userData.name,
        email: userData.email,
        role: userData.role,
        ecoPoints: 0,
        kycVerified: false,
        backgroundCheckVerified: false,
        verificationLevel: 'none',
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      
      // Generate a mock token
      const token = `mock_token_${Date.now()}`;
      
      // Store auth data
      await AsyncStorage.setItem('auth_token', token);
      await AsyncStorage.setItem('user_data', JSON.stringify(newUser));
      
      setUser(newUser);
      setCurrentRoleState(newUser.role);
      
      console.log('Signup successful:', newUser);
    } catch (error) {
      console.error('Signup failed:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    try {
      setIsLoading(true);
      
      // Clear stored data
      await AsyncStorage.removeItem('auth_token');
      await AsyncStorage.removeItem('user_data');
      
      setUser(null);
      setCurrentRoleState('TRASH_HERO');
      
      console.log('Logout successful');
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const setCurrentRole = (role: UserRole): void => {
    if (user && canSwitchToRole(role)) {
      setCurrentRoleState(role);
    }
  };

  const getAvailableRoles = (): UserRole[] => {
    if (!user) return ['TRASH_HERO'];
    
    // Admin can switch to any role
    if (user.role === 'ADMIN') {
      return ['TRASH_HERO', 'IMPACT_WARRIOR', 'ECO_DEFENDER', 'ADMIN'];
    }
    
    // Other users can only use their assigned role
    return [user.role];
  };

  const canSwitchToRole = (role: UserRole): boolean => {
    if (!user) return false;
    
    // Admin can switch to any role
    if (user.role === 'ADMIN') return true;
    
    // Other users can only use their assigned role
    return user.role === role;
  };

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated,
    currentRole,
    login,
    signup,
    logout,
    setCurrentRole,
    getAvailableRoles,
    canSwitchToRole,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
