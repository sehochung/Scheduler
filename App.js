import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  ScrollView,
  TouchableOpacity
} from 'react-native';

// Import main CSS file
import './src/styles/index.css';

// Import color theme
import COLORS from './src/colors';

// Import components from their respective folders
import TaskInput from './src/components/TaskInput';
import SuggestionPanel from './src/components/SuggestionPanel';
import MoodTracker from './src/components/MoodTracker';
import ScheduleSharing from './src/components/ScheduleSharing';
import DailyAnalysis from './src/components/DailyAnalysis';
import DailySchedule from './src/components/DailySchedule';

export default function App() {
  console.log('App component rendering');
  const [tasks, setTasks] = useState([]);
  const [dailyMood, setDailyMood] = useState({});
  const [analysis, setAnalysis] = useState(null);
  const [showBasicView, setShowBasicView] = useState(false); // Show full app view
  
  // Process tasks for DailySchedule component by formatting them properly
  const processedTasks = React.useMemo(() => {
    return tasks.map(task => {
      // Convert ISO date string to 12-hour format (e.g. "12:00 AM")
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
      
      // Assign a color based on task tags or productivity level
      let color = COLORS.primary;
      if (task.tags && task.tags.length > 0) {
        if (task.tags.includes('work')) color = COLORS.primary;
        else if (task.tags.includes('leisure')) color = COLORS.success;
        else if (task.tags.includes('health')) color = '#E91E63';
        else if (task.tags.includes('meeting')) color = '#FF9800';
        else if (task.tags.includes('learning')) color = '#00BCD4';
      } else if (task.productivityLevel) {
        if (task.productivityLevel === 'high') color = COLORS.success;
        else if (task.productivityLevel === 'low') color = COLORS.danger;
      }
      
      return {
        name: task.title,
        startTime: startTimeFormatted,
        duration: task.duration,
        color: color
      };
    });
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

  const analyzeDailyPerformance = () => {
    // Generate insights based on completed tasks and mood data

    // Determine schedule category based on tasks
    let workCount = 0;
    let leisureCount = 0;
    let grindCount = 0;

    tasks.forEach(task => {
      if (task.tags && task.tags.includes('work')) workCount++;
      if (task.tags && task.tags.includes('leisure')) leisureCount++;
      if (task.tags && task.tags.includes('grind')) grindCount++;
    });

    // Determine primary schedule category
    let scheduleCategory = 'balanced';
    if (workCount > leisureCount && workCount > grindCount) {
      scheduleCategory = 'work-focused';
    } else if (leisureCount > workCount && leisureCount > grindCount) {
      scheduleCategory = 'leisure-focused';
    } else if (grindCount > workCount && grindCount > leisureCount) {
      scheduleCategory = 'grind-focused';
    }

    setAnalysis({
      productivityScore: 85,
      moodTrends: 'Positive after exercise tasks',
      suggestions: ['Schedule more morning exercise', 'Take breaks between long tasks'],
      scheduleCategory: scheduleCategory
    });
  };

  // Simple test view to check if basic components render
  if (showBasicView) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '#f0f0f0' }}>
        <View style={{ padding: 20, alignItems: 'center', justifyContent: 'center', flex: 1 }}>
          <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 20 }}>Basic Test View</Text>
          <Text style={{ fontSize: 16, marginBottom: 10 }}>If you can see this, the app is rendering correctly</Text>
          <TouchableOpacity
            onPress={() => setShowBasicView(false)}
            style={{
              backgroundColor: 'blue',
              padding: 10,
              borderRadius: 5,
              marginTop: 20
            }}
          >
            <Text style={{ color: 'white' }}>Show Full App</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // Full app view
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
      >
        <Text style={styles.appTitle}>Schedule Bot</Text>

        <DailySchedule
          tasks={processedTasks}
        />

        <TaskInput
          onAddTask={addTask}
        />

        <SuggestionPanel
          tasks={tasks}
        />

        <MoodTracker
          onMoodUpdate={setDailyMood}
          tasks={tasks}
        />



        <DailyAnalysis
          analysis={analysis}
          onAnalyze={analyzeDailyPerformance}
        />

        <ScheduleSharing
          schedule={tasks}
        />

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Schedule better, live smarter
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