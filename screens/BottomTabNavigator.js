import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import HomeScreen from './HomeScreen';  // Adjust the imports as needed
import ProfileScreen from './ProfileScreen';
import WalkingScreen from './WalkingScreen';
import RunningScreen from './RunningScreen';
import YogaScreen from './YogaScreen';  // Ensure this is correctly imported

const Tab = createBottomTabNavigator();

const BottomTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName;

          if (route.name === 'Home') iconName = 'home-outline';
          else if (route.name === 'Profile') iconName = 'person-outline';
          else if (route.name === 'Walking') iconName = 'walk-outline';
          else if (route.name === 'Running') iconName = 'fitness-outline';
          else if (route.name === 'Yoga') iconName = 'body-outline';  // Yoga icon

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        headerShown: false,
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
      <Tab.Screen name="Walking" component={WalkingScreen} />
      <Tab.Screen name="Running" component={RunningScreen} />
      <Tab.Screen name="Yoga" component={YogaScreen} />  {/* Yoga tab */}
    </Tab.Navigator>
  );
};

export default BottomTabNavigator;
