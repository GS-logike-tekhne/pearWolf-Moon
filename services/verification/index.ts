/**
 * Unified Verification Service
 * Main entry point for all verification functionality
 */

import { UserVerificationService } from './userVerificationService';
import { PhotoVerificationService } from './photoVerificationService';
import {
  VerificationService,
  UserVerificationData,
  UserVerificationResult,
  PhotoVerificationData,
  PhotoVerificationResult,
  CleanupSubmission,
  CleanupVerificationResult,
  VerificationStatus,
  VerificationRequirements,
  VerifiableUser,
  EventType,
} from './verificationTypes';

/**
 * Unified Verification Service Implementation
 * Combines user verification, photo verification, and cleanup verification
 */
export class UnifiedVerificationService implements VerificationService {
  private static instance: UnifiedVerificationService;
  private userService: UserVerificationService;
  private photoService: PhotoVerificationService;

  private constructor() {
    this.userService = UserVerificationService.getInstance();
    this.photoService = PhotoVerificationService.getInstance();
  }

  public static getInstance(): UnifiedVerificationService {
    if (!UnifiedVerificationService.instance) {
      UnifiedVerificationService.instance = new UnifiedVerificationService();
    }
    return UnifiedVerificationService.instance;
  }

  // ============================================================================
  // USER VERIFICATION METHODS
  // ============================================================================

  /**
   * Verify user with KYC and background check data
   */
  async verifyUser(data: UserVerificationData): Promise<UserVerificationResult> {
    return this.userService.verifyUser(data);
  }

  /**
   * Get user verification status
   */
  async getUserVerificationStatus(userId: string): Promise<UserVerificationResult | null> {
    return this.userService.getUserVerificationStatus(userId);
  }

  // ============================================================================
  // PHOTO VERIFICATION METHODS
  // ============================================================================

  /**
   * Verify photos for mission completion
   */
  async verifyPhotos(data: PhotoVerificationData): Promise<PhotoVerificationResult> {
    return this.photoService.verifyPhotos(data);
  }

  /**
   * Verify cleanup photos (before/after)
   */
  async verifyCleanup(submission: CleanupSubmission): Promise<CleanupVerificationResult> {
    return this.photoService.verifyCleanup(submission);
  }

  // ============================================================================
  // UNIFIED VERIFICATION METHODS
  // ============================================================================

  /**
   * Get comprehensive verification status for a user
   */
  async getVerificationStatus(userId: string): Promise<VerificationStatus> {
    try {
      const [userVerification] = await Promise.all([
        this.userService.getUserVerificationStatus(userId),
        // Could add photo verification status here if needed
      ]);

      const overallStatus = this.determineOverallStatus(userVerification);

      return {
        userId,
        userVerification,
        photoVerification: null, // Could be populated from database
        cleanupVerification: null, // Could be populated from database
        overallStatus,
        lastUpdated: new Date(),
      };
    } catch (error) {
      console.error('Failed to get verification status:', error);
      return {
        userId,
        userVerification: null,
        photoVerification: null,
        cleanupVerification: null,
        overallStatus: 'none',
        lastUpdated: new Date(),
      };
    }
  }

  /**
   * Get verification requirements for a mission type
   */
  getVerificationRequirements(missionType: string): VerificationRequirements {
    return this.photoService.getVerificationRequirements(missionType);
  }

  /**
   * Check if verification is required for a mission
   */
  isVerificationRequired(missionType: string, reward: number): boolean {
    return this.photoService.isVerificationRequired(missionType, reward);
  }

  // ============================================================================
  // UTILITY METHODS
  // ============================================================================

  /**
   * Check if user can participate in specific event type
   */
  canParticipateInEvent(user: VerifiableUser, eventType: EventType): boolean {
    return this.userService.canParticipateInEvent(user, eventType);
  }

  /**
   * Check if user needs background check for child-safe events
   */
  needsBackgroundCheck(user: VerifiableUser, isChildSafeEvent: boolean): boolean {
    return this.userService.needsBackgroundCheck(user, isChildSafeEvent);
  }

  /**
   * Get verification badge text for display
   */
  getVerificationBadgeText(user: VerifiableUser): string {
    return this.userService.getVerificationBadgeText(user);
  }

  // ============================================================================
  // PRIVATE METHODS
  // ============================================================================

  /**
   * Determine overall verification status
   */
  private determineOverallStatus(userVerification: UserVerificationResult | null): 'verified' | 'pending' | 'rejected' | 'none' {
    if (!userVerification) {
      return 'none';
    }

    if (userVerification.verified) {
      return 'verified';
    }

    // Could add logic for pending/rejected states based on verification level
    return 'pending';
  }
}

// Export the unified service instance
export const verificationService = UnifiedVerificationService.getInstance();

// Export individual services for direct access if needed
export { UserVerificationService } from './userVerificationService';
export { PhotoVerificationService } from './photoVerificationService';

// Export all types
export * from './verificationTypes';

// Default export
export default verificationService;
