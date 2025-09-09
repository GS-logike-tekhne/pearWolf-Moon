import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  TextInput,
  StyleSheet,
  Alert,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';

const DonationButton = ({ cleanupId, cleanupTitle, onDonationSuccess, style }: { cleanupId: any; cleanupTitle: any; onDonationSuccess: any; style?: any }) => {
  const { theme } = useTheme();
  const [showModal, setShowModal] = useState(false);
  const [amount, setAmount] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [currencyType, setCurrencyType] = useState<'cash' | 'ecoPoints'>('cash');

  const cashAmounts = [5, 10, 25, 50, 100];
  const ecoPointAmounts = [50, 100, 250, 500, 1000];
  const quickAmounts = currencyType === 'cash' ? cashAmounts : ecoPointAmounts;

  const handleDonation = async () => {
    if (!amount || parseFloat(amount) < 1) {
      Alert.alert('Error', 'Please enter a valid donation amount');
      return;
    }

    setLoading(true);
    try {
      // API call to process donation
      const response = await fetch('/api/donations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cleanupId,
          amount: parseFloat(amount),
          message,
          currencyType,
        }),
      });

      if (response.ok) {
        Alert.alert('Success', 'Thank you for your donation!');
        setShowModal(false);
        setAmount('');
        setMessage('');
        onDonationSuccess && onDonationSuccess();
      } else {
        Alert.alert('Error', 'Payment failed. Please try again.');
      }
    } catch (error) {
      Alert.alert('Error', 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <TouchableOpacity 
        style={[styles.donateButton, { backgroundColor: theme.error }, style]} 
        onPress={() => setShowModal(true)}
      >
        <Ionicons name="heart" size={20} color="white" />
        <Text style={styles.donateButtonText}>Donate</Text>
      </TouchableOpacity>

      <Modal visible={showModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContainer, { backgroundColor: theme.cardBackground }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: theme.textColor }]}>
                Support This Cleanup
              </Text>
              <TouchableOpacity onPress={() => setShowModal(false)}>
                <Ionicons name="close" size={24} color={theme.secondaryText} />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              <Text style={[styles.cleanupTitle, { color: theme.secondaryText }]}>
                {cleanupTitle}
              </Text>

              {/* Currency Type Toggle */}
              <Text style={[styles.sectionLabel, { color: theme.textColor }]}>
                Donation Type
              </Text>
              <View style={styles.currencyToggle}>
                <TouchableOpacity
                  style={[
                    styles.currencyButton,
                    { borderColor: theme.borderColor },
                    currencyType === 'cash' && { 
                      backgroundColor: theme.primary, 
                      borderColor: theme.primary 
                    }
                  ]}
                  onPress={() => {
                    setCurrencyType('cash');
                    setAmount('');
                  }}
                >
                  <Ionicons 
                    name="cash" 
                    size={16} 
                    color={currencyType === 'cash' ? 'white' : theme.secondaryText} 
                  />
                  <Text style={[
                    styles.currencyButtonText,
                    { color: theme.secondaryText },
                    currencyType === 'cash' && { color: 'white' }
                  ]}>
                    Cash
                  </Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={[
                    styles.currencyButton,
                    { borderColor: theme.borderColor },
                    currencyType === 'ecoPoints' && { 
                      backgroundColor: theme.success, 
                      borderColor: theme.success 
                    }
                  ]}
                  onPress={() => {
                    setCurrencyType('ecoPoints');
                    setAmount('');
                  }}
                >
                  <Ionicons 
                    name="leaf" 
                    size={16} 
                    color={currencyType === 'ecoPoints' ? 'white' : theme.secondaryText} 
                  />
                  <Text style={[
                    styles.currencyButtonText,
                    { color: theme.secondaryText },
                    currencyType === 'ecoPoints' && { color: 'white' }
                  ]}>
                    Eco Points
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Quick Amount Buttons */}
              <Text style={[styles.sectionLabel, { color: theme.textColor }]}>
                Quick Amounts
              </Text>
              <View style={styles.quickAmounts}>
                {quickAmounts.map((quickAmount) => (
                  <TouchableOpacity
                    key={quickAmount}
                    style={[
                      styles.quickAmountButton,
                      { borderColor: theme.borderColor },
                      amount === quickAmount.toString() && { 
                        backgroundColor: theme.primary, 
                        borderColor: theme.primary 
                      }
                    ]}
                    onPress={() => setAmount(quickAmount.toString())}
                  >
                    <Text style={[
                      styles.quickAmountText,
                      { color: theme.secondaryText },
                      amount === quickAmount.toString() && { color: 'white' }
                    ]}>
                      {currencyType === 'cash' ? `$${quickAmount}` : `${quickAmount} pts`}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* Custom Amount */}
              <Text style={[styles.sectionLabel, { color: theme.textColor }]}>
                Custom Amount
              </Text>
              <TextInput
                style={[
                  styles.amountInput, 
                  { 
                    borderColor: theme.borderColor,
                    color: theme.textColor,
                    backgroundColor: theme.cardBackground
                  }
                ]}
                placeholder={currencyType === 'cash' ? 'Enter dollar amount' : 'Enter eco points'}
                placeholderTextColor={theme.secondaryText}
                value={amount}
                onChangeText={setAmount}
                      />

              {/* Optional Message */}
              <Text style={[styles.sectionLabel, { color: theme.textColor }]}>
                Message (Optional)
              </Text>
              <TextInput
                style={[
                  styles.messageInput, 
                  { 
                    borderColor: theme.borderColor,
                    color: theme.textColor,
                    backgroundColor: theme.cardBackground
                  }
                ]}
                placeholder="Leave an encouraging message..."
                placeholderTextColor={theme.secondaryText}
                value={message}
                onChangeText={setMessage}
                multiline
                      />

              <TouchableOpacity
                style={[
                  styles.confirmButton, 
                  { backgroundColor: theme.primary },
                  loading && styles.disabledButton
                ]}
                onPress={handleDonation}
                disabled={loading}
              >
                <Text style={styles.confirmButtonText}>
                  {loading ? 'Processing...' : 
                   currencyType === 'cash' ? 
                   `Donate $${amount || '0'}` : 
                   `Donate ${amount || '0'} Eco Points`
                  }
                </Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  donateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  donateButtonText: {
    color: 'white',
    fontWeight: '600',
    marginLeft: 6,
    fontSize: 14,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  cleanupTitle: {
    fontSize: 16,
    marginBottom: 20,
  },
  sectionLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
    marginTop: 12,
  },
  quickAmounts: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 8,
  },
  quickAmountButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    marginRight: 8,
    marginBottom: 8,
  },
  quickAmountText: {
    fontWeight: '600',
  },
  amountInput: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 8,
  },
  messageInput: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    height: 80,
    textAlignVertical: 'top',
    marginBottom: 20,
  },
  confirmButton: {
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
  },
  disabledButton: {
    opacity: 0.6,
  },
  confirmButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  currencyToggle: {
    flexDirection: 'row',
    marginBottom: 12,
    gap: 8,
  },
  currencyButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    gap: 6,
  },
  currencyButtonText: {
    fontWeight: '600',
    fontSize: 14,
  },
});

export default DonationButton;