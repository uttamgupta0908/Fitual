import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface WorkoutSet {
  id: string;
  reps: string;
  weight: string;
  weightUnit: 'kg' | 'lbs';
  isCompleted: boolean;
}

interface WorkoutExercise {
  id: string;
  exerciseId: number;
  name: string;
  sets: WorkoutSet[];
}

interface WorkoutStore {
  //theses are state variables
  workoutExercises: WorkoutExercise[];
  weightUnit: 'kg' | 'lbs';

  //actions
  addExerciseToWorkout: (exercise: { id: number; name: string }) => void;
  setWorkoutExercises: (
    exercises:
      | WorkoutExercise[]
      | ((prev: WorkoutExercise[]) => WorkoutExercise[]),
  ) => void;
  setWeightUnit: (unit: 'kg' | 'lbs') => void;
  resetWorkout: () => void;
}

export const useWorkoutStore = create<WorkoutStore>()(
  persist(
    set => ({
      workoutExercises: [],
      weightUnit: 'kg',

      addExerciseToWorkout: exercise =>
        set(state => {
          const newExercise: WorkoutExercise = {
            exerciseId: exercise.id,
            // userId: exercise.userId,
            name: exercise.name,
            sets: [],
          };
          return {
            workoutExercises: [...state.workoutExercises, newExercise],
          };
        }),
      setWorkoutExercises: exercises =>
        set(state => ({
          workoutExercises:
            typeof exercises === 'function'
              ? exercises(state.workoutExercises)
              : exercises,
        })),
      setWeightUnit: unit => set({ weightUnit: unit }),
      resetWorkout: () => set({ workoutExercises: [] }),
    }),
    {
      name: 'workoutstore',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: state => ({
        weightUnit: state.weightUnit,
      }),
    },
  ),
);
