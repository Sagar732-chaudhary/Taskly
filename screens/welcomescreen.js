// screens/WelcomePage.js
import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
// import { useNavigation } from '@react-navigation/native';

const WelcomePage = () => {
  

  return (
    <View style={styles.container}>
      {/* Welcome Image */}
      <Image
        source={require('../assets/home.jpg')} // Replace with your image path
        style={styles.image}
      />
      {/* Welcome Text */}
      <Text style={styles.welcomeText}>Welcome to the App!</Text>

      {/* Start Button */}
      <TouchableOpacity style={styles.startButton} onPress={handleStart}>
        <Text style={styles.buttonText}>Start</Text>
      </TouchableOpacity>
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
  image: {
    width: '100%',
    height: 300,
    resizeMode: 'contain',
    marginBottom: 30,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  startButton: {
    backgroundColor: '#1B95E0',
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
  },
});

export default WelcomePage;
