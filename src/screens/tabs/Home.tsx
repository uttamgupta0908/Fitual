import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  RefreshControl,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { fetchWorkoutsFromAPI, Workout } from '../../utils/workout';

import { formatDuration } from '../../utils/formatworkout';
import { useNavigation } from '@react-navigation/native';
import {
  ChevronRight,
  Dumbbell,
  HeartPlus,
  Play,
  Timer,
} from 'lucide-react-native';
import formatDate from '../../utils/formateDate';

export default function Home() {
  const navigation = useNavigation();
  const { user } = useAuth();
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchWorkouts = async () => {
    try {
      const results = await fetchWorkoutsFromAPI();
      setWorkouts(results);
    } catch (error) {
      console.error('Error fetching workouts:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchWorkouts();
  }, [user?.id]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchWorkouts();
  };

  const totalWorkouts = workouts.length;
  const lastWorkout = workouts[0];
  const totalDuration = workouts.reduce(
    (sum, workout) => sum + (workout.duration || 0),
    0,
  );
  const averageDuration =
    totalDuration > 0 ? Math.round(totalDuration / totalWorkouts) : 0;

  const getTotalSets = (workout: Workout) => {
    return (
      workout.exercises?.reduce((total, exercise) => {
        return total + (exercise.sets?.length || 0);
      }, 0) || 0
    );
  };

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-gray-900">
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#3B82F6" />
          <Text className="text-gray-300 mt-4">Loading your stats...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-900">
      <ScrollView
        className="flex-1"
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* header */}
        <View className="px-6 pt-8 pb-6">
          <Text className="text-lg text-gray-400">Welcome back,</Text>
          <Text className="text-3xl font-bold text-white">
            {user?.name || 'Athlete'}!💪
          </Text>
        </View>

        {/* stats overview */}
        <View className="px-6 mb-6">
          <View className="bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-700">
            <Text className="text-lg font-semibold text-white mb-4">
              Your Stats
            </Text>
            <View className="flex-row justify-between">
              <View className="items-center flex-1">
                <Text className="text-2xl font-bold text-blue-400">
                  {totalWorkouts}
                </Text>
                <Text className="text-sm text-gray-400 text-center">
                  Total{'\n'} Workouts
                </Text>
              </View>
              <View className="items-center flex-1">
                <Text className="text-2xl font-bold text-green-400">
                  {formatDuration(totalDuration)}
                </Text>
                <Text className="text-sm text-gray-400 text-center">
                  Total{'\n'}Time
                </Text>
              </View>
              <View className="items-center flex-1">
                <Text className="text-2xl font-bold text-purple-400">
                  {averageDuration > 0 ? formatDuration(averageDuration) : '0m'}
                </Text>
                <Text className="text-sm text-gray-400 text-center">
                  Average{'\n'}Duration
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Quick Actions */}
        <View className="px-6 mb-6">
          <Text className="text-lg font-semibold text-white mb-4">
            Quick Actions
          </Text>

          {/* Start Workout Button */}
          <TouchableOpacity
            onPress={() => navigation.navigate('ActiveWorkout')}
            className="bg-blue-600 rounded-2xl p-6 mb-4 shadow-sm"
            activeOpacity={0.8}
          >
            <View className="flex-row items-center justify-between">
              <View className="flex-row items-center flex-1">
                <View className="w-12 h-12 bg-blue-500 rounded-full items-center justify-center mr-4">
                  <Play size={24} color="white" />
                </View>
                <View>
                  <Text className="text-white text-xl font-semibold">
                    Start Workout
                  </Text>
                  <Text className="text-blue-200">
                    Begin your training session
                  </Text>
                </View>
              </View>
              <ChevronRight size={24} color="white" />
            </View>
          </TouchableOpacity>

          {/* Action Grid */}
          <View className="flex-row gap-4">
            <TouchableOpacity
              onPress={() => navigation.navigate('History')}
              className="bg-gray-800 rounded-2xl p-4 flex-1 shadow-sm border border-gray-700"
              activeOpacity={0.7}
            >
              <View className="items-center">
                <View className="w-12 h-12 bg-gray-700 rounded-full items-center justify-center mb-3">
                  <Timer size={24} color="#D1D5DB" />
                </View>
                <Text className="text-white font-medium text-center">
                  Workout{'\n'} History
                </Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => navigation.navigate('Exercise')}
              className="bg-gray-800 rounded-2xl p-4 flex-1 shadow-sm border border-gray-700"
              activeOpacity={0.7}
            >
              <View className="items-center">
                <View className="w-12 h-12 bg-gray-700 rounded-full items-center justify-center mb-3">
                  <Dumbbell size={24} color="#D1D5DB" />
                </View>
                <Text className="text-white font-medium text-center">
                  Browse{'\n'}Exercises
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        {/* Last Workout */}
        {lastWorkout && (
          <View className="px-6 mb-8">
            <Text className="text-lg font-semibold text-white mb-4">
              Last Workout
            </Text>
            <TouchableOpacity
              className="bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-700"
              onPress={() =>
                navigation.navigate('WorkoutRecord', { id: lastWorkout.id })
              }
              activeOpacity={0.7}
            >
              <View className="flex-row items-center justify-between mb-4">
                <View>
                  <Text className="text-lg font-semibold text-white">
                    {lastWorkout.date
                      ? formatDate(lastWorkout.date)
                      : 'No Date'}
                  </Text>
                  <View className="flex-row items-center mt-1">
                    <Timer size={16} color="#9CA3AF" />
                    <Text className="text-gray-400 ml-2">
                      {lastWorkout.duration
                        ? formatDuration(lastWorkout.duration)
                        : 'Duration not recorded'}
                    </Text>
                  </View>
                </View>
                <View className="bg-blue-900 rounded-full w-12 h-12 items-center justify-center">
                  <HeartPlus size={24} color="#3B82F6" />
                </View>
              </View>
              <View className="flex-row items-center justify-between">
                <Text className="text-gray-400">
                  {lastWorkout.exercises?.length || 0} exercises ·{' '}
                  {getTotalSets(lastWorkout)} sets
                </Text>
                <ChevronRight size={20} color="#9CA3AF" />
              </View>
            </TouchableOpacity>
          </View>
        )}

        {/* Empty State */}
        {totalWorkouts === 0 && (
          <View className="px-6 mb-8">
            <View className="bg-gray-800 rounded-2xl p-8 items-center shadow-sm border border-gray-700">
              <View className="w-16 h-16 bg-blue-900 rounded-full items-center justify-center mb-4">
                <Dumbbell size={32} color="#3B82F6" />
              </View>
              <Text className="text-xl font-semibold text-white mb-2">
                Ready to start your fitness journey?
              </Text>
              <Text className="text-gray-400 text-center mb-4">
                Track your workouts and see your progress over time
              </Text>
              <TouchableOpacity
                onPress={() => navigation.navigate('Workout')}
                className="bg-blue-600 rounded-xl px-6 py-3"
                activeOpacity={0.8}
              >
                <Text className="text-white font-semibold">
                  Start Your First Workout
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
