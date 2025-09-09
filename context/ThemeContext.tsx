import React, { createContext, useContext, useState, ReactNode } from 'react';

interface Theme {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  cardBackground: string;
  textColor: string;
  secondaryText: string;
  borderColor: string;
  success: string;
  warning: string;
  error: string;
}

interface ThemeContextType {
  theme: Theme;
  userRole: string;
  setUserRole: (role: string) => void;
  setTheme: (role: string) => void;
}

const themes: Record<string, Theme> = {
  admin: {
    primary: '#ea580c',
    secondary: '#f97316', 
    accent: '#fed7aa',
    background: '#ffffff',
    cardBackground: '#ffffff',
    textColor: '#1f2937',
    secondaryText: '#6b7280',
    borderColor: '#e5e7eb',
    success: '#10b981',
    warning: '#f59e0b',
    error: '#ef4444',
  },
  business: {
    primary: '#007bff',
    secondary: '#3b82f6',
    accent: '#dbeafe',
    background: '#ffffff',
    cardBackground: '#ffffff',
    textColor: '#1f2937',
    secondaryText: '#6b7280',
    borderColor: '#e5e7eb',
    success: '#10b981',
    warning: '#f59e0b',
    error: '#ef4444',
  },
  'trash-hero': {
    primary: '#28A745',
    secondary: '#15803d',
    accent: '#d1fae5',
    background: '#ffffff',
    cardBackground: '#ffffff',
    textColor: '#1f2937',
    secondaryText: '#6b7280',
    borderColor: '#e5e7eb',
    success: '#28A745',
    warning: '#28A745',
    error: '#ef4444',
  },
  'impact-warrior': {
    primary: '#dc2626',
    secondary: '#991b1b',
    accent: '#fecaca',
    background: '#ffffff',
    cardBackground: '#ffffff',
    textColor: '#1f2937',
    secondaryText: '#6b7280',
    borderColor: '#e5e7eb',
    success: '#10b981',
    warning: '#f59e0b',
    error: '#ef4444',
  },
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [userRole, setUserRole] = useState<string>('trash-hero');
  
  const theme = themes[userRole] || themes.admin;

  const setTheme = (role: string) => {
    setUserRole(role);
  };

  const value: ThemeContextType = {
    theme,
    userRole,
    setUserRole,
    setTheme,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};