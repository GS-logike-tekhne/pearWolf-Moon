/**
 * Verification Service Exports
 * Main entry point for verification functionality
 */

import { verificationService } from './verification/index';
import { VerifiableUser } from './verification/verificationTypes';

/**
 * Check if user is verified (has any verification)
 */
export const isUserVerified = (user: VerifiableUser): boolean => {
  return user.kycVerified || user.backgroundCheckVerified || false;
};

/**
 * Get verification badge text for display
 */
export const getVerificationBadgeText = (user: VerifiableUser): string => {
  return verificationService.getVerificationBadgeText(user);
};

/**
 * Check if user can participate in specific event type
 */
export const canParticipateInEvent = (user: VerifiableUser, eventType: string): boolean => {
  return verificationService.canParticipateInEvent(user, eventType as any);
};

/**
 * Check if verification is required for a mission
 */
export const isVerificationRequired = (missionType: string, reward: number): boolean => {
  return verificationService.isVerificationRequired(missionType, reward);
};

// Re-export everything from the verification service
export * from './verification/index';
export * from './verification/verificationTypes';
