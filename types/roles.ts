// Centralized role definitions for the PEAR app
// This ensures consistency across all components and contexts

export type UserRole = 'TRASH_HERO' | 'IMPACT_WARRIOR' | 'ECO_DEFENDER' | 'ADMIN';

// Role display names and descriptions
export const ROLE_CONFIG = {
  TRASH_HERO: {
    displayName: 'Trash Hero',
    description: 'Paid cleanups and environmental restoration',
    color: '#9AE630',
    icon: 'trash',
    shortName: 'trash-hero',
  },
  IMPACT_WARRIOR: {
    displayName: 'Impact Warrior', 
    description: 'Volunteer environmental action',
    color: '#dc2626',
    icon: 'leaf',
    shortName: 'impact-warrior',
  },
  ECO_DEFENDER: {
    displayName: 'Eco Defender',
    description: 'Businesses & sponsors',
    color: '#007bff',
    icon: 'business',
    shortName: 'eco-defender',
  },
  ADMIN: {
    displayName: 'Admin',
    description: 'Missions & analytics management',
    color: '#ea580c',
    icon: 'shield-checkmark',
    shortName: 'admin',
  },
} as const;

// Helper functions for role management
export const getRoleColor = (role: UserRole): string => {
  return ROLE_CONFIG[role].color;
};

export const getRoleDisplayName = (role: UserRole): string => {
  return ROLE_CONFIG[role].displayName;
};

export const getRoleShortName = (role: UserRole): string => {
  return ROLE_CONFIG[role].shortName;
};

export const getRoleIcon = (role: UserRole): string => {
  return ROLE_CONFIG[role].icon;
};

// Convert between different role formats
export const normalizeRole = (role: string): UserRole => {
  const roleMap: Record<string, UserRole> = {
    // Handle old formats
    'VOLUNTEER': 'IMPACT_WARRIOR',
    'BUSINESS': 'ECO_DEFENDER',
    'trash-hero': 'TRASH_HERO',
    'impact-warrior': 'IMPACT_WARRIOR',
    'eco-defender': 'ECO_DEFENDER',
    'business': 'ECO_DEFENDER',
    'admin': 'ADMIN',
    // Handle current formats
    'TRASH_HERO': 'TRASH_HERO',
    'IMPACT_WARRIOR': 'IMPACT_WARRIOR',
    'ECO_DEFENDER': 'ECO_DEFENDER',
    'ADMIN': 'ADMIN',
  };
  
  return roleMap[role] || 'TRASH_HERO';
};

// Check if user can switch between roles (unified heroes)
export const canSwitchRole = (userRole: UserRole, targetRole: UserRole): boolean => {
  // Only TRASH_HERO and IMPACT_WARRIOR can switch between each other
  const unifiedRoles: UserRole[] = ['TRASH_HERO', 'IMPACT_WARRIOR'];
  return unifiedRoles.includes(userRole) && unifiedRoles.includes(targetRole);
};

// Get available roles for a user
export const getAvailableRoles = (userRole: UserRole): UserRole[] => {
  if (userRole === 'TRASH_HERO' || userRole === 'IMPACT_WARRIOR') {
    return ['TRASH_HERO', 'IMPACT_WARRIOR'];
  }
  return [userRole];
};
