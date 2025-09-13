import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface TransactionItemProps {
  title: string;
  timestamp: string;
  amount: string;
  icon: string;
  iconColor: string;
  onPress?: () => void;
  isLast?: boolean;
}

const TransactionItem: React.FC<TransactionItemProps> = ({
  title,
  timestamp,
  amount,
  icon,
  iconColor,
  onPress,
  isLast = false,
}) => {
  return (
    <TouchableOpacity style={[styles.container, isLast && styles.lastContainer]} onPress={onPress}>
      <View style={[styles.iconContainer, { backgroundColor: '#000000' }]}>
        <Ionicons name={icon as any} size={20} color="white" />
      </View>
      
      <View style={styles.content}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.timestamp}>{timestamp}</Text>
      </View>
      
      <Text style={styles.amount}>{amount}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#9AE630',
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
  },
  lastContainer: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 2,
  },
  timestamp: {
    fontSize: 12,
    color: 'rgba(0, 0, 0, 0.6)',
  },
  amount: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
  },
});

export default TransactionItem;
