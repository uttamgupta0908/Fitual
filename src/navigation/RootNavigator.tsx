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
  // {
  //   /* <Stack.Screen
  //   name="ExerciseDetail"
  //   component={ExerciseDetail}
  //   options={{
  //     headerShown: false,
  //     presentation: 'modal',
  //     gestureEnabled: true,
  //     animationTypeForReplace: 'push',
  //   }}
  // /> */
  // }
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
          <Stack.Screen name="WorkoutDetail" component={WorkoutDetail} />
        </>
      ) : (
        <Stack.Screen name="AUTH" component={AuthLayout} />
      )}
    </Stack.Navigator>
  );
}

// import AuthLayout from './(auth)';
// import TabNavigator from './(tabs)/TabNavigator';
// import { createNativeStackNavigator } from '@react-navigation/native-stack';

// const Stack = createNativeStackNavigator();

// export default function RootNavigator() {

//   // Simulate an authentication check
//   const isSignedIn = true; // Replace with actual authentication logic

//   console.log('isSignedIn >>>', isSignedIn);
//   return (
//     <Stack.Navigator screenOptions={{ headerShown: false }}>
//       {isSignedIn ? (
//         <Stack.Screen name="(tabs)" component={TabNavigator} />
//       ) : (
//         <Stack.Screen name="(auth)" component={AuthLayout} />
//       )}
//     </Stack.Navigator>
//   );
// }

// // import { createNativeStackNavigator } from '@react-navigation/native-stack';
// // import { useEffect } from 'react';
// // import TabNavigator from './(tabs)/TabNavigator';

// // const Stack = createNativeStackNavigator();
// // export default function RootNavigator() {
// //   let isSigned = true;
// //   useEffect(() => {
// //     // Simulate an authentication check
// //     const checkAuth = async () => {
// //       // Here you would typically check if the user is authenticated
// //       // For example, checking a token in AsyncStorage or similar
// //       isSigned = true; // Set this based on your auth logic
// //     };
// //     checkAuth();
// //   }, []);
// //   return (
// //     <Stack.Navigator screenOptions={{ headerShown: false }}>
// //       {isSigned ? (
// //         <Stack.Screen name="(tabs)" component={TabNavigator} />
// //       ) : (
// //         <Stack.Screen name="(auth)" component={} />
// //       )}
// //     </Stack.Navigator>
// //   );
// // }
