import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import COLORS from '../colors';

const TaskInput = ({ onAddTask }) => {
  const [title, setTitle] = useState('');
  const [duration, setDuration] = useState('');
  const [startTime, setStartTime] = useState('09:00');
  const [productivityLevel, setProductivityLevel] = useState('medium');
  const [selectedTags, setSelectedTags] = useState([]);

  const availableTags = ['work', 'leisure', 'grind', 'personal', 'meeting', 'health', 'learning'];
  
  // Generate time options in 30-minute increments for 24 hours
  const timeOptions = [];
  for (let hour = 0; hour < 24; hour++) {
    for (let minute = 0; minute < 60; minute += 30) {
      const formattedHour = hour.toString().padStart(2, '0');
      const formattedMinute = minute.toString().padStart(2, '0');
      const time = `${formattedHour}:${formattedMinute}`;
      const displayTime = getDisplayTime(hour, minute);
      timeOptions.push({ value: time, label: displayTime });
    }
  }

  // Format time for display (12-hour format with AM/PM)
  function getDisplayTime(hour, minute) {
    const period = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 === 0 ? 12 : hour % 12;
    return `${displayHour}:${minute.toString().padStart(2, '0')} ${period}`;
  }

  const handleTagToggle = (tag) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter(t => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const handleAddTask = () => {
    if (!title || !duration) {
      // Simple validation
      alert('Please fill out all required fields');
      return;
    }

    const newTask = {
      id: Date.now().toString(),
      title,
      duration: parseInt(duration, 10),
      startTime: new Date(`2023-01-01T${startTime}`).toISOString(),
      tags: selectedTags,
      productivityLevel,
      completed: false,
    };

    onAddTask(newTask);
    
    // Reset form
    setTitle('');
    setDuration('');
    setStartTime('09:00');
    setSelectedTags([]);
    setProductivityLevel('medium');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Add New Task</Text>
      
      <View style={styles.inputRow}>
        <Text style={styles.label}>Task Title:</Text>
        <TextInput
          style={styles.input}
          value={title}
          onChangeText={setTitle}
          placeholder="What are you planning to do?"
          placeholderTextColor={COLORS.secondaryDark}
        />
      </View>
      
      <View style={styles.inputRow}>
        <Text style={styles.label}>Duration (min):</Text>
        <TextInput
          style={styles.input}
          value={duration}
          onChangeText={setDuration}
          placeholder="How long will it take?"
          placeholderTextColor={COLORS.secondaryDark}
          keyboardType="numeric"
        />
      </View>
      
      <View style={styles.inputRow}>
        <Text style={styles.label}>Start Time:</Text>
        <View style={styles.timePickerContainer}>
          <Picker
            selectedValue={startTime}
            style={styles.timePicker}
            onValueChange={(itemValue) => setStartTime(itemValue)}
          >
            {timeOptions.map(option => (
              <Picker.Item 
                key={option.value} 
                label={option.label} 
                value={option.value} 
              />
            ))}
          </Picker>
        </View>
      </View>
      
      <View style={styles.tagsSection}>
        <Text style={styles.label}>Tags (optional):</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.tagsContainer}>
            {availableTags.map(tag => (
              <TouchableOpacity
                key={tag}
                style={[
                  styles.tagBadge,
                  selectedTags.includes(tag) ? { backgroundColor: getTagColor(tag) } : styles.unselectedTag
                ]}
                onPress={() => handleTagToggle(tag)}
              >
                <Text 
                  style={[
                    styles.tagText, 
                    selectedTags.includes(tag) ? styles.selectedTagText : styles.unselectedTagText
                  ]}
                >
                  {tag}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </View>
      
      <View style={styles.productivityContainer}>
        <Text style={styles.label}>Expected Productivity:</Text>
        <View style={styles.levelButtons}>
          {['low', 'medium', 'high'].map(level => (
            <TouchableOpacity
              key={level}
              style={[
                styles.levelButton,
                productivityLevel === level && styles.selectedLevel,
                { backgroundColor: getProductivityColor(level) }
              ]}
              onPress={() => setProductivityLevel(level)}
            >
              <Text style={styles.levelText}>{level.charAt(0).toUpperCase() + level.slice(1)}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
      
      <TouchableOpacity style={styles.addButton} onPress={handleAddTask}>
        <Text style={styles.addButtonText}>Add to Schedule</Text>
      </TouchableOpacity>
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
    marginBottom: 15,
    color: COLORS.black,
  },
  inputRow: {
    marginBottom: 12,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.secondaryDark,
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: COLORS.secondary,
    borderRadius: 6,
    padding: 10,
    fontSize: 16,
    backgroundColor: COLORS.white,
    color: COLORS.black,
  },
  timePickerContainer: {
    borderWidth: 1,
    borderColor: COLORS.secondary,
    borderRadius: 6,
    backgroundColor: COLORS.white,
    height: 50,
  },
  timePicker: {
    width: '100%',
    height: 50,
  },
  tagsSection: {
    marginVertical: 12,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 5,
  },
  tagBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 8,
  },
  unselectedTag: {
    backgroundColor: COLORS.secondaryLight,
    borderWidth: 1,
    borderColor: COLORS.secondary,
  },
  tagText: {
    fontSize: 14,
    fontWeight: '500',
  },
  selectedTagText: {
    color: COLORS.white,
  },
  unselectedTagText: {
    color: COLORS.secondaryDark,
  },
  productivityContainer: {
    marginVertical: 12,
  },
  levelButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  levelButton: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 6,
    marginHorizontal: 4,
    alignItems: 'center',
  },
  selectedLevel: {
    borderWidth: 2,
    borderColor: COLORS.secondaryDark,
  },
  levelText: {
    color: COLORS.white,
    fontWeight: '600',
  },
  addButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 12,
    borderRadius: 6,
    alignItems: 'center',
    marginTop: 10,
  },
  addButtonText: {
    color: COLORS.white,
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default TaskInput;