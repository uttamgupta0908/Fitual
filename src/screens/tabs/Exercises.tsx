import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  RefreshControl,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CircleX, HeartPulse, Search } from 'lucide-react-native';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { fetchExercisesFromAPI, ExerciseType } from '../../utils/exercise';
import ExerciseCard from '../../components/ExerciseCard';
import { useAuth } from '../../context/AuthContext';

///////////////
type RootStackParamList = {
  ExerciseDetail: { id: number };
};

export default function Exercises() {
  const [searchQuery, setSearchQuery] = useState('');
  const [exercises, setExercises] = useState<ExerciseType[]>([]);
  const [filteredExercises, setFilteredExercises] = useState<ExerciseType[]>(
    [],
  );
  const [loading, setLoading] = useState(true);

  const { user } = useAuth();
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const [refreshing, setRefreshing] = useState(false);

  const fetchExercises = async () => {
    try {
      const data = await fetchExercisesFromAPI();
      setExercises(data);
      setFilteredExercises(data);
    } catch (error) {
      console.log('Error fetching exercise:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExercises();
  }, []);

  useEffect(() => {
    const filtered = exercises.filter(exercise =>
      exercise.name.toLowerCase().includes(searchQuery.toLowerCase()),
    );
    setFilteredExercises(filtered);
  }, [searchQuery, exercises]);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchExercises();
    setRefreshing(false);
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-950">
      {/* Header */}
      <View className="px-6 py-4 bg-gray-900 border-b border-gray-800">
        <Text className="text-2xl font-bold text-white">Exercise Library</Text>
        <Text className="text-gray-400 mt-1">
          Discover and master exercises
        </Text>

        {/* Search bar */}
        <View className="flex-row items-center bg-gray-800 rounded-xl px-4 py-3 mt-4">
          <Search size={20} color="#9CA3AF" />
          <TextInput
            className="flex-1 ml-3 text-white"
            placeholder="Search exercise..."
            placeholderTextColor="#6B7280"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <CircleX size={20} color="#9CA3AF" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* FlatList */}
      <FlatList
        data={filteredExercises}
        keyExtractor={item => item.id.toString()}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: 24 }}
        renderItem={({ item }) => (
          <ExerciseCard
            item={item}
            onPress={() =>
              navigation.navigate('ExerciseDetail', { id: item.id })
            }
            showChevron={true}
          />
        )}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#3B82F6']}
            tintColor="#3B82F6"
            title="Refreshing..."
            titleColor="#9CA3AF"
          />
        }
        ListEmptyComponent={
          <View className="bg-gray-900 rounded-2xl p-8 items-center">
            <HeartPulse size={64} color="#6B7280" />
            <Text className="text-xl font-semibold text-white mt-4">
              {searchQuery
                ? 'Try adjusting your search'
                : 'Your exercise will appear here'}
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}
