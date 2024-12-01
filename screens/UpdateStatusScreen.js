import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, TextInput } from 'react-native';
import { firestore } from '../firebase';
import { doc, updateDoc } from 'firebase/firestore'; 

const UpdateStatusScreen = ({ route, navigation }) => {
  const { taskId, currentStatus } = route.params; // Get taskId and currentStatus from params
  const [status, setStatus] = useState(currentStatus || 'Incomplete'); // Set initial status

  const handleUpdateStatus = async () => {
    try {
      const taskDocRef = doc(firestore, 'todos', taskId); // Reference to the task document
      await updateDoc(taskDocRef, { isCompleted: status === 'Completed' }); // Update the status
      alert('Task status updated successfully!');
      navigation.goBack(); // Go back to the previous screen after update
    } catch (error) {
      console.error('Error updating task status:', error);
      alert('Failed to update status. Please try again.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Update Task Status</Text>
      <Text style={styles.label}>Task ID: {taskId}</Text>
      
      <TextInput
        style={styles.input}
        value={status}
        onChangeText={setStatus}
        placeholder="Enter task status (Completed/Incomplete)"
      />

      <TouchableOpacity style={styles.updateButton} onPress={handleUpdateStatus}>
        <Text style={styles.buttonText}>Update Status</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f4f5f9',
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
  },
  input: {
    width: '80%',
    padding: 12,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    marginBottom: 20,
    fontSize: 16,
  },
  updateButton: {
    backgroundColor: '#007bff',
    padding: 14,
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default UpdateStatusScreen;
