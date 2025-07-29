import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  RefreshControl,
  Image,
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
    if (!user?.id) return;
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
  }, [user?.id]);

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
    <SafeAreaView className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="px-6 py-4 bg-white border-b border-gray-200">
        <Text className="text-2xl font-bold text-gray-900">
          Exercise Library
        </Text>
        <Text className="text-gray-600 mt-1">
          Discover and master exercises
        </Text>

        {/* Search bar */}
        <View className="flex-row items-center bg-gray-100 rounded-xl px-4 py-3 mt-4">
          <Search size={20} color="#6B7280" />
          <TextInput
            className="flex-1 ml-3 text-gray-800"
            placeholder="Search exercise..."
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

      {/* FlatList */}
      <FlatList
        // className="bg-black"
        // className="bg-black"
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
            titleColor="#6B7280"
          />
        }
        ListEmptyComponent={
          <View className="bg-white rounded-2xl p-8 items-center">
            <HeartPulse size={64} color="#9CA3AF" />
            <Text className="text-xl font-semibold text-gray-900 mt-4">
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
