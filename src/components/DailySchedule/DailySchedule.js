import React from 'react';
import { View, Text, StyleSheet, ScrollView, Platform } from 'react-native';
import COLORS from '../../colors';
import '../../../src/styles/components/DailySchedule.css';

// Constants for timeline calculations - defined outside component for StyleSheet access
const TOTAL_MINUTES_IN_DAY = 24 * 60; // 24 hours = 1440 minutes
const MINUTES_PER_PIXEL = 2; // 1 minute = 2 pixels height
const DEFAULT_MIN_TIMELINE_HEIGHT = 400; // Minimum height when tasks exist
const PADDING_HOURS = 2; // Add 2 hours padding before first task and after last task

const DailySchedule = ({ tasks = [] }) => {
  /**
   * Converts a time string (e.g., "12:00 AM") to minutes since midnight
   * @param {string} timeString - Time in format "HH:MM AM/PM"
   * @return {number} Minutes since midnight
   */
  const convertTimeToMinutes = (timeString) => {
    if (!timeString) return 0;
    
    try {
      // Parse the time string
      const parts = timeString.split(' ');
      if (parts.length !== 2) return 0;
      
      const [time, period] = parts;
      const timeParts = time.split(':');
      if (timeParts.length !== 2) return 0;
      
      let hours = parseInt(timeParts[0], 10);
      let minutes = parseInt(timeParts[1], 10);
      
      if (isNaN(hours) || isNaN(minutes)) return 0;
      
      // Convert to 24-hour format
      if (period === 'PM' && hours < 12) {
        hours += 12;
      } else if (period === 'AM' && hours === 12) {
        hours = 0;
      }
      
      // Calculate total minutes since midnight
      return hours * 60 + minutes;
    } catch (error) {
      console.error("Error parsing time:", error);
      return 0;
    }
  };
  
  /**
   * Converts minutes since midnight to a vertical position in pixels
   * relative to the dynamic range's start time
   * @param {number} minutes - Minutes since midnight
   * @param {number} startMinutes - Start minutes of the range
   * @return {number} Vertical position in pixels
   */
  const getVerticalPosition = (minutes, startMinutes) => {
    if (!minutes || isNaN(minutes)) return 0;
    
    // Calculate position relative to the range start
    const relativeMinutes = minutes - startMinutes;
    
    // Convert minutes to pixels (default is MINUTES_PER_PIXEL)
    const position = relativeMinutes / MINUTES_PER_PIXEL;
    
    // Ensure position is not negative (shouldn't happen with our range calculation)
    return Math.max(position, 0);
  };
  
  /**
   * Converts duration in minutes to height in pixels
   * @param {number} durationMinutes - Duration in minutes
   * @return {number} Height in pixels
   */
  const getDurationHeight = (durationMinutes) => {
    if (!durationMinutes || isNaN(durationMinutes)) return 30; // Default minimum height
    
    // Convert duration to height using our pixel ratio
    const height = durationMinutes / MINUTES_PER_PIXEL;
    
    // Ensure height is reasonable (minimum 30px for visibility)
    return Math.max(height, 30);
  };
  
  /**
   * Formats time for display (e.g., 9:30 AM)
   * @param {number} minutes - Minutes since midnight
   * @return {string} Formatted time string
   */
  const formatTime = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    
    // Convert to 12-hour format
    const period = hours >= 12 ? 'PM' : 'AM';
    const displayHours = hours % 12 === 0 ? 12 : hours % 12;
    
    return `${displayHours}:${mins.toString().padStart(2, '0')} ${period}`;
  };
  
  /**
   * Checks if a new task overlaps with any existing task
   * @param {Object} newTask - The task to check for overlaps
   * @param {Array} existingTasks - Array of existing tasks
   * @return {Object} { overlaps: boolean, overlapsWith: task or null }
   */
  const checkTaskOverlap = (newTask, existingTasks) => {
    if (!newTask || !newTask.startTime || !newTask.duration) {
      return { overlaps: false, overlapsWith: null };
    }
    
    const newTaskStart = convertTimeToMinutes(newTask.startTime);
    const newTaskEnd = newTaskStart + (parseInt(newTask.duration, 10) || 0);
    
    for (const task of existingTasks) {
      if (!task || !task.startTime || !task.duration) continue;
      
      const taskStart = convertTimeToMinutes(task.startTime);
      const taskEnd = taskStart + (parseInt(task.duration, 10) || 0);
      
      // Check for overlap: new task starts during existing task or ends during existing task
      // or completely encompasses an existing task
      if ((newTaskStart >= taskStart && newTaskStart < taskEnd) || 
          (newTaskEnd > taskStart && newTaskEnd <= taskEnd) ||
          (newTaskStart <= taskStart && newTaskEnd >= taskEnd)) {
        return { overlaps: true, overlapsWith: task };
      }
    }
    
    return { overlaps: false, overlapsWith: null };
  };
  
  // Sort tasks by start time with error handling
  const sortedTasks = React.useMemo(() => {
    try {
      return [...tasks].filter(task => task && task.startTime).sort((a, b) => {
        return convertTimeToMinutes(a.startTime) - convertTimeToMinutes(b.startTime);
      });
    } catch (error) {
      console.error("Error sorting tasks:", error);
      return [];
    }
  }, [tasks]);
  
  /**
   * Calculate the dynamic time range for the schedule
   * Returns: { startMinutes, endMinutes, rangeInMinutes, timelineHeight, hourMarkers }
   */
  const timeRange = React.useMemo(() => {
    // If no tasks, don't calculate a range
    if (!sortedTasks.length) {
      return {
        startMinutes: 0,
        endMinutes: 0,
        rangeInMinutes: 0,
        timelineHeight: 0,
        hourMarkers: []
      };
    }
    
    try {
      // Find earliest start time
      const earliestTask = sortedTasks[0]; // Tasks are already sorted by start time
      let startMinutes = convertTimeToMinutes(earliestTask.startTime);
      
      // Round down to the nearest hour for cleaner display and subtract PADDING_HOURS
      startMinutes = Math.floor(startMinutes / 60) * 60;
      startMinutes = Math.max(0, startMinutes - (PADDING_HOURS * 60)); // Add padding but don't go below 0
      
      // Find latest end time (start time + duration)
      let latestEndMinutes = 0;
      sortedTasks.forEach(task => {
        const taskStartMinutes = convertTimeToMinutes(task.startTime);
        const taskEndMinutes = taskStartMinutes + (parseInt(task.duration, 10) || 0);
        latestEndMinutes = Math.max(latestEndMinutes, taskEndMinutes);
      });
      
      // Round up to the nearest hour for cleaner display and add padding
      latestEndMinutes = Math.ceil(latestEndMinutes / 60) * 60 + (PADDING_HOURS * 60);
      latestEndMinutes = Math.min(latestEndMinutes, TOTAL_MINUTES_IN_DAY); // Don't exceed 24 hours
      
      // Ensure a minimum range of 4 hours for visibility
      const minRangeMinutes = 4 * 60;
      const rangeInMinutes = Math.max(latestEndMinutes - startMinutes, minRangeMinutes);
      
      // Calculate timeline height based on range (1 minute = MINUTES_PER_PIXEL pixels)
      const timelineHeight = Math.max(
        rangeInMinutes / MINUTES_PER_PIXEL,
        DEFAULT_MIN_TIMELINE_HEIGHT
      );
      
      // Calculate hour markers within our range
      const hourMarkers = [];
      const startHour = Math.floor(startMinutes / 60);
      const endHour = Math.ceil(latestEndMinutes / 60);
      
      for (let hour = startHour; hour <= endHour; hour++) {
        const hourInMinutes = hour * 60;
        const relativePosition = hourInMinutes - startMinutes; // Position relative to our start
        const position = relativePosition / MINUTES_PER_PIXEL;
        
        if (position >= 0) { // Only include hours within our range
          hourMarkers.push({
            hour,
            position, 
            label: hour === 0 || hour === 24 ? '12:00 AM' : 
                   hour === 12 ? '12:00 PM' : 
                   hour > 12 ? `${hour-12}:00 PM` : 
                   `${hour}:00 AM`
          });
        }
      }
      
      return {
        startMinutes,
        endMinutes: latestEndMinutes,
        rangeInMinutes,
        timelineHeight,
        hourMarkers
      };
    } catch (error) {
      console.error("Error calculating time range:", error);
      return {
        startMinutes: 0,
        endMinutes: 0,
        rangeInMinutes: 0,
        timelineHeight: 0,
        hourMarkers: []
      };
    }
  }, [sortedTasks]);
  
  // Extract values from the calculated time range
  const { startMinutes, endMinutes, rangeInMinutes, timelineHeight, hourMarkers } = timeRange;
  
  // Debug log to check tasks (can remove in production)
  React.useEffect(() => {
    console.log("Rendered tasks:", sortedTasks);
  }, [sortedTasks]);
  
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Daily Schedule</Text>
      
      {/* When there are no tasks, show empty state message */}
      {sortedTasks.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateText}>
            No tasks scheduled for today. Add tasks to see your daily schedule.
          </Text>
        </View>
      ) : (
        /* Only render the timeline when tasks exist */
        <>
          {/* Web Timeline View */}
          {Platform.OS === 'web' && (
            <div className="daily-schedule-container">
              <div className="timeline-container">
                {/* Hour markers column */}
                <div className="hour-markers">
                  {hourMarkers.map((marker, i) => (
                    <div 
                      key={i} 
                      className="hour-marker"
                      style={{ top: `${marker.position}px` }}
                    >
                      <span className="hour-label">{marker.label}</span>
                    </div>
                  ))}
                </div>
                
                {/* Timeline with tasks - height is dynamically calculated */}
                <div className="timeline" style={{ height: `${timelineHeight}px` }}>
                  {/* Hour grid lines */}
                  {hourMarkers.map((marker, i) => (
                    <div
                      key={`grid-${i}`}
                      className="hour-grid-line"
                      style={{ top: `${marker.position}px` }}
                    />
                  ))}
                  
                  {/* Task blocks */}
                  {sortedTasks.map((task, index) => {
                    if (!task || !task.startTime || !task.duration) {
                      console.log('Skipping invalid task:', task); // Debug log
                      return null;
                    }
                    
                    try {
                      // Calculate position relative to our dynamic range start
                      const taskStartMinutes = convertTimeToMinutes(task.startTime);
                      const topPosition = getVerticalPosition(taskStartMinutes, startMinutes);
                      const height = getDurationHeight(parseInt(task.duration, 10) || 30);
                      
                      console.log('Rendering task:', { // Debug log
                        index,
                        title: task.title || task.name,
                        startTime: task.startTime,
                        duration: task.duration,
                        topPosition,
                        height
                      });
                      
                      return (
                        <div
                          key={index}
                          className="task-block"
                          style={{
                            top: `${topPosition}px`,
                            height: `${height}px`,
                            backgroundColor: task.color || COLORS.primary,
                          }}
                        >
                          <div className="task-title">
                            {task.title || task.name || 'Untitled Task'}
                          </div>
                          <div className="task-details">
                            {task.startTime} • {task.duration} min
                          </div>
                        </div>
                      );
                    } catch (error) {
                      console.error("Error rendering task:", error, task);
                      return null;
                    }
                  })}
                  
                  {/* Time range information (can be removed in production) */}
                  <div className="time-range-info">
                    <small>
                      {formatTime(startMinutes)} - {formatTime(endMinutes)}
                    </small>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* Mobile Timeline View */}
          {Platform.OS !== 'web' && (
            <ScrollView style={styles.mobileTimeline}>
              <View style={[styles.timelineContent, { height: timelineHeight }]}>
                {/* Hour markers for mobile */}
                <View style={styles.hourMarkersContainer}>
                  {hourMarkers.map((marker, i) => (
                    <View 
                      key={i} 
                      style={[
                        styles.hourMarker,
                        { top: marker.position }
                      ]}
                    >
                      <Text style={styles.hourLabel}>{marker.label}</Text>
                      <View style={styles.hourLine} />
                    </View>
                  ))}
                </View>
                
                {/* Task blocks for mobile */}
                <View style={styles.taskBlocksContainer}>
                  {sortedTasks.map((task, index) => {
                    if (!task || !task.startTime || !task.duration) {
                      return null; // Skip invalid tasks
                    }
                    
                    try {
                      const taskStartMinutes = convertTimeToMinutes(task.startTime);
                      const topPosition = getVerticalPosition(taskStartMinutes, startMinutes);
                      const duration = parseInt(task.duration, 10) || 30;
                      const height = getDurationHeight(duration);
                      
                      return (
                        <View
                          key={index}
                          style={[
                            styles.taskBlock,
                            {
                              position: 'absolute',
                              top: topPosition,
                              height: height,
                              left: 0,
                              right: 0,
                              backgroundColor: task.color || COLORS.primary
                            }
                          ]}
                        >
                          {/* Make sure to always render task name */}
                          <Text style={styles.taskTitle} numberOfLines={1}>
                            {task.name || 'Untitled Task'}
                          </Text>
                          <Text style={styles.taskDuration}>
                            {task.startTime} • {task.duration || 0} min
                          </Text>
                        </View>
                      );
                    } catch (error) {
                      console.error("Error rendering mobile task:", error, task);
                      return null;
                    }
                  })}
                </View>
              </View>
            </ScrollView>
          )}
        </>
      )}
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
    marginBottom: 15,
    color: COLORS.black,
  },
  emptyState: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.secondaryLight,
    borderRadius: 8,
    marginTop: 20,
  },
  emptyStateText: {
    color: COLORS.secondaryDark,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  
  // Mobile-specific styles for vertical timeline
  mobileTimeline: {
    height: 500, // Fixed height with scroll
    marginVertical: 10,
  },
  timelineContent: {
    position: 'relative',
    flexDirection: 'row',
  },
  hourMarkersContainer: {
    width: 60,
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    borderRightWidth: 1,
    borderRightColor: COLORS.secondary,
  },
  hourMarker: {
    position: 'absolute',
    left: 0,
    width: 60,
    alignItems: 'flex-start',
  },
  hourLabel: {
    fontSize: 10,
    color: COLORS.secondaryDark,
    marginLeft: 5,
  },
  hourLine: {
    position: 'absolute',
    left: 60,
    right: -500, // Extend across timeline
    height: 1,
    backgroundColor: 'rgba(0,0,0,0.05)',
  },
  taskBlocksContainer: {
    position: 'absolute',
    top: 0,
    left: 70, // Offset from hour markers
    right: 10,
    bottom: 0,
  },
  taskBlock: {
    borderRadius: 4,
    padding: 8,
    justifyContent: 'center',
  },
  taskTitle: {
    color: COLORS.white,
    fontWeight: 'bold',
    fontSize: 12,
  },
  taskDuration: {
    color: COLORS.white,
    fontSize: 10,
    opacity: 0.9,
    marginTop: 4,
  },
});

export default DailySchedule;