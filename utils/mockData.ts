// Centralized mock data for PEAR Verified Missions system
// Single source of truth for all mock data

export interface VerifiedMission {
  id: string;
  title: string;
  description: string;
  location: {
    name: string;
    coordinates: {
      latitude: number;
      longitude: number;
    };
  };
  raised: number;
  goal: number;
  donors: number;
  urgency: 'high' | 'medium' | 'low';
  participants: number;
  organizer: string;
  startDate: string;
  endDate: string;
  beforePhotos?: string[];
  afterPhotos?: string[];
  isVerified: boolean;
  category: 'cleanup' | 'restoration' | 'education' | 'conservation';
}

export interface Contributor {
  id: string;
  name: string;
  missionsCompleted: number;
  totalXP: number;
  rank: number;
  badge?: string;
  totalFunding?: number;
}

export interface FeaturedCleanup {
  id: number;
  title: string;
  location: string;
  raised: number;
  goal: number;
  donors: number;
  urgency: 'high' | 'medium' | 'low';
}

export interface UserStats {
  trashHero: {
    verifiedEvents: number;
    jobsCompleted: number;
    totalEarned: string;
    impactRadius: string;
    successRate: string;
    hoursWorked: string;
  };
  impactWarrior: {
    verifiedEvents: number;
    eventsJoined: number;
    impactPoints: string;
    communityRadius: string;
    cleanupsLed: number;
    volunteerHours: string;
  };
  business: {
    verifiedEvents: number;
    fundedJobs: number;
    totalInvestment: string;
    impactRadius: string;
    jobsCreated: number;
    co2Offset: string;
  };
  admin: {
    verifiedEvents: number;
    usersManaged: number;
    systemUptime: string;
    platformReach: string;
    issuesResolved: number;
    jobsOverseen: number;
  };
}

// Eco Station Types
export interface EcoStation {
  id: string;
  name: string;
  type: 'recycling-depot' | 'analytics-hub' | 'pearthquake-event';
  location: {
    name: string;
    coordinates: {
      latitude: number;
      longitude: number;
    };
  };
  level: number;
  communityRating: number;
  isActive: boolean;
  requiredRole?: 'trash-hero' | 'impact-warrior' | 'eco-defender';
  xpReward: number;
  ecoPointsReward: number;
  badgeReward?: string;
  description: string;
  maxParticipants?: number;
  currentParticipants?: number;
  startTime?: string;
  endTime?: string;
  globalEvent?: boolean;
}

export interface StationMission {
  id: string;
  stationId: string;
  title: string;
  description: string;
  type: 'sorting' | 'photo-verification' | 'data-collection' | 'community-cleanup';
  difficulty: 'easy' | 'medium' | 'hard';
  xpReward: number;
  ecoPointsReward: number;
  timeLimit?: number; // in minutes
  requirements?: string[];
}

