import React from 'react';
import { View, Text, StyleSheet, Image, ScrollView } from 'react-native';
import COLORS from '../colors';

const Schedule = ({ tasks = [] }) => {
  // Group tasks by hour for timeline view
  const groupedByHour = tasks.reduce((acc, task) => {
    const hour = new Date(task.startTime).getHours();
    if (!acc[hour]) acc[hour] = [];
    acc[hour].push(task);
    return acc;
  }, {});

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your Daily Schedule</Text>
      
      <ScrollView style={styles.timeline}>
        {Object.keys(groupedByHour).sort().map(hour => (
          <View key={hour} style={styles.timeBlock}>
            <Text style={styles.timeLabel}>{hour}:00</Text>
            <View style={styles.taskContainer}>
              {groupedByHour[hour].map((task, index) => (
                <View key={index} style={styles.task}>
                  <Text style={styles.taskTitle}>{task.title}</Text>
                  <Text style={styles.taskDuration}>{task.duration} min</Text>
                  {task.image && (
                    <Image 
                      source={{ uri: task.image }} 
                      style={styles.taskImage} 
                    />
                  )}
                  {task.tags && task.tags.length > 0 && (
                    <View style={styles.tagsContainer}>
                      {task.tags.map((tag, tagIndex) => (
                        <View 
                          key={tagIndex} 
                          style={[styles.tagBadge, { backgroundColor: getTagColor(tag) }]}
                        >
                          <Text style={styles.tagText}>{tag}</Text>
                        </View>
                      ))}
                    </View>
                  )}
                  {task.productivityLevel && (
                    <View style={[styles.productivityIndicator, 
                      { backgroundColor: getProductivityColor(task.productivityLevel) }]}>
                      <Text style={styles.productivityText}>
                        {task.productivityLevel}
                      </Text>
                    </View>
                  )}
                </View>
              ))}
            </View>
          </View>
        ))}
        
        {/* Empty state */}
        {tasks.length === 0 && (
          <Text style={styles.emptyState}>
            Your schedule is empty. Add some tasks to start planning your day!
          </Text>
        )}
      </ScrollView>
    </View>
  );
};

// Helper function to get color based on tag
const getTagColor = (tag) => {
  switch (tag.toLowerCase()) {
    case 'work': return COLORS.primary;
    case 'leisure': return COLORS.success;
    case 'grind': return COLORS.secondaryDark;
    default: return COLORS.secondary;
  }
};

// Helper function to get color based on productivity level
const getProductivityColor = (level) => {
  switch (level) {
    case 'high': return COLORS.success;
    case 'medium': return COLORS.warning;
    case 'low': return COLORS.danger;
    default: return COLORS.secondaryDark;
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginBottom: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 15,
    color: COLORS.black,
  },
  timeline: {
    flex: 1,
  },
  timeBlock: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  timeLabel: {
    width: 50,
    fontSize: 16,
    color: COLORS.secondaryDark,
    paddingTop: 5,
  },
  taskContainer: {
    flex: 1,
  },
  task: {
    backgroundColor: COLORS.cardBackground,
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1,
    elevation: 2,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.primary,
  },
  taskTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 5,
    color: COLORS.black,
  },
  taskDuration: {
    fontSize: 14,
    color: COLORS.secondaryDark,
    marginBottom: 5,
  },
  taskImage: {
    width: '100%',
    height: 120,
    borderRadius: 6,
    marginVertical: 5,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 5,
  },
  tagBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 8,
    marginBottom: 5,
  },
  tagText: {
    color: COLORS.white,
    fontSize: 12,
    fontWeight: 'bold',
  },
  productivityIndicator: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginTop: 5,
  },
  productivityText: {
    color: COLORS.white,
    fontSize: 12,
    fontWeight: 'bold',
  },
  emptyState: {
    fontSize: 16,
    color: COLORS.secondaryDark,
    fontStyle: 'italic',
    textAlign: 'center',
    marginTop: 40,
    backgroundColor: COLORS.secondaryLight,
    padding: 20,
    borderRadius: 8,
  },
});

export default Schedule;