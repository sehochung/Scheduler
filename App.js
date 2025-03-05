import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  ScrollView,
} from 'react-native';

// Import main CSS file
import './src/styles/index.css';

// Import color theme
import COLORS from './src/colors';

// Import components from their respective folders
import TaskInput from './src/components/TaskInput';
import DailySchedule from './src/components/DailySchedule';
import ThingsToAccomplish from './src/components/ThingsToAccomplish';

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [prefilledTaskTitle, setPrefilledTaskTitle] = useState('');
  
  // Process tasks for DailySchedule component
  const processedTasks = React.useMemo(() => {
    if (!tasks || tasks.length === 0) return [];
    
    return tasks.map(task => {
      if (!task) return null;
      
      let startTimeFormatted = 'Unknown time';
      
      try {
        if (task.startTime) {
          const date = new Date(task.startTime);
          const hours = date.getHours();
          const minutes = date.getMinutes();
          const period = hours >= 12 ? 'PM' : 'AM';
          const displayHour = hours % 12 === 0 ? 12 : hours % 12;
          startTimeFormatted = `${displayHour}:${minutes.toString().padStart(2, '0')} ${period}`;
        }
      } catch (error) {
        console.error('Error formatting time:', error);
      }
      
      // Assign a color based on task tags
      let color = COLORS.primary;
      if (task.tags && task.tags.length > 0) {
        if (task.tags.includes('work')) color = COLORS.primary;
        else if (task.tags.includes('leisure')) color = COLORS.success;
        else if (task.tags.includes('health')) color = '#E91E63';
        else if (task.tags.includes('meeting')) color = '#FF9800';
        else if (task.tags.includes('learning')) color = '#00BCD4';
      }
      
      // Make sure we're returning a properly formatted task object
      return {
        id: task.id,
        name: task.title || 'Untitled Task',
        title: task.title || 'Untitled Task', // Include both name and title for flexibility
        startTime: startTimeFormatted,
        duration: parseInt(task.duration, 10) || 30, // Ensure duration is a number with fallback
        color: color
      };
    }).filter(Boolean); // Filter out any null values
  }, [tasks]);

  // Process a new task and check for overlaps before adding
  const addTask = (newTask) => {
    // Convert newTask to the format used by DailySchedule
    const processedNewTask = {
      name: newTask.title,
      startTime: (() => {
        try {
          if (newTask.startTime) {
            const date = new Date(newTask.startTime);
            const hours = date.getHours();
            const minutes = date.getMinutes();
            const period = hours >= 12 ? 'PM' : 'AM';
            const displayHour = hours % 12 === 0 ? 12 : hours % 12;
            return `${displayHour}:${minutes.toString().padStart(2, '0')} ${period}`;
          }
          return '';
        } catch (error) {
          console.error('Error formatting time:', error);
          return '';
        }
      })(),
      duration: newTask.duration
    };

    // Check if the new task overlaps with existing tasks
    const checkOverlap = (task) => {
      if (!task.startTime || !task.duration) return false;
      
      // Convert times to minutes for comparison
      const taskStartMinutes = (() => {
        const [time, period] = task.startTime.split(' ');
        let [hours, minutes] = time.split(':').map(Number);
        
        if (period === 'PM' && hours < 12) hours += 12;
        else if (period === 'AM' && hours === 12) hours = 0;
        
        return hours * 60 + minutes;
      })();
      
      const taskEndMinutes = taskStartMinutes + task.duration;
      
      // Check against all existing processed tasks
      for (const existingTask of processedTasks) {
        const existingStartMinutes = (() => {
          if (!existingTask.startTime) return 0;
          
          const [time, period] = existingTask.startTime.split(' ');
          let [hours, minutes] = time.split(':').map(Number);
          
          if (period === 'PM' && hours < 12) hours += 12;
          else if (period === 'AM' && hours === 12) hours = 0;
          
          return hours * 60 + minutes;
        })();
        
        const existingEndMinutes = existingStartMinutes + existingTask.duration;
        
        // Check for overlap
        if ((taskStartMinutes >= existingStartMinutes && taskStartMinutes < existingEndMinutes) || 
            (taskEndMinutes > existingStartMinutes && taskEndMinutes <= existingEndMinutes) ||
            (taskStartMinutes <= existingStartMinutes && taskEndMinutes >= existingEndMinutes)) {
          return {
            overlaps: true,
            task: existingTask
          };
        }
      }
      
      return { overlaps: false };
    };
    
    // Check for overlaps
    const overlap = checkOverlap(processedNewTask);
    
    if (overlap.overlaps) {
      // Show error message for overlapping tasks
      alert(`Task time overlaps with existing task "${overlap.task.name}" (${overlap.task.startTime} for ${overlap.task.duration} min). Please choose a different time.`);
      return false;
    }
    
    // No overlap, add the task
    setTasks([...tasks, newTask]);
    return true;
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
      >
        <Text style={styles.appTitle}>Smart Scheduler</Text>
        <ThingsToAccomplish onTaskSelect={(title) => {
          // Pre-fill TaskInput when a to-do item is clicked
          setPrefilledTaskTitle(title);
          
          // Scroll to the TaskInput component (simplified - in a real app you would use a ref)
          setTimeout(() => {
            const taskInputElement = document.querySelector('.task-input-container');
            if (taskInputElement) {
              taskInputElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
          }, 100);
        }} />
        
        <TaskInput 
          onAddTask={addTask} 
          initialTitle={prefilledTaskTitle}
          onTitleUsed={() => setPrefilledTaskTitle('')}
        />
        <DailySchedule tasks={processedTasks} />

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Plan smarter, achieve more
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingTop: 40, // Add padding for status bar
    paddingBottom: 40,
  },
  appTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 20,
    textAlign: 'center',
  },
  footer: {
    marginTop: 30,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 14,
    color: COLORS.secondaryDark,
    fontStyle: 'italic',
  }
});