// Mock data exports
export const mockVerifiedMissions: VerifiedMission[] = [
  {
    id: 'verified-1',
    title: 'PEAR Beach Cleanup Marathon',
    description: 'Join our verified beach cleanup to protect marine life and coastal ecosystems',
    location: {
      name: 'Malibu Beach',
      coordinates: { latitude: 34.0259, longitude: -118.7798 },
    },
    raised: 1200,
    goal: 2000,
    donors: 34,
    urgency: 'high',
    participants: 25,
    organizer: 'PEAR Community',
    startDate: '2024-01-15',
    endDate: '2024-01-22',
    isVerified: true,
    category: 'cleanup'
  },
  {
    id: 'verified-2',
    title: 'PEAR Park Restoration Project',
    description: 'Verified habitat restoration and trail maintenance initiative',
    location: {
      name: 'Griffith Park',
      coordinates: { latitude: 34.1361, longitude: -118.3004 },
    },
    raised: 800,
    goal: 1500,
    donors: 18,
    urgency: 'medium',
    participants: 15,
    organizer: 'PEAR Community',
    startDate: '2024-01-20',
    endDate: '2024-01-27',
    isVerified: true,
    category: 'restoration'
  },
  {
    id: 'verified-3',
    title: 'PEAR River Trail Cleanup',
    description: 'Critical cleanup of LA River Trail to protect watershed and wildlife',
    location: {
      name: 'LA River Trail',
      coordinates: { latitude: 34.0736, longitude: -118.2406 },
    },
    raised: 450,
    goal: 1000,
    donors: 12,
    urgency: 'high',
    participants: 8,
    organizer: 'PEAR Community',
    startDate: '2024-01-25',
    endDate: '2024-02-01',
    isVerified: true,
    category: 'cleanup'
  },
  {
    id: 'verified-4',
    title: 'PEAR Ocean Conservation Workshop',
    description: 'Educational workshop on ocean conservation and plastic reduction',
    location: {
      name: 'Santa Monica Pier',
      coordinates: { latitude: 34.0089, longitude: -118.4973 },
    },
    raised: 600,
    goal: 800,
    donors: 22,
    urgency: 'low',
    participants: 30,
    organizer: 'PEAR Community',
    startDate: '2024-02-01',
    endDate: '2024-02-01',
    isVerified: true,
    category: 'education'
  },
  {
    id: 'verified-5',
    title: 'PEAR Wildlife Habitat Restoration',
    description: 'Verified restoration of critical wildlife habitat in urban park',
    location: {
      name: 'Echo Park',
      coordinates: { latitude: 34.0781, longitude: -118.2587 },
    },
    raised: 950,
    goal: 1200,
    donors: 28,
    urgency: 'medium',
    participants: 12,
    organizer: 'PEAR Community',
    startDate: '2024-02-05',
    endDate: '2024-02-12',
    isVerified: true,
    category: 'conservation'
  }
];

export const mockFeaturedCleanups: FeaturedCleanup[] = [
  {
    id: 1,
    title: 'Beach Cleanup Marathon',
    location: 'Santa Monica Beach',
    raised: 1200,
    goal: 2000,
    donors: 34,
    urgency: 'high',
  },
  {
    id: 2,
    title: 'Park Restoration Project',
    location: 'Central Park',
    raised: 800,
    goal: 1500,
    donors: 18,
    urgency: 'medium',
  },
  {
    id: 3,
    title: 'River Trail Cleanup',
    location: 'LA River Trail',
    raised: 450,
    goal: 1000,
    donors: 12,
    urgency: 'low',
  },
];

export const mockLeaderboardData: Contributor[] = [
  {
    id: '1',
    name: 'EcoQueen88',
    missionsCompleted: 12,
    totalXP: 4500,
    rank: 1,
    badge: 'Eco Champion'
  },
  {
    id: '2',
    name: 'TrashTitan',
    missionsCompleted: 9,
    totalXP: 3200,
    rank: 2,
    badge: 'Cleanup Master'
  },
  {
    id: '3',
    name: 'ZeroWasteZane',
    missionsCompleted: 7,
    totalXP: 2800,
    rank: 3,
    badge: 'Impact Warrior'
  },
  {
    id: '4',
    name: 'GreenGuru',
    missionsCompleted: 6,
    totalXP: 2100,
    rank: 4
  },
  {
    id: '5',
    name: 'OceanSaver',
    missionsCompleted: 5,
    totalXP: 1800,
    rank: 5
  }
];

export const mockTopContributors: Contributor[] = [
  {
    id: '1',
    name: 'EcoQueen88',
    missionsCompleted: 12,
    totalXP: 4500,
    totalFunding: 1250,
    rank: 1,
    badge: 'Eco Champion'
  },
  {
    id: '2',
    name: 'TrashTitan',
    missionsCompleted: 9,
    totalXP: 3200,
    totalFunding: 980,
    rank: 2,
    badge: 'Cleanup Master'
  },
  {
    id: '3',
    name: 'ZeroWasteZane',
    missionsCompleted: 7,
    totalXP: 2800,
    totalFunding: 750,
    rank: 3,
    badge: 'Impact Warrior'
  },
  {
    id: '4',
    name: 'GreenGuru',
    missionsCompleted: 6,
    totalXP: 2100,
    totalFunding: 650,
    rank: 4
  },
  {
    id: '5',
    name: 'OceanSaver',
    missionsCompleted: 5,
    totalXP: 1800,
    totalFunding: 580,
    rank: 5
  }
];

