import { Image } from 'react-native';
import {
  PhotoVerificationData,
  PhotoVerificationResult,
  CleanupSubmission,
  CleanupVerificationResult,
  VerificationRequirements,
} from './verificationTypes';

/**
 * Photo Verification Service
 * Handles photo verification for missions and cleanup verification
 */
export class PhotoVerificationService {
  private static instance: PhotoVerificationService;

  public static getInstance(): PhotoVerificationService {
    if (!PhotoVerificationService.instance) {
      PhotoVerificationService.instance = new PhotoVerificationService();
    }
    return PhotoVerificationService.instance;
  }

  /**
   * Verify photos for mission completion
   */
  async verifyPhotos(data: PhotoVerificationData): Promise<PhotoVerificationResult> {
    const startTime = Date.now();
    
    try {
      // Simulate AI verification process
      await this.simulateProcessingDelay();

      const analysis = await this.analyzePhotos(data);
      const confidence = this.calculateConfidence(analysis);
      const isVerified = confidence > 75;

      return {
        isVerified,
        confidence,
        analysis,
        suggestions: this.generateSuggestions(analysis, confidence),
        verificationId: this.generateVerificationId(),
        metadata: {
          processingTime: Date.now() - startTime,
          imageSizes: await this.getImageSizes(data.photos),
          locationAccuracy: data.location.accuracy,
        },
      };
    } catch (error) {
      console.error('Photo verification failed:', error);
      throw new Error('Photo verification failed');
    }
  }

  /**
   * Verify cleanup photos (before/after)
   */
  async verifyCleanup(submission: CleanupSubmission): Promise<CleanupVerificationResult> {
    const startTime = Date.now();

    try {
      // Get image dimensions for quality assessment
      const beforeImageSize = await this.getImageDimensions(submission.beforeImageUri);
      const afterImageSize = await this.getImageDimensions(submission.afterImageUri);

      // Simulate AI analysis with realistic confidence scoring
      const analysis = await this.simulateCleanupAnalysis(
        submission,
        beforeImageSize,
        afterImageSize
      );

      const processingTime = Date.now() - startTime;

      return {
        verified: analysis.confidence > 75,
        confidence: analysis.confidence,
        details: {
          trashDetectedBefore: analysis.trashDetectedBefore,
          trashDetectedAfter: analysis.trashDetectedAfter,
          locationVerified: analysis.locationVerified,
          timestampValid: analysis.timestampValid,
          imageQuality: analysis.imageQuality,
          recommendations: analysis.recommendations,
        },
        metadata: {
          beforeImageSize,
          afterImageSize,
          locationAccuracy: submission.location?.accuracy,
          processingTime,
        },
      };
    } catch (error) {
      console.error('Error in cleanup verification:', error);
      return this.createFailedVerificationResult(startTime);
    }
  }

  /**
   * Get verification requirements for a mission type
   */
  getVerificationRequirements(missionType: string): VerificationRequirements {
    const requirements: VerificationRequirements = {
      photosRequired: 2, // before and after
      videoAllowed: false,
      locationRequired: true,
      timestampRequired: true,
      minImageQuality: 'fair',
      userVerificationRequired: false,
      backgroundCheckRequired: false,
    };

    if (missionType === 'PAID_CLEANUP') {
      requirements.photosRequired = 3; // before, during, after
      requirements.videoAllowed = true;
      requirements.minImageQuality = 'good';
      requirements.userVerificationRequired = true;
    }

    if (missionType === 'CHILD_SAFE_EVENT') {
      requirements.backgroundCheckRequired = true;
    }

    return requirements;
  }

  /**
   * Check if verification is required for a mission
   */
  isVerificationRequired(missionType: string, reward: number): boolean {
    // Require verification for high-value missions or specific types
    return (
      reward > 100 ||
      missionType === 'PAID_CLEANUP' ||
      missionType === 'SPONSORED_MISSION' ||
      missionType === 'CHILD_SAFE_EVENT'
    );
  }

  // ============================================================================
  // PRIVATE METHODS
  // ============================================================================

  /**
   * Analyze photos for verification
   */
  private async analyzePhotos(data: PhotoVerificationData) {
    const imageSizes = await this.getImageSizes(data.photos);
    const avgQuality = this.calculateAverageImageQuality(imageSizes);

    return {
      hasTrash: Math.random() > 0.3, // 70% chance of detecting trash
      hasCleanup: Math.random() > 0.4, // 60% chance of detecting cleanup
      beforeAfter: data.beforePhotos && data.afterPhotos ? true : false,
      locationMatch: this.verifyLocationMatch(data.location),
      timestampValid: this.verifyTimestamp(data.timestamp),
      imageQuality: avgQuality,
    };
  }

  /**
   * Calculate verification confidence
   */
  private calculateConfidence(analysis: any): number {
    let confidence = 50; // Base confidence

    if (analysis.hasTrash) confidence += 15;
    if (analysis.hasCleanup) confidence += 20;
    if (analysis.beforeAfter) confidence += 10;
    if (analysis.locationMatch) confidence += 10;
    if (analysis.timestampValid) confidence += 5;

    // Adjust based on image quality
    switch (analysis.imageQuality) {
      case 'good':
        confidence += 15;
        break;
      case 'fair':
        confidence += 5;
        break;
      case 'poor':
        confidence -= 10;
        break;
    }

    // Add some randomness for realism
    confidence += (Math.random() - 0.5) * 10;

    return Math.max(0, Math.min(100, Math.round(confidence)));
  }

