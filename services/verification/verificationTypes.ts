/**
 * Unified verification types for PEAR application
 * Consolidates user verification, photo verification, and cleanup verification
 */

// ============================================================================
// USER VERIFICATION TYPES
// ============================================================================

export type VerificationLevel = 'none' | 'kyc' | 'background_check';
export type VerificationBadgeType = 'verified' | 'kyc' | 'background_check';

export interface VerifiableUser {
  id: string;
  kycVerified?: boolean;
  backgroundCheckVerified?: boolean;
  verificationLevel?: VerificationLevel;
  verificationDate?: Date;
  verificationDocuments?: string[];
}

export interface UserVerificationData {
  userId: string;
  kycData?: {
    documentType: string;
    documentNumber: string;
    documentImage: string;
  };
  backgroundCheckData?: {
    ssn?: string;
    address: string;
    employmentHistory: string[];
  };
}

export interface UserVerificationResult {
  verified: boolean;
  level: VerificationLevel;
  badgeText: string;
  canParticipateInEvent: (eventType: EventType) => boolean;
  needsBackgroundCheck: (isChildSafeEvent: boolean) => boolean;
  verificationDate: Date;
  documents: string[];
}

// ============================================================================
// PHOTO VERIFICATION TYPES
// ============================================================================

export interface PhotoVerificationData {
  missionId: string;
  userId: string;
  photos: string[];
  beforePhotos?: string[];
  afterPhotos?: string[];
  location: {
    latitude: number;
    longitude: number;
    accuracy?: number;
    address?: string;
  };
  timestamp: Date;
  notes?: string;
}

export interface PhotoVerificationResult {
  isVerified: boolean;
  confidence: number;
  analysis: {
    hasTrash: boolean;
    hasCleanup: boolean;
    beforeAfter: boolean;
    locationMatch: boolean;
    timestampValid: boolean;
    imageQuality: 'good' | 'fair' | 'poor';
  };
  suggestions: string[];
  verificationId: string;
  metadata: {
    processingTime: number;
    imageSizes: Array<{ width: number; height: number }>;
    locationAccuracy?: number;
  };
}

// ============================================================================
// CLEANUP VERIFICATION TYPES
// ============================================================================

export interface CleanupSubmission {
  beforeImageUri: string;
  afterImageUri: string;
  missionId: string;
  location?: {
    latitude: number;
    longitude: number;
    accuracy?: number;
  };
  timestamp: Date;
  notes?: string;
}

export interface CleanupVerificationResult {
  verified: boolean;
  confidence: number;
  details: {
    trashDetectedBefore: boolean;
    trashDetectedAfter: boolean;
    locationVerified: boolean;
    timestampValid: boolean;
    imageQuality: 'good' | 'fair' | 'poor';
    recommendations: string[];
  };
  metadata: {
    beforeImageSize: { width: number; height: number };
    afterImageSize: { width: number; height: number };
    locationAccuracy?: number;
    processingTime: number;
  };
}

// ============================================================================
// UNIFIED VERIFICATION TYPES
// ============================================================================

export type EventType = 'general' | 'family_friendly' | 'child_safe';
export type VerificationType = 'user' | 'photo' | 'cleanup';

export interface VerificationStatus {
  userId: string;
  userVerification: UserVerificationResult | null;
  photoVerification: PhotoVerificationResult | null;
  cleanupVerification: CleanupVerificationResult | null;
  overallStatus: 'verified' | 'pending' | 'rejected' | 'none';
  lastUpdated: Date;
}

export interface VerificationRequirements {
  photosRequired: number;
  videoAllowed: boolean;
  locationRequired: boolean;
  timestampRequired: boolean;
  minImageQuality: 'good' | 'fair' | 'poor';
  userVerificationRequired: boolean;
  backgroundCheckRequired: boolean;
}

// ============================================================================
// VERIFICATION SERVICE INTERFACE
// ============================================================================

export interface VerificationService {
  // User verification
  verifyUser(data: UserVerificationData): Promise<UserVerificationResult>;
  getUserVerificationStatus(
    userId: string
  ): Promise<UserVerificationResult | null>;

  // Photo verification
  verifyPhotos(data: PhotoVerificationData): Promise<PhotoVerificationResult>;
  verifyCleanup(
    submission: CleanupSubmission
  ): Promise<CleanupVerificationResult>;

  // Unified verification
  getVerificationStatus(userId: string): Promise<VerificationStatus>;
  getVerificationRequirements(missionType: string): VerificationRequirements;
  isVerificationRequired(missionType: string, reward: number): boolean;

  // Utility functions
  canParticipateInEvent(user: VerifiableUser, eventType: EventType): boolean;
  needsBackgroundCheck(
    user: VerifiableUser,
    isChildSafeEvent: boolean
  ): boolean;
  getVerificationBadgeText(user: VerifiableUser): string;
}

// ============================================================================
// VERIFICATION CONFIGURATION
// ============================================================================

export interface VerificationConfig {
  confidenceThreshold: number;
  imageQualityThreshold: 'good' | 'fair' | 'poor';
  locationAccuracyThreshold: number; // meters
  timestampValidityHours: number;
  processingTimeoutMs: number;
  retryAttempts: number;
  cloudAIEnabled: boolean;
  fallbackToMock: boolean;
}

export const DEFAULT_VERIFICATION_CONFIG: VerificationConfig = {
  confidenceThreshold: 75,
  imageQualityThreshold: 'fair',
  locationAccuracyThreshold: 50,
  timestampValidityHours: 2,
  processingTimeoutMs: 30000,
  retryAttempts: 3,
  cloudAIEnabled: false,
  fallbackToMock: true,
};
