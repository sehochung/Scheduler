import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import COLORS from '../../colors';
import '../../../src/styles/components/SuggestionPanel.css';


const SuggestionPanel = ({ tasks = [] }) => {
  const [suggestions, setSuggestions] = useState([]);
  const [timeRemaining, setTimeRemaining] = useState(0);

  // In a real app, this would connect to a machine learning service
  // that analyzes user patterns and provides personalized suggestions
  useEffect(() => {
    // Mock calculation of remaining time in the day
    const scheduledMinutes = tasks.reduce((total, task) => total + task.duration, 0);
    const totalDayMinutes = 24 * 60;
    const remaining = totalDayMinutes - scheduledMinutes;
    setTimeRemaining(remaining);
    
    // Generate suggestions based on tasks and available time
    generateSuggestions(tasks, remaining);
  }, [tasks]);

  const generateSuggestions = (currentTasks, availableTime) => {
    // This is where the ML model would run to generate suggestions
    // For now, we'll use hardcoded suggestions based on task tags
    
    // Analyze task tags to determine user's focus
    const tagCounts = {};
    currentTasks.forEach(task => {
      if (task.tags) {
        task.tags.forEach(tag => {
          tagCounts[tag] = (tagCounts[tag] || 0) + 1;
        });
      }
    });
    
    // Find the most frequent tag
    let dominantTag = 'work'; // Default
    let maxCount = 0;
    
    Object.keys(tagCounts).forEach(tag => {
      if (tagCounts[tag] > maxCount) {
        maxCount = tagCounts[tag];
        dominantTag = tag;
      }
    });
    
    // Suggest based on dominant tag
    const mockSuggestions = [];
    
    if (dominantTag === 'work') {
      mockSuggestions.push(
        { id: '1', activity: 'Deep work session', duration: 90, benefit: 'Focus improvement' },
        { id: '2', activity: 'Schedule planning', duration: 20, benefit: 'Organization' },
        { id: '3', activity: 'Email batch processing', duration: 30, benefit: 'Inbox zero' }
      );
    } else if (dominantTag === 'leisure') {
      mockSuggestions.push(
        { id: '1', activity: 'Walk outside', duration: 30, benefit: 'Mood boost' },
        { id: '2', activity: 'Read fiction', duration: 45, benefit: 'Stress reduction' },
        { id: '3', activity: 'Meditation', duration: 15, benefit: 'Mental clarity' }
      );
    } else if (dominantTag === 'grind') {
      mockSuggestions.push(
        { id: '1', activity: 'Workout session', duration: 60, benefit: 'Energy boost' },
        { id: '2', activity: 'Learning new skill', duration: 45, benefit: 'Personal growth' },
        { id: '3', activity: 'Project sprint', duration: 120, benefit: 'Accomplishment' }
      );
    } else if (dominantTag === 'health') {
      mockSuggestions.push(
        { id: '1', activity: 'Hydration break', duration: 5, benefit: 'Better focus' },
        { id: '2', activity: 'Healthy meal prep', duration: 30, benefit: 'Energy management' },
        { id: '3', activity: 'Quick stretch', duration: 10, benefit: 'Posture improvement' }
      );
    } else {
      // Generic suggestions for any other tag
      mockSuggestions.push(
        { id: '1', activity: 'Short break', duration: 15, benefit: 'Mental recharge' },
        { id: '2', activity: 'Planning session', duration: 20, benefit: 'Better organization' },
        { id: '3', activity: 'Reflection time', duration: 10, benefit: 'Process learnings' }
      );
    }
    
    // Filter suggestions to only include those that fit in available time
    const filteredSuggestions = mockSuggestions.filter(
      suggestion => suggestion.duration <= availableTime
    );
    
    setSuggestions(filteredSuggestions);
  };

  const addSuggestionToSchedule = (suggestion) => {
    // This would trigger the parent component to add this task
    console.log(`Added suggestion: ${suggestion.activity}`);
    // In a real app: onAddSuggestion(suggestion);
  };

  // If no gaps in schedule or all suggestions are too long
  if (suggestions.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Personalized Suggestions</Text>
        <Text style={styles.emptyText}>
          {timeRemaining < 30 
            ? "Your schedule is packed! Great job optimizing your day."
            : "Add more tasks to receive personalized suggestions for your schedule."}
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Personalized Suggestions</Text>
      <Text style={styles.subtitle}>
        Fill your gaps with these activities tailored to your preferences
      </Text>
      
      <FlatList
        data={suggestions}
        keyExtractor={item => item.id}
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        renderItem={({ item }) => (
          <TouchableOpacity 
            style={styles.suggestionCard}
            onPress={() => addSuggestionToSchedule(item)}
          >
            <Text style={styles.activityName}>{item.activity}</Text>
            <Text style={styles.duration}>{item.duration} min</Text>
            <View style={styles.benefitContainer}>
              <Text style={styles.benefitLabel}>Benefit:</Text>
              <Text style={styles.benefitValue}>{item.benefit}</Text>
            </View>
            <Text style={styles.addText}>+ Add to schedule</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.cardBackground,
    borderRadius: 12,
    padding: 15,
    marginVertical: 10,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.primary,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
    color: COLORS.black,
  },
  subtitle: {
    fontSize: 14,
    color: COLORS.secondaryDark,
    marginBottom: 15,
  },
  suggestionCard: {
    backgroundColor: COLORS.background,
    borderRadius: 8,
    padding: 15,
    width: 180,
    marginRight: 12,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
    borderLeftWidth: 3,
    borderLeftColor: COLORS.primary,
  },
  activityName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: COLORS.black,
  },
  duration: {
    fontSize: 14,
    color: COLORS.secondaryDark,
    marginBottom: 10,
  },
  benefitContainer: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  benefitLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.secondaryDark,
    marginRight: 5,
  },
  benefitValue: {
    fontSize: 14,
    color: COLORS.success,
    fontWeight: '500',
  },
  addText: {
    fontSize: 14,
    color: COLORS.primary,
    fontWeight: '600',
    textAlign: 'right',
    marginTop: 5,
  },
  emptyText: {
    fontSize: 14,
    color: COLORS.secondaryDark,
    fontStyle: 'italic',
    marginVertical: 10,
    padding: 10,
    backgroundColor: COLORS.secondaryLight,
    borderRadius: 6,
  },
});

export default SuggestionPanel;