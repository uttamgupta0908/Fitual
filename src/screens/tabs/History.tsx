import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  RefreshControl,
  ActivityIndicator,
  TouchableOpacity,
  StatusBar,
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

import { Dumbbell, HeartPlus, Timer } from 'lucide-react-native';
import WorkoutDetail from '../../components/WorkoutDetail';
import formatDate from '../../utils/formateDate';

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
    try {
      const data = await fetchWorkoutsFromAPI();

      setWorkouts(data);
      setFilteredWorkouts(data);
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
      navigation.setParams({ refresh: false });
    }
  }, [route.params?.refresh]);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchWorkouts();
    setRefreshing(false);
  };

  const formatWorkoutDuration = (seconds?: number) => {
    if (!seconds) return 'Duration not recorded';
    return formatDuration(seconds);
  };

  // const getTotalSets = (workout: GetWorkoutsQueryResult[number]) => {
  //   return (
  //     workout.exercises?.reduce((total, exercise) => {
  //       return total + (exercise.sets?.length || 0);
  //     }, 0) || 0
  //   );
  // };

  // const geyExerciseNames = (workout: GetWorkoutQuery[number]) => {
  //   return (
  //     workout.exercises?.map(ex => ex.exercise?.name).filter(Boolean) || []
  //   );
  // };
  const getTotalSets = (workout: Workout) => {
    return (
      workout.exercises?.reduce((total, exercise) => {
        return total + (exercise.sets?.length || 0);
      }, 0) || 0
    );
  };

  const getExerciseNames = (workout: Workout): string[] => {
    return workout.exercises?.map(e => e.exercise?.name).filter(Boolean) || [];
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
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar barStyle="dark-content" backgroundColor="white" />
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
                activeOpacity={0.7}
                onPress={() =>
                  navigation.navigate('WorkoutRecord', { id: workout.id })
                }
                //   onPress={() =>
                //     navigation.navigate(
                //       'History' as never,
                //       {
                //         workout: workout.id,
                //       } as never,
                //     )
                //   }
              >
                {/* // onPress={() => {
                //   router.push({
                //     pathname: '/history/workout-record',
                //     params: {
                //       workoutId: workout.id,
                //     },
                //   });
                // }} */}

                {/* workout heaeder */}
                <View className="flex-row items-center justify-between mb-4">
                  <View className="flex-1">
                    <Text className="text-lg font-semibold text-gray-900">
                      {workout.date ? formatDate(workout.date) : 'N/A'}
                    </Text>

                    <View className="flex-row items-center mt-1">
                      <Timer size={16} color="#687280" />
                      <Text className="text-gray-600 ml-2">
                        {formatWorkoutDuration(workout.duration)}
                      </Text>
                    </View>
                  </View>
                  <View className="bg-blue-100 rounded-full w-12 h-12 items-center justify-center">
                    <HeartPlus size={24} color="#3B82F6" />
                  </View>
                </View>

                {/* workout stats */}

                <View className="flex-row items-center justify-between mb-4">
                  <View className="flex-row items-center">
                    <View className="bg-gray-100 rounded-lg px-3 py-2 mr-3">
                      <Text className="text-sm font-medium text-gray-700">
                        {workout.exercises?.length || 0} exercises
                      </Text>
                    </View>
                    <View className="bg-gray-100 rounded-lg px-3 py-2">
                      <Text className="text-sm font-medium text-gray-700">
                        {getTotalSets(workout)} sets
                      </Text>
                    </View>
                  </View>
                </View>

                {/* exercise list  */}
                {workout.exercises && workout.exercises.length > 0 && (
                  <View className="mb-4">
                    <Text className="text-sm font-medius text-gray-700 mb-2">
                      Exercises:
                    </Text>
                    <View className="flex-row flex-wrap">
                      {getExerciseNames(workout)
                        .slice(0, 3)
                        .map((name, index) => (
                          <View
                            key={index}
                            className="bg-blue-50 rounded-lg px-3 py-1 mr-2 mb-2"
                          >
                            <Text className="text-blue-700 text-sm font-medium">
                              {name}
                            </Text>
                          </View>
                        ))}
                      {getExerciseNames(workout).length > 3 && (
                        <View className="bg-gray-100 rounded-lg px-3 py-1 mr-2 mb-2">
                          <Text className="text-gray-600 text-sm font-medium">
                            +{getExerciseNames(workout).length - 3} more
                          </Text>
                        </View>
                      )}
                    </View>
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
