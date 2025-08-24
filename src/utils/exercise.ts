import AsyncStorage from '@react-native-async-storage/async-storage';

export type ExerciseType = {
  id: number;
  name: string;
  muscleGroup: string;
  equipment: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced'; // based on your enum
  description: string;
  videoUrl: string;
  imageUrl: string;
};

import { API_URL } from '@env';

export const fetchExercisesFromAPI = async (): Promise<ExerciseType[]> => {
  const token = await AsyncStorage.getItem('token');
  const res = await fetch(`${API_URL}/exercises`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || 'Failed to fetch exercises');
  }
  return res.json();
};
