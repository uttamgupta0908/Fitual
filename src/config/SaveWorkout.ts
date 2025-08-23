// export interface WorkoutData {
//   userId: number;
//   date: string;
//   duration: number;
//   exercises: {
//     exerciseId: number;
//     sets: number;
//     reps: number;
//     weight: number;
//     weightUnit: 'kg' | 'lbs';
//   }[];
// }

// export async function POST(request: Request) {
//   const workoutData: WorkoutData = await request.json();
//   try {
//     const result = await adminClient.create(workoutData);
//     console.log('workout saved successfully:', result);

//     return Response.json({
//       success: true,
//       workoutId: result.id,
//       message: 'Workout saved successfully',
//     });
//   } catch (error) {
//     console.log('Error saving workout:', error);
//     return Response.json({ error: 'Failed to save workout' }, { status: 500 });
//   }
// }
