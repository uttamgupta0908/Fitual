import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AuthLayout from '../screens/(auth)/index';

const Stack = createNativeStackNavigator();

export default function AuthStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="AUTH" component={AuthLayout} />
    </Stack.Navigator>
  );
}
