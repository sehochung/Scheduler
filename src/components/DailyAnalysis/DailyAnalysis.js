import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import COLORS from '../../colors';
import '../../../src/styles/components/DailyAnalysis.css';


const DailyAnalysis = ({ analysis, onAnalyze }) => {
  // If no analysis available yet
  if (!analysis) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Daily Analysis</Text>
        <Text style={styles.emptyText}>
          Complete your day to see performance analysis and insights.
        </Text>
        <TouchableOpacity style={styles.analyzeButton} onPress={onAnalyze}>
          <Text style={styles.analyzeButtonText}>Generate Analysis</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Daily Analysis</Text>
      
      <ScrollView style={styles.contentContainer}>
        <View style={styles.scoreCard}>
          <Text style={styles.scoreTitle}>Productivity Score</Text>
          <Text style={styles.scoreValue}>{analysis.productivityScore}%</Text>
          <View style={styles.scoreBar}>
            <View 
              style={[
                styles.scoreProgress, 
                { width: `${analysis.productivityScore}%` }
              ]} 
            />
          </View>
        </View>
        
        <Text style={styles.sectionTitle}>Productivity by Time</Text>
        <View style={styles.chartPlaceholder}>
          <Text style={styles.chartPlaceholderText}>Productivity Chart</Text>
        </View>
        
        <Text style={styles.sectionTitle}>Mood Tracking</Text>
        <View style={styles.chartPlaceholder}>
          <Text style={styles.chartPlaceholderText}>Mood Chart</Text>
        </View>
        
        <Text style={styles.sectionTitle}>Insights</Text>
        <View style={styles.insightsContainer}>
          <Text style={styles.insightText}>• {analysis.moodTrends}</Text>
          {analysis.suggestions.map((suggestion, index) => (
            <Text key={index} style={styles.insightText}>• {suggestion}</Text>
          ))}
        </View>
        
        <Text style={styles.sectionTitle}>Task Completion</Text>
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>12</Text>
            <Text style={styles.statLabel}>Tasks Completed</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>85%</Text>
            <Text style={styles.statLabel}>Completion Rate</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>3</Text>
            <Text style={styles.statLabel}>Tasks Missed</Text>
          </View>
        </View>
      </ScrollView>
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
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    color: COLORS.black,
  },
  emptyText: {
    fontSize: 16,
    color: COLORS.secondaryDark,
    fontStyle: 'italic',
    marginBottom: 20,
    backgroundColor: COLORS.secondaryLight,
    padding: 15,
    borderRadius: 8,
  },
  analyzeButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 6,
    alignItems: 'center',
  },
  analyzeButtonText: {
    color: COLORS.white,
    fontWeight: 'bold',
    fontSize: 16,
  },
  contentContainer: {
    maxHeight: 500,
  },
  scoreCard: {
    backgroundColor: COLORS.secondaryLight,
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
  },
  scoreTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 5,
    color: COLORS.secondaryDark,
  },
  scoreValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.success,
    marginBottom: 10,
  },
  scoreBar: {
    height: 10,
    backgroundColor: COLORS.secondary,
    borderRadius: 5,
    overflow: 'hidden',
  },
  scoreProgress: {
    height: 10,
    backgroundColor: COLORS.success,
    borderRadius: 5,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 15,
    marginBottom: 10,
    color: COLORS.black,
  },
  chartPlaceholder: {
    height: 180,
    backgroundColor: COLORS.secondaryLight,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 8,
  },
  chartPlaceholderText: {
    fontSize: 16,
    color: COLORS.secondaryDark,
  },
  insightsContainer: {
    backgroundColor: COLORS.secondaryLight,
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
  },
  insightText: {
    fontSize: 16,
    color: COLORS.black,
    marginBottom: 8,
    lineHeight: 22,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  statItem: {
    flex: 1,
    backgroundColor: COLORS.secondaryLight,
    borderRadius: 10,
    padding: 12,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 12,
    color: COLORS.secondaryDark,
    textAlign: 'center',
  },
});

export default DailyAnalysis;