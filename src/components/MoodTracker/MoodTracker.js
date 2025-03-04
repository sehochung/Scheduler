import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import COLORS from '../../colors';
import '../../../src/styles/components/MoodTracker.css';


const MoodTracker = ({ onMoodUpdate, tasks = [] }) => {
  const [selectedTask, setSelectedTask] = useState(null);
  const [trackedMoods, setTrackedMoods] = useState([]);
  
  const moods = [
    { value: 1, emoji: '😖', label: 'Terrible' },
    { value: 2, emoji: '😔', label: 'Bad' },
    { value: 3, emoji: '😐', label: 'Neutral' },
    { value: 4, emoji: '🙂', label: 'Good' },
    { value: 5, emoji: '😄', label: 'Great' },
  ];

  // Get tasks that don't have moods tracked yet
  const getUnratedTasks = () => {
    // Find task IDs that already have moods
    const ratedTaskIds = trackedMoods.map(mood => mood.taskId);
    // Filter tasks to only include those that haven't been rated
    return tasks.filter(task => !ratedTaskIds.includes(task.id));
  };
  
  const handleSelectTask = (task) => {
    setSelectedTask(task);
  };
  
  const handleMoodSelect = (mood) => {
    if (!selectedTask) return;
    
    const newMoodEntry = {
      id: Date.now().toString(),
      taskId: selectedTask.id,
      taskTitle: selectedTask.title,
      tags: selectedTask.tags || [],
      moodValue: mood.value,
      moodLabel: mood.label,
      moodEmoji: mood.emoji,
      timestamp: new Date().toISOString(),
    };
    
    const updatedMoods = [...trackedMoods, newMoodEntry];
    setTrackedMoods(updatedMoods);
    onMoodUpdate(updatedMoods);
    
    // Reset selected task
    setSelectedTask(null);
  };
  
  // Calculate average mood if there are tracked moods
  const averageMood = trackedMoods.length 
    ? (trackedMoods.reduce((sum, entry) => sum + entry.moodValue, 0) / trackedMoods.length).toFixed(1)
    : null;
  
  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.title}>Mood Tracker</Text>
        {averageMood && (
          <View style={styles.averageMoodContainer}>
            <Text style={styles.averageLabel}>Today's Average</Text>
            <Text style={styles.averageValue}>{averageMood}/5</Text>
          </View>
        )}
      </View>
      
      <Text style={styles.subtitle}>Track how you feel after completing tasks</Text>
      
      {!selectedTask ? (
        <View>
          {getUnratedTasks().length > 0 ? (
            <>
              <Text style={styles.sectionTitle}>Rate your mood for these tasks:</Text>
              <ScrollView style={styles.taskList} horizontal={false}>
                {getUnratedTasks().map(task => (
                  <TouchableOpacity
                    key={task.id}
                    style={[
                      styles.taskItem,
                      { borderLeftColor: task.tags && task.tags.length > 0 
                        ? getTagColor(task.tags[0]) 
                        : COLORS.secondary }
                    ]}
                    onPress={() => handleSelectTask(task)}
                  >
                    <Text style={styles.taskItemTitle}>{task.title}</Text>
                    <Text style={styles.taskDetails}>
                      {new Date(task.startTime).toLocaleTimeString([], {
                        hour: '2-digit', 
                        minute: '2-digit',
                        hour12: true
                      })}
                      {" • "}
                      {task.duration} min
                    </Text>
                    {task.tags && task.tags.length > 0 && (
                      <View style={styles.tagsList}>
                        {task.tags.map((tag, index) => (
                          <Text key={index} style={[styles.tagLabel, { color: getTagColor(tag) }]}>
                            #{tag}
                          </Text>
                        ))}
                      </View>
                    )}
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </>
          ) : (
            <Text style={styles.emptyListText}>
              {tasks.length === 0 
                ? "Add tasks to your schedule to track your mood while completing them." 
                : "All your tasks have been rated! Add more tasks to continue tracking."}
            </Text>
          )}
          
          {trackedMoods.length > 0 && (
            <View>
              <Text style={styles.sectionTitle}>Your Mood History:</Text>
              <ScrollView style={styles.moodList}>
                {trackedMoods.map(entry => (
                  <View key={entry.id} style={styles.moodEntry}>
                    <View style={styles.moodInfo}>
                      <Text style={styles.taskTitle}>{entry.taskTitle}</Text>
                      <Text style={styles.timestamp}>
                        {new Date(entry.timestamp).toLocaleTimeString([], {
                          hour: '2-digit', 
                          minute: '2-digit',
                          hour12: true
                        })}
                      </Text>
                    </View>
                    <View style={[styles.moodBadge, getMoodBadgeStyle(entry.moodValue)]}>
                      <Text style={styles.moodEmoji}>{entry.moodEmoji}</Text>
                      <Text style={styles.moodLabel}>{entry.moodLabel}</Text>
                    </View>
                  </View>
                ))}
              </ScrollView>
            </View>
          )}
        </View>
      ) : (
        <View>
          <Text style={styles.sectionTitle}>
            How did you feel after completing "{selectedTask.title}"?
          </Text>
          <View style={styles.moodSelector}>
            {moods.map(mood => (
              <TouchableOpacity
                key={mood.value}
                style={styles.moodOption}
                onPress={() => handleMoodSelect(mood)}
              >
                <Text style={styles.moodEmoji}>{mood.emoji}</Text>
                <Text style={styles.moodOptionLabel}>{mood.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={() => setSelectedTask(null)}
          >
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

// Helper function to get color based on tag
const getTagColor = (tag) => {
  switch (tag.toLowerCase()) {
    case 'work': return COLORS.primary;
    case 'leisure': return COLORS.success;
    case 'grind': return COLORS.secondaryDark;
    case 'personal': return '#9C27B0'; // Purple
    case 'meeting': return '#FF9800'; // Orange
    case 'health': return '#E91E63'; // Pink
    case 'learning': return '#00BCD4'; // Cyan
    default: return COLORS.secondary;
  }
};

// Helper function to get mood badge style based on mood value
const getMoodBadgeStyle = (moodValue) => {
  switch (moodValue) {
    case 1: return { backgroundColor: '#E53935' }; // Red for terrible
    case 2: return { backgroundColor: '#FB8C00' }; // Orange for bad
    case 3: return { backgroundColor: '#FDD835' }; // Yellow for neutral
    case 4: return { backgroundColor: '#7CB342' }; // Light green for good
    case 5: return { backgroundColor: '#43A047' }; // Green for great
    default: return { backgroundColor: COLORS.secondary };
  }
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
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.black,
  },
  subtitle: {
    fontSize: 14,
    color: COLORS.secondaryDark,
    marginBottom: 15,
  },
  averageMoodContainer: {
    alignItems: 'center',
    backgroundColor: COLORS.secondaryLight,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
  },
  averageLabel: {
    fontSize: 12,
    color: COLORS.secondaryDark,
  },
  averageValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.success,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.black,
    marginTop: 12,
    marginBottom: 8,
  },
  taskList: {
    maxHeight: 200,
  },
  taskItem: {
    padding: 12,
    borderLeftWidth: 4,
    marginBottom: 8,
    backgroundColor: COLORS.secondaryLight,
    borderRadius: 6,
  },
  taskItemTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: COLORS.black,
  },
  taskDetails: {
    fontSize: 12,
    color: COLORS.secondaryDark,
    marginTop: 3,
  },
  tagsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 6,
  },
  tagLabel: {
    fontSize: 12,
    fontWeight: '500',
    marginRight: 8,
  },
  emptyListText: {
    fontSize: 14,
    color: COLORS.secondaryDark,
    fontStyle: 'italic',
    marginVertical: 10,
    padding: 10,
    backgroundColor: COLORS.secondaryLight,
    borderRadius: 6,
    textAlign: 'center',
  },
  moodSelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 15,
  },
  moodOption: {
    alignItems: 'center',
    padding: 10,
    marginHorizontal: 2,
    backgroundColor: COLORS.secondaryLight,
    borderRadius: 8,
    flex: 1,
  },
  moodEmoji: {
    fontSize: 24,
    marginBottom: 5,
  },
  moodOptionLabel: {
    fontSize: 12,
    color: COLORS.black,
    fontWeight: '500',
    textAlign: 'center',
  },
  cancelButton: {
    backgroundColor: COLORS.secondary,
    paddingVertical: 10,
    borderRadius: 6,
    alignItems: 'center',
    marginTop: 10,
  },
  cancelButtonText: {
    color: COLORS.white,
    fontWeight: '500',
  },
  moodList: {
    maxHeight: 200,
  },
  moodEntry: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.secondaryLight,
  },
  moodInfo: {
    flex: 1,
  },
  taskTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.black,
  },
  timestamp: {
    fontSize: 12,
    color: COLORS.secondaryDark,
    marginTop: 2,
  },
  moodBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 6,
    borderRadius: 15,
    minWidth: 90,
    justifyContent: 'center',
  },
  moodLabel: {
    color: COLORS.white,
    fontWeight: '600',
    fontSize: 12,
    marginLeft: 4,
  },
});

export default MoodTracker;