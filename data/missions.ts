import { Mission, MissionTemplate, UserRole } from '../types/missions';

// Mission templates for each role
export const missionTemplates: MissionTemplate[] = [
  // Trash Hero Missions
  {
    id: 'th_cleanup_001',
    name: 'Street Cleanup',
    description: 'Clean up litter from designated street areas',
    type: 'cleanup',
    requiredRole: 'trash-hero',
    defaultRewards: {
      xpReward: 50,
      ecoPointsReward: 25,
    },
    instructions: [
      'Bring gloves and trash bags',
      'Focus on high-traffic areas',
      'Separate recyclables from trash',
      'Take before/after photos',
    ],
    equipment: ['Gloves', 'Trash bags', 'Recycling bags', 'Camera'],
    estimatedDuration: 60,
    difficulty: 'easy',
  },
  {
    id: 'th_recycling_001',
    name: 'Recycling Station Sort',
    description: 'Sort and organize items at recycling station',
    type: 'recycling',
    requiredRole: 'trash-hero',
    defaultRewards: {
      xpReward: 75,
      ecoPointsReward: 35,
    },
    instructions: [
      'Sort items by material type',
      'Remove non-recyclable items',
      'Clean contaminated items',
      'Organize by category',
    ],
    equipment: ['Sorting bins', 'Cleaning supplies', 'Labels'],
    estimatedDuration: 90,
    difficulty: 'medium',
  },
  {
    id: 'th_hazardous_001',
    name: 'Hazardous Waste Collection',
    description: 'Safely collect and dispose of hazardous materials',
    type: 'cleanup',
    requiredRole: 'trash-hero',
    defaultRewards: {
      xpReward: 150,
      ecoPointsReward: 75,
    },
    instructions: [
      'Use proper safety equipment',
      'Identify hazardous materials',
      'Package safely for transport',
      'Follow disposal protocols',
    ],
    equipment: ['Safety gear', 'Hazardous waste containers', 'Labels'],
    estimatedDuration: 120,
    difficulty: 'hard',
  },
  
  // Impact Warrior Missions
  {
    id: 'iw_community_001',
    name: 'Community Garden Setup',
    description: 'Help establish a community garden space',
    type: 'restoration',
    requiredRole: 'impact-warrior',
    defaultRewards: {
      xpReward: 100,
      ecoPointsReward: 50,
    },
    instructions: [
      'Prepare soil and beds',
      'Plant seeds and seedlings',
      'Install irrigation system',
      'Create maintenance schedule',
    ],
    equipment: ['Garden tools', 'Seeds', 'Soil', 'Irrigation supplies'],
    estimatedDuration: 180,
    difficulty: 'medium',
  },
  {
    id: 'iw_education_001',
    name: 'Environmental Education',
    description: 'Teach environmental awareness to community',
    type: 'community-event',
    requiredRole: 'impact-warrior',
    defaultRewards: {
      xpReward: 80,
      ecoPointsReward: 40,
    },
    instructions: [
      'Prepare educational materials',
      'Engage with community members',
      'Demonstrate eco-friendly practices',
      'Answer questions and provide resources',
    ],
    equipment: ['Educational materials', 'Demonstration items', 'Handouts'],
    estimatedDuration: 120,
    difficulty: 'medium',
  },
  {
    id: 'iw_beach_001',
    name: 'Beach Restoration',
    description: 'Restore beach ecosystem and remove debris',
    type: 'restoration',
    requiredRole: 'impact-warrior',
    defaultRewards: {
      xpReward: 120,
      ecoPointsReward: 60,
    },
    instructions: [
      'Remove plastic and debris',
      'Plant native vegetation',
      'Monitor wildlife impact',
      'Document restoration progress',
    ],
    equipment: ['Beach cleanup tools', 'Native plants', 'Camera', 'Measuring tools'],
    estimatedDuration: 240,
    difficulty: 'hard',
  },
  
  // Eco Defender Missions
  {
    id: 'ed_data_001',
    name: 'Environmental Data Collection',
    description: 'Collect and analyze environmental data',
    type: 'data-collection',
    requiredRole: 'eco-defender',
    defaultRewards: {
      xpReward: 90,
      ecoPointsReward: 45,
    },
    instructions: [
      'Set up monitoring equipment',
      'Collect air/water quality samples',
      'Record environmental conditions',
      'Analyze and report findings',
    ],
    equipment: ['Monitoring equipment', 'Sample containers', 'Data sheets', 'Camera'],
    estimatedDuration: 150,
    difficulty: 'medium',
  },
  {
    id: 'ed_funding_001',
    name: 'Project Funding Review',
    description: 'Review and approve environmental project funding',
    type: 'data-collection',
    requiredRole: 'eco-defender',
    defaultRewards: {
      xpReward: 110,
      ecoPointsReward: 55,
    },
    instructions: [
      'Review project proposals',
      'Assess environmental impact',
      'Evaluate funding requirements',
      'Make funding recommendations',
    ],
    equipment: ['Project documents', 'Assessment tools', 'Review forms'],
    estimatedDuration: 120,
    difficulty: 'hard',
  },
  {
    id: 'ed_research_001',
    name: 'Climate Research Study',
    description: 'Conduct climate change research study',
    type: 'data-collection',
    requiredRole: 'eco-defender',
    defaultRewards: {
      xpReward: 200,
      ecoPointsReward: 100,
    },
    instructions: [
      'Design research methodology',
      'Collect climate data',
      'Analyze trends and patterns',
      'Publish research findings',
    ],
    equipment: ['Research tools', 'Data analysis software', 'Climate sensors'],
    estimatedDuration: 480,
    difficulty: 'hard',
  },
];

