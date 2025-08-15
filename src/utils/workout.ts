import AsyncStorage from '@react-native-async-storage/async-storage';

// import { API_URL } from '@env';
const API_URL = 'http://192.168.1.8:5000';

export type WeightUnit = 'kg' | 'lbs';

export type Exercise = {
  id: number;
  name: string;
  muscleGroup: string;
  equipment: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  description: string;
  videoUrl: string;
  imageUrl: string;
};

export type WorkoutExercise = {
  id: number;
  reps: number;
  weight: number;
  weightUnit: WeightUnit;
  exercise: Exercise;
};

export type Workout = {
  id: number;
  userId: number;
  date: string; // ISO string
  duration: number; // seconds
  exercises: WorkoutExercise[];
};

export const fetchWorkoutsFromAPI = async (): Promise<Workout[]> => {
  const token = await AsyncStorage.getItem('token');
  const response = await fetch(`${API_URL}/workouts`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to fetch workouts');
  }

  const data: Workout[] = await response.json();
  return data;
};
