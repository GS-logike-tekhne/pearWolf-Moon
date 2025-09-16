import React from 'react';
import { ScrollView, View } from 'react-native';
import ScreenLayout from '../components/ScreenLayout';
import { sharedStyles } from '../styles/shared';

// Import the new modular components
import MissionInfo from '../components/verified/MissionInfo';
import FundingSection from '../components/verified/FundingSection';
import PhotoGallery from '../components/verified/PhotoGallery';
import MissionActions from '../components/verified/MissionActions';
import JoinModal from '../components/verified/JoinModal';
import { useVerifiedMissions } from '../hooks/useVerifiedMissions';

interface PearVerifiedMissionDetailProps {
  navigation: any;
  route: {
    params: {
      mission: {
        id: number;
        title: string;
        location: string;
        description: string;
        raised: number;
        goal: number;
        donors: number;
        urgency: 'high' | 'medium' | 'low';
        participants: number;
        startDate: string;
        endDate: string;
        organizer: string;
        beforePhotos?: string[];
        afterPhotos?: string[];
      };
    };
  };
}

const PearVerifiedMissionDetail: React.FC<PearVerifiedMissionDetailProps> = ({
  navigation,
  route,
}) => {
  const { mission } = route.params;
  
  const {
    isJoined,
    showJoinModal,
    handleJoin,
    confirmJoinMission,
    closeJoinModal
  } = useVerifiedMissions();

  return (
    <ScreenLayout>
      <ScrollView style={sharedStyles.container} showsVerticalScrollIndicator={false}>
        
        <MissionInfo mission={mission} />
        
        <FundingSection mission={mission} />
        
        <PhotoGallery mission={mission} />
        
        <MissionActions 
          mission={mission}
          isJoined={isJoined}
          onJoin={handleJoin}
        />
        
        <View style={sharedStyles.bottomSpacing} />
      </ScrollView>

      <JoinModal 
        visible={showJoinModal}
        mission={mission}
        onConfirm={confirmJoinMission}
        onCancel={closeJoinModal}
      />
    </ScreenLayout>
  );
};

export default PearVerifiedMissionDetail;
