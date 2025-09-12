/**
 * Unified Location Services Entry Point
 * Simplified, bloat-free location management for PEAR
 */

// Core services
export { default as LocationService } from './locationService';
export { LocationUtils } from './locationUtils';

// Types
export * from './locationTypes';

// Re-export common functions for direct access
export const calculateDistance = LocationUtils.calculateDistance;
export const filterMissionsByProximity = LocationUtils.filterMissionsByProximity;
export const getNearbyMissions = LocationUtils.getNearbyMissions;
export const isWithinRadius = LocationUtils.isWithinRadius;
export const formatDistance = LocationUtils.formatDistance;
