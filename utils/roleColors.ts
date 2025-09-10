// Centralized role color utility to ensure consistency across the app
// This file is now deprecated - use types/roles.ts instead
import { UserRole, getRoleColor as getRoleColorFromTypes, normalizeRole } from '../types/roles';

export const getRoleColor = (role: string | UserRole): string => {
  const normalizedRole = normalizeRole(role);
  return getRoleColorFromTypes(normalizedRole);
};

// Re-export for backward compatibility
export type { UserRole } from '../types/roles';