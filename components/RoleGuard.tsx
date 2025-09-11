// components/RoleGuard.tsx
import React, { ReactNode } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { UserRole } from '../types/roles';
import { Feature, hasPermission, getRolePermissions } from '../types/rolePermissions';

interface RoleGuardProps {
  children: ReactNode;
  allowedRoles?: UserRole[];
  requiredPermission?: Feature;
  fallback?: ReactNode;
  showAccessDenied?: boolean;
}

export const RoleGuard: React.FC<RoleGuardProps> = ({
  children,
  allowedRoles,
  requiredPermission,
  fallback,
  showAccessDenied = true
}) => {
  const { currentRole, user } = useAuth();
  const { theme } = useTheme();

  // Check if user has access
  const hasAccess = (): boolean => {
    // If specific roles are required, check if current role is in the list
    if (allowedRoles && allowedRoles.length > 0) {
      return allowedRoles.includes(currentRole);
    }

    // If specific permission is required, check if user has that permission
    if (requiredPermission) {
      return hasPermission(currentRole, requiredPermission);
    }

    // If no restrictions specified, allow access
    return true;
  };

  // If user has access, render children
  if (hasAccess()) {
    return <>{children}</>;
  }

  // If custom fallback is provided, use it
  if (fallback) {
    return <>{fallback}</>;
  }

  // If access denied and we should show the message
  if (showAccessDenied) {
    return (
      <View style={[styles.accessDeniedContainer, { backgroundColor: theme.background }]}>
        <View style={[styles.accessDeniedCard, { backgroundColor: theme.cardBackground }]}>
          <View style={styles.iconContainer}>
            <Ionicons name="shield-checkmark" size={48} color="#dc3545" />
          </View>
          
          <Text style={[styles.title, { color: theme.textColor }]}>
            🚫 Access Restricted
          </Text>
          
          <Text style={[styles.message, { color: theme.secondaryText }]}>
            You don't have permission to access this section.
          </Text>
          
          <View style={styles.roleInfo}>
            <Text style={[styles.roleLabel, { color: theme.secondaryText }]}>
              Current Role: <Text style={[styles.roleValue, { color: theme.primary }]}>
                {currentRole.replace('_', ' ')}
              </Text>
            </Text>
            
            {allowedRoles && allowedRoles.length > 0 && (
              <Text style={[styles.roleLabel, { color: theme.secondaryText }]}>
                Required Roles: <Text style={[styles.roleValue, { color: theme.primary }]}>
                  {allowedRoles.map(role => role.replace('_', ' ')).join(', ')}
                </Text>
              </Text>
            )}
            
            {requiredPermission && (
              <Text style={[styles.roleLabel, { color: theme.secondaryText }]}>
                Required Permission: <Text style={[styles.roleValue, { color: theme.primary }]}>
                  {requiredPermission}
                </Text>
              </Text>
            )}
          </View>
          
          <View style={styles.permissionsList}>
            <Text style={[styles.permissionsTitle, { color: theme.textColor }]}>
              Your Current Permissions:
            </Text>
            {getRolePermissions(currentRole).map((permission, index) => (
              <View key={index} style={styles.permissionItem}>
                <Ionicons name="checkmark-circle" size={16} color="#28a745" />
                <Text style={[styles.permissionText, { color: theme.secondaryText }]}>
                  {permission}
                </Text>
              </View>
            ))}
          </View>
        </View>
      </View>
    );
  }

  // If we shouldn't show access denied, return null
  return null;
};

// Higher-order component for easier screen wrapping
export const withRoleGuard = <P extends object>(
  Component: React.ComponentType<P>,
  guardProps: Omit<RoleGuardProps, 'children'>
) => {
  return (props: P) => (
    <RoleGuard {...guardProps}>
      <Component {...props} />
    </RoleGuard>
  );
};

// Hook for checking permissions in components
export const useRoleGuard = () => {
  const { currentRole } = useAuth();

  const checkPermission = (permission: Feature): boolean => {
    return hasPermission(currentRole, permission);
  };

  const hasAnyPermission = (permissions: Feature[]): boolean => {
    return permissions.some(permission => checkPermission(permission));
  };

  const hasAllPermissions = (permissions: Feature[]): boolean => {
    return permissions.every(permission => checkPermission(permission));
  };

  const isRole = (role: UserRole): boolean => {
    return currentRole === role;
  };

  const isAnyRole = (roles: UserRole[]): boolean => {
    return roles.includes(currentRole);
  };

  return {
    currentRole,
    hasPermission: checkPermission,
    hasAnyPermission,
    hasAllPermissions,
    isRole,
    isAnyRole,
    permissions: getRolePermissions(currentRole)
  };
};

const styles = StyleSheet.create({
  accessDeniedContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  accessDeniedCard: {
    width: '100%',
    maxWidth: 400,
    padding: 24,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  iconContainer: {
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  message: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 22,
  },
  roleInfo: {
    width: '100%',
    marginBottom: 20,
  },
  roleLabel: {
    fontSize: 14,
    marginBottom: 4,
  },
  roleValue: {
    fontWeight: '600',
  },
  permissionsList: {
    width: '100%',
  },
  permissionsTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  permissionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  permissionText: {
    marginLeft: 8,
    fontSize: 14,
  },
});
