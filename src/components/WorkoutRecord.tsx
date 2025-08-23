import {
  View,
  Text,
  SafeAreaView,
  ActivityIndicator,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import React, { useEffect, useState } from 'react';

import { useAuth } from '../context/AuthContext';
import { fetchWorkoutsFromAPI, Workout } from '../utils/workout';
import { formatDuration } from '../utils/formatworkout';
import { useNavigation } from '@react-navigation/native';
import {
  Calendar,
  ChartColumnBig,
  CircleAlert,
  Dumbbell,
  HeartPlus,
  Timer,
  Trash,
} from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function WorkoutRecord() {
  const { user } = useAuth();
  const navigation = useNavigation();
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [workout, setWorkout] = useState<Workout[]>([]);

  const API_URL = 'http://192.168.1.11:5000';

  const fetchWorkout = async () => {
    if (!user?.id) return;
    try {
      const result = await fetchWorkoutsFromAPI();

      setWorkout(result);
    } catch (error) {
      console.log('Error fetching workout:', error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchWorkout();
  }, [user?.id]);

  const formatDate = (dataString?: string) => {
    if (!dataString) return 'Unkown Date';
    const date = new Date(dataString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatTime = (dateString?: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };
  const formatWorkoutDuration = (seconds?: number) => {
    if (!seconds) return 'Duration not recorded';
    return formatDuration(seconds);
  };

  //
  const getTotalReps = () => {
    return workout.reduce((total, workout) => {
      return (
        total +
        workout.exercises.reduce((subTotal, ex) => subTotal + (ex.reps || 0), 0)
      );
    }, 0);
  };

  const getTotalVolume = () => {
    let totalVolume = 0;
    let unit = 'lbs';
    workout?.exercises?.forEach(exercise => {
      exercise.sets?.forEach(set => {
        if (set.weight && set.reps) {
          totalVolume += set.weight * set.reps;
          unit = set.weightUnit || ' lbs';
        }
      });
    });
    return { volume: totalVolume, unit };
  };

  const handleDeleteWorkout = () => {
    Alert.alert(
      'Delete Workout',
      'Are you sure want to to delete this workout? This action cannot be undone.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => deleteWorkout(workout.id, setDeleting, navigation),
        },
      ],
    );
  };
  // const deleteWorkout = async () => {
  //   if (!workoutId) return;

  //   setDeleting(true);

  //   try {
  //     ////////////////////////////////
  //     await fetch('/api/delete-wokout', {
  //       method: 'POST',
  //       body: JSON.stringify({ workoutId }),
  //     });
  //     Router.replace('/(app)/(tabs)/history?refresh=true');
  //   } catch (error) {
  //     console.error('Error deleting workout:', error);
  //     Alert.alert('Error', 'Failed to delete workout. Please try again.', [
  //       { text: 'OK' },
  //     ]);
  //   } finally {
  //     setDeleting(false);
  //   }
  // };
  const deleteWorkout = async (
    workoutId: number,
    setDeleting: (value: boolean) => void,
    navigation: any,
  ) => {
    if (!workoutId) return;

    setDeleting(true);

    try {
      ///
      const token = await AsyncStorage.getItem('token');
      const res = await fetch(`${API_URL}/workouts/${workoutId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!res.ok) {
        throw new Error('Failed to delete workout');
      }
      navigation.navigate('History', { refresh: true });
      // Router.replace('/(app)/(tabs)/history?refresh=true');
    } catch (error) {
      console.error('Error deleting workout:', error);
      Alert.alert('Error', 'Failed to delete workout. Please try again.', [
        { text: 'OK' },
      ]);
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50">
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#3B82F6" />
          <Text className="text-gray-600 mt-4">Loading workout....</Text>
        </View>
      </SafeAreaView>
    );
  }
  if (!workout) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50">
        <View className="flex-1 items-center justify-center">
          <CircleAlert size={64} color="#EF4444" />
          <Text className="text-xl text-gray-900 mt-4">
            No workout data available
          </Text>
          <Text className="text-gray-600 text-center mt-2">
            Workout could not found.
          </Text>

          <TouchableOpacity
            onPress={() => navigation.goBack()}
            className="bg-blue-600 px-6 py-3 rounded-lg mt-6"
          >
            <Text className="text-white font-medium">Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const { volume, unit } = getTotalVolume();
  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <ScrollView className="flex-1">
        {/* workout summary */}
        <View className="bg-white p-6 border-b border-gray-300">
          <View className="flex-row justify-between mb-4">
            <Text className="text-lg font-semibold text-gray-900">
              Workout Summary
            </Text>
            <TouchableOpacity
              onPress={handleDeleteWorkout}
              disabled={deleting}
              className="bg-red-600 px-4 py-2 rounded-lg flex-row items-center"
            >
              {deleting ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <>
                  <Trash size={16} color="#FFFFFF" />
                  <Text className="text-white font-medium ml-2">
                    Delete Workout
                  </Text>
                </>
              )}
            </TouchableOpacity>
          </View>
          <View className="flex-row items-center mb-3">
            <Calendar size={20} color="#6B7280" />
            <Text className="text-gray-700 ml-3 font-medium">
              {formatDate(workout.date)} at {formatTime(workout.date)}
            </Text>
          </View>
          <View className="flex-row items-center mb-3">
            <Timer size={20} color="#6B7280" />
            <Text className="text-gray-700 ml-3 font-medium">
              {formatWorkoutDuration(workout.duration)}
            </Text>
          </View>
          <View className="flex-row items-center mb-3">
            <HeartPlus size={20} color="#6B7280" />
            <Text className="text-gray-700 ml-3 font-medium">
              {workout.exercises?.length || 0} exercises
            </Text>
          </View>
          <View className="flex-row items-center mb-3">
            <ChartColumnBig size={20} color="#6B7280" />
            <Text className="text-gray-700 ml-3 font-medium">
              {getTotalReps()} total reps
            </Text>
          </View>
          {volume > 0 && (
            <View className="flex-row items-center">
              <Dumbbell size={20} color="#6B7280" />
              <Text className="text-gray-700 ml-3 font-medium">
                {volume.toLocaleString()}
                {unit} total volume
              </Text>
            </View>
          )}
        </View>

        {/* exercises list */}
        <View className="space-y-4 p-6 gap-4">
          {workout.exercises?.map((exerciseData, index) => (
            <View
              key={exerciseData.id}
              className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
            >
              {/* header */}
              <View className="flex-row items-center justify-between mb-4">
                <View className="flex-1">
                  <Text className="text-lg font-bold text-gray-900">
                    {exerciseData.exercise?.name || 'Unknown Exercise'}
                  </Text>
                  <Text className="text-gray-600 text-sm mt-1">
                    {exerciseData.sets?.length || 0} sets completed
                  </Text>
                </View>
                <View
                  className="bg-blue-100 rounded-full w-10 h-10
items-center justify-center"
                >
                  <Text className="text-blue-600 font-bold">{index + 1}</Text>
                </View>
              </View>

              {/* setfs*/}
              <View className="space-y-2">
                <Text className="text-sm font-medium text-gray-700 mb-2">
                  Sets:
                </Text>
                {exerciseData.sets?.map((set, setIndex) => (
                  <View
                    key={set.key}
                    className="bg-gray-50 rounded-lg p-3 flex-row items-center justify-between"
                  >
                    <View className="flex-row items-center">
                      <View className="bg-gray-200 rounded-full w-6 h-6 items-center justify-center mr-3">
                        <Text className="text-gray-700 text-xs font-medium">
                          {setIndex + 1}
                        </Text>
                      </View>
                      <Text className="text-gray-900 font-medium">
                        {set.reps} reps
                      </Text>
                    </View>
                    {set.weight && (
                      <View className="flex-row items-center">
                        <Dumbbell size={16} color="#6B7280" />
                        <Text className="text-gray-700 ml-2 font-medium">
                          {set.weight}
                          {set.weightUnit || 'kg'}
                        </Text>
                      </View>
                    )}
                  </View>
                ))}
              </View>
              {/* exercise volume summary */}
              {exerciseData.sets && exerciseData.sets.length > 0 && (
                <View className="mt-4 pt-4 border-t border-gray-100">
                  <View className="flex-row items-center justify-between">
                    <Text className="text-sm text-gray-600">
                      Exercise Volume:
                    </Text>
                    <Text className="text-sm font-medium text-gray-900">
                      {exerciseData.sets
                        .reduce((total, set) => {
                          return total + (set.weight || 0) * (set.reps || 0);
                        }, 0)
                        .toLocaleString()}{' '}
                      {exerciseData.sets[0]?.weightUnit || 'kg'}
                    </Text>
                  </View>
                </View>
              )}
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
