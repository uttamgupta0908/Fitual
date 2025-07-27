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
import {
  fetchWorkoutsFromAPI,
  Workout,
  WorkoutExercise,
} from '../../utils/workout';
import { useAuth } from '../../context/AuthContext';
import {
  useNavigation,
  useRoute,
  NavigationProp,
} from '@react-navigation/native';
import { formatDuration } from '../../utils/formatworkout';

import { Dumbbell } from 'lucide-react-native';

type RootStackParamList = {
  History: { refresh?: boolean };
};

export default function History() {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const route = useRoute();
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [filteredWorkouts, setFilteredWorkouts] = useState<Workout[]>([]);
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchWorkouts = async () => {
    if (!user?.id) return;
    try {
      const data = await fetchWorkoutsFromAPI();
      setWorkouts(data);
      setFilteredWorkouts(data);
      // (data);
    } catch (error) {
      console.log('Error fetching workouts:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchWorkouts();
  }, [user?.id]);

  useEffect(() => {
    if (route.params?.refresh) {
      fetchWorkouts();

      // Optional: clear param after fetch
      navigation.setParams({ refresh: false });
    }
  }, [route.params?.refresh]);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchWorkouts();
    setRefreshing(false);
  };

  const formData = (dataString: string) => {
    const date = new Date(dataString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString('en-Us', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
      });
    }
  };

  const formatWorkoutDuration = (seconds?: number) => {
    if (!seconds) return 'Duration not recorded';
    return formatDuration(seconds);
  };

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50">
        <View className="px-6 py-4 bg-white border-b border-gray-200">
          <Text className="text-2xl font-bold text-gray-900">
            Workout History
          </Text>
        </View>
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#3B82F6" />
          <Text className="text-gray-600 mt-4">Loading your workouts.....</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      {/* header*/}
      <View className="px-6 py-4 bg-white border-b border-gray-200">
        <Text className="text-2xl font-bold text-gray-900">
          Workout History
        </Text>
        <Text className="text-gray-600 mt-1">
          {workouts.length} workout{workouts.length !== 1 ? 's' : ''} completed
        </Text>
      </View>
      {/* list of workouts */}
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ padding: 24 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {workouts.length === 0 ? (
          <View className="bg-white rounded-2xl p-8 items-center">
            <Dumbbell size={64} color="#9CA3AF" />
            <Text className="text-xl font-bold text-gray-900 mt-4">
              No workouts yet
            </Text>
            <Text className="text-gray-600 text-center mt-2">
              Your completed workout will appear here
            </Text>
          </View>
        ) : (
          <View className="space-y-4 gap-4">
            {workouts.map(workout => (
              <TouchableOpacity
                key={workout.id}
                className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
              ></TouchableOpacity>
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
