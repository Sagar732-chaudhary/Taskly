import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Button, Alert } from 'react-native';
import * as Location from 'expo-location';

const RunningScreen = () => {
  const [location, setLocation] = useState(null);
  const [distance, setDistance] = useState(0);
  const [isTracking, setIsTracking] = useState(false);
  const [previousLocation, setPreviousLocation] = useState(null);
  const [startTime, setStartTime] = useState(null);
  const [elapsedTime, setElapsedTime] = useState(0); // Time in seconds
  const [speed, setSpeed] = useState(0); // Speed in meters per second

  useEffect(() => {
    const startTracking = async () => {
      if (isTracking) {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert('Permission denied', 'Location access is needed for running tracking.');
          setIsTracking(false);
          return;
        }

        // Start tracking the user's position
        Location.watchPositionAsync(
          {
            accuracy: Location.Accuracy.High,
            timeInterval: 1000, // Update every second
            distanceInterval: 1, // Update every meter
          },
          (newLocation) => {
            const { latitude, longitude, speed } = newLocation.coords;

            if (previousLocation) {
              const dist = getDistanceFromLatLonInMeters(
                previousLocation.latitude,
                previousLocation.longitude,
                latitude,
                longitude
              );
              setDistance((prevDistance) => prevDistance + dist);
            }

            if (speed) {
              setSpeed(speed); // Set speed in meters per second
            }

            setPreviousLocation({ latitude, longitude });
            setLocation(newLocation.coords);
          }
        );

        // Set start time for elapsed time tracking
        if (!startTime) {
          setStartTime(Date.now());
        }
      }
    };

    startTracking();

    // Update elapsed time every second
    const timerInterval = setInterval(() => {
      if (isTracking && startTime) {
        const now = Date.now();
        setElapsedTime(Math.floor((now - startTime) / 1000)); // Elapsed time in seconds
      }
    }, 1000);

    return () => {
      clearInterval(timerInterval);
    };
  }, [isTracking, startTime]);

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

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Running Tracker</Text>
      <Text style={styles.info}>Distance: {distance.toFixed(2)} meters</Text>
      <Text style={styles.info}>Speed: {speed.toFixed(2)} m/s</Text>
      <Text style={styles.info}>Elapsed Time: {elapsedTime} seconds</Text>
      <Text style={styles.info}>
        Current Location: {location ? `${location.latitude}, ${location.longitude}` : 'Fetching...'}
      </Text>
      <Button
        title={isTracking ? 'Stop Tracking' : 'Start Tracking'}
        onPress={() => setIsTracking((prev) => !prev)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  info: {
    fontSize: 16,
    marginBottom: 10,
  },
});

export default RunningScreen;
