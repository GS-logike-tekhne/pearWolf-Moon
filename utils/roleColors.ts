// Centralized role color utility to ensure consistency across the app
export const getRoleColor = (role: string): string => {
  switch (role) {
    case 'admin':
      return '#ea580c'; // Orange - matches ThemeContext
    case 'business':
      return '#007bff'; // Blue - matches ThemeContext  
    case 'trash-hero':
      return '#28A745'; // Green - matches ThemeContext
    case 'impact-warrior':
      return '#dc2626'; // Red - matches ThemeContext
    default:
      return '#007bff'; // Default to business blue
  }
};

// Role type for better type safety
export type UserRole = 'admin' | 'business' | 'trash-hero' | 'impact-warrior';