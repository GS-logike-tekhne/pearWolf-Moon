import { useState, useEffect, useCallback } from 'react';
import { useXP } from '../context/XPContext';

export interface TrashEncounter {
  id: string;
  type: 'plastic_bottle' | 'candy_wrapper' | 'cigarette_butt' | 'broken_glass' | 'metal_can' | 'styrofoam' | 'large_debris' | 'hazardous_waste';
  rarity: 'common' | 'uncommon' | 'rare';
  xpReward: number;
  ecoPointsReward: number;
  coordinates: {
    latitude: number;
    longitude: number;
  };
  spawnedAt: number;
  expiresAt: number;
  isClaimed: boolean;
}

interface EncounterResult {
  type: string;
  rarity: string;
  xpEarned: number;
  ecoPointsEarned: number;
  badgeProgress?: string;
}

export const TRASH_TYPES = {
  plastic_bottle: { name: 'Plastic Bottle', icon: 'bottle', rarity: 'common', xp: 5, ecoPoints: 2 },
  candy_wrapper: { name: 'Candy Wrapper', icon: 'trash', rarity: 'common', xp: 3, ecoPoints: 1 },
  cigarette_butt: { name: 'Cigarette Butt', icon: 'cigarette', rarity: 'common', xp: 2, ecoPoints: 1 },
  broken_glass: { name: 'Broken Glass', icon: 'warning', rarity: 'uncommon', xp: 15, ecoPoints: 5 },
  metal_can: { name: 'Metal Can', icon: 'cube', rarity: 'uncommon', xp: 12, ecoPoints: 4 },
  styrofoam: { name: 'Styrofoam', icon: 'square', rarity: 'uncommon', xp: 10, ecoPoints: 3 },
  large_debris: { name: 'Large Debris', icon: 'construct', rarity: 'rare', xp: 50, ecoPoints: 15 },
  hazardous_waste: { name: 'Hazardous Waste', icon: 'skull', rarity: 'rare', xp: 100, ecoPoints: 25 }
};

export const useTrashEncounters = () => {
  const { addXP } = useXP();
  const [encounters, setEncounters] = useState<TrashEncounter[]>([]);
  const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [encountersCompleted, setEncountersCompleted] = useState(0);

  // Generate random coordinates around user location (150-300m radius)
  const generateNearbyCoordinates = useCallback((centerLat: number, centerLon: number) => {
    const radius = 150 + Math.random() * 150; // 150-300m radius
    const angle = Math.random() * 2 * Math.PI;
    
    // Rough conversion: 1 degree ≈ 111km
    const latOffset = (radius / 111000) * Math.cos(angle);
    const lonOffset = (radius / 111000) * Math.sin(angle) / Math.cos(centerLat * Math.PI / 180);
    
    return {
      latitude: centerLat + latOffset,
      longitude: centerLon + lonOffset
    };
  }, []);

  // Generate random trash type based on rarity weights
  const generateTrashType = useCallback(() => {
    const rand = Math.random();
    if (rand < 0.02) return 'hazardous_waste'; // 2% rare
    if (rand < 0.1) return 'large_debris'; // 8% rare
    if (rand < 0.18) return 'broken_glass'; // 8% uncommon
    if (rand < 0.26) return 'metal_can'; // 8% uncommon
    if (rand < 0.34) return 'styrofoam'; // 8% uncommon
    if (rand < 0.67) return 'candy_wrapper'; // 33% common
    if (rand < 1.0) return 'plastic_bottle'; // 33% common
    return 'cigarette_butt'; // 34% common
  }, []);

  // Spawn new trash encounters
  const spawnEncounters = useCallback((userLat: number, userLon: number) => {
    if (!userLat || !userLon) return;

    const newEncounters: TrashEncounter[] = [];
    const spawnCount = 1 + Math.floor(Math.random() * 3); // 1-3 encounters

    for (let i = 0; i < spawnCount; i++) {
      const trashType = generateTrashType() as keyof typeof TRASH_TYPES;
      const trashData = TRASH_TYPES[trashType];
      const coordinates = generateNearbyCoordinates(userLat, userLon);
      const now = Date.now();
      const expiresAt = now + (10 * 60 * 1000); // 10 minutes

      newEncounters.push({
        id: `encounter_${Date.now()}_${i}`,
        type: trashType,
        rarity: trashData.rarity as 'common' | 'uncommon' | 'rare',
        xpReward: trashData.xp,
        ecoPointsReward: trashData.ecoPoints,
        coordinates,
        spawnedAt: now,
        expiresAt,
        isClaimed: false
      });
    }

    setEncounters(prev => [...prev, ...newEncounters]);
  }, [generateTrashType, generateNearbyCoordinates]);

  // Update user location and spawn encounters
  const updateUserLocation = useCallback((lat: number, lon: number) => {
    setUserLocation({ latitude: lat, longitude: lon });
    spawnEncounters(lat, lon);
  }, [spawnEncounters]);

  // Clean up expired encounters
  useEffect(() => {
    const cleanupInterval = setInterval(() => {
      const now = Date.now();
      setEncounters(prev => prev.filter(encounter => encounter.expiresAt > now));
    }, 60000); // Check every minute

    return () => clearInterval(cleanupInterval);
  }, []);

  // Complete an encounter
  const completeEncounter = useCallback((encounterId: string): EncounterResult => {
    const encounter = encounters.find(e => e.id === encounterId);
    if (!encounter || encounter.isClaimed) {
      throw new Error('Encounter not found or already claimed');
    }

    // Mark as claimed
    setEncounters(prev => prev.map(e => 
      e.id === encounterId ? { ...e, isClaimed: true } : e
    ));

    // Award XP and Eco Points
    addXP(encounter.xpReward, 'trash_encounter');
    setEncountersCompleted(prev => prev + 1);

    // Determine badge progress
    const trashData = TRASH_TYPES[encounter.type];
    let badgeProgress: string | undefined;
    
    if (encountersCompleted >= 99 && encountersCompleted < 100) {
      badgeProgress = 'Trash Hunter +1 (100/100)';
    } else if (encountersCompleted % 10 === 0) {
      badgeProgress = `Trash Hunter +${encountersCompleted / 10}`;
    }

    return {
      type: trashData.name,
      rarity: encounter.rarity,
      xpEarned: encounter.xpReward,
      ecoPointsEarned: encounter.ecoPointsReward,
      badgeProgress
    };
  }, [encounters, addXP, encountersCompleted]);

  // Get encounters near user location
  const getNearbyEncounters = useCallback(() => {
    if (!userLocation) return [];
    
    return encounters.filter(encounter => {
      const distance = Math.sqrt(
        Math.pow(encounter.coordinates.latitude - userLocation.latitude, 2) +
        Math.pow(encounter.coordinates.longitude - userLocation.longitude, 2)
      );
      return distance < 0.005 && !encounter.isClaimed; // Within ~500m
    });
  }, [encounters, userLocation]);

  return {
    encounters: getNearbyEncounters(),
    encountersCompleted,
    updateUserLocation,
    completeEncounter,
    TRASH_TYPES
  };
};
