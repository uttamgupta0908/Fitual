import React, { createRef } from 'react';
import {
  NavigationContainer,
  NavigationContainerRef,
} from '@react-navigation/native';

import './global.css';
import RootNavigator from './src/navigation/RootNavigator';
import { AuthProvider } from './src/context/AuthContext';

export const navigationRef = createRef<NavigationContainerRef<any>>();

export default function App() {
  return (
    <NavigationContainer ref={navigationRef}>
      <AuthProvider>
        <RootNavigator />
      </AuthProvider>
    </NavigationContainer>
  );
}
