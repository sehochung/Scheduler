import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ScrollView, Platform, Modal } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import COLORS from '../../colors';
import '../../../src/styles/components/TaskInput.css';

const TaskInput = ({ onAddTask, initialTitle = '', onTitleUsed }) => {
  const [title, setTitle] = useState(initialTitle);
  const [duration, setDuration] = useState('');
  const [startTime, setStartTime] = useState('');
  const [productivityLevel, setProductivityLevel] = useState('medium');
  const [selectedTags, setSelectedTags] = useState([]);
  
  // Update title when initialTitle prop changes
  React.useEffect(() => {
    if (initialTitle && initialTitle !== title) {
      setTitle(initialTitle);
      // Notify the parent that we've used the title
      if (onTitleUsed) {
        onTitleUsed();
      }
    }
  }, [initialTitle, onTitleUsed]);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [timeInputMode, setTimeInputMode] = useState('picker'); // 'picker' or 'text'
  const [timeInputText, setTimeInputText] = useState('');
  const [timeInputError, setTimeInputError] = useState('');
  const [showTimeModal, setShowTimeModal] = useState(false);
  const [tempTime, setTempTime] = useState('');
  const [timeFormat, setTimeFormat] = useState('12h'); // '12h' or '24h'

  const availableTags = ['work', 'leisure', 'grind', 'personal', 'meeting', 'health', 'learning'];
  
  // Format time for display (12-hour format with AM/PM)
  function getDisplayTime(timeString) {
    if (!timeString) return 'Select a time'; // Handle empty time
    
    const [hours, minutes] = timeString.split(':').map(Number);
    const period = hours >= 12 ? 'PM' : 'AM';
    const displayHour = hours % 12 === 0 ? 12 : hours % 12;
    return `${displayHour}:${minutes.toString().padStart(2, '0')} ${period}`;
  }

  // Format time for 24-hour display
  function get24HourDisplayTime(timeString) {
    const [hours, minutes] = timeString.split(':').map(Number);
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  }

  // Get current display time based on format
  function getCurrentDisplayTime() {
    if (!startTime) {
      return 'Select a time';
    }
    return timeFormat === '12h' ? getDisplayTime(startTime) : get24HourDisplayTime(startTime);
  }

  // Generate time options in 15-minute intervals
  const generateTimeOptions = () => {
    const options = [];
    
    for (let hour = 0; hour < 24; hour++) {
      for (let minute = 0; minute < 60; minute += 15) {
        const timeValue = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        const period = hour >= 12 ? 'PM' : 'AM';
        const displayHour = hour % 12 === 0 ? 12 : hour % 12;
        const displayTime = `${displayHour}:${minute.toString().padStart(2, '0')} ${period}`;
        
        options.push({
          value: timeValue,
          label: displayTime
        });
      }
    }
    return options;
  };

  const timeOptions = generateTimeOptions();

  const handleTagToggle = (tag) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter(t => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  // Convert time string to hours and minutes
  const timeToNumbers = (timeString) => {
    const [hours, minutes] = timeString.split(':').map(Number);
    return { hours, minutes };
  };

  // Convert hours and minutes to time string
  const numbersToTime = (hours, minutes) => {
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  };

  const handleTimeChange = (event, selectedTime) => {
    setShowTimePicker(false);
    if (selectedTime) {
      const hours = selectedTime.getHours();
      const minutes = selectedTime.getMinutes();
      setStartTime(numbersToTime(hours, minutes));
    }
  };

  const showTimePickerModal = () => {
    setShowTimePicker(true);
  };

  // Function to validate manually entered time
  const validateTimeInput = (input) => {
    // For 12-hour format with AM/PM
    const twelveHourRegex = /^(0?[1-9]|1[0-2]):([0-5][0-9])\s*(am|pm|AM|PM)$/;
    // For 24-hour format
    const twentyFourHourRegex = /^([01]?[0-9]|2[0-3]):([0-5][0-9])$/;
    
    if (twelveHourRegex.test(input)) {
      // Extract hours, minutes, and period from the input
      const [, hours, minutes, period] = input.match(twelveHourRegex);
      let numericHours = parseInt(hours, 10);
      
      // Convert to 24-hour format
      if (period.toLowerCase() === 'pm' && numericHours < 12) {
        numericHours += 12;
      } else if (period.toLowerCase() === 'am' && numericHours === 12) {
        numericHours = 0;
      }
      
      return {
        valid: true,
        time: numbersToTime(numericHours, parseInt(minutes, 10))
      };
    } else if (twentyFourHourRegex.test(input)) {
      // Extract hours and minutes from the input
      const [, hours, minutes] = input.match(twentyFourHourRegex);
      return {
        valid: true,
        time: numbersToTime(parseInt(hours, 10), parseInt(minutes, 10))
      };
    }
    
    return {
      valid: false,
      error: 'Invalid time format. Please use HH:MM AM/PM or 24-hour format.'
    };
  };

  // Handle input in text mode
  const handleTimeInputChange = (text) => {
    setTimeInputText(text);
    setTimeInputError('');
  };

  // Apply text input time
  const applyManualTimeInput = () => {
    const result = validateTimeInput(timeInputText);
    if (result.valid) {
      setStartTime(result.time);
      setTimeInputMode('picker');
      setTimeInputText('');
      setTimeInputError('');
    } else {
      setTimeInputError(result.error);
    }
  };

  // Toggle time format
  const toggleTimeFormat = () => {
    setTimeFormat(timeFormat === '12h' ? '24h' : '12h');
  };

  // Open custom time modal
  const openTimeModal = () => {
    // Initialize with '00:00' if no time is selected
    setTempTime(startTime || '00:00');
    setShowTimeModal(true);
  };

  // Handle time confirmation in modal
  const confirmTime = () => {
    setStartTime(tempTime);
    setShowTimeModal(false);
  };

  // Update time from sliders
  const updateTimeFromSliders = (totalMinutes) => {
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    const newTime = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
    setTempTime(newTime);
  };

  // Helper function to convert minutes since midnight to formatted time
  const minutesToTime = (totalMinutes) => {
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    const period = hours >= 12 ? 'PM' : 'AM';
    const displayHour = hours % 12 === 0 ? 12 : hours % 12;
    return `${displayHour}:${minutes.toString().padStart(2, '0')} ${period}`;
  };

  // Helper function to convert time string to minutes since midnight
  const timeToMinutes = (timeString) => {
    if (!timeString) return 0;
    const [hours, minutes] = timeString.split(':').map(Number);
    return hours * 60 + minutes;
  };

  // Update time from slider
  const updateTimeFromSlider = (totalMinutes) => {
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    const newTime = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
    setTempTime(newTime);
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
    setStartTime('');
    setSelectedTags([]);
    setProductivityLevel('medium');
  };

  return (
    <View style={styles.container} className="task-input-container">
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
        
        {/* Time Input Container */}
        <View style={styles.timeInputContainer}>
          {/* Time Display */}
          <TouchableOpacity 
            style={styles.timeDisplay} 
            onPress={openTimeModal}
          >
            <Text style={[
              styles.timeDisplayText,
              !startTime && styles.placeholderText
            ]}>
              {getCurrentDisplayTime()}
            </Text>
          </TouchableOpacity>
          
          {/* Format Toggle Button */}
          <TouchableOpacity 
            style={styles.formatToggleButton} 
            onPress={toggleTimeFormat}
          >
            <Text style={styles.formatToggleText}>
              {timeFormat === '12h' ? '24h' : '12h'}
            </Text>
          </TouchableOpacity>
        </View>
        
        {/* Custom Time Modal */}
        <Modal
          visible={showTimeModal}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setShowTimeModal(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Select Time</Text>
              
              {/* Time Input Mode Tabs */}
              <View style={styles.timeInputTabs}>
                <TouchableOpacity
                  style={[
                    styles.timeInputTab,
                    timeInputMode === 'picker' && styles.activeTimeInputTab
                  ]}
                  onPress={() => setTimeInputMode('picker')}
                >
                  <Text style={styles.timeInputTabText}>Picker</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.timeInputTab,
                    timeInputMode === 'text' && styles.activeTimeInputTab
                  ]}
                  onPress={() => setTimeInputMode('text')}
                >
                  <Text style={styles.timeInputTabText}>Manual</Text>
                </TouchableOpacity>
              </View>
              
              {/* Time Picker Mode */}
              {timeInputMode === 'picker' && (
                <View style={styles.timePickerMode}>
                  {Platform.OS === 'web' ? (
                    <View style={styles.webTimePicker}>
                      <View style={styles.timePickerContent}>
                        {/* Time Display with Step Buttons */}
                        <View style={styles.timeDisplayContainer}>
                          <View style={styles.timeControlsRow}>
                            <TouchableOpacity
                              style={styles.stepButton}
                              onPress={() => {
                                const currentMinutes = timeToMinutes(tempTime);
                                updateTimeFromSlider(Math.max(0, currentMinutes - 1));
                              }}
                            >
                              <Text style={styles.stepButtonText}>−</Text>
                            </TouchableOpacity>
                            
                            <Text style={styles.timeValue}>
                              {minutesToTime(timeToMinutes(tempTime))}
                            </Text>
                            
                            <TouchableOpacity
                              style={styles.stepButton}
                              onPress={() => {
                                const currentMinutes = timeToMinutes(tempTime);
                                updateTimeFromSlider(Math.min(1439, currentMinutes + 1));
                              }}
                            >
                              <Text style={styles.stepButtonText}>+</Text>
                            </TouchableOpacity>
                          </View>
                        </View>
                        
                        {/* Time Slider */}
                        <View style={styles.timeSliderContainer} className="time-slider">
                          <input
                            type="range"
                            min="0"
                            max="1439"
                            step="1"
                            value={timeToMinutes(tempTime)}
                            onChange={(e) => {
                              updateTimeFromSlider(parseInt(e.target.value));
                            }}
                            style={{
                              width: '100%',
                              height: '2px',
                              WebkitAppearance: 'none',
                              background: COLORS.secondary,
                              outline: 'none',
                              opacity: '0.7',
                              WebkitTransition: '.2s',
                              transition: 'opacity .2s',
                              cursor: 'pointer',
                              borderRadius: '1px',
                              margin: '40px 0 8px 0',
                            }}
                          />
                          
                          {/* Time Markers */}
                          <View style={styles.timeMarkers}>
                            <Text style={styles.timeMarker}>12:00 AM</Text>
                            <Text style={styles.timeMarker}>12:00 PM</Text>
                            <Text style={styles.timeMarker}>11:59 PM</Text>
                          </View>
                        </View>
                      </View>
                    </View>
                  ) : (
                    // Native DateTimePicker for mobile
                    <DateTimePicker
                      value={new Date(`2023-01-01T${tempTime}`)}
                      mode="time"
                      is24Hour={timeFormat === '24h'}
                      display="spinner"
                      onChange={(event, selectedTime) => {
                        if (selectedTime) {
                          const hours = selectedTime.getHours();
                          const minutes = selectedTime.getMinutes();
                          setTempTime(numbersToTime(hours, minutes));
                        }
                      }}
                    />
                  )}
                </View>
              )}
              
              {/* Manual Text Input Mode */}
              {timeInputMode === 'text' && (
                <View style={styles.manualTimeInput}>
                  <TextInput
                    style={[
                      styles.manualTimeInputField,
                      timeInputError && styles.inputError
                    ]}
                    value={timeInputText}
                    onChangeText={handleTimeInputChange}
                    placeholder={timeFormat === '12h' ? "e.g., 9:30 AM" : "e.g., 13:30"}
                    placeholderTextColor={COLORS.secondaryDark}
                  />
                  {timeInputError ? (
                    <Text style={styles.timeInputErrorText}>{timeInputError}</Text>
                  ) : (
                    <Text style={styles.timeInputHint}>
                      Enter time in {timeFormat === '12h' ? '12-hour (9:30 AM)' : '24-hour (13:30)'} format
                    </Text>
                  )}
                  <TouchableOpacity
                    style={styles.applyTimeButton}
                    onPress={applyManualTimeInput}
                  >
                    <Text style={styles.applyTimeButtonText}>Apply</Text>
                  </TouchableOpacity>
                </View>
              )}
              
              {/* Modal Footer Buttons */}
              <View style={styles.modalFooter}>
                <TouchableOpacity
                  style={[styles.modalButton, styles.cancelButton]}
                  onPress={() => setShowTimeModal(false)}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.modalButton, styles.confirmButton]}
                  onPress={confirmTime}
                >
                  <Text style={styles.confirmButtonText}>Confirm</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
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
  // Time Input Container
  timeInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: COLORS.secondary,
    borderRadius: 6,
    backgroundColor: COLORS.white,
    overflow: 'hidden',
  },
  timeDisplay: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 12,
    justifyContent: 'center',
  },
  timeDisplayText: {
    fontSize: 16,
    color: COLORS.black,
  },
  placeholderText: {
    color: COLORS.secondaryDark,
  },
  formatToggleButton: {
    backgroundColor: COLORS.secondaryLight,
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderLeftWidth: 1,
    borderLeftColor: COLORS.secondary,
  },
  formatToggleText: {
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.secondaryDark,
  },
  
  // Modal Styles
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '90%',
    maxWidth: 400,
    backgroundColor: COLORS.white,
    borderRadius: 10,
    padding: 20,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.primary,
    textAlign: 'center',
    marginBottom: 15,
  },
  
  // Time Input Mode Tabs
  timeInputTabs: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.secondaryLight,
    marginBottom: 15,
  },
  timeInputTab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
  },
  activeTimeInputTab: {
    borderBottomWidth: 2,
    borderBottomColor: COLORS.primary,
  },
  timeInputTabText: {
    fontSize: 16,
    fontWeight: '500',
    color: COLORS.secondaryDark,
  },
  
  // Time Picker Mode
  timePickerMode: {
    marginBottom: 20,
  },
  
  // Web Time Picker Styles
  webTimePicker: {
    width: '100%',
    alignItems: 'center',
  },
  timePickerContent: {
    width: '100%',
    maxWidth: 600,
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  timeDisplayContainer: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  timeControlsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 15,
  },
  stepButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: COLORS.secondaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 12,
    borderWidth: 1,
    borderColor: COLORS.secondary,
  },
  stepButtonText: {
    color: COLORS.secondaryDark,
    fontSize: 16,
    fontWeight: '500',
    lineHeight: 16,
  },
  timeValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: COLORS.primary,
    minWidth: 150,
    textAlign: 'center',
  },
  
  // Manual Time Input
  manualTimeInput: {
    width: '100%',
    marginBottom: 20,
  },
  manualTimeInputField: {
    borderWidth: 1,
    borderColor: COLORS.secondary,
    borderRadius: 6,
    padding: 10,
    fontSize: 16,
    backgroundColor: COLORS.white,
    marginBottom: 5,
  },
  inputError: {
    borderColor: COLORS.danger,
  },
  timeInputErrorText: {
    color: COLORS.danger,
    fontSize: 12,
    marginBottom: 5,
  },
  timeInputHint: {
    color: COLORS.secondaryDark,
    fontSize: 12,
    marginBottom: 10,
  },
  applyTimeButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 8,
    borderRadius: 6,
    alignItems: 'center',
    marginTop: 10,
  },
  applyTimeButtonText: {
    color: COLORS.white,
    fontWeight: 'bold',
    fontSize: 14,
  },
  
  // Modal Footer
  modalFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 5,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 6,
    marginHorizontal: 5,
  },
  cancelButton: {
    backgroundColor: COLORS.secondaryLight,
  },
  cancelButtonText: {
    color: COLORS.secondaryDark,
    fontWeight: 'bold',
    fontSize: 16,
  },
  confirmButton: {
    backgroundColor: COLORS.primary,
  },
  confirmButtonText: {
    color: COLORS.white,
    fontWeight: 'bold',
    fontSize: 16,
  },
  
  // Original styles
  timePickerContainer: {
    flex: 1,
    borderWidth: Platform.OS !== 'web' ? 1 : 0,
    borderColor: COLORS.secondary,
    borderRadius: 6,
    backgroundColor: COLORS.white,
    overflow: 'hidden',
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
  timeOptionsContainer: {
    width: '100%',
    maxHeight: 300,
  },
  timeOption: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
  },
  selectedTimeOption: {
    backgroundColor: COLORS.lightPrimary,
  },
  timeOptionText: {
    fontSize: 16,
  },
  selectedTimeOptionText: {
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  closeButton: {
    marginTop: 15,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: COLORS.primary,
    borderRadius: 5,
  },
  closeButtonText: {
    color: COLORS.white,
    fontWeight: 'bold',
  },
  timeMarkers: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 2,
  },
  timeMarker: {
    fontSize: 11,
    color: COLORS.secondaryDark,
    opacity: 0.7,
    textAlign: 'center',
  },
  timeSliderContainer: {
    width: '100%',
    paddingHorizontal: 10,
  },
});

export default TaskInput;