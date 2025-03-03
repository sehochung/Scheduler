import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import COLORS from '../colors';

const ScheduleSharing = ({ schedule = [] }) => {
  const handleShareSchedule = () => {
    // In a real app, this would open sharing options
    alert('In a real app, this would open sharing options');
  };
  
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Share Your Schedule</Text>
      
      <Text style={styles.description}>
        Share your daily plan with friends, family, or colleagues to coordinate activities and stay accountable.
      </Text>
      
      <View style={styles.shareOptions}>
        <TouchableOpacity 
          style={styles.optionButton}
          onPress={handleShareSchedule}
        >
          <View style={[styles.optionIcon, { backgroundColor: COLORS.success }]}>
            <Text style={styles.optionIconText}>✉️</Text>
          </View>
          <Text style={styles.optionText}>Message</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.optionButton}
          onPress={handleShareSchedule}
        >
          <View style={[styles.optionIcon, { backgroundColor: COLORS.primary }]}>
            <Text style={styles.optionIconText}>📧</Text>
          </View>
          <Text style={styles.optionText}>Email</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.optionButton}
          onPress={handleShareSchedule}
        >
          <View style={[styles.optionIcon, { backgroundColor: COLORS.secondaryDark }]}>
            <Text style={styles.optionIconText}>🔗</Text>
          </View>
          <Text style={styles.optionText}>Copy Link</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.cardBackground,
    borderRadius: 12,
    padding: 16,
    marginVertical: 10,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.primary,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: COLORS.black,
  },
  description: {
    fontSize: 14,
    color: COLORS.secondaryDark,
    marginBottom: 15,
    lineHeight: 20,
  },
  shareOptions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 10,
    backgroundColor: COLORS.secondaryLight,
    borderRadius: 8,
    padding: 15,
  },
  optionButton: {
    alignItems: 'center',
    width: 80,
  },
  optionIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  optionIconText: {
    fontSize: 24,
  },
  optionText: {
    fontSize: 14,
    color: COLORS.black,
    fontWeight: '500',
  },
});

export default ScheduleSharing;