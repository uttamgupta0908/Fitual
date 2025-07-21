import React from 'react';
import { NavigationContainer } from '@react-navigation/native';

import './global.css';
import RootNavigator from './src/navigation/RootNavigator';
export default function App() {
  return (
    <NavigationContainer>
      <RootNavigator />
    </NavigationContainer>
  );
}
