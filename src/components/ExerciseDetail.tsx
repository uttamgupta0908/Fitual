import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  StatusBar,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { CircleX, HeartPulse } from 'lucide-react-native';

import { fetchExercisesFromAPI, ExerciseType } from '../utils/exercise';

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

  useEffect(() => {
    const fetchExercise = async () => {
      try {
        const foundExercise = fetchExercisesFromAPI.find(ex => ex.id === id);
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
          {/* Image or Fallback */}
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

          {/* Exercise Info
          <View className="p-4">
            <Text className="text-2xl font-bold mb-2">
              {exercise?.name ?? 'Exercise Not Found'}
            </Text>
            <Text className="text-base text-gray-600">
              Muscle Group: {exercise?.muscleGroup ?? 'N/A'}
            </Text>
            <Text className="text-base text-gray-600">
              Equipment: {exercise?.equipment ?? 'N/A'}
            </Text>
            <Text className="text-base text-gray-600">
              Difficulty: {exercise?.difficulty ?? 'N/A'}
            </Text>
          </View> */}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

// import { useRoute, RouteProp } from '@react-navigation/native';
// import {
//   Image,
//   ScrollView,
//   StatusBar,
//   Text,
//   TouchableOpacity,
//   View,
// } from 'react-native';
// import { SafeAreaView } from 'react-native-safe-area-context';
// import { useNavigation } from '@react-navigation/native';
// import { CircleX, HeartPulse } from 'lucide-react-native';
// import { useEffect, useState } from 'react';
// import { ExerciseType } from '../utils/exercise';
// type ExerciseDetailParams = {
//   ExerciseDetail: {
//     id: number;
//   };
// };

// const singleExerciseQuery = defineQuery(
//   `#[_type == "exercise" && _id ==$id][0]`,
// );

// export default function ExerciseDetail() {
//   const route = useRoute<RouteProp<ExerciseDetailParams, 'ExerciseDetail'>>();
//   const { id } = route.params;
//   const navigation = useNavigation();
//   const [exercise, setExercise] = useState<ExerciseType>(null);
//   const [loading, setLoading] = useState(true);
//   const [aiGuidance, setAiGuidance] = useState<string>('');
//   const [aiLoading, setAiLoading] = useState(false);

//   useEffect(() => {
//     const fetchExercise = async () => {
//       if (!id) return;
//       try {
//         const exerciseData = await clearInterval.fetch(singleExerciseQuery, {
//           id,
//         });
//         setExercise(exerciseData);
//       } catch (error) {
//         console.error('Error fetching exercise', error);
//       } finally {
//         setLoading(false);
//       }
//     };
//   }, [id]);

//   return (
//     <SafeAreaView className="flex-1 bg-white">
//       <StatusBar barStyle="light-content" backgroundColor="#000" />

//       {/* Header closing button */}
//       <View className="absolute top-12 left-0 right-0 z-10 px-4">
//         <TouchableOpacity
//           onPress={() => navigation.goBack()}
//           className="w-10 h-10 bg-black/20 rounded-full items-center justify-center backdrop-blur-sm"
//         >
//           <CircleX size={24} color="white" />
//         </TouchableOpacity>
//       </View>
//       <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
//         {/* Hero Imagee */}
//         <View className="h-80 bg-white relative">
//           {exercise?.image ? (
//             <Image source={} className="w-full h-full" resizeMode="contain" />
//           ) : (
//             <View className="w-full h-full bg-gradient-to-br from-blue-400 to-purple-500 items-center justify-center">
//               <HeartPulse size={80} color="white" />
//             </View>
//           )}
//           {/* overlay gradient */}
//           <View className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t fron-black/60 to-transparent"></View>
//         </View>
//       </ScrollView>
//       <Text>ExerciseDetail: {id}</Text>
//     </SafeAreaView>
//   );
// }
