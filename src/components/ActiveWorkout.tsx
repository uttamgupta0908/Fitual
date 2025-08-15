import {
  View,
  Text,
  StatusBar,
  Platform,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  ScrollView,
} from 'react-native';
import React from 'react';
import { useStopwatch } from 'react-timer-hook';
import { useWorkoutStore } from '../../store/workoutstore';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { Dumbbell, Plus } from 'lucide-react-native';

export default function ActiveWorkout() {
  const navigation = useNavigation();
  const {
    workoutExercises,
    setWorkoutExercises,
    resetWorkout,
    weightUnit,
    setWeightUnit,
  } = useWorkoutStore();

  //use th stopwaatch hook
  const { seconds, minutes, totalSeconds, reset } = useStopwatch({
    autoStart: true,
  });

  //   if no active workout it will reset hte time

  useFocusEffect(
    React.useCallback(() => {
      if (workoutExercises.length === 0) {
        reset();
      }
    }, [workoutExercises.length, reset]),
  );

  const getWorkoutDuration = () => {
    return `${minutes.toString().padStart(2, '0')}:${seconds
      .toString()
      .padStart(2, '0')}`;
  };

  const cancelWorkout = () => {
    Alert.alert(
      'Cancel Workout',
      'Are you sure you want to cancel the workout?',
      [
        { text: 'No', style: 'cancel' },
        {
          text: 'End Workout',
          onPress: () => {
            resetWorkout();
            navigation.goBack();
          },
        },
      ],
    );
  };
  const addExercise = () => {
    setShowExerciseSelection(true);
  };
  return (
    <View className="flex-1">
      <StatusBar barStyle="light-content" backgroundColor="#1F2937" />

      {/* top safe areae */}
      <View
        className="bg-gray-800"
        style={{
          paddingTop: Platform.OS === 'ios' ? 55 : StatusBar.currentHeight || 0,
        }}
      />
      {/* headere */}
      <View className="bg-gray-800 px-6 py-4">
        <View className="flex-row items-center justify-between">
          <View>
            <Text className="text-white text-xl font-semibold">
              Active Workout
            </Text>
            <Text className="text-gray-300">{getWorkoutDuration()}</Text>
          </View>
          <View className="flex-row items-center space-x-3 gap-2">
            {/* Weight Unit Toggle */}
            <View className="flex-row bg-gray-700 rounded-lg p-1">
              <TouchableOpacity
                onPress={() => setWeightUnit('lbs')}
                className={`px-3 py-1 rounded ${
                  weightUnit === 'lbs' ? 'bg-blue-600' : ''
                }`}
              >
                <Text
                  className={`text-sm font-medium ${
                    weightUnit === 'lbs' ? 'text-white' : 'text-gray-300'
                  }`}
                >
                  lbs
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setWeightUnit('kg')}
                className={`px-3 py-1 rounded ${
                  weightUnit === 'kg' ? 'bg-blue-600' : ''
                }`}
              >
                <Text
                  className={`text-sm font-medium ${
                    weightUnit === 'kg' ? 'text-white' : 'text-gray-300'
                  }`}
                >
                  kg
                </Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity
              onPress={cancelWorkout}
              className="bg-red-600 px-4 py-2 rounded-lg"
            >
              <Text className="text-white font-medium">End Workout</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
      {/* content */}
      <View className="flex-1 bg-white">
        <View className="px-6 mt-4">
          <Text className="text-center text-gray-600 mb-2">
            {workoutExercises.length} exercises
          </Text>
        </View>
        {/* no exercises */}
        {workoutExercises.length == 0 && (
          <View className="bg-gray-50 rounded-2xl p-8 items-center mx-6">
            <Dumbbell size={48} color="#9CA3AF" />
            <Text className="text-gray-600 text-lg text-center mt-4">
              No exercise yet
            </Text>
            <Text className="text-gray-500 text-center mt-2">
              Get start by adding your first exercise below
            </Text>
          </View>
        )}
        {/* ALl the exercise in verstical view */}
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <ScrollView className="flex-1 px-6 mt-4">
            {workoutExercises.map(exercise => (
              <View key={exercise.id} className="mb-8">
                {/* exerccise header */}
              </View>
            ))}
            {/* add eexercise button */}
            <TouchableOpacity
              onPress={addExercise}
              className="bg-blue-600 rounded-2xl py-4 items-center mb-8 active:bg-blue-700"
              activeOpacity={0.8}
            >
              <View className="flex-row items-center">
                <Plus size={20} color="white" style={{ marginRight: 8 }} />
                <Text className="text-white font-semibold text-lg">
                  Add Exercise
                </Text>
              </View>
            </TouchableOpacity>
          </ScrollView>
        </KeyboardAvoidingView>
      </View>
      {/* exercise model */}
      <ExerciseSelectionModel
        visible={shownExerciseSelection}
        onClose={() => setShowExerciseSelection(false)}
      />
    </View>
  );
}
