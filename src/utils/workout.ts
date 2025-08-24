import AsyncStorage from '@react-native-async-storage/async-storage';

import { API_URL } from '@env';

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
  sets: number;
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
export type WorkoutExercisePayload = {
  exerciseId: number;
  sets: number;
  reps: number;
  weight: number;
  weightUnit: WeightUnit;
};

export type WorkoutPayload = {
  userId: number;
  date: string; // ISO string
  duration: number; // seconds
  exercises: WorkoutExercisePayload[];
};

export const saveWorkoutToAPI = async (payload: WorkoutPayload) => {
  const token = await AsyncStorage.getItem('token');

  const response = await fetch(`${API_URL}/workouts`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to save workout');
  }

  const data = await response.json();
  return data; // returns the saved workout object
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
export const fetchWorkoutById = async (workoutId: string): Promise<Workout> => {
  const token = await AsyncStorage.getItem('token');
  const response = await fetch(`${API_URL}/workouts/${workoutId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to fetch workouts');
  }

  const data: Workout[] = await response.json();

  return data;
};
