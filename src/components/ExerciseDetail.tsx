import React, { useEffect, useState } from 'react';
// import { API_URL } from '@env';
const API_URL = 'http://192.168.1.11:5000';

import {
  View,
  Text,
  Image,
  ScrollView,
  StatusBar,
  TouchableOpacity,
  ActivityIndicator,
  Linking,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { CircleX, HeartPulse, Play } from 'lucide-react-native';

import { fetchExercisesFromAPI, ExerciseType } from '../utils/exercise';
import Markdown from 'react-native-markdown-display';

type ExerciseDetailParams = {
  ExerciseDetail: {
    id: number;
  };
};

export default function ExerciseDetail() {
  const route = useRoute<RouteProp<ExerciseDetailParams, 'ExerciseDetail'>>();
  const { id } = route.params;
  const navigation = useNavigation();

  const [exercise, setExercise] = useState<ExerciseType | null>(null);
  const [loading, setLoading] = useState(true);
  const [aiGuidance, setAiGuidance] = useState<string | null>(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiMessage, setAiMessage] = useState('');

  // const getAiGuidance = async () => {
  //   const prompt = `
  // Explain the exercise "${exercise?.name}" for a beginner with tips and safety instructions in markdown format.
  // `;

  //   try {
  //     const res = await fetch(`${API_URL}/api/ai/gemini`, {
  //       method: 'POST',
  //       headers: { 'Content-Type': 'application/json' },
  //       body: JSON.stringify({ prompt }),
  //     });

  //     const data = await res.json();
  //     console.log('AI Output:', data.message);
  //   } catch (err) {
  //     console.error('Failed to fetch Gemini AI response', err);
  //   }
  // };

  // const fetchAIGuidance = async () => {
  //   if (!exercise) return;
  //   setLoading(true);
  //   const prompt = `
  //   Explain the exercise in detail and for a beginner.

  //   The exercise name is: ${exercise.name}

  //   Keep it short and concise. Use markdown formatting.

  //   Use the following format:

  //   ## Equipment Required

  //   ## Instructions

  //   ### Tips

  //   ### Variations

  //   ### Safety

  //   keep spacing between the headings and the content.
  //   `;
  //   try {
  //     const response = await fetch('http://192.168.1.5:5000/api/ai', {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //       body: JSON.stringify({ exerciseName: exercise?.name }),
  //     });

  //     const data = await response.json();
  //     setAiMessage(data.message);
  //   } catch (error) {
  //     console.error('Fetch error:', error);
  //     setAiMessage('Error loading guidance.');
  //   } finally {
  //     setLoading(false);
  //   }
  // };
  const getAiGuidance = async () => {
    if (!exercise) return;

    setAiLoading(true);

    const prompt = `
    Explain the exercise "${exercise.name}" for a beginner with tips and safety instructions in markdown format.
    `;

    try {
      const res = await fetch(`${API_URL}/gemini`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      });

      const data = await res.json();

      if (data?.response) {
        setAiGuidance(data.response);
      } else {
        setAiGuidance('No guidance returned.');
      }
    } catch (err) {
      console.error('Gemini AI response', err);
      setAiGuidance('Error retrieving guidance.');
    } finally {
      setAiLoading(false);
    }
  };

  useEffect(() => {
    const fetchExercise = async () => {
      try {
        const exercises = await fetchExercisesFromAPI();
        const foundExercise = exercises.find(ex => ex.id === id);
        setExercise(foundExercise ?? null);
      } catch (error) {
        console.error('Error fetching exercise', error);
      } finally {
        setLoading(false);
      }
    };

    fetchExercise();
  }, [id]);

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar barStyle="light-content" backgroundColor="#000" />

      {/* Back Button */}
      <View className="absolute top-12 left-4 z-10">
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          className="w-10 h-10 bg-black/20 rounded-full items-center justify-center"
        >
          <CircleX size={24} color="white" />
        </TouchableOpacity>
      </View>

      {loading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#000" />
        </View>
      ) : (
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Image */}
          <View className="h-80 bg-gray-200 relative">
            {exercise?.imageUrl ? (
              <Image
                source={{ uri: exercise.imageUrl }}
                className="w-full h-full"
                resizeMode="cover"
              />
            ) : (
              <View className="flex-1 bg-indigo-500 items-center justify-center">
                <HeartPulse size={80} color="white" />
              </View>
            )}
          </View>

          {/* Exercise Details */}
          <View className="px-6 py-6">
            <Text className="text-3xl font-bold text-gray-900 mb-2">
              {exercise?.name}
            </Text>

            {/* Difficulty Badge */}
            <View className="flex-row items-center mb-4">
              <View
                className={`px-3 py-1 rounded-full ${
                  exercise?.difficulty === 'beginner'
                    ? 'bg-green-500'
                    : exercise?.difficulty === 'intermediate'
                    ? 'bg-yellow-500'
                    : 'bg-red-500'
                }`}
              >
                <Text className="text-xs font-semibold text-white capitalize">
                  {exercise?.difficulty}
                </Text>
              </View>
            </View>

            {/* Muscle Group & Equipment */}
            <View className="flex-row space-x-4 mb-6">
              <View className="flex-1">
                <Text className="text-sm text-gray-500 mb-1">Muscle Group</Text>
                <Text className="text-base font-medium text-gray-900">
                  {exercise?.muscleGroup}
                </Text>
              </View>
              <View className="flex-1">
                <Text className="text-sm text-gray-500 mb-1">Equipment</Text>
                <Text className="text-base font-medium text-gray-900">
                  {exercise?.equipment}
                </Text>
              </View>
            </View>

            {/* Description */}
            <View className="mb-6">
              <Text className="text-lg font-semibold text-gray-900 mb-3">
                Description
              </Text>
              <Text className="text-base text-gray-700 leading-6">
                {exercise?.description}
              </Text>
            </View>

            {/* Video Section */}
            {exercise?.videoUrl && (
              <View className="mb-6">
                <Text className="text-xl font-semibold text-gray-800 mb-3">
                  Video Tutorial
                </Text>
                <TouchableOpacity
                  className="bg-green-500 rounded-xl p-4 flex-row items-center"
                  onPress={() => Linking.openURL(exercise.videoUrl)}
                >
                  <View className="w-12 h-12 bg-white rounded-full items-center justify-center mr-4">
                    <Play size={20} color="green" />
                  </View>
                  <View>
                    <Text className="text-white font-semibold text-lg">
                      Watch Tutorial
                    </Text>
                    <Text className="text-red-100 text-sm">
                      Learn proper form
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>
            )}
            {/* Ai guidd */}
            {(aiGuidance || aiLoading) && (
              <View className="mb-6">
                <View className="flex-row items-center mb-3">
                  <HeartPulse size={24} color="#3B82F6" />
                  <Text className="text-xl font-semibold text-gray-800 ml-2">
                    AI Coach says...
                  </Text>
                </View>
                {aiLoading ? (
                  <View className="bg-gray-50 rounded-xl p-4 items-center">
                    <ActivityIndicator size="small" color="#3B82F6" />
                    <Text className="text-gray-600 mt-2">
                      Getting personalized guidance...
                    </Text>
                  </View>
                ) : (
                  <View className="bg-blue-50 rounded-xl p-4 border-l-4 border-blue-500">
                    <Markdown
                      style={{
                        body: {
                          paddingBottom: 20,
                        },
                        heading2: {
                          fontSize: 18,
                          fontWeight: 'bold',
                          color: '#1f2937',
                          marginTop: 12,
                          marginBottom: 6,
                        },
                        heading3: {
                          fontSize: 16,
                          fontWeight: '600',
                          color: '#374151',
                          marginTop: 0,
                          marginBottom: 4,
                        },
                      }}
                    >
                      {aiGuidance}
                    </Markdown>
                  </View>
                )}
              </View>
            )}
            {/* ------ */}

            {/* Action button */}
            <View className="mt-8 gap-2">
              {/* ai coach */}
              <TouchableOpacity
                className={`rounded-xl py-4 items-center ${
                  aiLoading
                    ? 'bg-gray-400'
                    : aiGuidance
                    ? 'bg-green-500'
                    : 'bg-blue-500'
                }`}
                onPress={getAiGuidance}
                disabled={aiLoading}
              >
                {aiLoading ? (
                  <View className="flex-row items-center">
                    <ActivityIndicator size="small" color="white" />
                    <Text className="text-white font-bold text-lg ml-2">
                      Loading...
                    </Text>
                  </View>
                ) : (
                  <Text className="text-white font-bold text-lg">
                    {aiGuidance
                      ? 'Refresh AI Guidence'
                      : 'Get AI Guidence on Form & Technique'}
                  </Text>
                )}
              </TouchableOpacity>
              <TouchableOpacity
                className="bg-gray-200 rounded-xl py-4 items-center"
                onPress={() => navigation.goBack()}
              >
                <Text className="text-gray-800 font-bold text-lg">Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      )}
    </SafeAreaView>
  );
}
