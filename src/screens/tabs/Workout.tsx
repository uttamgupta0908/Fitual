import {
  View,
  Text,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { HeartPlus, Play, Bot } from 'lucide-react-native';

// 👇 Mock: replace with your real AI call
async function fetchAIWorkoutInsights(prevWorkout: any) {
  // send to AI backend (Gemini, DeepSeek, etc.)
  // const res = await fetch(`${API_URL}/ai/coach`, { method: "POST", body: JSON.stringify(prevWorkout) })
  // return await res.json();

  // Mock data
  return {
    questions: [
      'Did you feel muscle fatigue after yesterday’s squats?',
      'Were you able to maintain proper posture during deadlifts?',
    ],
    guidance: [
      'Add 5 extra push-ups today for progressive overload.',
      'Focus on stretching hamstrings before workout.',
    ],
  };
}

export default function Workout() {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(true);
  const [insights, setInsights] = useState<any>(null);

  const previousWorkout = {
    name: 'Full Body Strength',
    duration: '45 min',
    calories: 320,
    score: 78,
  };

  const startWorkout = () => {
    navigation.navigate('ActiveWorkout');
  };

  useEffect(() => {
    const loadAI = async () => {
      setLoading(true);
      const data = await fetchAIWorkoutInsights(previousWorkout);
      setInsights(data);
      setLoading(false);
    };
    loadAI();
  }, []);

  return (
    <ScrollView>
      <SafeAreaView className="flex-1 bg-gray-50">
        <StatusBar barStyle="dark-content" />

        {/* Main container */}
        <View className="flex-1 px-6">
          {/* Header */}
          <View className="pt-8 pb-6">
            <Text className="text-3xl font-bold text-gray-900 mb-2">
              Ready to Train?
            </Text>
            <Text className="text-lg text-gray-600">
              Start your workout session
            </Text>
          </View>

          {/* Previous Workout Analysis */}
          <View className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 mb-4">
            <Text className="text-base font-semibold text-gray-700 mb-4">
              Previous Workout Analysis
            </Text>

            <Text className="text-lg font-semibold text-gray-900">
              {previousWorkout.name}
            </Text>
            <Text className="text-sm text-gray-500 mb-2">
              Duration: {previousWorkout.duration} • Calories:{' '}
              {previousWorkout.calories} kcal
            </Text>

            {/* Score Bar */}
            <View className="w-full h-3 bg-gray-200 rounded-full overflow-hidden mt-2">
              <View
                className="h-full bg-blue-600 rounded-full"
                style={{ width: `${previousWorkout.score}%` }}
              />
            </View>
            <Text className="text-sm text-gray-500 mt-2">
              Score: {previousWorkout.score} / 100
            </Text>
          </View>

          {/* AI Coach Insights */}
          <View className="bg-indigo-50 rounded-2xl p-5 shadow-sm border border-indigo-100 my-4">
            <View className="flex-row items-center mb-3">
              <Bot size={20} color="#4F46E5" style={{ marginRight: 6 }} />
              <Text className="text-base font-semibold text-indigo-900">
                AI Coach Suggestions
              </Text>
            </View>

            {loading ? (
              <ActivityIndicator size="small" color="#4F46E5" />
            ) : (
              <>
                {/* Questions */}
                <Text className="text-sm text-gray-700 mb-2 font-medium">
                  Reflect on yesterday:
                </Text>
                {insights?.questions?.map((q: string, i: number) => (
                  <Text key={i} className="text-sm text-gray-600 mb-1">
                    • {q}
                  </Text>
                ))}

                {/* Guidance */}
                <Text className="text-sm text-gray-700 mt-3 mb-2 font-medium">
                  Today’s guidance:
                </Text>
                {insights?.guidance?.map((tip: string, i: number) => (
                  <Text key={i} className="text-sm text-gray-600 mb-1">
                    ✅ {tip}
                  </Text>
                ))}
              </>
            )}
          </View>
        </View>

        {/* Start Workout Button */}
        <View className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 mx-6 mb-8">
          <View className="flex-row items-center justify-between mb-6">
            <View className="flex-row items-center">
              <View className="w-12 h-12 bg-blue-100 rounded-full items-center justify-center mr-3">
                <HeartPlus size={24} color="#3882F6" />
              </View>
              <View>
                <Text className="text-xl font-semibold text-gray-900 ">
                  Start Workout
                </Text>
                <Text className="text-gray-500">
                  Begin your training session
                </Text>
              </View>
            </View>
            <View className="bg-green-100 px-3 py-1 rounded-full">
              <Text className="text-green-700 font-medium text-sm">Ready</Text>
            </View>
          </View>

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
    </ScrollView>
  );
}
