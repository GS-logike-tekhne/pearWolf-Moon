import { Platform } from 'react-native';

export interface MapConfig {
  provider: 'google' | 'default';
  apiKey?: string;
  fallbackToDefault: boolean;
  enableMockData: boolean;
}

// Simplified configuration for better emulator compatibility
export const MAP_CONFIG: MapConfig = {
  provider: 'default', // Use default provider for emulator compatibility
  apiKey: undefined,
  fallbackToDefault: true,
  enableMockData: true,
};
