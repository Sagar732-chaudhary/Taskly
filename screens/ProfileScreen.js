import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet, Alert, ScrollView, FlatList } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome'; // Import FontAwesome icons
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase'; // Adjust the path to your firebase.js
import * as Location from 'expo-location';

const ProfileScreen = () => {
  const [userData, setUserData] = useState({ name: '', email: '', phone: '' });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('profile'); // Profile, walking, running, yoga
  const [distance, setDistance] = useState(0);
  const [speed, setSpeed] = useState(0);  // Speed in meters per second for running
  const [sessionTime, setSessionTime] = useState(0); // Yoga session time
  const [isTracking, setIsTracking] = useState(false);
  const [previousLocation, setPreviousLocation] = useState(null);
  const [startTime, setStartTime] = useState(null);
  const [location, setLocation] = useState(null); // For GPS tracking
  const [activityHistory, setActivityHistory] = useState([]);
  const [goal, setGoal] = useState(5000); // Example: default walking goal is 5000 meters
  const [achievements, setAchievements] = useState([]);

  // Fetch user data from Firebase
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserData({
          name: user.displayName || 'User',
          email: user.email || '',
          phone: user.phoneNumber || 'Not provided',
        });
        setLoading(false);
      } else {
        Alert.alert('Please login first');
        setLoading(false);
      }
    });

    return unsubscribe; // Clean up on unmount
  }, []);

  useEffect(() => {
    const startTracking = async () => {
      if (isTracking) {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          alert('Permission denied. Location access is needed.');
          setIsTracking(false);
          return;
        }

        // Start tracking the user's position for walking and running
        Location.watchPositionAsync(
          {
            accuracy: Location.Accuracy.High,
            timeInterval: 1000, // Update every second
            distanceInterval: 1, // Update every meter
          },
          (newLocation) => {
            const { latitude, longitude, speed: currentSpeed } = newLocation.coords;

            if (previousLocation) {
              const dist = getDistanceFromLatLonInMeters(
                previousLocation.latitude,
                previousLocation.longitude,
                latitude,
                longitude
              );
              setDistance((prevDistance) => prevDistance + dist);
            }

            if (currentSpeed) {
              setSpeed(currentSpeed); // Set speed in meters per second for running
            }

            setPreviousLocation({ latitude, longitude });
            setLocation(newLocation.coords);
          }
        );

        // Set start time for elapsed time tracking for running
        if (!startTime) {
          setStartTime(Date.now());
        }
      }
    };

    startTracking();
    return () => {
      setPreviousLocation(null);
      setDistance(0);
    };
  }, [isTracking]);

  const getDistanceFromLatLonInMeters = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Radius of the earth in km
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = R * c * 1000; // Distance in meters
    return d;
  };

  const deg2rad = (deg) => deg * (Math.PI / 180);

  const handleStartStopTracking = () => {
    setIsTracking((prev) => !prev);
    if (!isTracking) {
      setStartTime(Date.now()); // Start tracking time for running
      setDistance(0); // Reset distance when starting a new activity
    }
  };

  const handleYogaSession = () => {
    if (isTracking) {
      setSessionTime((prev) => prev + 1);
    }
  };

  const handleAddActivityToHistory = (activityType, distance, time) => {
    setActivityHistory([
      ...activityHistory,
      { type: activityType, distance, time, date: new Date().toLocaleString() },
    ]);
  };

  const handleGoalCompletion = () => {
    if (distance >= goal) {
      setAchievements([...achievements, 'Goal achieved!']);
      Alert.alert('Congratulations', 'You have completed your goal!');
    }
  };

  if (loading) {
    return <Text>Loading...</Text>;
  }

  return (
    <ScrollView style={styles.container}>
      {/* Profile Section */}
      <View style={styles.profileSection}>
        <Icon name="user-circle" size={150} color="#007BFF" style={styles.profileIcon} />
        <Text style={styles.name}>{userData.name}</Text>
        <Text style={styles.info}>Email: {userData.email}</Text>
        <Text style={styles.info}>Phone: {userData.phone}</Text>
      </View>

      {/* Activity Tracker Tabs */}
      <View style={styles.tabContainer}>
        <Button title="Profile" onPress={() => setActiveTab('profile')} />
        <Button title="Walking" onPress={() => setActiveTab('walking')} />
        <Button title="Running" onPress={() => setActiveTab('running')} />
        <Button title="Yoga" onPress={() => setActiveTab('yoga')} />
      </View>

      {/* Activity Tracker */}
      {activeTab === 'walking' && (
        <View style={styles.activitySection}>
          <Text style={styles.title}>Walking Tracker</Text>
          <Text style={styles.info}>Distance: {distance.toFixed(2)} meters</Text>
          <Text style={styles.info}>Goal: {goal} meters</Text>
          <Button title={isTracking ? 'Stop Tracking' : 'Start Tracking'} onPress={handleStartStopTracking} />
          <Button title="Add to History" onPress={() => handleAddActivityToHistory('Walking', distance, sessionTime)} />
          {distance >= goal && (
            <Text style={styles.info}>Goal Completed! Congratulations!</Text>
          )}
        </View>
      )}

      {activeTab === 'running' && (
        <View style={styles.activitySection}>
          <Text style={styles.title}>Running Tracker</Text>
          <Text style={styles.info}>Distance: {distance.toFixed(2)} meters</Text>
          <Text style={styles.info}>Speed: {speed.toFixed(2)} m/s</Text>
          <Text style={styles.info}>Elapsed Time: {Math.floor((Date.now() - startTime) / 1000)} seconds</Text>
          <Button title={isTracking ? 'Stop Tracking' : 'Start Tracking'} onPress={handleStartStopTracking} />
          <Button title="Add to History" onPress={() => handleAddActivityToHistory('Running', distance, sessionTime)} />
          {distance >= goal && (
            <Text style={styles.info}>Goal Completed! Congratulations!</Text>
          )}
        </View>
      )}

      {activeTab === 'yoga' && (
        <View style={styles.activitySection}>
          <Text style={styles.title}>Yoga Session</Text>
          <Text style={styles.info}>Session Time: {sessionTime} seconds</Text>
          <Button title={isTracking ? 'End Yoga Session' : 'Start Yoga Session'} onPress={() => {
            setIsTracking(!isTracking);
            if (isTracking) handleYogaSession();
          }} />
          <Button title="Add to History" onPress={() => handleAddActivityToHistory('Yoga', 0, sessionTime)} />
        </View>
      )}

      {/* Activity History */}
      <View style={styles.historySection}>
        <Text style={styles.title}>Activity History</Text>
        <FlatList
          data={activityHistory}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <View style={styles.historyItem}>
              <Text>{item.type} - {item.distance} meters - {item.time} sec - {item.date}</Text>
            </View>
          )}
        />
      </View>

      {/* Achievements */}
      <View style={styles.achievementsSection}>
        <Text style={styles.title}>Achievements</Text>
        {achievements.length > 0 ? (
          achievements.map((achievement, index) => (
            <Text key={index} style={styles.info}>{achievement}</Text>
          ))
        ) : (
          <Text style={styles.info}>No achievements yet.</Text>
        )}
      </View>
    </ScrollView>
  );
};

// Styles for Profile Screen and Activity Sections
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7f9fc',
    padding: 20,
  },
  profileSection: {
    alignItems: 'center',
    marginBottom: 30,
  },
  profileIcon: {
    marginBottom: 20,
  },
  name: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 10,
    color: '#1a1a1a',
  },
  info: {
    fontSize: 16,
    color: '#6c757d',
    marginBottom: 5,
  },
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginBottom: 20,
  },
  activitySection: {
    alignItems: 'center',
    marginBottom: 30,
  },
  historySection: {
    marginTop: 30,
  },
  historyItem: {
    padding: 10,
    backgroundColor: '#f1f1f1',
    marginBottom: 5,
    borderRadius: 5,
  },
  achievementsSection: {
    marginTop: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
});

export default ProfileScreen;
