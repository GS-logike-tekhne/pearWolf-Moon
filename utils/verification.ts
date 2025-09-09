export type VerificationLevel = 'none' | 'kyc' | 'background_check';
export type VerificationBadgeType = 'verified' | 'kyc' | 'background_check';

// Flexible user type for verification functions
type VerifiableUser = {
  kycVerified?: boolean;
  backgroundCheckVerified?: boolean;
  verificationLevel?: VerificationLevel;
};

// Check if user has any verification
export const isUserVerified = (user: VerifiableUser): boolean => {
  return user.kycVerified || user.backgroundCheckVerified || false;
};

// Get the highest verification level for display
export const getVerificationLevel = (user: VerifiableUser): VerificationLevel => {
  if (user.backgroundCheckVerified) return 'background_check';
  if (user.kycVerified) return 'kyc';
  return 'none';
};

// Get verification badge text
export const getVerificationBadgeText = (user: VerifiableUser): string => {
  const level = getVerificationLevel(user);
  switch (level) {
    case 'background_check':
      return 'PEAR Verified Pro';
    case 'kyc':
      return 'PEAR Verified';
    case 'none':
    default:
      return 'Get Verified';
  }
};

// Check if user needs background check for family events
export const needsBackgroundCheck = (user: VerifiableUser, isChildSafeEvent: boolean = false): boolean => {
  return isChildSafeEvent && !user.backgroundCheckVerified;
};

// Get verification status for specific event type
export const canParticipateInEvent = (user: VerifiableUser, eventType: 'general' | 'family_friendly' | 'child_safe' = 'general'): boolean => {
  switch (eventType) {
    case 'child_safe':
      return user.backgroundCheckVerified || false;
    case 'family_friendly':
    case 'general':
      return isUserVerified(user);
    default:
      return false;
  }
};

// Demo verification - set some users as verified for demo purposes
export const createDemoVerifiedUser = (role: string): VerifiableUser => {
  switch (role) {
    case 'admin':
      return {
        kycVerified: true,
        backgroundCheckVerified: true,
        verificationLevel: 'background_check'
      };
    case 'business':
      return {
        kycVerified: true,
        backgroundCheckVerified: false,
        verificationLevel: 'kyc'
      };
    case 'trash-hero':
      return {
        kycVerified: true,
        backgroundCheckVerified: true,
        verificationLevel: 'background_check'
      };
    case 'volunteer':
      return {
        kycVerified: false,
        backgroundCheckVerified: false,
        verificationLevel: 'none'
      };
    default:
      return {
        kycVerified: false,
        backgroundCheckVerified: false,
        verificationLevel: 'none'
      };
  }
};