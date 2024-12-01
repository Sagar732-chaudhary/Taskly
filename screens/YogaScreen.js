import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Modal,
  Button,
  Alert,
} from 'react-native';

const YogaScreen = () => {
  // Sample yoga routines
  const [routines] = useState([
    { id: '1', name: 'Morning Yoga', duration: '15 minutes', description: 'A quick routine to energize your day.' },
    { id: '2', name: 'Relaxation Yoga', duration: '20 minutes', description: 'Perfect for winding down after a long day.' },
    { id: '3', name: 'Strength Yoga', duration: '30 minutes', description: 'Build strength with these poses.' },
    { id: '4', name: 'Flexibility Yoga', duration: '25 minutes', description: 'Improve flexibility and mobility.' },
  ]);

  const [selectedRoutine, setSelectedRoutine] = useState(null);
  const [isModalVisible, setModalVisible] = useState(false);

  const startSession = () => {
    Alert.alert(
      'Yoga Session Started',
      `You are now doing ${selectedRoutine.name}. Duration: ${selectedRoutine.duration}.`,
      [{ text: 'OK', onPress: () => setModalVisible(false) }]
    );
  };

  const renderRoutine = ({ item }) => (
    <TouchableOpacity
      style={styles.routineCard}
      onPress={() => {
        setSelectedRoutine(item);
        setModalVisible(true);
      }}
    >
      <Text style={styles.routineName}>{item.name}</Text>
      <Text style={styles.routineDetails}>{item.duration}</Text>
      <Text style={styles.routineDescription}>{item.description}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Yoga Routines</Text>
      <FlatList
        data={routines}
        renderItem={renderRoutine}
        keyExtractor={(item) => item.id}
        style={styles.routineList}
      />

      {/* Modal for session details */}
      <Modal
        visible={isModalVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            {selectedRoutine && (
              <>
                <Text style={styles.modalTitle}>{selectedRoutine.name}</Text>
                <Text style={styles.modalDuration}>Duration: {selectedRoutine.duration}</Text>
                <Text style={styles.modalDescription}>{selectedRoutine.description}</Text>
                <Button title="Start Session" onPress={startSession} />
              </>
            )}
            <Button title="Cancel" color="red" onPress={() => setModalVisible(false)} />
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f9f9f9',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginVertical: 16,
  },
  routineList: {
    marginTop: 16,
  },
  routineCard: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  routineName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#007bff',
  },
  routineDetails: {
    fontSize: 16,
    color: '#555',
    marginTop: 4,
  },
  routineDescription: {
    fontSize: 14,
    color: '#666',
    marginTop: 8,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 8,
    width: '80%',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  modalDuration: {
    fontSize: 18,
    marginBottom: 8,
  },
  modalDescription: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
  },
});

export default YogaScreen;
