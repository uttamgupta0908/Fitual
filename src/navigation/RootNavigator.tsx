// navigation/RootNavigator.tsx

import React, { useEffect, useState } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import TabNavigator from './TabNavigator';
import AuthLayout from '../screens/(auth)/index'; // Adjust the import path as necessary

import { storage } from '../storage/mmkv'; // Adjust path as needed
import ExerciseDetail from '../components/ExerciseDetail';
import { AuthProvider, useAuth } from '../context/AuthContext';
import { ActivityIndicator, View } from 'react-native';
import WorkoutDetail from '../components/WorkoutDetail';
import { API_URL } from '@env';

const Stack = createNativeStackNavigator();

export default function RootNavigator() {
  const { isLoggedIn, isLoading } = useAuth();

  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <Stack.Navigator
      screenOptions={{ headerShown: false }}
      initialRouteName={isLoggedIn ? 'TABS' : 'AUTH'}
    >
      {isLoggedIn ? (
        <>
          <Stack.Screen name="TABS" component={TabNavigator} />
          <Stack.Screen
            name="ExerciseDetail"
            component={ExerciseDetail}
            options={{
              headerShown: false,
              presentation: 'modal',
              gestureEnabled: true,
              animationTypeForReplace: 'push',
            }}
          />
          {/* <Stack.Screen name="WorkoutDetail" component={WorkoutDetail} /> */}
        </>
      ) : (
        <Stack.Screen name="AUTH" component={AuthLayout} />
      )}
    </Stack.Navigator>
  );
}