export const mockUserStats: UserStats = {
  trashHero: {
    verifiedEvents: 3,
    jobsCompleted: 47,
    totalEarned: '$2,340',
    impactRadius: '12.3 km²',
    successRate: '97%',
    hoursWorked: '156h',
  },
  impactWarrior: {
    verifiedEvents: 5,
    eventsJoined: 34,
    impactPoints: '1,680',
    communityRadius: '8.7 km²',
    cleanupsLed: 12,
    volunteerHours: '128h',
  },
  business: {
    verifiedEvents: 2,
    fundedJobs: 12,
    totalInvestment: '$3,240',
    impactRadius: '8.5 km²',
    jobsCreated: 47,
    co2Offset: '850 kg',
  },
  admin: {
    verifiedEvents: 8,
    usersManaged: 1247,
    systemUptime: '99.8%',
    platformReach: '15 cities',
    issuesResolved: 156,
    jobsOverseen: 892,
  },
};

export const mockFundData = {
  totalRaised: 15420,
  monthlyGoal: 25000,
  activeCleanups: 12,
  donorCount: 247,
};

// Helper functions
export const getVerifiedEventsByLocation = (latitude: number, longitude: number, radiusMiles: number = 10): VerifiedMission[] => {
  // Mock function to filter events by location
  // In real implementation, this would calculate distances
  return mockVerifiedMissions;
};

export const getVerifiedEventById = (id: string): VerifiedMission | undefined => {
  return mockVerifiedMissions.find(event => event.id === id);
};

export const getUserStatsByRole = (role: string) => {
  switch (role) {
    case 'trash-hero':
      return mockUserStats.trashHero;
    case 'impact-warrior':
      return mockUserStats.impactWarrior;
    case 'business':
      return mockUserStats.business;
    case 'admin':
      return mockUserStats.admin;
    default:
      return mockUserStats.business;
  }
};

// Eco Station Mock Data
export const mockEcoStations: EcoStation[] = [
  // 🟢 Recycling Depots (Trash Hero-specific)
  {
    id: 'recycling-depot-1',
    name: 'Downtown Recycling Hub',
    type: 'recycling-depot',
    location: {
      name: 'Downtown LA',
      coordinates: { latitude: 34.0522, longitude: -118.2437 }
    },
    level: 3,
    communityRating: 4.8,
    isActive: true,
    requiredRole: 'trash-hero',
    xpReward: 75,
    ecoPointsReward: 25,
    badgeReward: 'Waste Alchemist',
    description: 'Advanced sorting station for recycling education and waste management',
    maxParticipants: 20,
    currentParticipants: 12
  },
  {
    id: 'recycling-depot-2',
    name: 'Santa Monica Sorting Center',
    type: 'recycling-depot',
    location: {
      name: 'Santa Monica',
      coordinates: { latitude: 34.0195, longitude: -118.4912 }
    },
    level: 2,
    communityRating: 4.5,
    isActive: true,
    requiredRole: 'trash-hero',
    xpReward: 60,
    ecoPointsReward: 20,
    badgeReward: 'Recycling Champion',
    description: 'Coastal recycling station with ocean plastic focus',
    maxParticipants: 15,
    currentParticipants: 8
  },

  // 🔵 Eco Analytics Hubs (Eco Defender-specific)
  {
    id: 'analytics-hub-1',
    name: 'Environmental Data Center',
    type: 'analytics-hub',
    location: {
      name: 'Griffith Observatory',
      coordinates: { latitude: 34.1183, longitude: -118.3004 }
    },
    level: 4,
    communityRating: 4.9,
    isActive: true,
    requiredRole: 'eco-defender',
    xpReward: 100,
    ecoPointsReward: 35,
    badgeReward: 'Data Detective',
    description: 'Advanced environmental monitoring and data collection hub',
    maxParticipants: 10,
    currentParticipants: 6
  },
  {
    id: 'analytics-hub-2',
    name: 'Coastal Research Station',
    type: 'analytics-hub',
    location: {
      name: 'Venice Beach',
      coordinates: { latitude: 33.9850, longitude: -118.4695 }
    },
    level: 3,
    communityRating: 4.7,
    isActive: true,
    requiredRole: 'eco-defender',
    xpReward: 85,
    ecoPointsReward: 30,
    badgeReward: 'Marine Analyst',
    description: 'Ocean health monitoring and marine ecosystem research',
    maxParticipants: 12,
    currentParticipants: 7
  },

  // 🌍 PEARthquake Events (Global community events)
  {
    id: 'pearthquake-1',
    name: 'Global Cleanup Day',
    type: 'pearthquake-event',
    location: {
      name: 'Multiple Locations',
      coordinates: { latitude: 34.0522, longitude: -118.2437 }
    },
    level: 5,
    communityRating: 5.0,
    isActive: true,
    xpReward: 200,
    ecoPointsReward: 75,
    badgeReward: 'Restoration Expert',
    description: 'Global community cleanup event - join thousands of environmental heroes!',
    maxParticipants: 1000,
    currentParticipants: 847,
    startTime: '2024-01-20T09:00:00Z',
    endTime: '2024-01-20T17:00:00Z',
    globalEvent: true
  },
  {
    id: 'pearthquake-2',
    name: 'Earth Day Mega Cleanup',
    type: 'pearthquake-event',
    location: {
      name: 'Worldwide',
      coordinates: { latitude: 34.0522, longitude: -118.2437 }
    },
    level: 5,
    communityRating: 4.9,
    isActive: false, // Event ended
    xpReward: 150,
    ecoPointsReward: 60,
    badgeReward: 'Earth Guardian',
    description: 'Annual Earth Day global cleanup initiative',
    maxParticipants: 5000,
    currentParticipants: 4231,
    startTime: '2024-04-22T08:00:00Z',
    endTime: '2024-04-22T20:00:00Z',
    globalEvent: true
  }
];

