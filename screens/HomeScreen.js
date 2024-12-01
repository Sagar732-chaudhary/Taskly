import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, Alert, TextInput, StyleSheet } from 'react-native';
import { firestore } from '../firebase';
import { collection, query, where, getDocs, deleteDoc, doc, addDoc } from 'firebase/firestore';
import { auth } from '../firebase';
import { Picker } from '@react-native-picker/picker'; 
import Icon from 'react-native-vector-icons/FontAwesome'; // Importing FontAwesome for notification icon

const HomeScreen = ({ navigation }) => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortOrder, setSortOrder] = useState('asc');
  const [notificationMessage, setNotificationMessage] = useState('');
  const [taskName, setTaskName] = useState('');

  // Fetch tasks from Firestore
  const fetchTasks = async () => {
    try {
      setLoading(true);
      const userId = auth.currentUser.uid;
      const tasksRef = collection(firestore, 'todos');
      const q = query(tasksRef, where('userId', '==', userId));
      const querySnapshot = await getDocs(q);

      const tasksList = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));

      setTasks(tasksList);
    } catch (error) {
      Alert.alert('Error', 'Failed to fetch tasks: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Simulate a demo notification with custom task name
  const showDemoNotification = (message) => {
    // Simulate a notification after a short delay (e.g., 2 seconds)
    setTimeout(() => {
      setNotificationMessage(message); // Set the notification message
      setTimeout(() => setNotificationMessage(''), 3000); // Clear the message after 3 seconds
    }, 1000);
  };

  // Handle task deletion
  const handleDeleteTask = async (taskId) => {
    try {
      await deleteDoc(doc(firestore, 'todos', taskId));
      setTasks(prevTasks => prevTasks.filter(task => task.id !== taskId));
      Alert.alert('Success', 'Task deleted successfully');
      showDemoNotification('A task was deleted successfully.');
    } catch (error) {
      Alert.alert('Error', 'Failed to delete task: ' + error.message);
    }
  };

  // Function to handle task addition
  const handleAddTask = async (taskData) => {
    try {
      const docRef = await addDoc(collection(firestore, 'todos'), taskData);
      setTasks(prevTasks => [...prevTasks, { id: docRef.id, ...taskData }]);
      Alert.alert('Success', 'Task added successfully');
      showDemoNotification('A new task was added.');
    } catch (error) {
      Alert.alert('Error', 'Failed to add task: ' + error.message);
    }
  };

  // Filter tasks based on search, status, category, etc.
  const filteredTasks = tasks
    .filter((task) => {
      if (searchQuery && !task.title.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false;
      }
      if (statusFilter === 'completed' && task.status !== 'completed') {
        return false;
      }
      if (statusFilter === 'incomplete' && task.status === 'completed') {
        return false;
      }
      return true;
    })
    .sort((a, b) => {
      if (sortOrder === 'asc') {
        return new Date(a.startDate) - new Date(b.startDate);
      } else {
        return new Date(b.startDate) - new Date(a.startDate);
      }
    });

  return (
    <View style={styles.container}>
      <View style={styles.appBar}>
        {/* Left notification icon */}
        <TouchableOpacity onPress={() => {
          // Ask for the task name when the bell icon is clicked
          Alert.prompt(
            'Task Reminder',
            'Enter the task name:',
            [
              { text: 'Cancel' },
              { text: 'OK', onPress: (taskName) => {
                setTaskName(taskName);
                showDemoNotification(`Reminder for: ${taskName}`);
              }}
            ],
            'plain-text'
          );
        }}>
          <Icon name="bell" size={30} color="#007bff" />
        </TouchableOpacity>

        {/* Centered title */}
        <Text style={styles.appBarTitle}>Your Tasks</Text>

        {/* Right refresh button */}
        <TouchableOpacity onPress={fetchTasks}>
          <Text style={styles.refreshButton}>🔄</Text>
        </TouchableOpacity>
      </View>

      {/* Notification display */}
      {notificationMessage && (
        <View style={styles.notificationBanner}>
          <Text style={styles.notificationText}>{notificationMessage}</Text>
        </View>
      )}

      {/* Search and filter UI */}
      <View style={styles.filterContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search tasks..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />

        {/* Sort and Status Filters */}
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={statusFilter}
            onValueChange={(itemValue) => setStatusFilter(itemValue)}
            style={styles.picker}
          >
            <Picker.Item label="All" value="all" />
            <Picker.Item label="Completed" value="completed" />
            <Picker.Item label="Incomplete" value="incomplete" />
          </Picker>

          <Picker
            selectedValue={sortOrder}
            onValueChange={(itemValue) => setSortOrder(itemValue)}
            style={styles.picker}
          >
            <Picker.Item label="Sort by Date (Asc)" value="asc" />
            <Picker.Item label="Sort by Date (Desc)" value="desc" />
          </Picker>
        </View>
      </View>

      {/* Show loading or tasks */}
      {loading ? (
        <Text>Loading...</Text>
      ) : (
        <FlatList
          data={filteredTasks}
          renderItem={({ item }) => (
            <View style={styles.taskItem}>
              <Text style={styles.taskTitle}>{item.title}</Text>
              <Text style={styles.taskCategory}>{item.category}</Text>
              <Text style={styles.taskDate}>
                {new Date(item.startDate).toLocaleDateString()} - {new Date(item.endDate).toLocaleDateString()}
              </Text>

              <View style={styles.actionButtons}>
                <TouchableOpacity
                  style={styles.editButton}
                  onPress={() => navigation.navigate('AddTask', { todo: item, isEdit: true })}
                >
                  <Text style={styles.buttonText}>Edit</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={() => handleDeleteTask(item.id)}
                >
                  <Text style={styles.buttonText}>Delete</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.taskList}
        />
      )}

      {/* Add New Task button */}
      <TouchableOpacity
        style={styles.addTaskButton}
        onPress={() => navigation.navigate('AddTask', { isEdit: false })}
      >
        <Text style={styles.buttonText}>Add New Task</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f4f5f9',
  },
  appBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 20,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  appBarTitle: {
    fontSize: 24,
    fontWeight: '600',
    textAlign: 'center', // Centered title
    flex: 1, // Ensures it takes up the available space
  },
  refreshButton: {
    fontSize: 24,
    color: '#007bff',
  },
  notificationBanner: {
    backgroundColor: '#f8d7da',
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
  notificationText: {
    color: '#721c24',
    fontWeight: 'bold',
  },
  filterContainer: {
    marginVertical: 10,
    height:'auto',
  },
  searchInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 8,
    borderRadius: 8,
    marginBottom: 10,
  },
  pickerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  picker: {
    width: '45%',
    height: 100,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
  },
  taskList: {
    flexGrow: 1,
  },
  taskItem: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  taskTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  taskCategory: {
    fontSize: 14,
    color: '#666',
  },
  taskDate: {
    fontSize: 14,
    color: '#999',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  editButton: {
    backgroundColor: '#4caf50',
    padding: 8,
    borderRadius: 4,
  },
  deleteButton: {
    backgroundColor: '#f44336',
    padding: 8,
    borderRadius: 4,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  addTaskButton: {
    backgroundColor: '#007bff',
    padding: 16,
    borderRadius: 8,
    marginTop: 20,
    alignItems: 'center',
  },
});

export default HomeScreen;
