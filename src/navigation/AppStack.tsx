import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import TabNavigator from './TabNavigator';
import ExerciseDetail from '../components/ExerciseDetail';
import WorkoutDetail from '../components/WorkoutDetail';
import WorkoutRecord from '../components/WorkoutRecord';
import ActiveWorkout from '../components/ActiveWorkout';
import ExerciseSelectionModel from '../components/ExerciseSelectionModel';
import { signin } from '../utils/auth';
import SignInScreen from '../screens/(auth)/SignInScreen';

const Stack = createNativeStackNavigator();

export default function AppStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="TABS" component={TabNavigator} />
      <Stack.Screen
        name="ExerciseDetail"
        component={ExerciseDetail}
        options={{
          presentation: 'modal',
          gestureEnabled: true,
          animationTypeForReplace: 'push',
        }}
      />
      <Stack.Screen name="WorkoutDetail" component={WorkoutDetail} />
      <Stack.Screen
        name="WorkoutRecord"
        component={WorkoutRecord}
        // options={{
        //   headerShown: true,
        //   headerTitle: 'Workout Record',
        //   headerBackTitle: 'History',
        // }}
      />
      <Stack.Screen
        name="ActiveWorkout"
        component={ActiveWorkout}
        options={{
          headerShown: false,
          headerTitle: 'ActiveWorkout',
          headerBackTitle: 'Create',
        }}
      />
      {/* <Stack.Screen
        name="ExerciseSelectionModel"
        component={ExerciseSelectionModel}
      /> */}
    </Stack.Navigator>
  );
}
