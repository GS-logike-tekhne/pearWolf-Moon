import { useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { UserRole, normalizeRole, canSwitchRole, getAvailableRoles, getRoleColor, getRoleDisplayName, getRoleIcon } from '../types/roles';

/**
 * Centralized role management hook that handles:
 * - Role-based theming
 * - Role switching logic
 * - Role validation
 * - Available roles for current user
 */
export const useRoleManager = () => {
  const { user, currentRole, setCurrentRole } = useAuth();
  const { setTheme } = useTheme();

  // Sync theme with current role
  useEffect(() => {
    const themeRole = normalizeRole(currentRole);
    setTheme(themeRole);
    console.log('RoleManager: Theme synced with role:', themeRole);
  }, [currentRole, setTheme]);

  // Get available roles for current user
  const getAvailableRolesForUser = (): UserRole[] => {
    return user ? getAvailableRoles(user.role) : ['TRASH_HERO'];
  };

  // Check if user can switch to a specific role
  const canSwitchToRole = (role: UserRole): boolean => {
    return user ? canSwitchRole(user.role, normalizeRole(role)) : false;
  };

  // Switch to a specific role (with validation)
  const switchToRole = (role: UserRole): boolean => {
    const normalizedRole = normalizeRole(role);
    
    if (canSwitchToRole(normalizedRole)) {
      console.log('RoleManager: Switching from', currentRole, 'to', normalizedRole);
      setCurrentRole(normalizedRole);
      return true;
    } else {
      console.log('RoleManager: Cannot switch to role', normalizedRole, 'from', user?.role);
      return false;
    }
  };

  // Toggle between Trash Hero and Impact Warrior (if user has both roles)
  const toggleHeroRoles = (): boolean => {
    console.log('toggleHeroRoles called');
    console.log('User:', user?.role);
    console.log('Current role:', currentRole);
    
    if (!user) {
      console.log('No user found');
      return false;
    }
    
    // Check if user can switch between the unified hero roles
    if (!canSwitchRole(user.role, 'TRASH_HERO') && !canSwitchRole(user.role, 'IMPACT_WARRIOR')) {
      console.log('User cannot switch to either hero role');
      return false;
    }

    const newRole = currentRole === 'TRASH_HERO' ? 'IMPACT_WARRIOR' : 'TRASH_HERO';
    console.log('Switching to role:', newRole);
    return switchToRole(newRole);
  };

  // Get role-specific configuration
  const getRoleConfig = () => {
    const role = normalizeRole(currentRole);
    
    switch (role) {
      case 'TRASH_HERO':
        return {
          title: 'TrashHero Pro',
          subtitle: 'Professional Cleaner',
          color: '#4CAF50',
          icon: getRoleIcon('TRASH_HERO'),
          canToggle: canSwitchToRole('IMPACT_WARRIOR'),
        };
      case 'IMPACT_WARRIOR':
        return {
          title: 'Impact Warrior',
          subtitle: 'Community Volunteer',
          color: '#dc2626',
          icon: getRoleIcon('IMPACT_WARRIOR'),
          canToggle: canSwitchToRole('TRASH_HERO'),
        };
      case 'ECO_DEFENDER':
        return {
          title: 'EcoDefender Corp',
          subtitle: 'Environmental Sponsor',
          color: '#2196F3',
          icon: getRoleIcon('ECO_DEFENDER'),
          canToggle: false,
        };
      case 'ADMIN':
        return {
          title: 'Platform Admin',
          subtitle: 'System Administrator',
          color: '#9C27B0',
          icon: getRoleIcon('ADMIN'),
          canToggle: false,
        };
      default:
        return {
          title: 'PEAR User',
          subtitle: 'Environmental Champion',
          color: '#4CAF50',
          icon: 'person',
          canToggle: false,
        };
    }
  };

  // Get role-specific navigation configuration
  const getNavigationConfig = () => {
    const role = normalizeRole(currentRole);
    
    return {
      dashboardScreen: getDashboardScreen(role),
      missionsScreen: getMissionsScreen(role),
      tabBarColor: getRoleConfig().color,
      showToggle: getRoleConfig().canToggle,
    };
  };

  const getDashboardScreen = (role: UserRole) => {
    switch (role) {
      case 'TRASH_HERO':
      case 'IMPACT_WARRIOR':
        return 'UnifiedHeroDashboard';
      case 'ECO_DEFENDER':
        return 'EcoDefenderDashboard';
      case 'ADMIN':
        return 'AdminDashboard';
      default:
        return 'UnifiedHeroDashboard';
    }
  };

  const getMissionsScreen = (role: UserRole) => {
    switch (role) {
      case 'TRASH_HERO':
        return 'TrashHeroMissions';
      case 'IMPACT_WARRIOR':
        return 'ImpactWarriorMissions';
      case 'ECO_DEFENDER':
        return 'EcoDefenderMissions';
      case 'ADMIN':
        return 'UserManagement';
      default:
        return 'TrashHeroMissions';
    }
  };

  return {
    // Current state
    currentRole: normalizeRole(currentRole),
    user,
    
    // Role management
    switchToRole,
    toggleHeroRoles,
    canSwitchToRole,
    getAvailableRolesForUser,
    
    // Configuration
    getRoleConfig,
    getNavigationConfig,
    
    // Utilities
    isTrashHero: currentRole === 'TRASH_HERO',
    isImpactWarrior: currentRole === 'IMPACT_WARRIOR',
    isEcoDefender: currentRole === 'ECO_DEFENDER',
    isAdmin: currentRole === 'ADMIN',
  };
};
