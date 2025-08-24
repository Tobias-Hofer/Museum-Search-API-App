import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Importing the screens used in the app
import HomeScreen from './screens/HomeScreen';
import ResultsScreen from './screens/ResultsScreen';
import DetailScreen from './screens/DetailScreen';

// Creating a stack navigator instance
const Stack = createNativeStackNavigator();

export default function App() {
  return (
   // Wrapping app in NavigationContainer for navigation
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Results" component={ResultsScreen} />
        <Stack.Screen name="Details" component={DetailScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}