import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Modal, ActivityIndicator } from 'react-native';
// Commenting out ImagePicker for debugging
// import * as ImagePicker from 'expo-image-picker';

const ScanSchedule = ({ onScanComplete }) => {
  const [scanning, setScanning] = useState(false);
  const [scanImage, setScanImage] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  
  const handleScan = async () => {
    // For debugging purposes, we'll skip the camera part
    // and just simulate the scan process
    setModalVisible(true);
    setScanning(true);
    
    // Mock OCR processing with a delay
    setTimeout(() => {
      setScanning(false);
      
      // Mock detected schedule items from the "scan"
      const detectedTasks = [
        {
          id: 'scan1',
          title: 'Team Meeting',
          duration: 60,
          startTime: new Date('2023-01-01T10:00').toISOString(),
          category: 'work',
          completed: false,
        },
        {
          id: 'scan2',
          title: 'Lunch with Client',
          duration: 90,
          startTime: new Date('2023-01-01T12:30').toISOString(),
          category: 'work',
          completed: false,
        },
        {
          id: 'scan3',
          title: 'Gym Workout',
          duration: 60,
          startTime: new Date('2023-01-01T17:00').toISOString(),
          category: 'grind',
          completed: false,
        },
      ];
      
      onScanComplete(detectedTasks);
    }, 3000);
  };
  
  const closeModal = () => {
    setModalVisible(false);
    setScanImage(null);
    setScanning(false);
  };
  
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Scan Paper Schedule</Text>
      
      <Text style={styles.description}>
        Take a photo of your handwritten schedule or printed calendar to import tasks automatically.
      </Text>
      
      <TouchableOpacity 
        style={styles.scanButton}
        onPress={handleScan}
      >
        <Text style={styles.scanButtonText}>📷 Scan Schedule</Text>
      </TouchableOpacity>
      
      {/* Modal for scanning process */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={closeModal}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              {scanning ? 'Processing Your Schedule...' : 'Schedule Detected!'}
            </Text>
            
            {scanning ? (
              <View style={styles.scanningContainer}>
                <ActivityIndicator size="large" color="#3498db" />
                <Text style={styles.scanningText}>
                  Using OCR to detect tasks and times...
                </Text>
              </View>
            ) : (
              <View style={styles.resultContainer}>
                <Text style={styles.resultText}>
                  3 tasks successfully detected from your paper schedule.
                </Text>
                
                <View style={styles.detectedItems}>
                  <View style={styles.detectedItem}>
                    <Text style={styles.detectedTime}>10:00 AM</Text>
                    <Text style={styles.detectedTask}>Team Meeting</Text>
                  </View>
                  
                  <View style={styles.detectedItem}>
                    <Text style={styles.detectedTime}>12:30 PM</Text>
                    <Text style={styles.detectedTask}>Lunch with Client</Text>
                  </View>
                  
                  <View style={styles.detectedItem}>
                    <Text style={styles.detectedTime}>5:00 PM</Text>
                    <Text style={styles.detectedTask}>Gym Workout</Text>
                  </View>
                </View>
                
                <TouchableOpacity 
                  style={styles.importButton}
                  onPress={closeModal}
                >
                  <Text style={styles.importButtonText}>Import to My Schedule</Text>
                </TouchableOpacity>
              </View>
            )}
            
            {!scanning && (
              <TouchableOpacity
                style={styles.closeButton}
                onPress={closeModal}
              >
                <Text style={styles.closeButtonText}>Cancel</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginVertical: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  description: {
    fontSize: 14,
    color: '#666',
    marginBottom: 15,
    lineHeight: 20,
  },
  scanButton: {
    backgroundColor: '#8e44ad',
    paddingVertical: 12,
    borderRadius: 6,
    alignItems: 'center',
  },
  scanButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  
  // Modal styles
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    width: '90%',
    maxHeight: '90%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
    color: '#333',
  },
  scanningContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  scanningText: {
    marginTop: 10,
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  resultContainer: {
    marginVertical: 10,
  },
  resultText: {
    fontSize: 16,
    color: '#27ae60',
    fontWeight: '500',
    textAlign: 'center',
    marginBottom: 15,
  },
  detectedItems: {
    backgroundColor: '#f8f8f8',
    borderRadius: 8,
    padding: 12,
    marginVertical: 10,
  },
  detectedItem: {
    flexDirection: 'row',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  detectedTime: {
    width: 100,
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  detectedTask: {
    flex: 1,
    fontSize: 14,
    color: '#555',
  },
  importButton: {
    backgroundColor: '#27ae60',
    paddingVertical: 12,
    borderRadius: 6,
    alignItems: 'center',
    marginTop: 15,
  },
  importButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  closeButton: {
    backgroundColor: '#f0f0f0',
    paddingVertical: 10,
    borderRadius: 6,
    alignItems: 'center',
    marginTop: 15,
  },
  closeButtonText: {
    color: '#555',
    fontWeight: '600',
    fontSize: 14,
  },
});

export default ScanSchedule;