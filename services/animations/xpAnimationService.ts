import { Animated, Easing } from 'react-native';

export interface XPAnimationConfig {
  duration: number;
  delay?: number;
  easing?: any;
  scale?: number;
  rotation?: number;
  opacity?: number;
}

export interface LevelUpAnimation {
  xpGained: number;
  newLevel: number;
  badgesEarned: string[];
  totalXP: number;
  previousLevel: number;
}

export interface CelebrationAnimation {
  type: 'xp_gain' | 'level_up' | 'badge_earned' | 'mission_complete';
  value: number;
  message: string;
  color: string;
  icon: string;
}

export class XPAnimationService {
  private static instance: XPAnimationService;
  private animations: Map<string, Animated.Value> = new Map();

  private constructor() {}

  public static getInstance(): XPAnimationService {
    if (!XPAnimationService.instance) {
      XPAnimationService.instance = new XPAnimationService();
    }
    return XPAnimationService.instance;
  }

  /**
   * Create XP gain animation (floating number)
   */
  createXPGainAnimation(
    xpAmount: number,
    position: { x: number; y: number }
  ): Animated.CompositeAnimation {
    const opacity = new Animated.Value(0);
    const translateY = new Animated.Value(0);
    const scale = new Animated.Value(0.5);

    this.animations.set(`xp_${Date.now()}`, opacity);

    return Animated.parallel([
      // Fade in and scale up
      Animated.timing(opacity, {
        toValue: 1,
        duration: 300,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
      Animated.timing(scale, {
        toValue: 1,
        duration: 300,
        easing: Easing.out(Easing.back(1.5)),
        useNativeDriver: true,
      }),
      // Float up and fade out
      Animated.sequence([
        Animated.delay(500),
        Animated.parallel([
          Animated.timing(translateY, {
            toValue: -50,
            duration: 1000,
            easing: Easing.out(Easing.quad),
            useNativeDriver: true,
          }),
          Animated.timing(opacity, {
            toValue: 0,
            duration: 1000,
            easing: Easing.out(Easing.quad),
            useNativeDriver: true,
          }),
        ]),
      ]),
    ]);
  }

  /**
   * Create level up animation (Pokémon-style)
   */
  createLevelUpAnimation(config: LevelUpAnimation): Animated.CompositeAnimation {
    const scale = new Animated.Value(0);
    const rotation = new Animated.Value(0);
    const opacity = new Animated.Value(0);
    const glow = new Animated.Value(0);

    return Animated.sequence([
      // Initial appearance
      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(scale, {
          toValue: 1.2,
          duration: 400,
          easing: Easing.out(Easing.back(1.5)),
          useNativeDriver: true,
        }),
      ]),
      // Glow effect
      Animated.loop(
        Animated.sequence([
          Animated.timing(glow, {
            toValue: 1,
            duration: 800,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
          }),
          Animated.timing(glow, {
            toValue: 0,
            duration: 800,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
          }),
        ]),
        { iterations: 3 }
      ),
      // Final scale down
      Animated.timing(scale, {
        toValue: 1,
        duration: 300,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
    ]);
  }

  /**
   * Create confetti animation
   */
  createConfettiAnimation(): Animated.CompositeAnimation[] {
    const confettiPieces = Array.from({ length: 20 }, (_, i) => {
      const translateY = new Animated.Value(-100);
      const translateX = new Animated.Value(0);
      const rotation = new Animated.Value(0);
      const opacity = new Animated.Value(1);

      const randomX = (Math.random() - 0.5) * 400;
      const randomRotation = Math.random() * 720;

      return Animated.parallel([
        Animated.timing(translateY, {
          toValue: 800,
          duration: 3000 + Math.random() * 1000,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(translateX, {
          toValue: randomX,
          duration: 3000 + Math.random() * 1000,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(rotation, {
          toValue: randomRotation,
          duration: 3000 + Math.random() * 1000,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
        Animated.sequence([
          Animated.delay(2000),
          Animated.timing(opacity, {
            toValue: 0,
            duration: 1000,
            useNativeDriver: true,
          }),
        ]),
      ]);
    });

    return confettiPieces;
  }

  /**
   * Create badge earned animation
   */
  createBadgeAnimation(badgeName: string): Animated.CompositeAnimation {
    const scale = new Animated.Value(0);
    const rotation = new Animated.Value(0);
    const opacity = new Animated.Value(0);

    return Animated.sequence([
      // Pop in
      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(scale, {
          toValue: 1.3,
          duration: 400,
          easing: Easing.out(Easing.back(2)),
          useNativeDriver: true,
        }),
        Animated.timing(rotation, {
          toValue: 1,
          duration: 600,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
      ]),
      // Bounce
      Animated.sequence([
        Animated.timing(scale, {
          toValue: 0.9,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.timing(scale, {
          toValue: 1.1,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.timing(scale, {
          toValue: 1,
          duration: 100,
          useNativeDriver: true,
        }),
      ]),
    ]);
  }

  /**
   * Create mission complete celebration
   */
  createMissionCompleteAnimation(): Animated.CompositeAnimation {
    const scale = new Animated.Value(0);
    const opacity = new Animated.Value(0);
    const pulse = new Animated.Value(1);

    return Animated.sequence([
      // Initial pop
      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(scale, {
          toValue: 1,
          duration: 400,
          easing: Easing.out(Easing.back(1.5)),
          useNativeDriver: true,
        }),
      ]),
      // Pulse effect
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulse, {
            toValue: 1.1,
            duration: 500,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
          }),
          Animated.timing(pulse, {
            toValue: 1,
            duration: 500,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
          }),
        ]),
        { iterations: 2 }
      ),
    ]);
  }

  /**
   * Create XP flash effect
   */
  createXPFlashAnimation(): Animated.CompositeAnimation {
    const opacity = new Animated.Value(0);
    const scale = new Animated.Value(1);

    return Animated.sequence([
      // Flash in
      Animated.timing(opacity, {
        toValue: 0.8,
        duration: 100,
        useNativeDriver: true,
      }),
      // Flash out
      Animated.timing(opacity, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
      // Scale pulse
      Animated.sequence([
        Animated.timing(scale, {
          toValue: 1.2,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.timing(scale, {
          toValue: 1,
          duration: 150,
          useNativeDriver: true,
        }),
      ]),
    ]);
  }

  /**
   * Create evolution-style animation
   */
  createEvolutionAnimation(): Animated.CompositeAnimation {
    const scale = new Animated.Value(1);
    const rotation = new Animated.Value(0);
    const opacity = new Animated.Value(1);

    return Animated.sequence([
      // Shrink and rotate
      Animated.parallel([
        Animated.timing(scale, {
          toValue: 0.1,
          duration: 800,
          easing: Easing.in(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(rotation, {
          toValue: 360,
          duration: 800,
          easing: Easing.in(Easing.quad),
          useNativeDriver: true,
        }),
      ]),
      // Pause
      Animated.delay(200),
      // Grow back with new form
      Animated.parallel([
        Animated.timing(scale, {
          toValue: 1.2,
          duration: 600,
          easing: Easing.out(Easing.back(1.5)),
          useNativeDriver: true,
        }),
        Animated.timing(rotation, {
          toValue: 720,
          duration: 600,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
      ]),
      // Settle
      Animated.timing(scale, {
        toValue: 1,
        duration: 200,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
    ]);
  }

  /**
   * Create combo multiplier animation
   */
  createComboAnimation(multiplier: number): Animated.CompositeAnimation {
    const scale = new Animated.Value(0);
    const opacity = new Animated.Value(0);
    const rotation = new Animated.Value(0);

    return Animated.sequence([
      // Pop in
      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(scale, {
          toValue: 1.5,
          duration: 300,
          easing: Easing.out(Easing.back(2)),
          useNativeDriver: true,
        }),
        Animated.timing(rotation, {
          toValue: 360,
          duration: 400,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
      ]),
      // Hold
      Animated.delay(1000),
      // Fade out
      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(scale, {
          toValue: 0.5,
          duration: 300,
          useNativeDriver: true,
        }),
      ]),
    ]);
  }

  /**
   * Clean up animations
   */
  cleanup(): void {
    this.animations.forEach(animation => {
      animation.removeAllListeners();
    });
    this.animations.clear();
  }

  /**
   * Get animation value by key
   */
  getAnimation(key: string): Animated.Value | undefined {
    return this.animations.get(key);
  }

  /**
   * Create custom animation
   */
  createCustomAnimation(config: XPAnimationConfig): Animated.CompositeAnimation {
    const animatedValue = new Animated.Value(0);
    const key = `custom_${Date.now()}`;
    this.animations.set(key, animatedValue);

    return Animated.timing(animatedValue, {
      toValue: 1,
      duration: config.duration,
      delay: config.delay || 0,
      easing: config.easing || Easing.out(Easing.quad),
      useNativeDriver: true,
    });
  }
}

export default XPAnimationService.getInstance();