  /**
   * Generate suggestions based on analysis
   */
  private generateSuggestions(analysis: any, confidence: number): string[] {
    const suggestions: string[] = [];

    if (confidence < 50) {
      suggestions.push('Consider retaking photos with better lighting');
      suggestions.push('Ensure photos clearly show the cleanup area');
    }

    if (analysis.imageQuality === 'poor') {
      suggestions.push('Use higher resolution photos for better verification');
    }

    if (!analysis.locationMatch) {
      suggestions.push('Enable GPS for better location verification');
    }

    if (!analysis.timestampValid) {
      suggestions.push('Photos should be taken during or shortly after cleanup');
    }

    if (confidence > 85) {
      suggestions.push('Excellent cleanup verification!');
    }

    return suggestions;
  }

  /**
   * Simulate cleanup analysis
   */
  private async simulateCleanupAnalysis(
    submission: CleanupSubmission,
    beforeSize: { width: number; height: number },
    afterSize: { width: number; height: number }
  ) {
    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));

    let confidence = 50;
    const recommendations: string[] = [];

    // Image quality assessment
    const beforeQuality = this.assessImageQuality(beforeSize);
    const afterQuality = this.assessImageQuality(afterSize);
    const imageQuality: 'good' | 'fair' | 'poor' =
      beforeQuality === 'good' && afterQuality === 'good'
        ? 'good'
        : beforeQuality === 'fair' || afterQuality === 'fair'
          ? 'fair'
          : 'poor';

    // Adjust confidence based on image quality
    if (imageQuality === 'good') confidence += 20;
    else if (imageQuality === 'fair') confidence += 10;
    else confidence -= 15;

    // Simulate trash detection
    const trashDetectedBefore = Math.random() > 0.3;
    const trashDetectedAfter = Math.random() > 0.7;

    if (trashDetectedBefore && !trashDetectedAfter) {
      confidence += 25;
    } else if (trashDetectedBefore && trashDetectedAfter) {
      confidence -= 10;
      recommendations.push('Consider taking another photo showing more complete cleanup');
    } else if (!trashDetectedBefore) {
      confidence -= 20;
      recommendations.push('Before photo should clearly show the area that needs cleaning');
    }

    // Location verification
    const locationVerified = submission.location && 
      submission.location.accuracy && 
      submission.location.accuracy < 50;

    if (locationVerified) {
      confidence += 10;
    } else {
      confidence -= 5;
      recommendations.push('Enable GPS for better location verification');
    }

    // Timestamp validation
    const timestampValid = Date.now() - submission.timestamp.getTime() < 2 * 60 * 60 * 1000;

    if (timestampValid) {
      confidence += 5;
    } else {
      confidence -= 15;
      recommendations.push('Photos should be taken during or shortly after cleanup');
    }

    // Add randomness and ensure bounds
    confidence += (Math.random() - 0.5) * 10;
    confidence = Math.max(0, Math.min(100, Math.round(confidence)));

    return {
      confidence,
      trashDetectedBefore,
      trashDetectedAfter,
      locationVerified: !!locationVerified,
      timestampValid,
      imageQuality,
      recommendations,
    };
  }

  /**
   * Get image dimensions
   */
  private getImageDimensions(uri: string): Promise<{ width: number; height: number }> {
    return new Promise((resolve, reject) => {
      (Image as any).getSize(
        uri,
        (width: number, height: number) => resolve({ width, height }),
        (error: any) => reject(error)
      );
    });
  }

  /**
   * Get sizes for multiple images
   */
  private async getImageSizes(photos: string[]): Promise<Array<{ width: number; height: number }>> {
    const sizes = [];
    for (const photo of photos) {
      try {
        const size = await this.getImageDimensions(photo);
        sizes.push(size);
      } catch (error) {
        sizes.push({ width: 0, height: 0 });
      }
    }
    return sizes;
  }

  /**
   * Assess image quality based on dimensions
   */
  private assessImageQuality(size: { width: number; height: number }): 'good' | 'fair' | 'poor' {
    const megapixels = (size.width * size.height) / 1000000;
    if (megapixels >= 2) return 'good';
    if (megapixels >= 1) return 'fair';
    return 'poor';
  }

  /**
   * Calculate average image quality
   */
  private calculateAverageImageQuality(sizes: Array<{ width: number; height: number }>): 'good' | 'fair' | 'poor' {
    const qualities = sizes.map(size => this.assessImageQuality(size));
    
    if (qualities.every(q => q === 'good')) return 'good';
    if (qualities.some(q => q === 'good') || qualities.every(q => q === 'fair')) return 'fair';
    return 'poor';
  }

  /**
   * Verify location match
   */
  private verifyLocationMatch(location: any): boolean {
    // In a real app, this would verify against mission location
    return location && location.latitude && location.longitude;
  }

  /**
   * Verify timestamp validity
   */
  private verifyTimestamp(timestamp: Date): boolean {
    const now = Date.now();
    const photoTime = timestamp.getTime();
    const hoursDiff = (now - photoTime) / (1000 * 60 * 60);
    return hoursDiff <= 2; // Within 2 hours
  }

  /**
   * Generate verification ID
   */
  private generateVerificationId(): string {
    return `verification_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Simulate processing delay
   */
  private async simulateProcessingDelay(): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));
  }

  /**
   * Create failed verification result
   */
  private createFailedVerificationResult(startTime: number): CleanupVerificationResult {
    return {
      verified: false,
      confidence: 0,
      details: {
        trashDetectedBefore: false,
        trashDetectedAfter: false,
        locationVerified: false,
        timestampValid: false,
        imageQuality: 'poor',
        recommendations: ['Verification failed due to technical error. Please try again.'],
      },
      metadata: {
        beforeImageSize: { width: 0, height: 0 },
        afterImageSize: { width: 0, height: 0 },
        processingTime: Date.now() - startTime,
      },
    };
  }
}

export default PhotoVerificationService.getInstance();
