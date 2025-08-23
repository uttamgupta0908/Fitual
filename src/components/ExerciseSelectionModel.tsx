import {
  View,
  Text,
  Modal,
  SafeAreaView,
  ScrollView,
  StatusBar,
  TextInput,
  TouchableOpacity,
  FlatList,
  RefreshControl,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import { useWorkoutStore } from '../../store/workoutstore';
import { CircleX, HeartPlus, Search } from 'lucide-react-native';
import ExerciseCard from './ExerciseCard';
import { Exercise, WorkoutExercisePayload } from '../utils/workout';
import { fetchExercisesFromAPI } from '../utils/exercise';
import { useAuth } from '../context/AuthContext';

interface ExerciseSelectionModel {
  visible: boolean;
  onClose: () => void;
}
export default function ExerciseSelectionModel({
  visible,
  onClose,
}: ExerciseSelectionModel) {
  const { addExerciseToWorkout } = useWorkoutStore();
  const [exercises, setExercises] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredExercises, setFilteredExercises] = useState<any[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    if (visible) {
      fetchExercises();
    }
  }, [visible]);

  useEffect(() => {
    const filterd = exercises.filter(exercise =>
      exercise.name.toLowerCase().includes(searchQuery.toLowerCase()),
    );
    setFilteredExercises(filterd);
  }, [searchQuery, exercises]);

  const fetchExercises = async () => {
    if (!user?.id) return;
    try {
      const exercises = await fetchExercisesFromAPI();
      setExercises(exercises);
      setFilteredExercises(exercises);
    } catch (error) {
      console.log('Error fetching exercises:', error);
    }
  };
  const handleExercisePress = (exercise: any) => {
    addExerciseToWorkout({
      id: exercise.id,
      name: exercise.name,
    });
    onClose();
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchExercises();
    setRefreshing(false);
  };
  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
    >
      <SafeAreaView className="flex-1 bg-white">
        <StatusBar barStyle="dark-content" />
        {/* header */}
        <View
          className="bg-white px-4 pt-4 pb-6 shadow-sm border-b
border-gray-100"
        >
          <View className="flex-row items-center justify-between mb-4">
            <Text className="text-2xl font-bold text-gray-800">
              Add Exercise
            </Text>
            <TouchableOpacity
              onPress={onClose}
              className="w-8 h-8 items-center justify-center"
            >
              <CircleX size={24} color="#687280" />
            </TouchableOpacity>
          </View>
          <Text className="text-gray-600 mb-4">
            Tap any exercise to add it to your workout
          </Text>
          {/* Search Bar */}
          <View
            className="flex-row items-center bg-gray-100 rounded-xl px-4
py-3"
          >
            <Search size={20} color="#6B7280" />
            <TextInput
              className="flex-1 ml-3 text-gray-800"
              placeholder="Search exercises..."
              placeholderTextColor="#9CA3AF"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery('')}>
                <CircleX size={20} color="#6B7280" />
              </TouchableOpacity>
            )}
          </View>
        </View>
        {/* exercise list */}
        <FlatList
          data={filteredExercises}
          renderItem={({ item }) => (
            <ExerciseCard
              item={item}
              onPress={() => handleExercisePress(item)}
              showChevron={false}
            />
          )}
          keyExtractor={item => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingTop: 16,
            paddingBottom: 32,
            paddingHorizontal: 16,
          }}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={['#3B82F6']}
              tintColor=" #3B82F6"
            />
          }
          ListEmptyComponent={
            <View className="flex-1 items-center justify-center py-20">
              <HeartPlus size={64} color="#D1D5DB" />
              <Text className="text-lg font-semibold text-gray-400 mt-4">
                {searchQuery ? 'No exercises found' : 'Loading exercises..'}
              </Text>
              <Text className=" text-sm text-gray-400 mt-2">
                {searchQuery
                  ? 'Try adjusting your search'
                  : 'Please wait a moment'}
              </Text>
            </View>
          }
        />
      </SafeAreaView>
    </Modal>
  );
}