// Station Mission Mock Data
export const mockStationMissions: StationMission[] = [
  // Recycling Depot Missions
  {
    id: 'sorting-mission-1',
    stationId: 'recycling-depot-1',
    title: 'Advanced Sorting Challenge',
    description: 'Sort 20 items correctly in under 2 minutes',
    type: 'sorting',
    difficulty: 'hard',
    xpReward: 75,
    ecoPointsReward: 25,
    timeLimit: 2,
    requirements: ['Perfect sorting score', 'Under time limit']
  },
  {
    id: 'sorting-mission-2',
    stationId: 'recycling-depot-2',
    title: 'Ocean Plastic Identification',
    description: 'Identify and sort ocean plastic types',
    type: 'sorting',
    difficulty: 'medium',
    xpReward: 50,
    ecoPointsReward: 15,
    timeLimit: 3,
    requirements: ['90% accuracy', 'Complete all items']
  },

  // Analytics Hub Missions
  {
    id: 'photo-mission-1',
    stationId: 'analytics-hub-1',
    title: 'Environmental Impact Assessment',
    description: 'Document environmental conditions with photos',
    type: 'photo-verification',
    difficulty: 'hard',
    xpReward: 100,
    ecoPointsReward: 35,
    timeLimit: 10,
    requirements: ['5 quality photos', 'GPS verification', 'Impact analysis']
  },
  {
    id: 'data-mission-1',
    stationId: 'analytics-hub-2',
    title: 'Marine Life Survey',
    description: 'Collect data on marine ecosystem health',
    type: 'data-collection',
    difficulty: 'medium',
    xpReward: 70,
    ecoPointsReward: 25,
    timeLimit: 15,
    requirements: ['Complete survey', 'Data validation', 'Photo documentation']
  },

  // PEARthquake Missions
  {
    id: 'global-cleanup-1',
    stationId: 'pearthquake-1',
    title: 'Global Cleanup Participation',
    description: 'Join the worldwide cleanup effort',
    type: 'community-cleanup',
    difficulty: 'easy',
    xpReward: 200,
    ecoPointsReward: 75,
    timeLimit: 60,
    requirements: ['Participate in cleanup', 'Photo verification', 'Community engagement']
  }
];
