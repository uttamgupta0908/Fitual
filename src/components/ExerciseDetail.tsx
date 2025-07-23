import { useRoute, RouteProp } from '@react-navigation/native';
import { Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type ExerciseDetailParams = {
  ExerciseDetail: {
    id: number;
  };
};

export default function ExerciseDetail() {
  const route = useRoute<RouteProp<ExerciseDetailParams, 'ExerciseDetail'>>();
  const { id } = route.params;
  
  return (
    <SafeAreaView className="flex-1 bg-white">
      <Text>ExerciseDetail: {id}</Text>
    </SafeAreaView>
  );
}