// Generate missions from templates
export const generateMissions = (): Mission[] => {
  const missions: Mission[] = [];
  
  missionTemplates.forEach((template, index) => {
    const mission: Mission = {
      id: template.id,
      title: template.name,
      description: template.description,
      type: template.type,
      status: 'available',
      urgency: index % 4 === 0 ? 'high' : index % 3 === 0 ? 'medium' : 'low',
      
      location: {
        name: getLocationForTemplate(template.id),
        coordinates: getCoordinatesForTemplate(template.id),
        address: getAddressForTemplate(template.id),
      },
      
      startDate: new Date(Date.now() + (index * 24 * 60 * 60 * 1000)),
      endDate: new Date(Date.now() + ((index + 7) * 24 * 60 * 60 * 1000)),
      estimatedDuration: template.estimatedDuration,
      
      requiredRole: template.requiredRole,
      minParticipants: template.difficulty === 'hard' ? 2 : 1,
      maxParticipants: template.difficulty === 'easy' ? 5 : 3,
      currentParticipants: Math.floor(Math.random() * 3),
      
      xpReward: template.defaultRewards.xpReward,
      ecoPointsReward: template.defaultRewards.ecoPointsReward,
      badgeReward: getBadgeForTemplate(template.id),
      
      progress: {
        current: Math.floor(Math.random() * 50),
        target: 100,
        unit: 'completion',
      },
      
      instructions: template.instructions,
      equipment: template.equipment,
      difficulty: template.difficulty,
      
      requiresPhotoVerification: true,
      requiresLocationVerification: true,
      
      createdBy: 'PEAR System',
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    missions.push(mission);
  });
  
  return missions;
};

// Helper functions
const getLocationForTemplate = (templateId: string): string => {
  const locations: Record<string, string> = {
    'th_cleanup_001': 'Downtown LA Streets',
    'th_recycling_001': 'Central Recycling Hub',
    'th_hazardous_001': 'Industrial District',
    'iw_community_001': 'Riverside Community Center',
    'iw_education_001': 'Local Elementary School',
    'iw_beach_001': 'Santa Monica Beach',
    'ed_data_001': 'Environmental Monitoring Station',
    'ed_funding_001': 'PEAR Headquarters',
    'ed_research_001': 'Climate Research Lab',
  };
  return locations[templateId] || 'PEAR Location';
};

const getCoordinatesForTemplate = (templateId: string) => {
  const coordinates: Record<string, { latitude: number; longitude: number }> = {
    'th_cleanup_001': { latitude: 34.0522, longitude: -118.2437 },
    'th_recycling_001': { latitude: 34.0736, longitude: -118.2406 },
    'th_hazardous_001': { latitude: 34.0195, longitude: -118.2912 },
    'iw_community_001': { latitude: 34.0689, longitude: -118.4452 },
    'iw_education_001': { latitude: 34.0522, longitude: -118.2437 },
    'iw_beach_001': { latitude: 34.0195, longitude: -118.4912 },
    'ed_data_001': { latitude: 34.0736, longitude: -118.2406 },
    'ed_funding_001': { latitude: 34.0522, longitude: -118.2437 },
    'ed_research_001': { latitude: 34.0195, longitude: -118.2912 },
  };
  return coordinates[templateId] || { latitude: 34.0522, longitude: -118.2437 };
};

const getAddressForTemplate = (templateId: string): string => {
  const addresses: Record<string, string> = {
    'th_cleanup_001': '123 Main St, Los Angeles, CA',
    'th_recycling_001': '456 Green Ave, Los Angeles, CA',
    'th_hazardous_001': '789 Industrial Blvd, Los Angeles, CA',
    'iw_community_001': '321 Community Dr, Los Angeles, CA',
    'iw_education_001': '654 School St, Los Angeles, CA',
    'iw_beach_001': '987 Beach Way, Santa Monica, CA',
    'ed_data_001': '147 Research Rd, Los Angeles, CA',
    'ed_funding_001': '258 PEAR Plaza, Los Angeles, CA',
    'ed_research_001': '369 Science Ave, Los Angeles, CA',
  };
  return addresses[templateId] || 'PEAR Location, Los Angeles, CA';
};

const getBadgeForTemplate = (templateId: string): string => {
  const badges: Record<string, string> = {
    'th_cleanup_001': 'Street Cleaner',
    'th_recycling_001': 'Recycling Master',
    'th_hazardous_001': 'Hazardous Waste Handler',
    'iw_community_001': 'Community Builder',
    'iw_education_001': 'Environmental Educator',
    'iw_beach_001': 'Beach Restorer',
    'ed_data_001': 'Data Collector',
    'ed_funding_001': 'Project Reviewer',
    'ed_research_001': 'Climate Researcher',
  };
  return badges[templateId] || 'Mission Complete';
};

// Export generated missions
export const missions = generateMissions();

// Helper functions for filtering missions
export const getMissionsByRole = (role: UserRole): Mission[] => {
  return missions.filter(mission => mission.requiredRole === role);
};

export const getMissionsByStatus = (status: Mission['status']): Mission[] => {
  return missions.filter(mission => mission.status === status);
};

export const getMissionsByType = (type: Mission['type']): Mission[] => {
  return missions.filter(mission => mission.type === type);
};

export const getAvailableMissions = (): Mission[] => {
  return missions.filter(mission => mission.status === 'available');
};

export const getMissionsByDifficulty = (difficulty: Mission['difficulty']): Mission[] => {
  return missions.filter(mission => mission.difficulty === difficulty);
};
