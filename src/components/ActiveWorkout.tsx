import {
  View,
  Text,
  StatusBar,
  Platform,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  ScrollView,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import React, { useState } from 'react';
import { useStopwatch } from 'react-timer-hook';
import { useWorkoutStore, WorkoutSet } from '../../store/workoutstore';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { Check, CheckCircle, Dumbbell, Plus, Trash } from 'lucide-react-native';
import ExerciseSelectionModel from './ExerciseSelectionModel';

export default function ActiveWorkout() {
  const [shownExerciseSelection, setShowExerciseSelection] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

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

  const saveWorkout = () => {
    Alert.alert(
      'Complete Workout',
      'Are you sure you want to complete the workout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Complete', onPress: async () => await endWorkout() },
      ],
    );
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

  const deleteExercise = (exerciseId: string) => {
    setWorkoutExercises(exercises =>
      exercises.filter(exercise => exercise.id !== exerciseId),
    );
  };

  const addNewSet = (exerciseId: string) => {
    const newSet: WorkoutSet = {
      id: Math.random().toString(),
      reps: '',
      weight: '',
      weightUnit: weightUnit,
      isCompleted: false,
    };
    setWorkoutExercises(exercises =>
      exercises.map(exercise =>
        exercise.id === exerciseId
          ? { ...exercise, sets: [...exercise.sets, newSet] }
          : exercise,
      ),
    );
  };

  const updateSet = (
    exerciseId: string,
    setId: string,
    field: 'reps' | 'weight',
    value: string,
  ) => {
    setWorkoutExercises(exercises =>
      exercises.map(exercise =>
        exercise.id === exerciseId
          ? {
              ...exercise,
              sets: exercise.sets.map(set =>
                set.id === setId ? { ...set, [field]: value } : set,
              ),
            }
          : exercise,
      ),
    );
  };

  const deleteSet = (exerciseId: string, setId: String) => {
    setWorkoutExercises(exercises =>
      exercises.map(exercise =>
        exercise.id === exerciseId
          ? { ...exercise, sets: exercise.sets.filter(set => set.id !== setId) }
          : exercise,
      ),
    );
  };

  const toggleSetCompletion = (exerciseId: string, setId: string) => {
    setWorkoutExercises(exercises =>
      exercises.map(exercise =>
        exercise.id === exerciseId
          ? {
              ...exercise,
              sets: exercise.sets.map(set =>
                set.id === setId
                  ? { ...set, isCompleted: !set.isCompleted }
                  : set,
              ),
            }
          : exercise,
      ),
    );
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
                <TouchableOpacity
                  onPress={() =>
                    navigation.navigate('ExerciseDetail', {
                      id: exercise.userId,
                    })
                  }
                  className="bg-blue-50 rounded-2xl p-4 mb-3"
                >
                  <View className="flex-row items-center justify-between">
                    <View className="flex-1">
                      <Text className="text-1 font-bold text-gray-900 mb-2">
                        {exercise.name}
                      </Text>
                      <Text className="text-gray-600">
                        {exercise.sets.length}sets .{''}
                        {
                          exercise.sets.filter(set => set.isCompleted).length
                        }{' '}
                        completed
                      </Text>
                    </View>
                    {/* delete exercis button */}
                    <TouchableOpacity
                      onPress={() => deleteExercise(exercise.id)}
                      className="w-10 h-10 rounded-xl items-center justify-center bg-red-500 ml-3"
                    >
                      <Trash size={16} color="white" />
                    </TouchableOpacity>
                  </View>
                </TouchableOpacity>

                {/* exercise sets */}
                <View className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 mb-3">
                  <Text className="text-lg font-semibold text-gray-900 mb-3">
                    Sets
                  </Text>
                  {exercise.sets.length === 0 ? (
                    <Text className="text-gray-500 text-center py-4">
                      No sets yet. Add your first set below.
                    </Text>
                  ) : (
                    exercise.sets.map((set, setIndex) => (
                      <View
                        key={set.id}
                        className={`py-3 px-3 mb-2 rounded-lg border ${
                          set.isCompleted
                            ? 'bg-green-100 border-green-300'
                            : 'bg-gray-50 border-gray-200'
                        }`}
                      >
                        {/* fiest row setsno.,rerps,weight....... */}
                        <View className=" flex-row items-center justify-between">
                          <Text className="text-gray-700">
                            Set{setIndex + 1}
                          </Text>
                          {/* reeps input */}
                          <View className="flex-1 mx-2">
                            <Text className="text-xs text-gray-500 mb-1">
                              Reps
                            </Text>
                            <TextInput
                              value={set.reps}
                              onChangeText={value =>
                                updateSet(exercise.id, set.id, 'reps', value)
                              }
                              placeholder="0"
                              keyboardType="numeric"
                              className={`border rounded-lg px-3 py-2 text-center ${
                                set.isCompleted
                                  ? 'bg-gray-100 border-gray-300 text-gray-50'
                                  : 'bg-white border-gray-300'
                              }`}
                              editable={!set.isCompleted}
                            />
                          </View>
                          {/* weigth inpur */}
                          <View className="flex-1 mx-2">
                            <Text className="text-xs text-gray-500 mb-1">
                              Weight({weightUnit})
                            </Text>
                            <TextInput
                              value={set.weight}
                              onChangeText={value =>
                                updateSet(exercise.id, set.id, 'weight', value)
                              }
                              placeholder="0"
                              keyboardType="numeric"
                              className={`border rounded-lg px-3 py-2 text-center ${
                                set.isCompleted
                                  ? 'bg-gray-100 border-gray-300 text-gray-50'
                                  : 'bg-white border-gray-300'
                              }`}
                              editable={!set.isCompleted}
                            />
                          </View>
                          {/* complete button */}
                          <TouchableOpacity
                            onPress={() =>
                              toggleSetCompletion(exercise.id, set.id)
                            }
                            className={`w-12 h-12 rounded-xl items-center justify-center mx-1 ${
                              set.isCompleted ? 'bg-green-500' : 'bg-gray-200'
                            }`}
                          >
                            {set.isCompleted ? (
                              <CheckCircle size={20} color="white" />
                            ) : (
                              <Check size={20} color="#9CA3AF" />
                            )}
                            {/* <Ionicons name={set.isCompleted?"checkmark":"checkmark-outline"}size={20} color{set.isCompleted?"white":"#9CA3AF"}/> */}
                          </TouchableOpacity>

                          {/* DELEte button */}
                          <TouchableOpacity
                            onPress={() => deleteSet(exercise.id, set.id)}
                            className="w-12 h-12 rounded-xl items-center justify-center bg-red-500 ml-1"
                          >
                            <Trash size={16} color="white" />
                          </TouchableOpacity>
                        </View>
                      </View>
                    ))
                  )}

                  {/* add new set button */}
                  <TouchableOpacity
                    onPress={() => addNewSet(exercise.id)}
                    className="bg-blue-100 border-2 border-dashed border-blue-300 rounded-lg py-3 items-center mt-2"
                  >
                    <View className="flex-row items-center">
                      <Plus
                        size={16}
                        color="#3B82F6"
                        style={{ marginRight: 6 }}
                      />
                      <Text className="text-blue-600 font-medium">Add Set</Text>
                    </View>
                  </TouchableOpacity>
                </View>
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

            {/* complete workout button */}
            <TouchableOpacity
              onPress={saveWorkout}
              className={`rounded-2xl py-4 items-center mb-8 ${
                isSaving ||
                workoutExercises.length === 0 ||
                workoutExercises.some(
                  (exercise = exercise.sets.some(set => !set.isCompleted)),
                )
                  ? ' bg-gray-400'
                  : 'bg-green-600 active:bg-green-700'
              }`}
              disabled={
                isSaving ||
                workoutExercises.length === 0 ||
                workoutExercises.some(exercise =>
                  exercise.sets.some(set => !set.isCompleted),
                )
              }
            >
              {isSaving ? (
                <View className="flex-row items-center">
                  <ActivityIndicator size="small" color="white" />

                  <Text className="text-white font-semibold text-lg ml-2">
                    Saving...
                  </Text>
                </View>
              ) : (
                <Text className="text-white font-semibold text-lg">
                  Complete Workout
                </Text>
              )}
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
