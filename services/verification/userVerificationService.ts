import {
  EventType,
  UserVerificationData,
  UserVerificationResult,
  VerifiableUser,
  VerificationLevel,
} from './verificationTypes';

/**
 * User Verification Service
 * Handles KYC, background checks, and user verification status
 */
export class UserVerificationService {
  private static instance: UserVerificationService;

  public static getInstance(): UserVerificationService {
    if (!UserVerificationService.instance) {
      UserVerificationService.instance = new UserVerificationService();
    }
    return UserVerificationService.instance;
  }

  /**
   * Verify user with KYC and background check data
   */
  async verifyUser(
    data: UserVerificationData
  ): Promise<UserVerificationResult> {
    try {
      // Simulate verification process
      await this.simulateVerificationDelay();

      const verificationLevel = this.determineVerificationLevel(data);
      const verified = verificationLevel !== 'none';

      return {
        verified,
        level: verificationLevel,
        badgeText: this.getVerificationBadgeText({
          id: data.userId,
          verificationLevel,
        } as VerifiableUser),
        canParticipateInEvent: (eventType: EventType) =>
          this.canParticipateInEvent(
            {
              id: data.userId,
              verificationLevel,
            } as VerifiableUser,
            eventType
          ),
        needsBackgroundCheck: (isChildSafeEvent: boolean) =>
          this.needsBackgroundCheck(
            {
              id: data.userId,
              verificationLevel,
            } as VerifiableUser,
            isChildSafeEvent
          ),
        verificationDate: new Date(),
        documents: this.extractDocuments(data),
      };
    } catch (error) {
      console.error('User verification failed:', error);
      throw new Error('User verification failed');
    }
  }

  /**
   * Get user verification status
   */
  async getUserVerificationStatus(
    userId: string
  ): Promise<UserVerificationResult | null> {
    try {
      // In a real app, this would fetch from database
      // For now, return mock data based on user role
      const mockUser = this.createMockVerifiedUser(userId);

      if (
        !mockUser.verificationLevel ||
        mockUser.verificationLevel === 'none'
      ) {
        return null;
      }

      return {
        verified: true,
        level: mockUser.verificationLevel,
        badgeText: this.getVerificationBadgeText(mockUser),
        canParticipateInEvent: (eventType: EventType) =>
          this.canParticipateInEvent(mockUser, eventType),
        needsBackgroundCheck: (isChildSafeEvent: boolean) =>
          this.needsBackgroundCheck(mockUser, isChildSafeEvent),
        verificationDate: mockUser.verificationDate || new Date(),
        documents: mockUser.verificationDocuments || [],
      };
    } catch (error) {
      console.error('Failed to get user verification status:', error);
      return null;
    }
  }

  /**
   * Check if user can participate in specific event type
   */
  canParticipateInEvent(user: VerifiableUser, eventType: EventType): boolean {
    switch (eventType) {
      case 'child_safe':
        return user.backgroundCheckVerified || false;
      case 'family_friendly':
      case 'general':
        return this.isUserVerified(user);
      default:
        return false;
    }
  }

  /**
   * Check if user needs background check for child-safe events
   */
  needsBackgroundCheck(
    user: VerifiableUser,
    isChildSafeEvent: boolean = false
  ): boolean {
    return isChildSafeEvent && !user.backgroundCheckVerified;
  }

  /**
   * Get verification badge text for display
   */
  getVerificationBadgeText(user: VerifiableUser): string {
    const level = this.getVerificationLevel(user);
    switch (level) {
      case 'background_check':
        return 'PEAR Verified Pro';
      case 'kyc':
        return 'PEAR Verified';
      case 'none':
      default:
        return 'Get Verified';
    }
  }

  /**
   * Check if user has any verification
   */
  private isUserVerified(user: VerifiableUser): boolean {
    return user.kycVerified || user.backgroundCheckVerified || false;
  }

  /**
   * Get the highest verification level for user
   */
  private getVerificationLevel(user: VerifiableUser): VerificationLevel {
    if (user.backgroundCheckVerified) return 'background_check';
    if (user.kycVerified) return 'kyc';
    return 'none';
  }

  /**
   * Determine verification level based on submitted data
   */
  private determineVerificationLevel(
    data: UserVerificationData
  ): VerificationLevel {
    // In a real app, this would integrate with KYC/background check services
    if (data.backgroundCheckData) {
      return 'background_check';
    }
    if (data.kycData) {
      return 'kyc';
    }
    return 'none';
  }

  /**
   * Extract document references from verification data
   */
  private extractDocuments(data: UserVerificationData): string[] {
    const documents: string[] = [];

    if (data.kycData?.documentImage) {
      documents.push(data.kycData.documentImage);
    }

    // Add other document references as needed
    return documents;
  }

  /**
   * Create mock verified user based on role
   */
  private createMockVerifiedUser(userId: string): VerifiableUser {
    // In a real app, this would be determined by actual user data
    const role = this.getUserRoleFromId(userId);

    switch (role) {
      case 'admin':
        return {
          id: userId,
          kycVerified: true,
          backgroundCheckVerified: true,
          verificationLevel: 'background_check',
          verificationDate: new Date(),
          verificationDocuments: ['admin_verification.pdf'],
        };
      case 'business':
        return {
          id: userId,
          kycVerified: true,
          backgroundCheckVerified: false,
          verificationLevel: 'kyc',
          verificationDate: new Date(),
          verificationDocuments: ['business_kyc.pdf'],
        };
      case 'trash-hero':
        return {
          id: userId,
          kycVerified: true,
          backgroundCheckVerified: true,
          verificationLevel: 'background_check',
          verificationDate: new Date(),
          verificationDocuments: ['hero_verification.pdf'],
        };
      case 'volunteer':
      default:
        return {
          id: userId,
          kycVerified: false,
          backgroundCheckVerified: false,
          verificationLevel: 'none',
        };
    }
  }

  /**
   * Get user role from ID (mock implementation)
   */
  private getUserRoleFromId(userId: string): string {
    // In a real app, this would query the user database
    if (userId.includes('admin')) return 'admin';
    if (userId.includes('business')) return 'business';
    if (userId.includes('hero')) return 'trash-hero';
    return 'volunteer';
  }

  /**
   * Simulate verification processing delay
   */
  private async simulateVerificationDelay(): Promise<void> {
    // Simulate processing time
    await new Promise(resolve =>
      setTimeout(resolve, 1000 + Math.random() * 2000)
    );
  }
}

export default UserVerificationService.getInstance();
