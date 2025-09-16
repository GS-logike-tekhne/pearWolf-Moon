// Environment configuration for PEAR app
export const ENV = {
  // Google Maps API Key - Replace with your actual API key
  GOOGLE_MAPS_API_KEY: process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY || 'AIzaSyApJ4w8ZRRe77_YKfHDRClKTq-pY9Ew41A',
  
  // Development settings
  DEV_MODE: __DEV__,
  ENABLE_MOCK_DATA: true,
  
  // Map settings
  DEFAULT_MAP_PROVIDER: 'default', // 'google' or 'default'
  FALLBACK_TO_DEFAULT: true,
};

export const getMapProvider = () => {
  // In development/emulator, use default provider to avoid API key issues
  if (ENV.DEV_MODE && !ENV.GOOGLE_MAPS_API_KEY.includes('YOUR_')) {
    return 'google';
  }
  return ENV.DEFAULT_MAP_PROVIDER;
};
