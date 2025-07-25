import { View, Text, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';
import { ChevronRight } from 'lucide-react-native';
import { Image } from 'react-native';
import { ExerciseType } from '../utils/exercise';
import { Exercise } from '../utils/workout';
const getDifficultyColor = (difficulty: string) => {
  switch (difficulty) {
    case 'beginner':
      return 'bg-green-500';
    case 'intermediate':
      return 'bg-yellow-500';
    case 'advanced':
      return 'bg-red-500';
    default:
      return 'bg-gray-500';
  }
};
const getDifficultyText = (difficulty: string) => {
  switch (difficulty) {
    case 'beginner':
      return 'Beginner';
    case 'intermediate':
      return 'Intermediate';
    case 'advanced':
      return 'Advanced';
    default:
      return 'Unknown';
  }
};
// interface Exercise {
//   name: string;
//   description?: string;
//   image?: { uri: string };
//   difficulty: string;
// }
interface ExerciseCardProps {
  item: Exercise;
  onPress: () => void;
  showChevron?: boolean;
}

export default function ExerciseCard({
  item,
  onPress,
  showChevron = false,
}: ExerciseCardProps) {
  return (
    <TouchableOpacity
      className="bg-white rounded-2xl mb-4 shadow-sm border border-gray-100"
      onPress={onPress}
    >
      <View className="flex-row p-6">
        <View className="w-20 h-20 bg-white rounded-xl mr-4 overflow-hidden">
          {item.imageUrl ? (
            <Image
              source={{ uri: item?.imageUrl }}
              //  source={{ uri: urlFor(item.image?.asset?._ref).url() }}
              className="w-full h-full"
              resizeMode="contain"
            />
          ) : (
            <View className=" w-full h-full bg-gradient-to-br from-blue-400 to-purple-500 items-center justify-center">
              {/* <Ionicons name="fitness" size={24} color="white" /> */}
            </View>
          )}
        </View>
        <View className="flex-1 justify-between">
          <View>
            <Text className="text-lg font-bold text-gray-900 mb-1">
              {item.name}
            </Text>
            <Text className="text-sm text-gray-600 mb-2" numberOfLines={2}>
              {item.description || 'No description available.'}
            </Text>
          </View>
          <View className="flex-row items-center justify-between">
            <View
              className={`px-3 py-1 rounded-full ${getDifficultyColor(
                item.difficulty,
              )}`}
            >
              <Text className="text-xs font-semibold text-white">
                {getDifficultyText(item.difficulty)}
              </Text>
            </View>
            {showChevron && (
              <TouchableOpacity className="P-2">
                <ChevronRight size={20} color="#6B7280" />
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}
