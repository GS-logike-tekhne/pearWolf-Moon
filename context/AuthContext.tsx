import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  id: number;
  username: string;
  name: string;
  email: string;
  role: 'TRASH_HERO' | 'VOLUNTEER' | 'BUSINESS' | 'ADMIN';
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
  currentRole: 'TRASH_HERO' | 'VOLUNTEER' | 'BUSINESS' | 'ADMIN';
  login: (username: string, password: string) => Promise<void>;
  signup: (userData: SignupData) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<boolean>;
  setCurrentRole: (role: 'TRASH_HERO' | 'VOLUNTEER' | 'BUSINESS' | 'ADMIN') => void;
}

interface SignupData {
  name: string;
  username: string;
  email: string;
  password: string;
  role: 'TRASH_HERO' | 'VOLUNTEER' | 'BUSINESS';
}

const AuthContext = createContext<AuthContextType | null>(null);

const API_BASE_URL = process.env.NODE_ENV === 'production' ? '' : 'http://localhost:5000';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentRole, setCurrentRoleState] = useState<'TRASH_HERO' | 'VOLUNTEER' | 'BUSINESS' | 'ADMIN'>('TRASH_HERO');
  
  const isAuthenticated = user !== null;

  const checkAuth = async (): Promise<boolean> => {
    try {
      console.log('Checking authentication status...');
      
      // For React Native, we'll simulate a successful auth check
      // In a real app, you'd make an API call to validate the session
      const mockUser: User = {
        id: 1,
        username: 'demo_user',
        name: 'Demo User',
        email: 'demo@pearapp.com',
        role: 'TRASH_HERO',
        ecoPoints: 1250,
        kycVerified: true,
        backgroundCheckVerified: true,
        verificationLevel: 'background_check',
        kycVerifiedAt: new Date(),
        backgroundCheckVerifiedAt: new Date(),
      };
      
      setUser(mockUser);
      setCurrentRoleState(mockUser.role);
      console.log('Authentication successful (demo mode):', mockUser);
      return true;
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
      
      // For demo purposes, simulate login
      // In a real app, you'd make API calls to your backend
      const mockUser: User = {
        id: 1,
        username,
        name: username.charAt(0).toUpperCase() + username.slice(1),
        email: `${username}@pearapp.com`,
        role: 'TRASH_HERO',
        ecoPoints: 1250,
      };
      
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
      
      // Store session token
      if (token) {
        localStorage.setItem('session_token', token);
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

  const setCurrentRole = (role: 'TRASH_HERO' | 'VOLUNTEER' | 'BUSINESS' | 'ADMIN') => {
    // Only allow switching between TRASH_HERO and VOLUNTEER for unified heroes
    if (user && (user.role === 'TRASH_HERO' || user.role === 'VOLUNTEER')) {
      if (role === 'TRASH_HERO' || role === 'VOLUNTEER') {
        setCurrentRoleState(role);
      }
    } else {
      // For other roles, keep their original role
      setCurrentRoleState(user?.role || 'TRASH_HERO');
    }
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