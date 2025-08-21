import {
  View,
  Text,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
} from 'react-native';
import React from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import { HeartPlus, Play } from 'lucide-react-native';

export default function Workout() {
  const navigation = useNavigation();
  const startWorkout = () => {
    navigation.navigate('ActiveWorkout');
  };
  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <StatusBar barStyle="dark-content" />
      {/* start wokout screen */}
      <View className="flex-1 px-6">
        {/* header */}
        <View className="pt-8 pb-6">
          <Text className="text-3xl font-bold text-gray-900 mb-2">
            Ready to Train?
          </Text>
          <Text className="text-lg text-gray-600">
            Start your workout session
          </Text>
        </View>
      </View>
      {/* generic start workout card */}
      <View
        className="bg-white rounded-3xl p-6 shadow-sm border
border-gray-100 mx-6 mb-8"
      >
        <View className="flex-row items-center justify-between mb-6">
          <View className="flex-row items-center">
            <View
              className="w-12 h-12 bg-blue-100 rounded-full items-center
justify-center mr-3"
            >
              <HeartPlus size={24} color="#3882F6" />
            </View>
            <View>
              <Text className="text-xl font-semibold text-gray-900">
                Start Workout
              </Text>
              <Text className="text-gray-500">Begin your training session</Text>
            </View>
          </View>
          <View className="bg-green-100 px-3 py-1 rounded-full">
            <Text className="text-green-700 font-medium text-sm"> Ready</Text>
          </View>
        </View>

        {/* start button */}
        <TouchableOpacity
          onPress={startWorkout}
          className="bg-blue-600 rounded-2xl py-4 items-center active:bg-blue-700"
          activeOpacity={0.8}
        >
          <View className="flex-row items-center">
            <Play size={20} color="white" style={{ marginRight: 8 }} />
            <Text className="text-white font-semibold text-lg">
              Start Workout
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
