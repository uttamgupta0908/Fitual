import React, { createRef } from 'react';
import {
  createNavigationContainerRef,
  NavigationContainer,
  NavigationContainerRef,
} from '@react-navigation/native';

import './global.css';
import RootNavigator from './src/navigation/RootNavigator';
import { AuthProvider } from './src/context/AuthContext';
import BootSplash from 'react-native-bootsplash';
// import { ThemeProvider } from '~/context/ThemeContext';
export const navigationRef = createNavigationContainerRef();

export default function App() {
  return (
    <AuthProvider>
      <NavigationContainer
        ref={navigationRef}
        onReady={() => BootSplash.hide()}
      >
        {/* <ThemeProvider> */}
        <RootNavigator />
        {/* </ThemeProvider> */}
      </NavigationContainer>
    </AuthProvider>
  );
}
