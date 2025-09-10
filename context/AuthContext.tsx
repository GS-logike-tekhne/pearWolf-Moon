import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserRole, normalizeRole, canSwitchRole, getAvailableRoles } from '../types/roles';

interface User {
  id: number;
  username: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  city?: string;
  state?: string;
  ecoPoints?: number;
  kycVerified?: boolean;
  kycVerifiedAt?: Date;
  backgroundCheckVerified?: boolean;
  backgroundCheckVerifiedAt?: Date;
  verificationLevel?: 'none' | 'kyc' | 'background_check';
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  currentRole: UserRole;
  login: (username: string, password: string) => Promise<void>;
  signup: (userData: SignupData) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<boolean>;
  setCurrentRole: (role: UserRole) => void;
  getAvailableRoles: () => UserRole[];
  canSwitchToRole: (role: UserRole) => boolean;
}

interface SignupData {
  name: string;
  username: string;
  email: string;
  password: string;
  role: UserRole;
}

const AuthContext = createContext<AuthContextType | null>(null);

const API_BASE_URL = process.env.NODE_ENV === 'production' ? '' : 'http://localhost:5000';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentRole, setCurrentRoleState] = useState<UserRole>('TRASH_HERO');
  
  const isAuthenticated = user !== null;

  const checkAuth = async (): Promise<boolean> => {
    try {
      console.log('Checking authentication status...');
      
      // For demo purposes, check if there's a stored session
      // In a real app, you'd make an API call to validate the session
      // For now, we'll start with no user to show the login screen
      setUser(null);
      setCurrentRoleState('TRASH_HERO');
      console.log('No authenticated user found - showing login screen');
      return false;
    } catch (error) {
      console.error('Authentication check error:', error);
      setUser(null);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const login = async (username: string, password: string): Promise<void> => {
    try {
      setIsLoading(true);
      
      // Demo login logic based on credentials
      let mockUser: User;
      
      if (username === 'admin' && password === 'admin123') {
        mockUser = {
          id: 1,
          username: 'admin',
          name: 'Admin User',
          email: 'admin@pearapp.com',
          role: 'ADMIN',
          ecoPoints: 5000,
          kycVerified: true,
          backgroundCheckVerified: true,
          verificationLevel: 'background_check',
          kycVerifiedAt: new Date(),
          backgroundCheckVerifiedAt: new Date(),
        };
      } else if (username === 'jjmoore254' && password === 'business123') {
        mockUser = {
          id: 2,
          username: 'jjmoore254',
          name: 'JJ Moore',
          email: 'jj@pearapp.com',
          role: 'ECO_DEFENDER',
          ecoPoints: 3450,
          kycVerified: true,
          backgroundCheckVerified: true,
          verificationLevel: 'background_check',
          kycVerifiedAt: new Date(),
          backgroundCheckVerifiedAt: new Date(),
        };
      } else if (username === 'testuser' && password === 'password123') {
        mockUser = {
          id: 3,
          username: 'testuser',
          name: 'Test User',
          email: 'test@pearapp.com',
          role: 'TRASH_HERO',
          ecoPoints: 1250,
          kycVerified: true,
          backgroundCheckVerified: true,
          verificationLevel: 'background_check',
          kycVerifiedAt: new Date(),
          backgroundCheckVerifiedAt: new Date(),
        };
      } else if (username === 'volunteer' && password === 'volunteer123') {
        mockUser = {
          id: 4,
          username: 'volunteer',
          name: 'Sarah Johnson',
          email: 'sarah@pearapp.com',
          role: 'IMPACT_WARRIOR',
          ecoPoints: 1680,
          kycVerified: true,
          backgroundCheckVerified: true,
          verificationLevel: 'background_check',
          kycVerifiedAt: new Date(),
          backgroundCheckVerifiedAt: new Date(),
        };
      } else {
        throw new Error('Invalid credentials');
      }
      
      setUser(mockUser);
      setCurrentRoleState(mockUser.role);
      console.log('Login successful (demo mode):', mockUser);
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (userData: SignupData): Promise<void> => {
    try {
      setIsLoading(true);
      const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Registration failed');
      }

      const { user: newUser, token } = await response.json();
      
      // Store session token (React Native uses AsyncStorage instead of localStorage)
      if (token) {
        // In React Native, you'd use AsyncStorage.setItem('session_token', token)
        console.log('Session token received:', token);
      }
      setUser(newUser);
      
      console.log('Registration successful:', newUser);
    } catch (error) {
      console.error('Registration failed:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    try {
      setIsLoading(true);
      setUser(null);
      setCurrentRoleState('TRASH_HERO');
      console.log('Logout successful');
    } catch (error) {
      console.error('Logout failed:', error);
      setUser(null);
      setCurrentRoleState('TRASH_HERO');
    } finally {
      setIsLoading(false);
    }
  };

  const setCurrentRole = (role: UserRole) => {
    const normalizedRole = normalizeRole(role);
    console.log('setCurrentRole called with:', role, 'normalized to:', normalizedRole);
    console.log('User role:', user?.role, 'Can switch:', user ? canSwitchRole(user.role, normalizedRole) : false);
    if (user && canSwitchRole(user.role, normalizedRole)) {
      console.log('Setting current role to:', normalizedRole);
      setCurrentRoleState(normalizedRole);
    } else {
      // For other roles, keep their original role
      console.log('Cannot switch, keeping original role:', user?.role || 'TRASH_HERO');
      setCurrentRoleState(user?.role || 'TRASH_HERO');
    }
  };

  const getAvailableRolesForUser = (): UserRole[] => {
    return user ? getAvailableRoles(user.role) : ['TRASH_HERO'];
  };

  const canSwitchToRole = (role: UserRole): boolean => {
    return user ? canSwitchRole(user.role, normalizeRole(role)) : false;
  };

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated,
    currentRole,
    login,
    signup,
    logout,
    checkAuth,
    setCurrentRole,
    getAvailableRoles: getAvailableRolesForUser,
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

export default AuthContext;