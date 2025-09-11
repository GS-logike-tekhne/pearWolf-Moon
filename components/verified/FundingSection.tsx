import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { sharedStyles } from '../../styles/shared';
import DonationProgress from '../DonationProgress';
import DonationButton from '../DonationButton';

interface FundingSectionProps {
  mission: {
    id: number;
    title: string;
    raised: number;
    goal: number;
    donors: number;
    endDate: string;
  };
}

const FundingSection: React.FC<FundingSectionProps> = ({ mission }) => {
  const { theme } = useTheme();

  return (
    <View style={[
      sharedStyles.card,
      { 
        backgroundColor: theme.cardBackground,
        borderColor: theme.borderColor,
      }
    ]}>
      <DonationProgress 
        goal={{
          id: mission.id.toString(),
          title: mission.title,
          description: 'PEAR Verified Mission',
          targetAmount: mission.goal,
          currentAmount: mission.raised,
          supporters: mission.donors,
          deadline: mission.endDate,
          category: 'verified-mission'
        }}
        onDonate={() => {}}
        onViewDetails={() => {}}
        showActions={true}
        compact={false}
      />
      
      <DonationButton 
        cleanupId={mission.id.toString()}
        cleanupTitle={mission.title}
        onDonationSuccess={() => {}}
        style={styles.donationButton}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  donationButton: {
    marginTop: 16,
  },
});

export default FundingSection;
