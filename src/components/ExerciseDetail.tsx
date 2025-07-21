import { useRoute } from '@react-navigation/native';
import { Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ExerciseDetail() {
  const route = useRoute();
  const { id } = route.params;

  return (
    <SafeAreaView className="flex-1 bg-white">
      <Text>ExerciseDetail:{id}</Text>
    </SafeAreaView>
  );
}
