
import React from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import AppStack from './navigation/AppStack';
import Toast from 'react-native-toast-message';

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <NavigationContainer>
        <AppStack />
      </NavigationContainer>
      <Toast />
    </GestureHandlerRootView>
  );
}
