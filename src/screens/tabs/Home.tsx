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
import { ChevronRight, Dumbbell, Play, Timer } from 'lucide-react-native';

export default function Home() {
  const navigation = useNavigation();
  const { user } = useAuth();
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchWorkouts = async () => {
    if (!user?.id) return;
    try {
      const results = await fetchWorkoutsFromAPI(user.id);
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

  const formatDate = (dataString: string) => {
    const date = new Date(dataString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString('en-US ', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
      });
    }
  };

  const getTotalSets = (workout: Workout) => {
    return (
      workout.exercises?.reduce((total, exercise) => {
        return total + (exercise.sets?.length || 0);
      }, 0) || 0
    );
  };

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50">
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#3B82F6" />
          <Text className="text-gray-600 mt-4">Loading your stats...</Text>
        </View>
      </SafeAreaView>
    );
  }
  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <ScrollView
        className="flex-1"
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* header */}
        <View className="px-6 pt-8 pb-6">
          <Text className="text-lg text-gray-600">Welcome back,</Text>
          <Text className="text-3xl font-bold text-gray-900">
            {user?.name || 'Athlete'}!💪
          </Text>
        </View>
        {/* stats overview */}
        <View className="px-6 mb-6">
          <View className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <Text className="text-lg font-semibold text-gray-900 mb-4">
              Your Stats
            </Text>
            <View className="flex-row justify-between">
              <View className="items-center flex-1">
                <Text className="text-2xl font-bold  text-blue-600">
                  {totalWorkouts}
                </Text>
                <Text className="text-sm text-gray-600 text-center">
                  Total{'\n'} Workouts
                </Text>
              </View>
              <View className="items-center flex-1">
                <Text className="text-2xl font-bold  text-green-600">
                  {formatDuration(totalDuration)}
                </Text>
                <Text className="text-sm text-gray-600 text-center">
                  Total{'\n'}Time
                </Text>
              </View>
              <View className="items-center flex-1">
                <Text className="text-2xl font-bold text-purple-600">
                  {averageDuration > 0 ? formatDuration(averageDuration) : '0m'}
                </Text>
                <Text className="text-sm text-gray-600 text-center">
                  Average{'\n'}Duration
                </Text>
              </View>
            </View>
          </View>
        </View>
        {/* oucik action */}
        <View className="px-6 mb-6">
          <Text className="text-lg font-semibold text-gray-900 mb-4">
            Quick Actions
          </Text>
          {/* Start Workout Button */}
          <TouchableOpacity
            onPress={() => navigation.navigate('ActiveWorkout')}
            // onPress={() => router.push("")}
            className="bg-blue-600 rounded-2xl p-6 mb-4 shadow-sm"
            activeOpacity={0.8}
          >
            <View className="flex-row items-center justify-between">
              <View className="flex-row items-center flex-1">
                <View
                  className="w-12 h-12 bg-blue-500 rounded-full
items-center justify-center mr-4"
                >
                  <Play size={24} color="white" />
                </View>
                <View>
                  <Text className="text-white text-xl font-semibold">
                    Start Workout
                  </Text>
                  <Text className="text-blue-100">
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
              className="bg-white rounded-2x1 p-4 flex-1 shadow-sm border
border-gray-100"
              activeOpacity={0.7}
            >
              <View className="items-center">
                <View
                  className="w-12 h-12 bg-gray-100 rounded-full
items-center justify-center mb-3"
                >
                  <Timer size={24} color="#6B7280" />
                </View>
                <Text className="text-gray-900 font-medium text-center">
                  Workout{'\n'} History
                </Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => navigation.navigate('Exercises')}
              className="bg-white rounded-2xl p-4 flex-1 shadow-sm border
border-gray-100"
              activeOpacity={0.7}
            >
              <View className="items-center">
                <View
                  className="w-12 h-12 bg-gray-100 rounded-full
items-center justify-center mb-3"
                >
                  <Dumbbell size={24} color="#6B7280" />
                </View>
                <Text className="text-gray-900 font-medium text-center">
                  Browse{'\n'}Exercises
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
