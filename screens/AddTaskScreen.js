import React, { useState } from 'react';
import {
  View,
  TextInput,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  Modal,
  FlatList,
} from 'react-native';
import { auth, firestore } from '../firebase';
import { collection, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import DateTimePicker from '@react-native-community/datetimepicker';

const AddTaskScreen = ({ route, navigation }) => {
  const { todo, isEdit } = route.params || {};

  const [taskName, setTaskName] = useState(isEdit ? todo.title : '');
  const [category, setCategory] = useState(isEdit ? todo.category : 'Design');
  const [customCategory, setCustomCategory] = useState(isEdit && todo.category === 'Other' ? todo.customCategory : '');
  const [startDate, setStartDate] = useState(isEdit ? new Date(todo.startDate) : new Date());
  const [endDate, setEndDate] = useState(isEdit ? new Date(todo.endDate) : new Date());
  const [startTime, setStartTime] = useState(isEdit ? new Date(todo.startTime) : new Date());
  const [endTime, setEndTime] = useState(isEdit ? new Date(todo.endTime) : new Date());
  const [description, setDescription] = useState(isEdit ? todo.description : '');
  const [showPicker, setShowPicker] = useState({ type: null, visible: false });
  const [loading, setLoading] = useState(false);
  const [isCategoryModalVisible, setCategoryModalVisible] = useState(false);
  const [categoryList] = useState(['Running', 'Cycling', 'Yoga', 'Design', 'Other']);

  const userId = auth.currentUser.uid;

  const handleSave = async () => {
    setLoading(true);
    const taskRef = collection(firestore, 'todos');
    const taskData = {
      title: taskName,
      category: category === 'Other' ? customCategory : category,
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      startTime: startTime.toISOString(),
      endTime: endTime.toISOString(),
      description,
      userId,
    };

    try {
      if (isEdit) {
        await updateDoc(doc(taskRef, todo.id), taskData); // Using the task ID for updates
        Alert.alert('Success', 'Task updated successfully');
      } else {
        await addDoc(taskRef, taskData); // Adding a new task
        Alert.alert('Success', 'Task added successfully');
      }
      navigation.navigate('Home');
    } catch (error) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      if (!todo || !todo.id) {
        Alert.alert('Error', 'Task ID is missing');
        return;
      }

      setLoading(true);
      await deleteDoc(doc(firestore, 'todos', todo.id)); // Deleting the task by ID
      Alert.alert('Success', 'Task deleted successfully');
      navigation.navigate('Home');
    } catch (error) {
      Alert.alert('Error', `Failed to delete task: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDateTimeChange = (event, selectedDate) => {
    if (event.type === 'dismissed') {
      setShowPicker({ type: null, visible: false });
      return;
    }

    if (selectedDate) {
      switch (showPicker.type) {
        case 'startDate':
          setStartDate(selectedDate);
          break;
        case 'endDate':
          setEndDate(selectedDate);
          break;
        case 'startTime':
          setStartTime(selectedDate);
          break;
        case 'endTime':
          setEndTime(selectedDate);
          break;
      }
    }
    setShowPicker({ type: null, visible: false });
  };

  const renderCategoryItem = ({ item }) => (
    <TouchableOpacity
      style={[styles.categoryOption, category === item && styles.categoryOptionSelected]}
      onPress={() => {
        setCategory(item);
        setCustomCategory('');
        setCategoryModalVisible(false);
      }}
    >
      <Text style={styles.categoryOptionText}>{item}</Text>
    </TouchableOpacity>
  );

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <Text style={styles.label}>Task Name</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter task name"
          value={taskName}
          onChangeText={setTaskName}
        />

        <Text style={styles.label}>Category</Text>
        <TouchableOpacity style={styles.input} onPress={() => setCategoryModalVisible(true)}>
          <Text style={styles.categoryText}>{category}</Text>
        </TouchableOpacity>

        {category === 'Other' && (
          <TextInput
            style={styles.input}
            placeholder="Enter custom category"
            value={customCategory}
            onChangeText={setCustomCategory}
          />
        )}

        <Text style={styles.label}>Start Date</Text>
        <TouchableOpacity
          style={styles.datePickerButton}
          onPress={() => setShowPicker({ type: 'startDate', visible: true })}
        >
          <Text style={styles.datePickerText}>{startDate.toDateString()}</Text>
        </TouchableOpacity>

        <Text style={styles.label}>End Date</Text>
        <TouchableOpacity
          style={styles.datePickerButton}
          onPress={() => setShowPicker({ type: 'endDate', visible: true })}
        >
          <Text style={styles.datePickerText}>{endDate.toDateString()}</Text>
        </TouchableOpacity>

        <Text style={styles.label}>Start Time</Text>
        <TouchableOpacity
          style={styles.datePickerButton}
          onPress={() => setShowPicker({ type: 'startTime', visible: true })}
        >
          <Text style={styles.datePickerText}>{startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Text>
        </TouchableOpacity>

        <Text style={styles.label}>End Time</Text>
        <TouchableOpacity
          style={styles.datePickerButton}
          onPress={() => setShowPicker({ type: 'endTime', visible: true })}
        >
          <Text style={styles.datePickerText}>{endTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Text>
        </TouchableOpacity>

        <Text style={styles.label}>Description</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Enter task description"
          value={description}
          onChangeText={setDescription}
          multiline
          numberOfLines={4}
        />

        <TouchableOpacity style={styles.createButton} onPress={handleSave} disabled={loading}>
          <Text style={styles.createButtonText}>
            {isEdit ? 'Update Task' : 'Create Task'}
          </Text>
        </TouchableOpacity>

        {isEdit && (
          <TouchableOpacity style={styles.deleteButton} onPress={handleDelete} disabled={loading}>
            <Text style={styles.deleteButtonText}>Delete Task</Text>
          </TouchableOpacity>
        )}

        {showPicker.visible && (
          <DateTimePicker
            value={
              showPicker.type === 'startDate'
                ? startDate
                : showPicker.type === 'endDate'
                ? endDate
                : showPicker.type === 'startTime'
                ? startTime
                : endTime
            }
            mode={showPicker.type.includes('Date') ? 'date' : 'time'}
            display="spinner"
            onChange={handleDateTimeChange}
          />
        )}

        <Modal
          visible={isCategoryModalVisible}
          animationType="slide"
          transparent
          onRequestClose={() => setCategoryModalVisible(false)}
        >
          <View style={styles.modalBackground}>
            <View style={styles.modalContainer}>
              <Text style={styles.modalTitle}>Select Category</Text>
              <FlatList
                data={categoryList}
                renderItem={renderCategoryItem}
                keyExtractor={(item) => item}
                style={styles.categoryList}
              />
            </View>
          </View>
        </Modal>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    padding: 16,
    backgroundColor: '#f4f5f9',
  },
  container: {
    flex: 1,
    paddingBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    fontSize: 16,
  },
  categoryText: {
    fontSize: 16,
    color: '#333',
  },
  datePickerButton: {
    backgroundColor: '#fff',
    padding: 12,
    marginBottom: 16,
    borderRadius: 8,
  },
  datePickerText: {
    fontSize: 16,
    color: '#333',
  },
  textArea: {
    height: 120,
  },
  createButton: {
    backgroundColor: '#4CAF50',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 16,
  },
  createButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  deleteButton: {
    backgroundColor: '#f44336',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  deleteButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  categoryOption: {
    padding: 12,
    marginBottom: 8,
    borderRadius: 8,
  },
  categoryOptionText: {
    fontSize: 16,
    color: '#333',
  },
  categoryOptionSelected: {
    backgroundColor: '#e0e0e0',
  },
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 8,
    width: '80%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  categoryList: {
    maxHeight: 200,
  },
});

export default AddTaskScreen;
