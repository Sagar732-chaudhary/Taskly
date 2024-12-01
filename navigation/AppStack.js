import React, { useState, useEffect } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase';
import LoginScreen from '../screens/LoginScreen';
import SignupScreen from '../screens/SignupScreen';
import HomeScreen from '../screens/HomeScreen';
import AddTaskScreen from '../screens/AddTaskScreen';
import ProfileScreen from '../screens/ProfileScreen';
import WalkingScreen from '../screens/WalkingScreen';
import RunningScreen from '../screens/RunningScreen';
import YogaScreen from '../screens/YogaScreen'; // Import Yoga Screen
import { Ionicons } from '@expo/vector-icons';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// Define Tab Navigator
const TabNavigator = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      tabBarIcon: ({ color, size }) => {
        let iconName;

        if (route.name === 'Home') iconName = 'home-outline';
        else if (route.name === 'Profile') iconName = 'person-outline';
        else if (route.name === 'Walking') iconName = 'walk-outline';
        else if (route.name === 'Running') iconName = 'fitness-outline';
        else if (route.name === 'Yoga') iconName = 'leaf-outline';

        return <Ionicons name={iconName} size={size} color={color} />;
      },
      headerShown: false,
    })}
  >
    <Tab.Screen name="Home" component={HomeScreen} />
    <Tab.Screen name="Profile" component={ProfileScreen} />
    <Tab.Screen name="Walking" component={WalkingScreen} />
    <Tab.Screen name="Running" component={RunningScreen} />
    <Tab.Screen name="Yoga" component={YogaScreen} />
  </Tab.Navigator>
);

// Main App Stack
const AppStack = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });
    return unsubscribe;
  }, []);

  return (
    <Stack.Navigator>
      {user ? (
        // When logged in, show TabNavigator and AddTask route
        <>
          <Stack.Screen name="Main" component={TabNavigator} options={{ headerShown: false }} />
          <Stack.Screen name="AddTask" component={AddTaskScreen} options={{ title: 'Add/Edit Task' }} />
        </>
      ) : (
        // When logged out, show Login and Signup screens
        <>
          <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
          <Stack.Screen name="Signup" component={SignupScreen} />
        </>
      )}
    </Stack.Navigator>
  );
};

export default AppStack;
