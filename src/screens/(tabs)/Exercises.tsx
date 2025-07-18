import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  RefreshControl,
} from 'react-native';
import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CircleX, HeartPulse, Icon, Search } from 'lucide-react-native';
import { SearchBar } from 'react-native-screens';
import { useNavigation } from '@react-navigation/native';

export default function Exercises() {
  const [searchQuery, setSearchQuery] = useState('');
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [filteredExercises, setFilteredExercises] = useState<Exercise[]>([]);
  const navigation = useNavigation();
  const [refreshing, setRefreshing] = useState(false);

  const fetchExercises = async () => {
    try {
      ///fetcch the exercises from your API or database
      const exercises = await client.fetch(exercisesQuery);
      setExercises(exercises);
      setFilteredExercises(exercises);
    } catch (error) {}
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchExercises();
    setRefreshing(false);
  };
  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      {/* HEADER */}
      <View className="px-6 py-4 bg-white border-b border-gray-200">
        <Text className="text-2xl font-bold text-gray-900">
          Exercise Library
        </Text>
        <Text className="text-gray-600 mt-1">Discover and master exercise</Text>
        {/* Search Bar */}
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
      <FlatList
        data={[]}
        keyExtractor={item => item._id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: 24 }}
        renderItem={({ item }) => (
          <ExerciseCard
            item={item}
            onPress={() =>
              navigation.navigate('ExerciseDetail', { id: item._id })
            }
          />
        )}
      />
      refreshControl=
      {
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          colors={['#3B82F6']}
          tintColor="#3B82F6"
          title="Refreshing..."
          titleColor="#6B7280"
        />
      }
      ListEmptyComponent=
      {
        <View className="bg-white rounded-2xl p-8 items-center">
          <HeartPulse size={64} color="#9CA3AF" />
          <Text className="text-xl font-semibold text-gray-900 mt-4">
            {searchQuery
              ? 'Try adjusting your search'
              : 'Your exercise will appear here'}
          </Text>
        </View>
      }
    </SafeAreaView>
  );
}
