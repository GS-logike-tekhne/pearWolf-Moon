import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { sharedStyles } from '../../styles/shared';
import { THEME } from '../../styles/theme';

interface JoinModalProps {
  visible: boolean;
  mission: {
    title: string;
  };
  onConfirm: () => void;
  onCancel: () => void;
}

const JoinModal: React.FC<JoinModalProps> = ({ 
  visible, 
  mission, 
  onConfirm, 
  onCancel 
}) => {
  const { theme } = useTheme();

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onCancel}
    >
      <View style={styles.modalOverlay}>
        <View style={[
          styles.modalContent, 
          { backgroundColor: theme.cardBackground }
        ]}>
          <Text style={[styles.modalTitle, { color: theme.textColor }]}>
            Join Mission
          </Text>
          
          <Text style={[styles.modalText, { color: theme.secondaryText }]}>
            Are you ready to join "{mission.title}"? You'll receive updates and can track your participation.
          </Text>
          
          <View style={styles.modalButtons}>
            <TouchableOpacity 
              style={[
                sharedStyles.secondaryButton,
                { borderColor: theme.borderColor }
              ]}
              onPress={onCancel}
            >
              <Text style={[
                sharedStyles.secondaryButtonText,
                { color: theme.secondaryText }
              ]}>
                Cancel
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[
                sharedStyles.button,
                { backgroundColor: theme.primary }
              ]}
              onPress={onConfirm}
            >
              <Text style={[sharedStyles.buttonText, { color: 'white' }]}>
                Join Mission
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    margin: THEME.SPACING.lg,
    borderRadius: THEME.BORDER_RADIUS.lg,
    padding: THEME.SPACING.lg,
    minWidth: 300,
  },
  modalTitle: {
    fontSize: THEME.TYPOGRAPHY.fontSize.xl,
    fontWeight: 'bold',
    marginBottom: THEME.SPACING.md,
    textAlign: 'center',
  },
  modalText: {
    fontSize: THEME.TYPOGRAPHY.fontSize.base,
    textAlign: 'center',
    marginBottom: THEME.SPACING.lg,
    lineHeight: 20,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});

export default JoinModal;
