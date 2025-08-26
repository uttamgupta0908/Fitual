import React, { useEffect, useState } from 'react';
import { API_URL } from '@env';

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
  ExerciseDetail: { id: number };
};

export default function ExerciseDetail() {
  const route = useRoute<RouteProp<ExerciseDetailParams, 'ExerciseDetail'>>();
  const { id } = route.params;
  const navigation = useNavigation();

  const [exercise, setExercise] = useState<ExerciseType | null>(null);
  const [loading, setLoading] = useState(true);
  const [aiGuidance, setAiGuidance] = useState<string | null>(null);
  const [aiLoading, setAiLoading] = useState(false);

  const getAiGuidance = async () => {
    if (!exercise) return;

    setAiLoading(true);

    const prompt = `Explain the exercise "${exercise.name}" for a beginner with tips and safety instructions in markdown format.`;

    try {
      const res = await fetch(`${API_URL}/gemini`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      });

      const data = await res.json();
      setAiGuidance(data?.response ?? 'No guidance returned.');
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
    <SafeAreaView style={{ flex: 1, backgroundColor: '#111827' }}>
      <StatusBar barStyle="light-content" backgroundColor="#111827" />

      {/* Back Button */}
      <View style={{ position: 'absolute', top: 48, left: 16, zIndex: 10 }}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={{
            width: 40,
            height: 40,
            backgroundColor: 'rgba(0,0,0,0.2)',
            borderRadius: 20,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <CircleX size={24} color="white" />
        </TouchableOpacity>
      </View>

      {loading ? (
        <View
          style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}
        >
          <ActivityIndicator size="large" color="#3B82F6" />
        </View>
      ) : (
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Image */}
          <View
            style={{
              height: 320,
              backgroundColor: '#1F2937',
              position: 'relative',
            }}
          >
            {exercise?.imageUrl ? (
              <Image
                source={{ uri: exercise.imageUrl }}
                style={{ width: '100%', height: '100%' }}
                resizeMode="cover"
              />
            ) : (
              <View
                style={{
                  flex: 1,
                  backgroundColor: '#374151',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <HeartPulse size={80} color="white" />
              </View>
            )}
          </View>

          {/* Exercise Details */}
          <View style={{ padding: 24 }}>
            <Text
              style={{
                fontSize: 28,
                fontWeight: 'bold',
                color: '#FFFFFF',
                marginBottom: 8,
              }}
            >
              {exercise?.name}
            </Text>

            {/* Difficulty Badge */}
            <View style={{ flexDirection: 'row', marginBottom: 16 }}>
              <View
                style={{
                  paddingHorizontal: 12,
                  paddingVertical: 4,
                  borderRadius: 9999,
                  backgroundColor:
                    exercise?.difficulty === 'beginner'
                      ? '#22C55E'
                      : exercise?.difficulty === 'intermediate'
                      ? '#FACC15'
                      : '#EF4444',
                }}
              >
                <Text
                  style={{
                    fontSize: 12,
                    fontWeight: '600',
                    color: '#FFFFFF',
                    textTransform: 'capitalize',
                  }}
                >
                  {exercise?.difficulty}
                </Text>
              </View>
            </View>

            {/* Muscle Group & Equipment */}
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginBottom: 24,
              }}
            >
              <View style={{ flex: 1 }}>
                <Text
                  style={{ fontSize: 12, color: '#9CA3AF', marginBottom: 4 }}
                >
                  Muscle Group
                </Text>
                <Text
                  style={{ fontSize: 16, fontWeight: '500', color: '#FFFFFF' }}
                >
                  {exercise?.muscleGroup}
                </Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text
                  style={{ fontSize: 12, color: '#9CA3AF', marginBottom: 4 }}
                >
                  Equipment
                </Text>
                <Text
                  style={{ fontSize: 16, fontWeight: '500', color: '#FFFFFF' }}
                >
                  {exercise?.equipment}
                </Text>
              </View>
            </View>

            {/* Description */}
            <View style={{ marginBottom: 24 }}>
              <Text
                style={{
                  fontSize: 18,
                  fontWeight: '600',
                  color: '#FFFFFF',
                  marginBottom: 8,
                }}
              >
                Description
              </Text>
              <Text style={{ fontSize: 16, color: '#D1D5DB', lineHeight: 24 }}>
                {exercise?.description}
              </Text>
            </View>

            {/* Video Section */}
            {exercise?.videoUrl && (
              <View style={{ marginBottom: 24 }}>
                <Text
                  style={{
                    fontSize: 20,
                    fontWeight: '600',
                    color: '#FFFFFF',
                    marginBottom: 8,
                  }}
                >
                  Video Tutorial
                </Text>
                <TouchableOpacity
                  style={{
                    flexDirection: 'row',
                    backgroundColor: '#22C55E',
                    borderRadius: 16,
                    padding: 16,
                    alignItems: 'center',
                  }}
                  onPress={() => Linking.openURL(exercise.videoUrl)}
                >
                  <View
                    style={{
                      width: 48,
                      height: 48,
                      borderRadius: 24,
                      backgroundColor: '#FFFFFF',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginRight: 12,
                    }}
                  >
                    <Play size={20} color="#22C55E" />
                  </View>
                  <View>
                    <Text
                      style={{
                        color: '#FFFFFF',
                        fontWeight: '600',
                        fontSize: 16,
                      }}
                    >
                      Watch Tutorial
                    </Text>
                    <Text style={{ color: '#D1FAE5', fontSize: 12 }}>
                      Learn proper form
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>
            )}

            {/* AI Guidance */}
            {(aiGuidance || aiLoading) && (
              <View style={{ marginBottom: 24 }}>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginBottom: 12,
                  }}
                >
                  <HeartPulse size={24} color="#3B82F6" />
                  <Text
                    style={{
                      fontSize: 20,
                      fontWeight: '600',
                      color: '#FFFFFF',
                      marginLeft: 8,
                    }}
                  >
                    AI Coach says...
                  </Text>
                </View>
                {aiLoading ? (
                  <View
                    style={{
                      backgroundColor: '#1F2937',
                      borderRadius: 16,
                      padding: 16,
                      alignItems: 'center',
                    }}
                  >
                    <ActivityIndicator size="small" color="#3B82F6" />
                    <Text style={{ color: '#9CA3AF', marginTop: 8 }}>
                      Getting personalized guidance...
                    </Text>
                  </View>
                ) : (
                  <View
                    style={{
                      backgroundColor: '#1E40AF',
                      borderRadius: 16,
                      padding: 16,
                      borderLeftWidth: 4,
                      borderLeftColor: '#3B82F6',
                    }}
                  >
                    <Markdown
                      style={{
                        body: { color: '#FFFFFF', paddingBottom: 20 },
                        heading2: {
                          fontSize: 18,
                          fontWeight: 'bold',
                          color: '#FFFFFF',
                          marginTop: 12,
                          marginBottom: 6,
                        },
                        heading3: {
                          fontSize: 16,
                          fontWeight: '600',
                          color: '#D1D5DB',
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

            {/* Action Buttons */}
            <View style={{ marginTop: 16, gap: 8 }}>
              <TouchableOpacity
                style={{
                  backgroundColor: aiLoading
                    ? '#6B7280'
                    : aiGuidance
                    ? '#22C55E'
                    : '#3B82F6',
                  paddingVertical: 16,
                  borderRadius: 16,
                  alignItems: 'center',
                }}
                onPress={getAiGuidance}
                disabled={aiLoading}
              >
                {aiLoading ? (
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <ActivityIndicator size="small" color="white" />
                    <Text
                      style={{
                        color: '#FFFFFF',
                        fontWeight: '700',
                        fontSize: 16,
                        marginLeft: 8,
                      }}
                    >
                      Loading...
                    </Text>
                  </View>
                ) : (
                  <Text
                    style={{
                      color: '#FFFFFF',
                      fontWeight: '700',
                      fontSize: 16,
                    }}
                  >
                    {aiGuidance
                      ? 'Refresh AI Guidance'
                      : 'Get AI Guidance on Form & Technique'}
                  </Text>
                )}
              </TouchableOpacity>

              <TouchableOpacity
                style={{
                  backgroundColor: '#374151',
                  paddingVertical: 16,
                  borderRadius: 16,
                  alignItems: 'center',
                }}
                onPress={() => navigation.goBack()}
              >
                <Text
                  style={{ color: '#FFFFFF', fontWeight: '700', fontSize: 16 }}
                >
                  Close
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      )}
    </SafeAreaView>
  );
}
