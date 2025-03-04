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
import Schedule from './src/components/Schedule';
import TaskInput from './src/components/TaskInput';
import SuggestionPanel from './src/components/SuggestionPanel';
import MoodTracker from './src/components/MoodTracker';
import ScheduleSharing from './src/components/ScheduleSharing';
import DailyAnalysis from './src/components/DailyAnalysis';

export default function App() {
  console.log('App component rendering');
  const [tasks, setTasks] = useState([]);
  const [dailyMood, setDailyMood] = useState({});
  const [analysis, setAnalysis] = useState(null);
  const [showBasicView, setShowBasicView] = useState(false); // Show full app view

  const addTask = (newTask) => {
    setTasks([...tasks, newTask]);
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

        <Schedule
          tasks={tasks}
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