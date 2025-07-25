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

const API_URL = 'http://192.168.1.6:5000'; // or your live server URL

export const fetchExercisesFromAPI = async (): Promise<ExerciseType[]> => {
  const res = await fetch(`${API_URL}/exercises`);
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || 'Failed to fetch exercises');
  }
  return res.json();
};

// export const Exercise = async () => {
//   const API_URL = 'http://localhost:5000/';

//   const res = await fetch(`${API_URL}/exercises`);

//   if (!res.ok) {
//     const error = await res.json();
//     throw new Error(error.error || 'Failed to fetch exercises');
//   }

//   return res.json(); // Returns list of exercises
// };
