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
import { useAuth } from '../context/AuthContext';
import { saveWorkoutToAPI } from '../utils/workout';

export type SetPayload = {
  reps: number;
  weight: number;
  weightUnit: 'kg' | 'lbs';
};

export type WorkoutExercisePayload = {
  exerciseId: number;
  sets: SetPayload[];
};

export type WorkoutPayload = {
  userId: number;
  date: string;
  duration: number;
  exercises: WorkoutExercisePayload[];
};

export default function ActiveWorkout() {
  const [shownExerciseSelection, setShowExerciseSelection] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const { user } = useAuth();
  const navigation = useNavigation();

  const {
    workoutExercises,
    setWorkoutExercises,
    resetWorkout,
    weightUnit,
    setWeightUnit,
  } = useWorkoutStore();

  const { seconds, minutes, totalSeconds, reset } = useStopwatch({
    autoStart: true,
  });

  useFocusEffect(
    React.useCallback(() => {
      if (workoutExercises.length === 0) reset();
    }, [workoutExercises.length, reset]),
  );

  const getWorkoutDuration = () =>
    `${minutes.toString().padStart(2, '0')}:${seconds
      .toString()
      .padStart(2, '0')}`;

  const endWorkout = async () => {
    if (!user) return;

    const exercisesPayload: WorkoutExercisePayload[] = workoutExercises
      .map(exercise => {
        const completedSets = exercise.sets
          .filter(set => set.isCompleted)
          .map(set => ({
            reps: Number(set.reps) || 0,
            weight: Number(set.weight) || 0,
            weightUnit: set.weightUnit || weightUnit,
          }));

        if (completedSets.length === 0) return null;
        return {
          exerciseId: Number(exercise.exerciseId),
          sets: completedSets,
        };
      })
      .filter(Boolean) as WorkoutExercisePayload[];

    if (exercisesPayload.length === 0) {
      Alert.alert(
        'No Completed Sets',
        'Please complete at least one set before saving the workout.',
      );
      return;
    }

    const payload: WorkoutPayload = {
      userId: user.id,
      date: new Date().toISOString(),
      duration: totalSeconds,
      exercises: exercisesPayload,
    };

    try {
      setIsSaving(true);
      const result = await saveWorkoutToAPI(payload);
      Alert.alert('Workout Saved', 'Your workout has been saved successfully!');
      navigation.navigate('TABS', {
        screen: 'History',
        params: { refresh: true },
      });
    } catch (error) {
      console.error(error);
      Alert.alert('Save Failed', 'Failed to save workout. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const saveWorkout = () => {
    Alert.alert(
      'Complete Workout',
      'Are you sure you want to complete the workout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Complete', onPress: endWorkout },
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

  const addExercise = () => setShowExerciseSelection(true);
  const deleteExercise = (exerciseId: string) =>
    setWorkoutExercises(exercises =>
      exercises.filter(ex => ex.exerciseId !== exerciseId),
    );
  const addNewSet = (exerciseId: string) => {
    const newSet: WorkoutSet = {
      id: Math.random().toString(),
      reps: '',
      weight: '',
      weightUnit,
      isCompleted: false,
    };
    setWorkoutExercises(exercises =>
      exercises.map(ex =>
        ex.exerciseId === exerciseId
          ? { ...ex, sets: [...ex.sets, newSet] }
          : ex,
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
      exercises.map(ex =>
        ex.exerciseId === exerciseId
          ? {
              ...ex,
              sets: ex.sets.map(set =>
                set.id === setId ? { ...set, [field]: value } : set,
              ),
            }
          : ex,
      ),
    );
  };
  const deleteSet = (exerciseId: string, setId: string) => {
    setWorkoutExercises(exercises =>
      exercises.map(ex =>
        ex.exerciseId === exerciseId
          ? { ...ex, sets: ex.sets.filter(set => set.id !== setId) }
          : ex,
      ),
    );
  };
  const toggleSetCompletion = (exerciseId: string, setId: string) => {
    setWorkoutExercises(exercises =>
      exercises.map(ex =>
        ex.exerciseId === exerciseId
          ? {
              ...ex,
              sets: ex.sets.map(set =>
                set.id === setId
                  ? { ...set, isCompleted: !set.isCompleted }
                  : set,
              ),
            }
          : ex,
      ),
    );
  };

  return (
    <View className="flex-1 bg-gray-900">
      <StatusBar barStyle="light-content" backgroundColor="#111827" />
      <View
        style={{
          paddingTop: Platform.OS === 'ios' ? 55 : StatusBar.currentHeight || 0,
          backgroundColor: '#111827',
        }}
      />

      {/* Header */}
      <View className="px-6 py-4 bg-gray-800">
        <View className="flex-row items-center justify-between">
          <View>
            <Text className="text-white text-xl font-semibold">
              Active Workout
            </Text>
            <Text className="text-gray-400">{getWorkoutDuration()}</Text>
          </View>
          <View className="flex-row items-center space-x-2">
            {/* Weight Unit */}
            <View className="flex-row bg-gray-700 rounded-lg p-1">
              {['lbs', 'kg'].map(unit => (
                <TouchableOpacity
                  key={unit}
                  onPress={() => setWeightUnit(unit as 'kg' | 'lbs')}
                  className={`px-3 py-1 rounded ${
                    weightUnit === unit ? 'bg-blue-600' : ''
                  }`}
                >
                  <Text
                    className={`text-sm font-medium ${
                      weightUnit === unit ? 'text-white' : 'text-gray-300'
                    }`}
                  >
                    {unit}
                  </Text>
                </TouchableOpacity>
              ))}
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

      {/* Content */}
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <ScrollView className="flex px-6 mt-4">
          {workoutExercises.length === 0 && (
            <View className="bg-gray-800 rounded-2xl p-8 items-center mx-0 my-4">
              <Dumbbell size={48} color="#9CA3AF" />
              <Text className="text-gray-300 text-lg text-center mt-4">
                No exercise yet
              </Text>
              <Text className="text-gray-500 text-center mt-2">
                Get started by adding your first exercise below
              </Text>
            </View>
          )}

          {workoutExercises.map(exercise => (
            <View key={exercise.exerciseId} className="mb-8">
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate('ExerciseDetail', {
                    id: exercise.exerciseId,
                  })
                }
                className="bg-gray-800 rounded-2xl p-4 mb-3"
              >
                <View className="flex-row items-center justify-between">
                  <View className="flex-1">
                    <Text className="text-lg font-bold text-white mb-2">
                      {exercise.name}
                    </Text>
                    <Text className="text-gray-400">
                      {exercise.sets.length} sets ·{' '}
                      {exercise.sets.filter(set => set.isCompleted).length}{' '}
                      completed
                    </Text>
                  </View>
                  <TouchableOpacity
                    onPress={() => deleteExercise(exercise.exerciseId)}
                    className="w-10 h-10 rounded-xl items-center justify-center bg-red-500 ml-3"
                  >
                    <Trash size={16} color="white" />
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>

              {/* Sets */}
              <View className="bg-gray-800 rounded-2xl p-4 mb-3 border border-gray-700">
                <Text className="text-lg font-semibold text-white mb-3">
                  Sets
                </Text>
                {exercise.sets.length === 0 ? (
                  <Text className="text-gray-400 text-center py-4">
                    No sets yet. Add your first set below.
                  </Text>
                ) : (
                  exercise.sets.map((set, idx) => (
                    <View
                      key={set.id}
                      className={`py-3 px-3 mb-2 rounded-lg border ${
                        set.isCompleted
                          ? 'bg-green-700 border-green-500'
                          : 'bg-gray-900 border-gray-700'
                      }`}
                    >
                      <View className="flex-row items-center justify-between">
                        <Text className="text-gray-300">Set {idx + 1}</Text>
                        <View className="flex-1 mx-2">
                          <Text className="text-xs text-gray-400 mb-1">
                            Reps
                          </Text>
                          <TextInput
                            value={set.reps}
                            onChangeText={value =>
                              updateSet(
                                exercise.exerciseId,
                                set.id,
                                'reps',
                                value,
                              )
                            }
                            placeholder="0"
                            placeholderTextColor="#6B7280"
                            keyboardType="numeric"
                            className={`border rounded-lg px-3 py-2 text-center ${
                              set.isCompleted
                                ? 'bg-gray-700 border-gray-600 text-gray-200'
                                : 'bg-gray-900 border-gray-700 text-white'
                            }`}
                            editable={!set.isCompleted}
                          />
                        </View>
                        <View className="flex-1 mx-2">
                          <Text className="text-xs text-gray-400 mb-1">
                            Weight({weightUnit})
                          </Text>
                          <TextInput
                            value={set.weight}
                            onChangeText={value =>
                              updateSet(
                                exercise.exerciseId,
                                set.id,
                                'weight',
                                value,
                              )
                            }
                            placeholder="0"
                            placeholderTextColor="#6B7280"
                            keyboardType="numeric"
                            className={`border rounded-lg px-3 py-2 text-center ${
                              set.isCompleted
                                ? 'bg-gray-700 border-gray-600 text-gray-200'
                                : 'bg-gray-900 border-gray-700 text-white'
                            }`}
                            editable={!set.isCompleted}
                          />
                        </View>
                        <TouchableOpacity
                          onPress={() =>
                            toggleSetCompletion(exercise.exerciseId, set.id)
                          }
                          className={`w-12 h-12 rounded-xl items-center justify-center mx-1 ${
                            set.isCompleted ? 'bg-green-500' : 'bg-gray-700'
                          }`}
                        >
                          {set.isCompleted ? (
                            <CheckCircle size={20} color="white" />
                          ) : (
                            <Check size={20} color="#9CA3AF" />
                          )}
                        </TouchableOpacity>
                        <TouchableOpacity
                          onPress={() => deleteSet(exercise.exerciseId, set.id)}
                          className="w-12 h-12 rounded-xl items-center justify-center bg-red-500 ml-1"
                        >
                          <Trash size={16} color="white" />
                        </TouchableOpacity>
                      </View>
                    </View>
                  ))
                )}

                <TouchableOpacity
                  onPress={() => addNewSet(exercise.exerciseId)}
                  className="bg-gray-700 border-2 border-dashed border-blue-500 rounded-lg py-3 items-center mt-2"
                >
                  <View className="flex-row items-center">
                    <Plus
                      size={16}
                      color="#3B82F6"
                      style={{ marginRight: 6 }}
                    />
                    <Text className="text-blue-400 font-medium">Add Set</Text>
                  </View>
                </TouchableOpacity>
              </View>
            </View>
          ))}

          {/* Add Exercise */}
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

          {/* Complete Workout */}
          <TouchableOpacity
            onPress={saveWorkout}
            className={`rounded-2xl py-4 items-center mb-8 ${
              isSaving ||
              workoutExercises.length === 0 ||
              workoutExercises.some(ex => ex.sets.some(s => !s.isCompleted))
                ? 'bg-gray-500'
                : 'bg-green-600 active:bg-green-700'
            }`}
            disabled={
              isSaving ||
              workoutExercises.length === 0 ||
              workoutExercises.some(ex => ex.sets.some(s => !s.isCompleted))
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

      {/* Exercise Modal */}
      <ExerciseSelectionModel
        visible={shownExerciseSelection}
        onClose={() => setShowExerciseSelection(false)}
      />
    </View>
  );
}
