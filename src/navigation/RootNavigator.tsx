// // navigation/RootNavigator.tsx

// import React, { useEffect, useState } from 'react';
// import { createNativeStackNavigator } from '@react-navigation/native-stack';

// import TabNavigator from './TabNavigator';
// import AuthLayout from '../screens/(auth)/index'; // Adjust the import path as necessary

// import { storage } from '../storage/mmkv'; // Adjust path as needed
// import ExerciseDetail from '../components/ExerciseDetail';
// import { AuthProvider, useAuth } from '../context/AuthContext';
// import { ActivityIndicator, View } from 'react-native';
// import WorkoutDetail from '../components/WorkoutDetail';
// import WorkoutRecord from '../components/WorkoutRecord';
// import ActiveWorkout from '../components/ActiveWorkout';

// // import { API_URL } from '@env';
// const API_URL = 'http://192.168.1.8:5000';

// const Stack = createNativeStackNavigator();

// export default function RootNavigator() {
//   const { isLoggedIn, isLoading } = useAuth();

//   if (isLoading) {
//     return (
//       <View className="flex-1 justify-center items-center">
//         <ActivityIndicator size="large" />
//       </View>
//     );
//   }

//   return (
//     <Stack.Navigator
//       screenOptions={{ headerShown: false }}
//       initialRouteName={isLoggedIn ? 'TABS' : 'AUTH'}
//     >
//       {isLoggedIn ? (
//         <>
//           <Stack.Screen name="TABS" component={TabNavigator} />
//           <Stack.Screen
//             name="ExerciseDetail"
//             component={ExerciseDetail}
//             options={{
//               headerShown: false,
//               presentation: 'modal',
//               gestureEnabled: true,
//               animationTypeForReplace: 'push',
//             }}
//           />
//           <Stack.Screen name="WorkoutDetail" component={WorkoutDetail} />
//           <Stack.Screen
//             name="WorkoutRecord"
//             component={WorkoutRecord}
//             options={{
//               headerShown: true,
//               headerTitle: 'Workout Record',
//               headerBackTitle: 'History',
//               // gestureEnabled: true,
//               // animationTypeForReplace: 'push',
//             }}
//           />
//           <Stack.Screen
//             name="ActiveWorkout"
//             component={ActiveWorkout}
//             options={{
//               headerShown: true,
//               headerTitle: 'ActiveWorkout',
//               headerBackTitle: 'Create',
//             }}
//           />
//         </>
//       ) : (
//         <Stack.Screen name="AUTH" component={AuthLayout} />
//       )}
//     </Stack.Navigator>
//   );
// }

import React from 'react';
import { View, ActivityIndicator } from 'react-native';
import { useAuth } from '../context/AuthContext';
import AuthStack from './AuthStack';
import AppStack from './AppStack';

export default function RootNavigator() {
  const { isLoggedIn, isLoading } = useAuth();

  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return isLoggedIn ? <AppStack /> : <AuthStack />;
}
