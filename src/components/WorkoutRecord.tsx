import {
  View,
  Text,
  SafeAreaView,
  ActivityIndicator,
  TouchableOpacity,
  ScrollView,
  Alert,
  LayoutAnimation,
  UIManager,
  Platform,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { fetchWorkoutById, Workout, WorkoutSet } from '../utils/workout';
import { formatDuration } from '../utils/formatworkout';
import { useNavigation, useRoute } from '@react-navigation/native';
import {
  Calendar,
  ChartColumnBig,
  CircleAlert,
  Dumbbell,
  HeartPlus,
  Timer,
  Trash,
  ChevronDown,
  ChevronUp,
} from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import formatDate from '../utils/formateDate';
import { API_URL } from '@env';

if (
  Platform.OS === 'android' &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export default function WorkoutRecord() {
  const { user } = useAuth();
  const route = useRoute();
  const { id } = route.params;
  const navigation = useNavigation();

  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [workout, setWorkout] = useState<Workout | null>(null);
  const [expandedExercises, setExpandedExercises] = useState<number[]>([]);

  useEffect(() => {
    const fetchWorkout = async () => {
      try {
        const result = await fetchWorkoutById(id);
        setWorkout(result);
      } catch (error) {
        console.log('Error fetching workout:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchWorkout();
  }, []);

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

  const getTotalSets = (workout: Workout) =>
    workout?.exercises?.reduce(
      (total, ex) => total + (ex.sets?.length || 0),
      0,
    ) || 0;

  const getTotalReps = (workout: Workout) =>
    workout?.exercises?.reduce(
      (total, ex) =>
        total + (ex.sets?.reduce((sum, set) => sum + (set.reps || 0), 0) || 0),
      0,
    ) || 0;

  const getTotalVolume = () => {
    let totalVolume = 0;
    let unit: 'kg' | 'lbs' = 'lbs';
    workout?.exercises?.forEach(ex =>
      ex.sets?.forEach(set => {
        totalVolume += (set.reps || 0) * (set.weight || 0);
        unit = set.weightUnit || unit;
      }),
    );
    return { volume: totalVolume, unit };
  };

  const handleDeleteWorkout = (workout: Workout) => {
    Alert.alert(
      'Delete Workout',
      'Are you sure want to delete this workout? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => deleteWorkout(workout.id, setDeleting, navigation),
        },
      ],
    );
  };

  const deleteWorkout = async (
    workoutId: number,
    setDeleting: (val: boolean) => void,
  ) => {
    if (!workoutId) return;
    setDeleting(true);
    try {
      const token = await AsyncStorage.getItem('token');
      const res = await fetch(`${API_URL}/workouts/${workoutId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      if (!res.ok) throw new Error('Failed to delete workout');
      navigation.navigate('TABS', {
        screen: 'History',
        params: { refresh: true },
      });
    } catch (err) {
      console.error(err);
      Alert.alert('Error', 'Failed to delete workout.');
    } finally {
      setDeleting(false);
    }
  };

  const toggleExercise = (id: number) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedExercises(prev =>
      prev.includes(id) ? prev.filter(e => e !== id) : [...prev, id],
    );
  };

  if (loading)
    return (
      <SafeAreaView className="flex-1 bg-gray-900">
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#3B82F6" />
          <Text className="text-gray-300 mt-4">Loading workout...</Text>
        </View>
      </SafeAreaView>
    );

  if (!workout)
    return (
      <SafeAreaView className="flex-1 bg-gray-900">
        <View className="flex-1 items-center justify-center">
          <CircleAlert size={64} color="#EF4444" />
          <Text className="text-xl text-white mt-4">No workout data</Text>
          <Text className="text-gray-400 text-center mt-2">
            Workout could not be found.
          </Text>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            className="bg-blue-700 px-6 py-3 rounded-lg mt-6"
          >
            <Text className="text-white font-medium">Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );

  const { volume, unit } = getTotalVolume();

  return (
    <SafeAreaView className="flex-1 bg-gray-900">
      <ScrollView className="flex-1">
        {/* Workout Summary */}
        <View className="bg-gray-800 p-6 border-b border-gray-700">
          <View className="flex-row justify-between mb-4">
            <Text className="text-lg font-semibold text-white">
              Workout Summary
            </Text>
            <TouchableOpacity
              onPress={() => handleDeleteWorkout(workout)}
              disabled={deleting}
              className="bg-red-600 px-4 py-2 rounded-lg flex-row items-center"
            >
              {deleting ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <>
                  <Trash size={16} color="#fff" />
                  <Text className="text-white font-medium ml-2">Delete</Text>
                </>
              )}
            </TouchableOpacity>
          </View>

          <View className="flex-row items-center mb-3">
            <Calendar size={20} color="#9CA3AF" />
            <Text className="text-gray-300 ml-3 font-medium">
              {workout.date ? formatDate(workout.date) : 'N/A'} at{' '}
              {formatTime(workout.date)}
            </Text>
          </View>

          <View className="flex-row items-center mb-3">
            <Timer size={20} color="#9CA3AF" />
            <Text className="text-gray-300 ml-3 font-medium">
              {formatWorkoutDuration(workout.duration)}
            </Text>
          </View>

          <View className="flex-row items-center mb-3">
            <HeartPlus size={20} color="#9CA3AF" />
            <Text className="text-gray-300 ml-3 font-medium">
              {workout.exercises?.length || 0} exercises
            </Text>
          </View>

          <View className="flex-row items-center mb-3">
            <ChartColumnBig size={20} color="#9CA3AF" />
            <Text className="text-gray-300 ml-3 font-medium">
              {getTotalReps(workout)} total reps
            </Text>
          </View>

          {volume > 0 && (
            <View className="flex-row items-center">
              <Dumbbell size={20} color="#9CA3AF" />
              <Text className="text-gray-300 ml-3 font-medium">
                {volume.toLocaleString()} {unit} total volume
              </Text>
            </View>
          )}
        </View>

        {/* Exercises */}
        <View className="space-y-4 p-6 gap-2">
          {workout.exercises?.map((ex, idx) => (
            <View
              key={ex.id}
              className="bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-700"
            >
              {/* Exercise Header */}
              <TouchableOpacity
                onPress={() => toggleExercise(ex.id)}
                className="flex-row items-center justify-between mb-3"
              >
                <View className="flex-1">
                  <Text className="text-lg font-bold text-white">
                    {ex.exercise?.name}
                  </Text>
                  <Text className="text-gray-400 text-sm mt-1">
                    {ex.sets?.length || 0} sets
                  </Text>
                </View>
                <View className="flex-row items-center">
                  <Text className="text-blue-400 font-bold mr-2">
                    {idx + 1}
                  </Text>
                  {expandedExercises.includes(ex.id) ? (
                    <ChevronUp size={20} color="#9CA3AF" />
                  ) : (
                    <ChevronDown size={20} color="#9CA3AF" />
                  )}
                </View>
              </TouchableOpacity>

              {/* Sets Details */}
              {expandedExercises.includes(ex.id) && (
                <View className="space-y-2 gap-2">
                  {ex.sets?.map((set: WorkoutSet, i) => (
                    <View
                      key={set.id}
                      className="bg-gray-700 rounded-lg p-3 flex-row items-center justify-between"
                    >
                      <Text className="text-gray-300 font-medium">
                        {i + 1}. {set.reps} reps
                      </Text>
                      {set.weight ? (
                        <View className="flex-row items-center">
                          <Dumbbell size={16} color="#9CA3AF" />
                          <Text className="text-gray-300 ml-2 font-medium">
                            {set.weight} {set.weightUnit || 'kg'}
                          </Text>
                        </View>
                      ) : null}
                    </View>
                  ))}

                  {/* Exercise Volume */}
                  <View className="mt-2 pt-2 border-t border-gray-700 flex-row justify-between">
                    <Text className="text-sm text-gray-400">
                      Exercise Volume:
                    </Text>
                    <Text className="text-sm font-medium text-white">
                      {ex.sets?.reduce(
                        (sum, s) => sum + (s.reps || 0) * (s.weight || 0),
                        0,
                      )}
                      {ex.sets?.[0]?.weightUnit || 'kg'}
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
